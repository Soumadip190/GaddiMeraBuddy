# InsureDrive intro + site (uses only your 2 videos)

Files: index.html, part1.mp4, part2.mp4  (keep them in the same folder)

## Run (PowerShell)
    cd insurance-intro
    python -m http.server 8080
    # open http://localhost:8080
(or: npx serve .)

## Flow
1. part1.mp4 plays: car -> close-up of the blank plate. Frame holds. Plate asks for the vehicle number.
2. Type the number (floating letters). Arrow button inside the plate enables only when valid. Press Enter or tap the arrow.
3. Letters sink into the plate (engraved) + one glint.
4. part2.mp4 plays: camera rises up the tailgate, through the rear window, to the infotainment screen. Typed plate rides the real plate out of frame.
5. Screen zooms to fill the page. It asks for phone number (with consent), then 6-digit OTP.
6. Fades into the insurance site: vehicle + policy status, compare, explainers, renewal checkout, dashboard.

## Wire up your backend (top of the <script>, 3 stubs)
    sendOtp(phone)        -> POST /api/otp/send     (MSG91 / Twilio)
    verifyOtp(phone,code) -> POST /api/otp/verify
    lookupVehicle(plate)  -> your vehicle-registration provider
Demo OTP is 123456. Set DEMO=false when real OTP is connected.
Site data (policies, status, vehicle facts) is SAMPLE data until the APIs are connected.

## Tuning constants (all measured from your clips)
P1   plate box on the last frame of part1
KF   plate box over time in part2 (overlay follows the plate)
STAR steering-wheel emblem track (blurred out)
STOP part2 time where the screen is framed (2.74s; frames after ~3.0s are blurry)
SCREEN infotainment glass rectangle used for the zoom

## 4K quality
The page auto-picks the best file the screen can show and falls back if a file is missing:
    part1_4k.mp4   part2_4k.mp4     (used on 4K / very large screens)
    part1_1080.mp4 part2_1080.mp4   (used on most laptops)
    part1.mp4      part2.mp4        (480p originals, always the last fallback)
Drop the new files next to index.html. No code change needed, as long as they have the SAME framing and timing as the originals.
Make them from the Flow originals (PowerShell, ffmpeg installed):
    ffmpeg -i flow_part1.mp4 -ss 0 -t 1.49 -c:v libx264 -crf 17 -preset slow -pix_fmt yuv420p -movflags +faststart part1_4k.mp4
    ffmpeg -i flow_part1.mp4 -ss 0 -t 1.49 -vf scale=1920:-2 -c:v libx264 -crf 18 -preset slow -pix_fmt yuv420p -movflags +faststart part1_1080.mp4
    (same for part2 with -t 4.31 and your part2 start time)
