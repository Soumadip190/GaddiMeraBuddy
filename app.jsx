import React, { useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { Home, Car, ShieldCheck, LayoutDashboard } from "lucide-react";
import "./src/index.css";
import ExpandedTabs from "@/components/ui/expanded-tabs";
import {
  formatPlate,
  deriveVehicleDetails,
  mask,
  ADDON_OPTIONS,
  PLANS,
  INITIAL_CONSENT_RECORDS,
  INITIAL_COMM_HISTORY,
  SEED_LEADS,
} from "./src/data.js";
import {
  VehicleDashboard,
  PolicyListingAndCompare,
  PolicyDetailsModal,
  RequestCallback,
  DoneView,
} from "./src/FlowViews.jsx";
import { GarageView, LegalAndConsentView } from "./src/GarageAndLegal.jsx";

/* ---------- styles (self-contained, exact whitish theme preserved) ---------- */
const css = `
*{box-sizing:border-box}
.pz{--bg:#efeee9;--card:#f8f8f6;--ink:#141414;--mut:#6e6e68;--line:#d8d7cf;--ok:#2f7d4f;--warn:#a8741a;--bad:#b9382c;
font-family:system-ui,-apple-system,"Segoe UI",Roboto,Arial,sans-serif;background:var(--bg);color:var(--ink);min-height:100vh;padding:16px 16px 72px}
.pz button:not([data-tab-btn]),.pz input,.pz select,.pz textarea{font:inherit;color:inherit}
.pz .nav{max-width:1120px;margin:0 auto;background:#fff;border:1px solid var(--line);border-radius:16px;padding:12px 16px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;box-shadow:0 2px 8px rgba(20,20,20,.04)}
.pz .brand{font-weight:700;font-size:17px;display:flex;align-items:center;gap:10px;color:var(--ink)}
.pz .logo{width:26px;height:26px;border-radius:8px;background:var(--ink);color:#fff;display:inline-grid;place-items:center;font-size:14px;font-weight:700}
.pz .plate-chip{font-family:"Barlow Condensed",system-ui,sans-serif;font-weight:700;font-size:15px;letter-spacing:.08em;background:#f4f1e6;color:#141414;border:1.5px solid #141414;border-radius:6px;padding:3px 10px;display:inline-flex;align-items:center;gap:6px}
.pz .plate-chip small{font-family:system-ui,sans-serif;font-size:10px;font-weight:700;color:#2563eb;letter-spacing:.04em}
.pz .tabs{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.pz .tab{background:#f4f3ee;border:1.5px solid #cfcec6;padding:8px 15px;border-radius:999px;cursor:pointer;color:var(--ink);font-weight:500;font-size:14px;transition:all .15s ease;white-space:nowrap}
.pz .tab:hover:not(:disabled){border-color:var(--ink);background:#eae9e2}
.pz .tab.on{background:var(--ink);color:#fff;border-color:var(--ink);font-weight:600}
.pz .tab:disabled{opacity:.5;cursor:not-allowed}
.pz .wrap{max-width:1120px;margin:0 auto;padding-top:36px}
.pz .narrow{max-width:600px;margin:0 auto}
.pz h1{font-size:clamp(28px,4.5vw,42px);line-height:1.12;font-weight:600;margin:0 0 10px;letter-spacing:-.02em;color:var(--ink)}
.pz h1 span,.pz h2 span{color:#7c7c76;font-weight:500}
.pz h2{font-size:21px;font-weight:600;margin:0 0 6px;letter-spacing:-.01em;color:var(--ink)}
.pz h3{font-size:17px;font-weight:600;margin:0 0 6px;color:var(--ink)}
.pz .sub{color:var(--mut);line-height:1.55;margin:0 0 22px;font-size:15px}
.pz .steps{display:flex;gap:8px;margin-bottom:28px;flex-wrap:wrap;align-items:center}
.pz .step{font-size:13.5px;font-weight:500;padding:7px 14px;border-radius:999px;background:#fff;border:1.5px solid #cfcec6;color:var(--mut);display:inline-flex;align-items:center;gap:6px;transition:all .15s ease}
.pz .step.clickable{cursor:pointer;color:var(--ink)}
.pz .step.clickable:hover{border-color:var(--ink);background:#f4f3ee}
.pz .step.on{background:var(--ink);color:#fff;border-color:var(--ink);font-weight:600;box-shadow:0 2px 6px rgba(20,20,20,.15)}
.pz .step.done{color:var(--ink);background:#e5f2ea;border-color:#9dcbb0;font-weight:600;cursor:pointer}
.pz .card{background:var(--card);border:1.5px solid var(--line);border-radius:20px;padding:24px;box-shadow:0 2px 10px rgba(20,20,20,.03)}
.pz .btn{background:var(--ink);color:#fff;border:1.5px solid var(--ink);border-radius:999px;padding:13px 24px;cursor:pointer;font-weight:600;font-size:15px;display:inline-flex;align-items:center;justify-content:center;gap:8px;transition:transform .12s ease,background .15s ease,border-color .15s ease;box-shadow:0 2px 6px rgba(20,20,20,.14);width:auto;height:auto;line-height:1.2;white-space:nowrap}
.pz .btn:not(.ghost){color:#fff}
.pz .btn:hover:not(:disabled){background:#2b2b28;border-color:#2b2b28;transform:translateY(-1px)}
.pz .btn:disabled{background:#8c8b85;border-color:#8c8b85;color:#fff;opacity:.7;cursor:not-allowed;box-shadow:none;transform:none}
.pz .btn.ghost{background:#fff;color:var(--ink);border:1.5px solid #b8b7ae;box-shadow:0 1px 3px rgba(0,0,0,.05)}
.pz .btn.ghost:hover:not(:disabled){background:#f2f1eb;border-color:var(--ink)}
.pz .btn.sm{padding:8px 15px;font-size:13.5px}
.pz .btn:focus-visible,.pz .tab:focus-visible,.pz input:focus-visible,.pz select:focus-visible,.pz textarea:focus-visible{outline:2px solid var(--ink);outline-offset:2px}
.pz .row{display:flex;gap:10px;flex-wrap:wrap;align-items:center}
.pz .otp{display:flex;gap:8px;margin:16px 0}
.pz .otp input{width:100%;max-width:58px;height:60px;text-align:center;font-size:24px;font-weight:600;border:1.5px solid #b8b7ae;border-radius:14px;background:#fff;color:var(--ink)}
.pz .otp input:focus{border-color:var(--ink)}
.pz .field{display:block;margin-bottom:16px;border:0;background:transparent;overflow:visible}
.pz .field>span{display:block;font-size:13.5px;font-weight:500;color:var(--ink);margin-bottom:6px;padding:0;border:0;height:auto}
.pz .field input,.pz .field select,.pz .field textarea{width:100%;padding:12px 14px;border:1.5px solid #bfbeb6;border-radius:12px;background:#fff;color:var(--ink);font-size:15px;height:auto}
.pz .chk{display:flex;gap:10px;align-items:flex-start;font-size:14px;line-height:1.45;margin-bottom:12px;cursor:pointer;color:var(--ink)}
.pz .chk input{margin-top:3px;width:17px;height:17px;accent-color:var(--ink);flex-shrink:0}
.pz .note{font-size:13px;color:var(--mut);line-height:1.5}
.pz .banner{background:#fff6dd;border:1.5px solid #e5cb83;color:#5c450a;border-radius:12px;padding:11px 14px;font-size:14px;margin-bottom:18px;line-height:1.45}
.pz .grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(155px,1fr));gap:1px;background:var(--line);border:1.5px solid var(--line);border-radius:16px;overflow:hidden;margin:16px 0 22px}
.pz .cell{background:#fff;padding:14px 16px}
.pz .cell small{display:block;color:var(--mut);font-size:12px;margin-bottom:4px}
.pz .cell b{font-weight:600;font-size:16px;color:var(--ink);font-variant-numeric:tabular-nums}
.pz .cmp{display:grid;grid-template-columns:repeat(auto-fit,minmax(290px,1fr));gap:16px;align-items:stretch}
.pz .plan{display:flex;flex-direction:column;background:var(--card);border:1.5px solid var(--line);border-radius:20px;padding:22px;transition:border-color .15s ease,box-shadow .15s ease}
.pz .plan.best{background:#fff;border:2px solid var(--ink);box-shadow:0 8px 24px rgba(20,20,20,.07)}
.pz .badge{align-self:flex-start;font-size:12px;font-weight:600;padding:4px 11px;border-radius:999px;margin-bottom:12px}
.pz .badge.best{background:var(--ink);color:#fff}
.pz .badge.alt{background:#e4e3dc;color:var(--ink);border:1px solid #c8c7be}
.pz .badge.spon{background:#fff6dd;color:var(--warn);border:1px solid #e5cb83}
.pz .price{font-size:34px;font-weight:700;letter-spacing:-.02em;margin:4px 0 2px;color:var(--ink);font-variant-numeric:tabular-nums}
.pz .plan ul{padding:0;margin:14px 0;list-style:none;font-size:14px;line-height:1.5;flex:1}
.pz .plan li{display:flex;justify-content:space-between;gap:10px;padding:8px 0;border-bottom:1px solid var(--line)}
.pz .plan li span:first-child{color:var(--mut)}
.pz .plan li span:last-child{font-weight:500;color:var(--ink);text-align:right}
.pz .why{font-size:13px;line-height:1.5;background:var(--bg);border:1px solid var(--line);border-radius:12px;padding:11px 13px;margin-bottom:16px;color:var(--ink)}
.pz .seg{display:flex;background:#e4e3dc;border:1.5px solid #cfcec6;border-radius:999px;padding:4px;margin-bottom:18px;gap:4px}
.pz .seg button{flex:1;border:0;background:transparent;padding:10px 14px;border-radius:999px;cursor:pointer;color:var(--ink);font-weight:500;transition:all .15s ease}
.pz .seg button.on{background:var(--ink);color:#fff;font-weight:600;box-shadow:0 2px 6px rgba(0,0,0,.15)}
.pz .stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(160px,1fr));gap:12px;margin-bottom:18px}
.pz .stat{background:var(--card);border:1.5px solid var(--line);border-radius:16px;padding:16px}
.pz .stat b{display:block;font-size:30px;font-weight:700;color:var(--ink);font-variant-numeric:tabular-nums}
.pz .stat span{font-size:13px;color:var(--mut)}
.pz .tbl{overflow-x:auto;background:var(--card);border:1.5px solid var(--line);border-radius:20px}
.pz table{width:100%;border-collapse:collapse;font-size:14px;min-width:760px}
.pz th{text-align:left;font-weight:600;color:var(--mut);padding:14px 16px;border-bottom:1.5px solid var(--line);background:#f1f0ea}
.pz td{padding:14px 16px;border-bottom:1px solid var(--line);color:var(--ink);vertical-align:middle}
.pz tr:last-child td{border-bottom:0}
.pz .pill{font-size:12px;font-weight:600;padding:4px 10px;border-radius:999px;background:#e6e5de;color:var(--ink);border:1px solid #cfcec6;display:inline-flex;align-items:center;gap:5px}
.pz .pill.y{background:#dff0e5;color:var(--ok);border-color:#a3d4b5}
.pz .pill.w{background:#fff3d1;color:var(--warn);border-color:#e5cb83}
.pz .pill.r{background:#fde2e0;color:var(--bad);border-color:#f1a8a2}
.pz .tick{width:56px;height:56px;border-radius:50%;background:var(--ink);color:#fff;display:grid;place-items:center;font-size:26px;margin-bottom:18px}
.pz .addon-bar{background:#fff;border:1.5px solid var(--line);border-radius:16px;padding:16px 18px;margin-bottom:20px}
.pz .chip-btn{background:#fff;border:1.5px solid #bfbeb6;border-radius:999px;padding:7px 14px;font-size:13px;font-weight:500;cursor:pointer;color:var(--ink);display:inline-flex;align-items:center;gap:6px;transition:all .15s ease}
.pz .chip-btn:hover{border-color:var(--ink);background:#f4f3ee}
.pz .chip-btn.on{background:var(--ink);color:#fff;border-color:var(--ink);font-weight:600}
.pz .term-box{background:#fff;border:1.5px solid var(--line);border-radius:14px;padding:14px 18px;margin-bottom:10px}
.pz .term-box summary{cursor:pointer;font-weight:600;font-size:15px;color:var(--ink);display:flex;justify-content:space-between;align-items:center;list-style:none}
.pz .term-box summary::-webkit-details-marker{display:none}
.pz .term-box p{margin:10px 0 0;color:var(--mut);font-size:14px;line-height:1.6}
@media(prefers-reduced-motion:no-preference){.pz .fade{animation:pzf .25s ease-out}@keyframes pzf{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:none}}}
`;

const STAGES = ["Verify", "Vehicle dashboard", "Compare & quotes", "Request callback"];

function Steps({ at, onJump }) {
  return (
    <div className="steps" role="navigation" aria-label="Renewal steps">
      {STAGES.map((s, i) => {
        const isDone = i < at;
        const isCurrent = i === at;
        return (
          <button
            type="button"
            key={s}
            disabled={i > at}
            onClick={() => i <= at && onJump && onJump(i)}
            className={"step " + (isCurrent ? "on" : isDone ? "done clickable" : "")}
          >
            <span>{isDone ? "✓" : i + 1}.</span>
            <span>{s}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------- OTP Page (KEPT UNTOUCHED AS INSTRUCTED) ---------- */
function Verify({ vehicle, mobile, onMobileChange, onDone }) {
  const [d, setD] = useState(["", "", "", "", "", ""]);
  const [sec, setSec] = useState(30);
  const [agree, setAgree] = useState(false);
  const [rem, setRem] = useState(true);
  const [wa, setWa] = useState(false);
  const [editingMob, setEditingMob] = useState(false);
  const [mobDraft, setMobDraft] = useState(mobile);
  const refs = useRef([]);

  useEffect(() => {
    if (sec > 0) {
      const t = setTimeout(() => setSec(sec - 1), 1000);
      return () => clearTimeout(t);
    }
  }, [sec]);

  const set = (i, v) => {
    v = v.replace(/\D/g, "").slice(-1);
    const n = [...d];
    n[i] = v;
    setD(n);
    if (v && i < 5) refs.current[i + 1]?.focus();
  };
  const key = (i, e) => {
    if (e.key === "Backspace" && !d[i] && i > 0) refs.current[i - 1]?.focus();
  };
  const paste = (e) => {
    const t = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (t) {
      e.preventDefault();
      setD(t.split("").concat(Array(6).fill("")).slice(0, 6));
    }
  };
  const fillDemo = () => {
    setD(["1", "2", "3", "4", "5", "6"]);
    setAgree(true);
  };
  const saveMobile = () => {
    const cleaned = mobDraft.replace(/\D/g, "").slice(0, 10);
    if (cleaned.length === 10) {
      onMobileChange(cleaned);
      setEditingMob(false);
      setSec(30);
    }
  };

  const ready = d.every(Boolean) && agree;

  return (
    <div className="narrow fade">
      <div className="row" style={{ marginBottom: 12 }}>
        <span className="plate-chip"><small>IND</small>{vehicle}</span>
        <span className="pill y">Number plate captured</span>
      </div>
      <h1>Confirm it's you. <span>We sent a code.</span></h1>
      <p className="sub">
        Enter the 6-digit code sent to <b>+91 {mask(mobile)}</b> to view renewal quotes for <b>{vehicle}</b>.
      </p>
      <div className="card">
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 10 }}>
          <span style={{ fontSize: 14, fontWeight: 500 }}>Mobile: +91 {mobile}</span>
          <div className="row" style={{ gap: 8 }}>
            <button type="button" className="btn ghost sm" onClick={() => setEditingMob(!editingMob)}>
              {editingMob ? "Cancel" : "Change mobile"}
            </button>
            <button type="button" className="btn ghost sm" onClick={fillDemo}>
              Fill demo OTP (123456)
            </button>
          </div>
        </div>

        {editingMob && (
          <div className="row" style={{ marginBottom: 14, padding: 12, background: "#fff", borderRadius: 12, border: "1px solid var(--line)" }}>
            <input
              type="tel"
              maxLength={10}
              value={mobDraft}
              onChange={(e) => setMobDraft(e.target.value.replace(/\D/g, "").slice(0, 10))}
              placeholder="10-digit mobile number"
              aria-label="10-digit mobile number"
              style={{ flex: 1, padding: "10px 12px", border: "1.5px solid #bfbeb6", borderRadius: 10 }}
            />
            <button type="button" className="btn sm" disabled={mobDraft.replace(/\D/g, "").length !== 10} onClick={saveMobile}>
              Send new code
            </button>
          </div>
        )}

        <div className="otp" onPaste={paste}>
          {d.map((v, i) => (
            <input
              key={i}
              ref={(el) => (refs.current[i] = el)}
              value={v}
              inputMode="numeric"
              aria-label={"Digit " + (i + 1)}
              onChange={(e) => set(i, e.target.value)}
              onKeyDown={(e) => key(i, e)}
            />
          ))}
        </div>

        <div className="row" style={{ justifyContent: "space-between", marginBottom: 20 }}>
          <span className="note">Demo mode: any 6 digits will work (or click "Fill demo OTP").</span>
          <button
            type="button"
            className="btn ghost sm"
            disabled={sec > 0}
            onClick={() => setSec(30)}
          >
            {sec > 0 ? `Resend in ${sec}s` : "Resend code"}
          </button>
        </div>

        <label className="chk">
          <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
          <span>
            I agree to the Terms and Privacy Notice, and allow my vehicle and mobile number to be used to show renewal options. <b>(Required)</b>
          </span>
        </label>
        <label className="chk">
          <input type="checkbox" checked={rem} onChange={(e) => setRem(e.target.checked)} />
          <span>Send me SMS and email reminders before my policy expires. (Optional)</span>
        </label>
        <label className="chk">
          <input type="checkbox" checked={wa} onChange={(e) => setWa(e.target.checked)} />
          <span>Contact me on WhatsApp about my renewal. (Optional)</span>
        </label>

        <p className="note" style={{ marginBottom: 16 }}>
          You can withdraw any of these at any time. Offers for other products such as health insurance are never sent unless you agree separately.
        </p>

        <button
          type="button"
          className="btn"
          disabled={!ready}
          onClick={() => onDone({ rem, wa })}
          style={{ width: "100%", color: "#ffffff" }}
        >
          Verify and continue →
        </button>
      </div>
    </div>
  );
}

function Admin({ leads, setLeads, consentRecords, onOpenConsent }) {
  const [q, setQ] = useState("");
  const [fs, setFs] = useState("All");
  const list = leads.filter(
    (l) =>
      (fs === "All" || l.status === fs) &&
      (l.veh + l.id + (l.plan || "") + (l.name || "") + (l.leadType || "")).toLowerCase().includes(q.toLowerCase())
  );
  const setS = (id, s) => setLeads(leads.map((l) => (l.id === id ? { ...l, status: s } : l)));
  const toggleConsent = (id, key) =>
    setLeads(leads.map((l) => (l.id === id ? { ...l, [key]: !l[key] } : l)));

  const exportCsv = () => {
    const headers = ["Lead ID", "Vehicle", "Type", "Lead Action", "Mobile", "Days Left", "Reminders Consent", "WhatsApp Consent", "Status"];
    const rows = list.map((l) => [l.id, l.veh, l.type, l.leadType || "Callback", l.mob, l.days, l.rem, l.wa, l.status]);
    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "insuredrive-kolkata-leads.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fade">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-end", marginBottom: 16 }}>
        <div>
          <h1>Admin Lead & Consent Dashboard. <span>Kolkata MVP operations.</span></h1>
          <p className="sub" style={{ marginBottom: 0 }}>
            Track callback requests, partner quotations, lead-routing types, and granular DPDP user consent flags.
          </p>
        </div>
        <div className="row" style={{ gap: 8 }}>
          <button type="button" className="btn ghost sm" onClick={onOpenConsent}>
            Audit Consent Ledger ({consentRecords.filter((c) => c.status === "Granted").length} active)
          </button>
          <button type="button" className="btn ghost sm" onClick={exportCsv}>
            Export CSV ({list.length})
          </button>
        </div>
      </div>

      <div className="stats" style={{ marginTop: 18 }}>
        <div className="stat"><b>{leads.length}</b><span>Total leads</span></div>
        <div className="stat"><b>{leads.filter((l) => l.days >= 0 && l.days <= 45).length}</b><span>Expiring within 45 days</span></div>
        <div className="stat"><b>{leads.filter((l) => l.days < 0).length}</b><span>Expired / break-in</span></div>
        <div className="stat"><b>{leads.filter((l) => l.status === "New").length}</b><span>Awaiting advisor call</span></div>
      </div>

      <div className="row" style={{ marginBottom: 14 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search vehicle, insurer, action type, or lead ID"
          aria-label="Search leads"
          style={{
            flex: 1,
            minWidth: 220,
            padding: "11px 16px",
            border: "1.5px solid #bfbeb6",
            borderRadius: 999,
            background: "#fff",
          }}
        />
        <select
          value={fs}
          onChange={(e) => setFs(e.target.value)}
          aria-label="Filter by status"
          style={{
            padding: "11px 16px",
            border: "1.5px solid #bfbeb6",
            borderRadius: 999,
            background: "#fff",
            fontWeight: 500,
          }}
        >
          {["All", "New", "Called", "Quote sent", "Converted", "Lost"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
        {(q || fs !== "All") && (
          <button type="button" className="btn ghost sm" onClick={() => { setQ(""); setFs("All"); }}>
            Reset filters
          </button>
        )}
      </div>

      <div className="tbl">
        <table>
          <thead>
            <tr>
              <th>Lead & Action</th>
              <th>Vehicle & Insurer</th>
              <th>Mobile & Pref</th>
              <th>Expiry Countdown</th>
              <th>Purpose Consents (click to toggle)</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {list.map((l) => (
              <tr key={l.id}>
                <td>
                  <b>{l.id}</b>
                  <div className="note">{l.leadType || "Request a callback"}</div>
                  {l.name && <div className="note">{l.name}</div>}
                </td>
                <td>
                  <b>{l.veh}</b>
                  <div className="note">{l.type} {l.plan ? `· ${l.plan}` : ""}</div>
                </td>
                <td>
                  <div>{l.mob}</div>
                  {l.lang && <div className="note">{l.lang} · {l.slot || "Morning"}</div>}
                </td>
                <td>
                  <span className={"pill " + (l.days < 0 ? "r" : l.days <= 15 ? "w" : "y")}>
                    {l.days < 0 ? Math.abs(l.days) + " days ago" : "In " + l.days + " days"}
                  </span>
                </td>
                <td>
                  <div className="row" style={{ gap: 6 }}>
                    <button
                      type="button"
                      onClick={() => toggleConsent(l.id, "rem")}
                      className={"pill " + (l.rem ? "y" : "")}
                      style={{ cursor: "pointer" }}
                    >
                      {l.rem ? "✓ " : ""}Reminders
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleConsent(l.id, "wa")}
                      className={"pill " + (l.wa ? "y" : "")}
                      style={{ cursor: "pointer" }}
                    >
                      {l.wa ? "✓ " : ""}WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleConsent(l.id, "mkt")}
                      className={"pill " + (l.mkt ? "y" : "")}
                      style={{ cursor: "pointer" }}
                    >
                      {l.mkt ? "✓ " : ""}Partner offers
                    </button>
                  </div>
                </td>
                <td>
                  <select
                    value={l.status}
                    onChange={(e) => setS(l.id, e.target.value)}
                    aria-label={"Status for " + l.id}
                    style={{
                      padding: "7px 12px",
                      border: "1.5px solid #bfbeb6",
                      borderRadius: 999,
                      background: "#fff",
                      fontWeight: 500,
                    }}
                  >
                    {["New", "Called", "Quote sent", "Converted", "Lost"].map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </td>
              </tr>
            ))}
            {!list.length && (
              <tr>
                <td colSpan={6} className="note" style={{ textAlign: "center", padding: 28 }}>
                  No leads match. Clear the search or filter.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- Main Platform Flow after OTP ---------- */
export function Flow({ vehicle: initialVehicle = "WB 02 AB 1234", mobile: initialMobile = "9876543210" }) {
  const [vehicle, setVehicle] = useState(() => formatPlate(initialVehicle));
  const [mobile, setMobile] = useState(initialMobile || "9876543210");
  const [view, setView] = useState("user"); // "user" | "garage" | "legal" | "admin"
  const [step, setStep] = useState(0);
  const [consent, setConsent] = useState({});
  const [vData, setVData] = useState(() => deriveVehicleDetails(initialVehicle));
  const [selectedAddons, setSelectedAddons] = useState(["zd", "rsa"]);
  const [compareIds, setCompareIds] = useState(["A", "B"]);
  const [inspectingPolicy, setInspectingPolicy] = useState(null);
  const [plan, setPlan] = useState(PLANS[0]);
  const [lastReq, setLastReq] = useState(null);
  const [refId, setRefId] = useState("");
  const [remind, setRemind] = useState([45, 30, 15, 7, 0]);
  const [leads, setLeads] = useState(SEED_LEADS);
  const [consentRecords, setConsentRecords] = useState(INITIAL_CONSENT_RECORDS);
  const [channels, setChannels] = useState({ sms: true, wa: true, email: true, calls: true });
  const [commHistory, setCommHistory] = useState(INITIAL_COMM_HISTORY);
  const [savedQuotes, setSavedQuotes] = useState([]);

  const [savedVehicles, setSavedVehicles] = useState(() => [
    {
      plate: formatPlate(initialVehicle),
      nickname: "Kolkata Daily Commuter",
      addedAt: "06 Oct 2026",
      history: ["Initial scan captured"],
    },
    {
      plate: "WB 06 CD 4421",
      nickname: "Salt Lake Family Sedan",
      addedAt: "18 Sep 2026",
      history: ["30-day reminder delivered"],
    },
  ]);

  useEffect(() => {
    const formatted = formatPlate(initialVehicle);
    setVehicle(formatted);
    setVData(deriveVehicleDetails(formatted));
  }, [initialVehicle]);

  useEffect(() => {
    const onPlateEvent = (e) => {
      const rawPlate = e.detail?.plate || "WB 02 AB 1234";
      const formatted = formatPlate(rawPlate);
      setVehicle(formatted);
      setVData(deriveVehicleDetails(formatted));
      if (e.detail?.mobile) setMobile(e.detail.mobile);
      setStep(0);
      setView("user");
    };
    window.addEventListener("insuredrive:open", onPlateEvent);
    return () => window.removeEventListener("insuredrive:open", onPlateEvent);
  }, []);

  const handleSaveGarage = () => {
    if (!savedVehicles.some((v) => v.plate === vehicle)) {
      setSavedVehicles([
        {
          plate: vehicle,
          nickname: vData.nickname || "Kolkata Commuter",
          addedAt: "Today",
          history: ["Saved from Vehicle Dashboard"],
        },
        ...savedVehicles,
      ]);
    } else {
      setView("garage");
    }
  };

  const handleSaveQuotation = (q) => {
    if (!savedQuotes.some((x) => x.id === q.id && x.vehicle === vehicle)) {
      setSavedQuotes([{ ...q, vehicle }, ...savedQuotes]);
    }
  };

  const send = (req) => {
    const id = "LD-" + (1043 + leads.length - SEED_LEADS.length);
    setRefId(id);
    setLastReq(req);
    setLeads([
      {
        id,
        name: req.name,
        veh: vehicle,
        mob: mask(mobile),
        type: vData.type === "Two-wheeler" ? "Bike" : "Car",
        plan: req.plan?.insurer || plan.insurer,
        leadType: req.actionType || "Request a callback",
        days: vData.days,
        rem: !!consent.rem,
        wa: req.mode === "wa" || !!consent.wa,
        mkt: false,
        status: "New",
        lang: req.lang,
        slot: req.time,
      },
      ...leads,
    ]);
    setStep(4);
  };

  const navTabs = [
    { title: "Renewal Assistant", icon: Home },
    { title: `My Garage (${savedVehicles.length})`, icon: Car },
    { type: "separator" },
    { title: "Manage Consent & Help", icon: ShieldCheck },
    { title: `Admin (${leads.length})`, icon: LayoutDashboard },
  ];

  const activeTabIndex =
    view === "user" ? 0 : view === "garage" ? 1 : view === "legal" ? 3 : 4;

  const handleTabChange = (idx) => {
    if (idx === 0) setView("user");
    else if (idx === 1) setView("garage");
    else if (idx === 3) setView("legal");
    else if (idx === 4) setView("admin");
  };

  return (
    <div className="pz">
      <style>{css}</style>
      <nav className="nav">
        <div className="brand">
          <span className="logo">◈</span>
          <span>InsureDrive</span>
          <span className="plate-chip" style={{ marginLeft: 6 }}>
            <small>IND</small>{vehicle}
          </span>
        </div>
        <ExpandedTabs
          tabs={navTabs}
          selectedIndex={activeTabIndex}
          clearOnClickOutside={false}
          onChange={handleTabChange}
        />
      </nav>

      <main className="wrap">
        {view === "admin" ? (
          <Admin
            leads={leads}
            setLeads={setLeads}
            consentRecords={consentRecords}
            onOpenConsent={() => setView("legal")}
          />
        ) : view === "garage" ? (
          <GarageView
            activeVehicle={vehicle}
            onSelectVehicle={(p) => {
              setVehicle(p);
              setVData(deriveVehicleDetails(p));
              setStep(1);
              setView("user");
            }}
            savedVehicles={savedVehicles}
            setSavedVehicles={setSavedVehicles}
            savedQuotes={savedQuotes}
            remind={remind}
            setRemind={setRemind}
            commHistory={commHistory}
            setCommHistory={setCommHistory}
            onOpenConsent={() => setView("legal")}
            onRequestQuoteFromSaved={(q) => {
              setPlan({ ...q, actionType: "Request a callback" });
              setStep(2);
              setView("user");
            }}
          />
        ) : view === "legal" ? (
          <LegalAndConsentView
            consentRecords={consentRecords}
            setConsentRecords={setConsentRecords}
            channels={channels}
            setChannels={setChannels}
            mobile={mobile}
            vehicle={vehicle}
            onDeleteData={() => {
              setSavedQuotes([]);
              setRemind([]);
            }}
          />
        ) : (
          <>
            {step === 0 && (
              <Verify
                vehicle={vehicle}
                mobile={mobile}
                onMobileChange={setMobile}
                onDone={(c) => {
                  setConsent(c);
                  setStep(1);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}
            {step === 1 && (
              <>
                <VehicleDashboard
                  vehicle={vehicle}
                  vData={vData}
                  setVData={setVData}
                  isSavedInGarage={savedVehicles.some((v) => v.plate === vehicle)}
                  onSaveGarage={handleSaveGarage}
                  onCompareOptions={() => {
                    document.getElementById("compare-section")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  onRenewCurrent={() => {
                    const currentMatch = PLANS.find((p) => p.insurer.includes(vData.currentInsurer)) || PLANS[0];
                    setPlan({ ...currentMatch, actionType: "Renew with current insurer" });
                    setStep(2);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  onBuyNew={() => {
                    setPlan({ ...PLANS[0], actionType: "Buy new insurance" });
                    document.getElementById("compare-section")?.scrollIntoView({ behavior: "smooth" });
                  }}
                  onContactAgent={() => {
                    setPlan({ ...PLANS[0], actionType: "Request a callback" });
                    setStep(2);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
                <PolicyListingAndCompare
                  vehicle={vehicle}
                  vData={vData}
                  plans={PLANS}
                  addonOptions={ADDON_OPTIONS}
                  selectedAddons={selectedAddons}
                  setSelectedAddons={setSelectedAddons}
                  compareIds={compareIds}
                  setCompareIds={setCompareIds}
                  onInspectPolicy={(p) => setInspectingPolicy(p)}
                  onSaveQuotation={handleSaveQuotation}
                  savedQuoteIds={savedQuotes.filter((q) => q.vehicle === vehicle).map((q) => q.id)}
                  onBack={null}
                  onPick={(p) => {
                    setPlan(p);
                    setStep(2);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                />
              </>
            )}
            {step === 2 && (
              <RequestCallback
                vehicle={vehicle}
                plan={plan}
                onBack={() => setStep(1)}
                onSend={(req) => {
                  const id = "LD-" + (1043 + leads.length - SEED_LEADS.length);
                  setRefId(id);
                  setLastReq(req);
                  setLeads([
                    {
                      id,
                      name: req.name,
                      veh: vehicle,
                      mob: mask(mobile),
                      type: vData.type === "Two-wheeler" ? "Bike" : "Car",
                      plan: req.plan?.insurer || plan.insurer,
                      leadType: req.actionType || "Request a callback",
                      days: vData.days,
                      rem: !!consent.rem,
                      wa: req.mode === "wa" || !!consent.wa,
                      mkt: false,
                      status: "New",
                      lang: req.lang,
                      slot: req.time,
                    },
                    ...leads,
                  ]);
                  setStep(3);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              />
            )}
            {step === 3 && (
              <DoneView
                ref_={refId}
                vehicle={vehicle}
                plan={plan}
                lastReq={lastReq}
                remind={remind}
                setRemind={setRemind}
                onRestart={() => setStep(1)}
                onOpenGarage={() => setView("garage")}
                onAdmin={() => setView("admin")}
              />
            )}
          </>
        )}
      </main>

      <PolicyDetailsModal
        policy={inspectingPolicy}
        vehicle={vehicle}
        onClose={() => setInspectingPolicy(null)}
        inCompare={inspectingPolicy ? compareIds.includes(inspectingPolicy.id) : false}
        onAddCompare={(id) =>
          setCompareIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
        }
        onRequestCallback={(p) => {
          setPlan({ ...p, actionType: "Request a callback" });
          setStep(2);
          setView("user");
        }}
        onBuyRenew={(p) => {
          setPlan({ ...p, actionType: "Get partner quotation" });
          setStep(2);
          setView("user");
        }}
      />

      <footer style={{ maxWidth: 1120, margin: "48px auto 0", paddingTop: 22, borderTop: "1.5px solid var(--line)", color: "var(--mut)", fontSize: 13, lineHeight: 1.65, display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
        <div>
          <b>InsureDrive Kolkata Renewal Assistant:</b> Personal data is collected only with explicit purpose-level consent (DPDP Act). Demo quotations shown for MVP validation.
        </div>
        <div className="row" style={{ gap: 14 }}>
          <button type="button" className="btn ghost sm" onClick={() => setView("legal")}>Privacy & Terms</button>
          <button type="button" className="btn ghost sm" onClick={() => setView("legal")}>Manage Consent</button>
          <button type="button" className="btn ghost sm" onClick={() => setView("legal")}>Partner Disclosure</button>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  const initialPlate = typeof window !== "undefined" && window.__INITIAL_PLATE__
    ? window.__INITIAL_PLATE__
    : "WB 02 AB 1234";
  return <Flow vehicle={initialPlate} />;
}

const mountEl = typeof document !== "undefined" ? document.getElementById("site") : null;
if (mountEl) {
  const root = createRoot(mountEl);
  root.render(<App />);
}
