#!/usr/bin/env python3
"""
write_tracks.py  (v2 — subpixel edge-refined plate tracker)

Generates tracks.js for the InsureDrive intro. Put it next to your mp4 files and
run once:

    python3 write_tracks.py

What's different from v1
------------------------
v1 fitted the plate's *thresholded bright blob*. That is biased — the threshold
cuts a little inside the plate's white face and the contour fit is noisy — which
left the engraved number a couple of percent off the plate, i.e. the residual
wobble. v2 instead:

  1. detects the plate coarsely (bright blob) to get an approximate quad;
  2. REFINES each of the four edges to subpixel precision by sampling intensity
     profiles perpendicular to the coarse edge and snapping to the strongest
     edge (dark border -> white face), then intersects the four fitted lines;
  3. fills gaps, then applies a light symmetric temporal smoothing.

The result is a per-frame quad that tracks the plate's true edges to well under
a pixel, so the number locks to the plate instead of wobbling by a couple of
percent.

Requires: opencv-python (cv2), numpy, and ffmpeg on PATH (or imageio-ffmpeg).
"""

import os, sys, glob, json, shutil, subprocess

import cv2
import numpy as np


TIERS = {
    "":      ("part1.mp4",      "part2.mp4"),
    "_1080": ("part1_1080.mp4", "part2_1080.mp4"),
    "_4k":   ("part1_4k.mp4",   "part2_4k.mp4"),
}
TMP = "_cal_tmp"
DEFAULT_FPS = 30.0
TMAX = 1.35            # part2 seconds to track (plate leaves the frame ~1.37s)


def ffmpeg_bin():
    exe = shutil.which("ffmpeg")
    if exe:
        return exe
    try:
        import imageio_ffmpeg
        return imageio_ffmpeg.get_ffmpeg_exe()
    except Exception:
        raise SystemExit("ffmpeg not found. Install ffmpeg, or `pip install imageio-ffmpeg`.")


FFMPEG = None


def extract(src, n=None):
    if os.path.isdir(TMP):
        shutil.rmtree(TMP)
    os.makedirs(TMP)
    cmd = [FFMPEG, "-y", "-v", "error", "-i", src]
    if n:
        cmd += ["-frames:v", str(n)]
    cmd += [os.path.join(TMP, "%04d.png")]
    subprocess.run(cmd, check=True)
    return sorted(glob.glob(os.path.join(TMP, "*.png")))


def video_fps(path):
    cap = cv2.VideoCapture(path)
    fps = cap.get(cv2.CAP_PROP_FPS) or 0
    cap.release()
    return fps if 1 < fps < 240 else DEFAULT_FPS


# ---------------------------------------------------------------- coarse
def fit_quad_lines(pts, x0, y0):
    pts = pts.reshape(-1, 2).astype(np.float64)
    mean = pts.mean(0)
    vals, vecs = np.linalg.eigh(np.cov((pts - mean).T))
    u = vecs[:, int(np.argmax(vals))]
    v = np.array([-u[1], u[0]])
    rel = pts - mean
    U, V = rel @ u, rel @ v
    mu = 0.18 * (U.max() - U.min())
    mv = 0.18 * (V.max() - V.min())
    sides = [pts[U < U.min() + mu], pts[U > U.max() - mu],
             pts[V < V.min() + mv], pts[V > V.max() - mv]]
    if any(len(s) < 8 for s in sides):
        return None
    L = [cv2.fitLine(s.astype(np.float32), cv2.DIST_L2, 0, 0.01, 0.01).flatten() for s in sides]

    def ix(a, b):
        vax, vay, pax, pay = L[a]
        vbx, vby, pbx, pby = L[b]
        t = np.linalg.solve(np.array([[vax, -vbx], [vay, -vby]]),
                            np.array([pbx - pax, pby - pay]))[0]
        return (float(pax + t * vax + x0), float(pay + t * vay + y0))

    return [ix(0, 2), ix(1, 2), ix(1, 3), ix(0, 3)]   # TL, TR, BR, BL


def coarse_quad(img, prev=None):
    g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    h, w = g.shape
    if prev is None:
        x0, y0, x1, y1 = int(0.15 * w), int(0.25 * h), int(0.85 * w), int(0.90 * h)
    else:
        xs = [p[0] for p in prev]; ys = [p[1] for p in prev]
        x0 = max(0, int(min(xs) - 0.08 * w)); x1 = min(w, int(max(xs) + 0.08 * w))
        y0 = max(0, int(min(ys) - 0.08 * h)); y1 = min(h, int(max(ys) + 0.08 * h))
    for th in (185, 165, 200):
        roi = g[y0:y1, x0:x1]
        _, m = cv2.threshold(roi, th, 255, cv2.THRESH_BINARY)
        m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
        cnts, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
        best, bestA = None, 0
        for c in cnts:
            a = cv2.contourArea(c)
            if a < 0.004 * w * h:
                continue
            (_, _), (rw, rh), _ = cv2.minAreaRect(c)
            asp = max(rw, rh) / max(1e-6, min(rw, rh))
            if 2.0 <= asp <= 7.0 and a > bestA:
                best, bestA = c, a
        if best is not None:
            return fit_quad_lines(best, x0, y0)
    return None


# ---------------------------------------------------------- edge refinement
def _bilinear(g, xs, ys):
    h, w = g.shape
    x0 = np.floor(xs).astype(int); y0 = np.floor(ys).astype(int)
    if x0.min() < 0 or y0.min() < 0 or x0.max() + 1 >= w or y0.max() + 1 >= h:
        return None
    fx = xs - x0; fy = ys - y0
    g00 = g[y0, x0]; g10 = g[y0, x0 + 1]; g01 = g[y0 + 1, x0]; g11 = g[y0 + 1, x0 + 1]
    return (g00 * (1 - fx) * (1 - fy) + g10 * fx * (1 - fy)
            + g01 * (1 - fx) * fy + g11 * fx * fy)


def refine_quad(gray, quad, half=None, nsamp=23, minpts=6):
    # search half-width scales with image width so it behaves the same at
    # 854 / 1920 / 3840 px (roughly +/-13 px at 1080).
    if half is None:
        half = max(8, int(round(0.013 * gray.shape[1])))
    C = np.array(quad, float)
    lines = []
    for e in range(4):
        a, b = C[e], C[(e + 1) % 4]
        d = b - a; L = np.hypot(*d)
        if L < 6:
            return None
        u = d / L; n = np.array([-u[1], u[0]])
        pts = []
        for k in range(1, nsamp + 1):
            s = k / (nsamp + 1)
            p = a + (b - a) * s
            ss = np.arange(-half, half + 1, dtype=float)
            prof = _bilinear(gray, p[0] + n[0] * ss, p[1] + n[1] * ss)
            if prof is None:
                continue
            gr = np.gradient(prof)
            j = int(np.argmax(np.abs(gr)))
            if j == 0 or j == len(gr) - 1:
                continue
            y0, y1, y2 = abs(gr[j - 1]), abs(gr[j]), abs(gr[j + 1])
            den = (y0 - 2 * y1 + y2)
            off = 0.5 * (y0 - y2) / den if abs(den) > 1e-9 else 0.0
            pos = ss[j] + max(-1.0, min(1.0, off))
            pts.append(p + n * pos)
        if len(pts) < minpts:
            return None
        pts = np.array(pts)
        for _ in range(2):
            c = pts.mean(0)
            _, _, V = np.linalg.svd(pts - c)
            dirv = V[0]
            nrm = np.array([-dirv[1], dirv[0]])
            dist = np.abs((pts - c) @ nrm)
            keep = dist < max(1.5, 2.5 * np.median(dist))
            if keep.sum() >= minpts:
                pts = pts[keep]
        c = pts.mean(0); _, _, V = np.linalg.svd(pts - c)
        lines.append((c, V[0]))

    def inter(l1, l2):
        c1, d1 = l1; c2, d2 = l2
        A = np.array([[d1[0], -d2[0]], [d1[1], -d2[1]]])
        if abs(np.linalg.det(A)) < 1e-9:
            return None
        t = np.linalg.solve(A, c2 - c1)[0]
        return c1 + t * d1

    out = [inter(lines[3], lines[0]), inter(lines[0], lines[1]),
           inter(lines[1], lines[2]), inter(lines[2], lines[3])]
    if any(o is None for o in out):
        return None
    return [tuple(o) for o in out]


# ---------------------------------------------------------------- track
def track_part2(p2f):
    files = extract(p2f, 45)
    fps = video_fps(p2f)
    prev = None
    quads = {}
    W = H = None
    for i, f in enumerate(files):
        t = i / fps
        if t > TMAX:
            break
        img = cv2.imread(f)
        H, W = img.shape[:2]
        g = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
        q = coarse_quad(img, prev)
        if q is None:
            continue
        rq = refine_quad(g, q) or q
        xs = [p[0] for p in rq]; ys = [p[1] for p in rq]
        if not (0.04 * W < max(xs) - min(xs) < 0.7 * W):
            rq = q
        prev = rq
        quads[i] = rq

    # fill single-frame gaps
    idx = sorted(quads)
    for i in range(idx[0], idx[-1] + 1):
        if i not in quads and (i - 1) in quads and (i + 1) in quads:
            quads[i] = [((quads[i-1][c][0] + quads[i+1][c][0]) / 2,
                         (quads[i-1][c][1] + quads[i+1][c][1]) / 2) for c in range(4)]

    rows = []
    for i in sorted(quads):
        row = [round(i / fps, 5)]
        for (x, y) in quads[i]:
            row += [round(x / W, 6), round(y / H, 6)]
        rows.append(row)

    # light symmetric temporal smoothing (interior only)
    if len(rows) >= 5:
        A = np.array(rows, float)
        for i in range(2, len(A) - 2):
            for j in range(1, 9):
                A[i, j] = (rows[i-2][j] + 2*rows[i-1][j] + 3*rows[i][j]
                           + 2*rows[i+1][j] + rows[i+2][j]) / 9
        rows = [[round(v, 6) for v in r] for r in A]
    return rows


def find_p1(p1f):
    """Plate box on the last frame of a Part-1 encode. The plate is in deep
    shadow there, so brighten and try a few thresholds; validate the result."""
    files = extract(p1f)
    img = cv2.imread(files[-1])
    H, W = img.shape[:2]
    g0 = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    x0, y0, x1, y1 = int(0.10*W), int(0.40*H), int(0.90*W), int(0.97*H)
    for gm in (None, 0.45, 0.35):
        gg = g0 if gm is None else np.clip((g0/255.0)**gm*255, 0, 255).astype(np.uint8)
        for th in (120, 150, 140, 100, 170):
            roi = gg[y0:y1, x0:x1]
            _, m = cv2.threshold(roi, th, 255, cv2.THRESH_BINARY)
            m = cv2.morphologyEx(m, cv2.MORPH_CLOSE, np.ones((9, 9), np.uint8))
            cnts, _ = cv2.findContours(m, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
            best, ba = None, 0
            for c in cnts:
                a = cv2.contourArea(c)
                if a < 0.004*W*H:
                    continue
                (_, _), (rw, rh), _ = cv2.minAreaRect(c)
                asp = max(rw, rh)/max(1e-6, min(rw, rh))
                if 2.0 <= asp <= 7.0 and a > ba:
                    best, ba = c, a
            if best is None:
                continue
            q = fit_quad_lines(best, x0, y0)
            if q is None:
                continue
            q = refine_quad(gg, q) or q
            xs = [p[0] for p in q]; ys = [p[1] for p in q]
            w = (max(xs)-min(xs))/W; h = (max(ys)-min(ys))/H
            if 0.10 < w < 0.60 and 0.03 < h < 0.30 and min(xs) > 0 and max(xs) < W and min(ys) > 0:
                dbg = img.copy()
                cv2.polylines(dbg, [np.array(q, np.int32)], True, (0, 255, 0), max(2, W//500))
                cv2.imwrite(f"p1_check{p1f.replace('.mp4','')}.png", dbg)
                return {"x": round(min(xs)/W, 6), "y": round(min(ys)/H, 6),
                        "w": round(w, 6), "h": round(h, 6)}
    print(f"# {p1f}: plate not found on the last frame; omitting P1 for this tier.",
          file=sys.stderr)
    return None


def main():
    global FFMPEG
    FFMPEG = ffmpeg_bin()
    tracks = {}
    for tier, (p1f, p2f) in TIERS.items():
        if not (os.path.exists(p1f) and os.path.exists(p2f)):
            print(f"# skip {tier or '(base)'}: {p1f} / {p2f} not found", file=sys.stderr)
            continue
        quad = track_part2(p2f)
        p1 = find_p1(p1f)
        tracks[tier] = {"P1": p1, "QUAD": quad}
        print(f"# {tier or '(base)'}: {len(quad)} keyframes, P1={p1}", file=sys.stderr)
    if not tracks:
        raise SystemExit("No tier produced any data — are the mp4s in this folder?")
    with open("tracks.js", "w") as f:
        f.write("// GENERATED by write_tracks.py (v2: subpixel edge-refined) - do not edit\n")
        f.write("const TRACKS=" + json.dumps(tracks, separators=(",", ":")) + ";\n")
    print("wrote tracks.js with tiers:", ", ".join(t or "(base)" for t in tracks))


if __name__ == "__main__":
    main()
