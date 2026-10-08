import React, { useState, useEffect, useRef } from "react";
import { formatPlate, inr, mask, deriveVehicleDetails } from "./data.js";

// =========================================================================
// STEP 1: USER VERIFICATION & DPDP 2023 CONSENT GATE
// =========================================================================
export function Step1Verification({
  vehicle,
  mobile,
  onMobileChange,
  onProceed,
  onOpenLedger,
  onBackToFleet,
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(42);
  const [consentMandatory] = useState(true);
  const [consentReminders, setConsentReminders] = useState(true);
  const [consentWhatsapp, setConsentWhatsapp] = useState(true);
  const [editingMobile, setEditingMobile] = useState(false);
  const [mobileDraft, setMobileDraft] = useState(mobile || "9830144829");
  const otpInputsRef = useRef([]);

  const vInfo = deriveVehicleDetails(vehicle || "WB02AB1234");

  // Timer countdown
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((t) => (t > 0 ? t - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const handleOtpChange = (index, val) => {
    const clean = val.replace(/[^0-9]/g, "");
    if (!clean) {
      const next = [...otp];
      next[index] = "";
      setOtp(next);
      return;
    }
    const next = [...otp];
    next[index] = clean[clean.length - 1];
    setOtp(next);
    if (index < 5 && otpInputsRef.current[index + 1]) {
      otpInputsRef.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      if (otpInputsRef.current[index - 1]) {
        otpInputsRef.current[index - 1].focus();
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = (e.clipboardData || window.clipboardData).getData("text").trim();
    const digits = pasted.replace(/[^0-9]/g, "").slice(0, 6);
    if (!digits) return;
    const next = [...otp];
    digits.split("").forEach((digit, i) => {
      if (i < 6) next[i] = digit;
    });
    setOtp(next);
    const focusIdx = Math.min(digits.length, 5);
    if (otpInputsRef.current[focusIdx]) {
      otpInputsRef.current[focusIdx].focus();
    }
  };

  const handleAutofill = () => {
    const demoCode = ["7", "4", "2", "9", "1", "8"];
    setOtp(demoCode);
    if (otpInputsRef.current[5]) {
      otpInputsRef.current[5].focus();
    }
  };

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(45);
  };

  const saveMobile = () => {
    const cleaned = mobileDraft.replace(/\D/g, "").slice(0, 10);
    if (cleaned.length === 10) {
      if (onMobileChange) onMobileChange(cleaned);
      setEditingMobile(false);
      setTimer(45);
    }
  };

  const handleContinue = () => {
    if (onProceed) {
      onProceed({
        opt1: consentReminders,
        opt2: consentWhatsapp,
        otp: otp.join(""),
      });
    }
  };

  return (
    <div className="flex flex-col w-full space-y-space-lg transition-opacity duration-300">
      {/* Step / Progress Breadcrumb Bar */}
      <div className="flex flex-wrap items-center justify-between gap-space-sm bg-surface-container-lowest p-space-md rounded-xl shadow-sm">
        <div className="flex items-center gap-space-md">
          <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-headline-sm text-headline-sm">
            <span className="material-symbols-outlined text-[20px]">enhanced_encryption</span>
          </div>
          <div>
            <div className="flex items-center gap-space-xs font-label-sm text-label-sm text-secondary uppercase tracking-wider font-bold">
              <span className="inline-block w-2 h-2 rounded-full bg-secondary"></span>
              Mandatory Statutory Gate · Step 1 of 5
            </div>
            <h1 className="font-headline-sm text-headline-sm text-on-surface">
              Identity Verification &amp; DPDP Consent Gate
            </h1>
          </div>
        </div>
        <div className="flex items-center gap-space-sm font-label-sm text-label-sm">
          <span className="px-2.5 py-1 rounded bg-secondary-container/40 text-on-secondary-container font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">gavel</span>
            DPDP Act 2023 Compliant
          </span>
          <span className="px-2.5 py-1 rounded bg-surface-container text-on-surface-variant font-label-numeric">
            IRDAI/NL/842-VERIF
          </span>
        </div>
      </div>

      {/* Active Vehicle Metadata Context Banner */}
      <div className="relative overflow-hidden bg-surface-container-lowest rounded-xl p-space-lg shadow-sm">
        <div className="absolute -right-16 -top-16 w-56 h-56 bg-surface-container-high/40 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          {/* Vehicle & Plate Data */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-space-md">
            {/* Realistic HSRP Plate Badge */}
            <div className="inline-flex items-center bg-surface-container-lowest px-3 py-1.5 rounded-lg shadow-sm border border-outline-variant/40">
              <div className="bg-primary-container text-on-primary px-1.5 py-1 rounded-sm flex flex-col items-center justify-center mr-2 leading-none">
                <span className="font-label-plate text-[9px] tracking-tight">IND</span>
                <span className="text-[8px] leading-none opacity-80">🇮🇳</span>
              </div>
              <div className="font-label-plate text-headline-sm text-on-surface uppercase tracking-wider font-bold">
                {formatPlate(vehicle) || "WB 02 AB 1234"}
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-title-md text-title-md text-on-surface font-bold">
                  {vInfo?.model ? `${vInfo.make} ${vInfo.model}` : "Hyundai Creta 1.5 SX (Petrol)"}
                </span>
                <span className="bg-secondary/10 text-secondary font-label-sm text-label-sm px-2 py-0.5 rounded-full flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[13px]">check_circle</span> VAHAN 4.0 Synced
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 font-body-sm text-body-sm text-on-surface-variant">
                <span>
                  Chassis: <strong className="font-label-numeric text-on-surface">MALC281...8892</strong>
                </span>
                <span>•</span>
                <span>
                  Reg Date: <strong className="text-on-surface">14 Mar 2021</strong>
                </span>
                <span>•</span>
                <span>
                  RTO: <strong className="text-on-surface">{vInfo?.rto || "WB-02 (Kolkata Beltala)"}</strong>
                </span>
              </div>
            </div>
          </div>
          {/* Telemetry Status Quick Pills */}
          <div className="flex items-center gap-space-sm self-start lg:self-center">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface">
              <span className="material-symbols-outlined text-secondary text-[18px]">verified_user</span>
              <div className="flex flex-col text-left">
                <span className="font-label-sm text-[10px] text-on-surface-variant uppercase leading-none">
                  MoRTH Parivahan
                </span>
                <span className="font-label-numeric text-body-sm font-semibold leading-tight text-on-surface">
                  Active Record
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-surface-container-low text-on-surface">
              <span className="material-symbols-outlined text-on-surface-variant text-[18px]">shield</span>
              <div className="flex flex-col text-left">
                <span className="font-label-sm text-[10px] text-on-surface-variant uppercase leading-none">
                  Last Insurer
                </span>
                <span className="font-body-sm text-body-sm font-semibold leading-tight text-on-surface">
                  {vInfo?.currentInsurer || "HDFC ERGO General"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Interactive Verification Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* LEFT COLUMN (5 cols): Mobile 2FA Authentication */}
        <section className="lg:col-span-5 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col justify-between space-y-space-lg">
          <div className="space-y-space-md">
            <div className="flex items-center justify-between pb-space-xs">
              <div className="flex items-center gap-space-xs">
                <span className="material-symbols-outlined text-primary-container text-[20px]">lock</span>
                <span className="font-label-sm text-label-sm text-primary-container uppercase font-bold tracking-wider">
                  Two-Factor Authentication
                </span>
              </div>
              <button
                className="px-2 py-0.5 rounded-full bg-surface-container-high text-on-surface hover:bg-surface-variant font-label-sm text-label-sm font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                id="autofill-btn"
                type="button"
                onClick={handleAutofill}
              >
                <span className="material-symbols-outlined text-[13px]">bolt</span> Demo Autofill
              </button>
            </div>
            <div>
              <h2 className="font-title-md text-title-md text-on-surface font-bold">Verify Registered Contact</h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                We dispatched a 6-digit cryptographic passcode to your VAHAN-linked mobile number for ownership binding.
              </p>
            </div>

            {/* Masked Phone Display */}
            <div className="flex items-center justify-between p-space-sm rounded-xl bg-surface-container-low">
              <div className="flex items-center gap-space-sm">
                <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface-variant">
                  <span className="material-symbols-outlined text-[18px]">smartphone</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-label-sm text-[10px] text-on-surface-variant uppercase leading-none">
                    Registered Primary Phone
                  </span>
                  <span className="font-label-numeric text-body-lg font-bold text-on-surface mt-0.5 tracking-wide">
                    +91 {mobile ? mask(mobile) : "98301 •••••"}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setEditingMobile(!editingMobile)}
                  className="font-label-sm text-[11px] text-primary hover:underline font-semibold"
                >
                  {editingMobile ? "Cancel" : "Edit"}
                </button>
                <span className="font-label-sm text-label-sm text-secondary flex items-center gap-1 font-semibold">
                  <span className="material-symbols-outlined text-[14px]">check</span> Verified
                </span>
              </div>
            </div>

            {/* Optional Edit Mobile Box */}
            {editingMobile && (
              <div className="flex items-center gap-2 p-2 bg-surface-container-low rounded-lg">
                <input
                  type="tel"
                  maxLength={10}
                  value={mobileDraft}
                  onChange={(e) => setMobileDraft(e.target.value.replace(/\D/g, ""))}
                  placeholder="10-digit mobile"
                  className="flex-1 px-3 py-1.5 bg-surface-container-lowest rounded text-body-sm font-label-numeric border border-outline-variant focus:outline-none"
                />
                <button
                  type="button"
                  onClick={saveMobile}
                  disabled={mobileDraft.length !== 10}
                  className="px-3 py-1.5 bg-primary text-on-primary text-body-sm rounded font-semibold disabled:opacity-50"
                >
                  Save
                </button>
              </div>
            )}

            {/* 6 Individual OTP Boxes Form */}
            <div className="space-y-space-sm pt-space-xs">
              <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wide block">
                Enter 6-Digit SMS Passcode
              </label>
              <div className="grid grid-cols-6 gap-2" id="otp-container">
                {otp.map((digit, idx) => (
                  <input
                    key={idx}
                    ref={(el) => (otpInputsRef.current[idx] = el)}
                    className="otp-box w-full h-12 text-center font-label-numeric text-headline-sm font-bold bg-surface-container-low text-on-surface rounded-lg focus:outline-none focus:bg-surface-container-lowest focus:ring-2 focus:ring-primary-container transition-all"
                    inputMode="numeric"
                    maxLength={1}
                    pattern="[0-9]*"
                    type="text"
                    value={digit}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onPaste={handleOtpPaste}
                    autoFocus={idx === 0}
                  />
                ))}
              </div>

              {/* Resend Countdown and Feedback */}
              <div className="flex items-center justify-between pt-1">
                <span className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1" id="otp-timer-text">
                  <span className="material-symbols-outlined text-[15px]">timer</span>
                  Resend passcode in{" "}
                  <strong className="font-label-numeric text-on-surface font-semibold" id="timer-count">
                    00:{timer < 10 ? `0${timer}` : timer}
                  </strong>
                  s
                </span>
                <button
                  className={`font-label-sm text-label-sm font-semibold transition-colors ${
                    timer <= 0
                      ? "text-secondary hover:underline cursor-pointer"
                      : "text-on-surface-variant cursor-not-allowed opacity-60"
                  }`}
                  disabled={timer > 0}
                  id="resend-btn"
                  type="button"
                  onClick={handleResend}
                >
                  Resend Code
                </button>
              </div>
            </div>
          </div>

          {/* TRAI DLT Whitelisting Carrier Badge */}
          <div className="pt-space-md">
            <div className="p-space-sm rounded-xl bg-surface-container-low flex items-start gap-space-sm">
              <span className="material-symbols-outlined text-secondary text-[20px] mt-0.5">verified</span>
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-2">
                  <span className="font-label-sm text-label-sm font-bold text-on-surface">TRAI DLT Whitelisted Route</span>
                  <span className="bg-secondary/15 text-secondary text-[10px] font-bold px-1.5 py-0.2 rounded font-label-numeric">
                    100% SLA
                  </span>
                </div>
                <p className="font-body-sm text-[12px] text-on-surface-variant mt-0.5 leading-snug">
                  Dispatched via Principal Entity Header{" "}
                  <span className="font-label-numeric font-semibold text-on-surface">INSRDRV-ACT</span>. Telecom regulatory token verified by Airtel / Jio Gateway.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* RIGHT COLUMN (7 cols): DPDP Act 2023 Statutory Consent Architecture */}
        <section className="lg:col-span-7 bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-md">
          <div className="flex flex-wrap items-center justify-between gap-space-sm">
            <div className="flex items-center gap-space-xs">
              <span className="material-symbols-outlined text-secondary text-[20px]">policy</span>
              <span className="font-label-sm text-label-sm text-secondary uppercase font-bold tracking-wider">
                Statutory Consent Governance
              </span>
            </div>
            <div className="flex items-center gap-1.5 bg-surface-container-high px-2.5 py-0.5 rounded-full font-label-numeric text-label-sm text-on-surface font-semibold">
              <span>Audit Key:</span>
              <span className="text-primary-container">DPDP-8832-IN</span>
            </div>
          </div>

          <div>
            <h2 className="font-title-md text-title-md text-on-surface font-bold">
              Digital Personal Data Protection (DPDP) Act, 2023
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Under Indian federal privacy jurisprudence, InsureDrive Technologies acts as a Registered Data Fiduciary. Specify the explicit, purpose-limited processing permissions below.
            </p>
          </div>

          {/* Purpose Specific Consent Checkboxes */}
          <div className="space-y-space-sm">
            {/* Checkbox 1: Mandatory Underwriting */}
            <label className="group relative flex items-start gap-space-sm p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container-high/50 cursor-pointer transition-colors">
              <input
                checked={consentMandatory}
                className="mt-1 w-5 h-5 rounded text-primary-container focus:ring-0 focus:outline-none cursor-not-allowed accent-primary-container"
                disabled
                id="consent-mandatory"
                type="checkbox"
                readOnly
              />
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-title-md text-body-md font-bold text-on-surface">
                    Underwriting &amp; Quote Aggregation
                  </span>
                  <span className="font-label-sm text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-primary-container text-on-primary">
                    Mandatory Statutory Basis
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                  Authority to query vehicle registration number{" "}
                  <span className="font-label-plate text-[12px] font-bold text-on-surface">
                    {formatPlate(vehicle) || "WB 02 AB 1234"}
                  </span>{" "}
                  against MoRTH Parivahan telemetry, confirm claim registers, and securely aggregate bindable premium quotes across 18 IRDAI-licensed general insurers.
                </p>
              </div>
            </label>

            {/* Checkbox 2: Renewal & NCB Alerts */}
            <label className="group relative flex items-start gap-space-sm p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container-high/60 cursor-pointer transition-colors">
              <input
                checked={consentReminders}
                onChange={(e) => setConsentReminders(e.target.checked)}
                className="mt-1 w-5 h-5 rounded text-primary-container focus:ring-0 focus:outline-none cursor-pointer accent-primary-container"
                id="consent-reminders"
                type="checkbox"
              />
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-title-md text-body-md font-semibold text-on-surface">
                    Renewal Reminders &amp; NCB Protection Advisories
                  </span>
                  <span className="font-label-sm text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                    Optional
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                  Receive scheduled dispatch notifications at 30, 15, and 3 days prior to expiration to safeguard your accrued <strong className="text-on-surface font-semibold">35% No Claim Bonus (NCB)</strong> from statutory lapse forfeiture.
                </p>
              </div>
            </label>

            {/* Checkbox 3: WhatsApp Assistant */}
            <label className="group relative flex items-start gap-space-sm p-space-md rounded-xl bg-surface-container-low hover:bg-surface-container-high/60 cursor-pointer transition-colors">
              <input
                checked={consentWhatsapp}
                onChange={(e) => setConsentWhatsapp(e.target.checked)}
                className="mt-1 w-5 h-5 rounded text-primary-container focus:ring-0 focus:outline-none cursor-pointer accent-primary-container"
                id="consent-whatsapp"
                type="checkbox"
              />
              <div className="flex flex-col flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="font-title-md text-body-md font-semibold text-on-surface flex items-center gap-1.5">
                    WhatsApp Renewal Assistant &amp; Digital Policy Vault
                  </span>
                  <span className="font-label-sm text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-surface-container text-on-surface-variant">
                    Optional
                  </span>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 leading-relaxed">
                  Permission to dispatch digital quotation comparison PDFs, policy endorsement notes, and 24x7 cashless garage network locator via Meta Verified WhatsApp Business API channel.
                </p>
              </div>
            </label>
          </div>

          {/* Section 6(7) DPDP Notice */}
          <div className="p-space-sm rounded-xl bg-surface-container-high/50 flex items-start gap-space-sm">
            <span className="material-symbols-outlined text-on-surface-variant text-[18px] mt-0.5">verified_user</span>
            <div className="flex-1 font-body-sm text-[12px] text-on-surface-variant leading-relaxed">
              <strong className="text-on-surface">Revocable Consent Rights:</strong> Pursuant to Section 6(7) of the DPDP Act 2023, you retain the irrevocable legal right to inspect your audit ledger, modify marketing triggers, or permanently delete stored telemetry at any time via the{" "}
              <button
                type="button"
                onClick={onOpenLedger}
                className="text-secondary font-semibold hover:underline inline-flex items-center gap-0.5"
              >
                <span>Consent Ledger Console</span>
                <span className="material-symbols-outlined text-[12px]">open_in_new</span>
              </button>.
            </div>
          </div>
        </section>
      </div>

      {/* Security Micro-Banner with Visual Trust Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-md p-space-md rounded-xl bg-surface-container-lowest shadow-sm">
        <div className="flex items-center gap-space-sm">
          <div className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[20px]">lock</span>
          </div>
          <div>
            <div className="font-label-sm text-label-sm text-on-surface font-bold">256-Bit TLS Bank Encryption</div>
            <div className="font-body-sm text-[12px] text-on-surface-variant">SHA-256 TLS payload encryption</div>
          </div>
        </div>
        <div className="flex items-center gap-space-sm">
          <div className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center text-primary-container">
            <span className="material-symbols-outlined text-[20px]">cloud_sync</span>
          </div>
          <div>
            <div className="font-label-sm text-label-sm text-on-surface font-bold">Direct MoRTH API Pipe</div>
            <div className="font-body-sm text-[12px] text-on-surface-variant">No third-party intermediate scraping</div>
          </div>
        </div>
        <div className="flex items-center gap-space-sm">
          <div className="w-9 h-9 rounded-lg bg-surface-container-low flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[20px]">assured_workload</span>
          </div>
          <div>
            <div className="font-label-sm text-label-sm text-on-surface font-bold">IRDAI Licensed Direct Broker</div>
            <div className="font-body-sm text-[12px] text-on-surface-variant">Registration #842 (Category: General)</div>
          </div>
        </div>
      </div>

      {/* Bottom Action Navigation Bar */}
      <div className="sticky bottom-4 z-30 flex flex-col sm:flex-row items-center justify-between gap-space-md bg-surface-container-lowest/95 backdrop-blur-md p-space-md rounded-xl shadow-xl border border-surface-container-high/60">
        <div className="flex items-center gap-space-md w-full sm:w-auto justify-between sm:justify-start">
          <button
            type="button"
            onClick={onBackToFleet}
            className="flex items-center gap-1.5 font-label-sm text-body-sm text-on-surface-variant hover:text-on-surface font-semibold transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[18px]">arrow_back</span>
            Back to Registered Fleet
          </button>
          <span className="hidden sm:inline text-outline-variant">•</span>
          <div className="hidden sm:flex items-center gap-1 font-label-sm text-label-sm text-secondary font-semibold">
            <span className="material-symbols-outlined text-[16px]">verified</span>
            Consent Checksum: <span className="font-label-numeric">#C98F-2025</span>
          </div>
        </div>
        <div className="flex items-center gap-space-sm w-full sm:w-auto">
          <button
            type="button"
            className="w-full sm:w-auto px-space-lg h-11 rounded-lg bg-primary-container text-on-primary hover:opacity-95 font-title-md text-body-md font-semibold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
            id="verify-submit-btn"
            onClick={handleContinue}
          >
            <span>Verify &amp; Continue to Policy Health</span>
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// STEP 2: VEHICLE & POLICY HUB DASHBOARD
// =========================================================================
export function Step2VehicleDashboard({
  vehicle,
  vData,
  onCompare,
  onQuickRenew,
  onOpenAdvisorModal,
  onSaveGarage,
  isSavedInGarage,
}) {
  const [showCorrection, setShowCorrection] = useState(false);
  const [showDropzone, setShowDropzone] = useState(false);
  const [engineNo, setEngineNo] = useState("G4FL89231");
  const [fuelVariant, setFuelVariant] = useState("1.5L Turbo GDi Petrol");
  const [odometer, setOdometer] = useState("38,420 km");
  const [uploadedDoc, setUploadedDoc] = useState(null);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const handleSaveCorrection = () => {
    setShowCorrection(false);
    showToast("Technical specifications updated and synced with underwriting model.");
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedDoc(file.name);
      setShowDropzone(false);
      showToast(`Document "${file.name}" uploaded. AI OCR successfully verified policy details.`);
    }
  };

  return (
    <div className="flex flex-col gap-space-lg w-full transition-opacity duration-300">
      {toastMsg && (
        <div className="bg-primary text-on-primary px-4 py-3 rounded-xl flex items-center justify-between shadow-lg">
          <div className="flex items-center gap-2 font-body-sm">
            <span className="material-symbols-outlined text-secondary-fixed text-[20px]">check_circle</span>
            <span>{toastMsg}</span>
          </div>
          <button type="button" onClick={() => setToastMsg("")} className="text-white/80 hover:text-white">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Status Diagnostic Bar */}
      <div className="w-full bg-surface-container-lowest rounded-xl p-space-md shadow-sm flex flex-wrap items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500 animate-ping"></span>
            <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface-variant tracking-wider">
              Policy Health State:
            </span>
          </div>
          <div className="bg-amber-100 text-amber-900 px-3 py-1 rounded-full font-label-numeric text-label-sm font-bold flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[16px] text-amber-800">warning</span>
            <span>EXPIRING IN 18 DAYS (CRITICAL RENEWAL WINDOW)</span>
          </div>
        </div>
        <div className="flex items-center gap-space-lg flex-wrap">
          <div className="flex items-center gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px] text-secondary">location_on</span>
            <span>RTO: <strong className="text-on-surface">Kolkata Central (WB-02)</strong></span>
          </div>
          <div className="flex items-center gap-1.5 font-body-sm text-body-sm text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px] text-primary">cloud_done</span>
            <span>Data Source: <strong className="text-on-surface">Parivahan API Sync (Active)</strong></span>
          </div>
        </div>
      </div>

      {/* Vehicle Overview + Current Active Policy Bento */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-stretch">
        {/* Vehicle Metadata Overview Card (7 Cols) */}
        <div className="lg:col-span-7 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="flex flex-col gap-space-md">
            <div className="flex items-start justify-between">
              <div>
                <span className="font-label-sm text-label-sm uppercase tracking-widest text-on-surface-variant font-bold">
                  Vehicle Specification Profile
                </span>
                <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold mt-1">
                  Hyundai Creta 1.5 SX (O) Turbo
                </h1>
                <p className="font-body-md text-body-md text-on-surface-variant">
                  7-Speed Dual Clutch Transmission (DCT) • Phantom Black
                </p>
              </div>
              <div className="bg-surface-container-low px-3 py-1.5 rounded-lg font-label-plate text-body-sm font-bold text-on-surface">
                {formatPlate(vehicle)}
              </div>
            </div>

            {/* Vehicle Visual Asset Banner */}
            <div className="w-full h-44 rounded-xl overflow-hidden relative bg-surface-container-high">
              <img
                className="w-full h-full object-cover"
                alt="Phantom Black Hyundai Creta modern compact SUV"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuBnn84etXEjOG4WR9UPrxh1W4S-h2vzhUsdDQ3_D9OxPY3wMfpttbANhXdBHtahlTL5l23WZXkSbNCKVwU0fJNvU3JNjUvdlB-VLihnBY-1MkbMn3fD_hRuXCuYMr_zCWZfNflkq838PxFYWab8feYYmj21g-45IpZKEaXdADU2AMZ_9Rg6HT3p-L86qbjL3jwD3kKjA5OcTGFN3vmsloZC5Yk_MvdT4fcVdojKwV__"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex items-end p-space-md">
                <div className="flex items-center gap-space-md text-on-primary">
                  <div className="flex flex-col">
                    <span className="text-[11px] font-label-sm uppercase opacity-80">Fuel &amp; Cubic Capacity</span>
                    <span className="font-label-numeric text-label-numeric font-bold">1497 cc • Petrol (BS6 Phase 2)</span>
                  </div>
                  <div className="h-6 w-px bg-white/30"></div>
                  <div className="flex flex-col">
                    <span className="text-[11px] font-label-sm uppercase opacity-80">Chassis &amp; Engine</span>
                    <span className="font-label-numeric text-label-numeric font-bold">VIN: MALC381••••8841</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Specs Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-space-sm pt-space-xs">
              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Reg Date</span>
                <span className="font-label-numeric text-label-numeric text-on-surface font-bold">14/03/2021</span>
              </div>
              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Vehicle Class</span>
                <span className="font-label-numeric text-label-numeric text-on-surface font-bold">Motor Car (LMV)</span>
              </div>
              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant">PUC Validity</span>
                <span className="font-label-numeric text-label-numeric text-secondary font-bold">Valid till Aug '25</span>
              </div>
              <div className="bg-surface-container-low p-space-sm rounded-lg flex flex-col">
                <span className="font-label-sm text-label-sm text-on-surface-variant">Hypothecation</span>
                <span className="font-label-numeric text-label-numeric text-on-surface font-bold">HDFC Bank Ltd</span>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-space-md text-body-sm">
            <span className="text-on-surface-variant">
              Ownership Record: <strong className="text-on-surface">First Owner (Individual)</strong>
            </span>
            <button
              className="text-primary font-bold hover:underline flex items-center gap-1"
              onClick={() => setShowCorrection(!showCorrection)}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">edit_note</span>
              <span>{showCorrection ? "Close Form" : "Edit Details Manually"}</span>
            </button>
          </div>
        </div>

        {/* Current Expiring Policy Card (5 Cols) */}
        <div className="lg:col-span-5 bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col justify-between">
          <div className="flex flex-col gap-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-space-sm">
                <div className="w-10 h-10 rounded-xl bg-primary-container text-on-primary flex items-center justify-center font-bold font-title-md">
                  HE
                </div>
                <div className="flex flex-col">
                  <span className="font-title-md text-title-md text-on-surface font-bold">HDFC ERGO General</span>
                  <span className="font-body-sm text-body-sm text-on-surface-variant">Comprehensive Motor Package</span>
                </div>
              </div>
              <span className="bg-amber-100 text-amber-900 font-label-numeric text-label-sm px-2.5 py-1 rounded-full font-bold">
                18 Days Left
              </span>
            </div>

            {/* Policy Key Reference Box */}
            <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-2">
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-on-surface-variant">Policy Certificate No.</span>
                <span className="font-label-numeric font-bold text-on-surface">#HD-MOT-99214-B</span>
              </div>
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-on-surface-variant">Coverage Tenure</span>
                <span className="font-label-numeric text-on-surface">29 Nov 2023 → 28 Nov 2024</span>
              </div>
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-on-surface-variant">Previous Year Premium Paid</span>
                <span className="font-label-numeric font-bold text-on-surface">₹24,850 (incl. GST)</span>
              </div>
              <div className="flex items-center justify-between text-body-sm">
                <span className="text-on-surface-variant">Claims Recorded (Last 3 Yrs)</span>
                <span className="font-label-numeric text-secondary font-bold">0 Claims (Eligible for Max NCB)</span>
              </div>
            </div>

            {/* Existing Inclusions Overview */}
            <div className="flex flex-col gap-1.5">
              <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface-variant">
                Existing Endorsements:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <span className="bg-surface-container text-on-surface text-[12px] px-2 py-1 rounded-md font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-secondary text-[14px]">check</span> Zero Depreciation
                </span>
                <span className="bg-surface-container text-on-surface text-[12px] px-2 py-1 rounded-md font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-secondary text-[14px]">check</span> 24x7 Roadside Assist
                </span>
                <span className="bg-surface-container text-on-surface text-[12px] px-2 py-1 rounded-md font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-secondary text-[14px]">check</span> Key Replacement
                </span>
                <span className="bg-surface-container text-on-surface text-[12px] px-2 py-1 rounded-md font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-secondary text-[14px]">check</span> PA Cover ₹15 Lakhs
                </span>
              </div>
            </div>
          </div>

          {/* Quick Renewal Direct CTA */}
          <div className="pt-space-md flex flex-col gap-2">
            <button
              className="w-full py-3 bg-secondary text-on-secondary rounded-lg font-title-md text-body-lg hover:bg-secondary/90 transition flex items-center justify-center gap-2 shadow-sm"
              onClick={onQuickRenew}
              type="button"
            >
              <span className="material-symbols-outlined text-[20px]">bolt</span>
              <span>Quick Renew Current Plan (₹21,140)</span>
            </button>
            <div className="text-center font-label-sm text-label-sm text-on-surface-variant">
              Instant renewal avoids inspection • Retains continuous cover
            </div>
          </div>
        </div>
      </div>

      {/* 4 Key Institutional Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-space-md">
        {/* Metric 1: Cashless Garages */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-bold">Network Reach</span>
            <span className="material-symbols-outlined text-primary text-[22px]">car_repair</span>
          </div>
          <div className="my-space-sm">
            <div className="font-label-numeric text-headline-md font-bold text-on-surface">8,400+</div>
            <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Cashless Garages Across India</div>
          </div>
          <div className="bg-surface-container-low px-2 py-1 rounded font-body-sm text-body-sm text-secondary font-semibold flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">near_me</span>
            <span>68 authorized centers in Kolkata</span>
          </div>
        </div>

        {/* Metric 2: Claim Settlement Ratio */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-bold">Settlement Efficacy</span>
            <span className="material-symbols-outlined text-secondary text-[22px]">verified</span>
          </div>
          <div className="my-space-sm">
            <div className="font-label-numeric text-headline-md font-bold text-on-surface">98.4%</div>
            <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Claim Settlement Ratio (FY23-24)</div>
          </div>
          <div className="bg-surface-container-low px-2 py-1 rounded font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px]">account_balance</span>
            <span>Verified via IRDAI Annual Report</span>
          </div>
        </div>

        {/* Metric 3: IDV Adjustable Parameter */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-bold">Vehicle Value (IDV)</span>
            <span className="material-symbols-outlined text-primary text-[22px]">tune</span>
          </div>
          <div className="my-space-sm">
            <div className="flex items-baseline gap-2">
              <span className="font-label-numeric text-headline-md font-bold text-on-surface">₹11,40,000</span>
              <span className="text-body-sm text-secondary font-bold font-label-numeric">(Max Rec.)</span>
            </div>
            <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">Insured Declared Total Value</div>
          </div>
          <div className="flex items-center justify-between text-body-sm text-on-surface-variant">
            <span>Range: ₹9.8L - ₹11.4L</span>
            <button className="text-primary font-bold hover:underline" onClick={onCompare}>
              Adjust →
            </button>
          </div>
        </div>

        {/* Metric 4: NCB Discount */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-bold">Accrued Discount</span>
            <span className="material-symbols-outlined text-secondary text-[22px]">percent</span>
          </div>
          <div className="my-space-sm">
            <div className="font-label-numeric text-headline-md font-bold text-secondary">35% NCB</div>
            <div className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">No-Claim Bonus Benefit</div>
          </div>
          <div className="bg-surface-container-low px-2 py-1 rounded font-body-sm text-body-sm text-on-surface font-medium flex items-center gap-1">
            <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
            <span>Saves ₹7,240 on OD Premium</span>
          </div>
        </div>
      </div>

      {/* Multifaceted Action Toolbar */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-wrap items-center justify-between gap-space-sm">
        <div className="flex items-center gap-space-xs flex-wrap">
          <button
            className="px-space-md py-2.5 rounded-lg bg-primary text-on-primary font-title-md text-body-sm hover:bg-slate-800 transition flex items-center gap-1.5 shadow-sm"
            onClick={onCompare}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">compare_arrows</span>
            <span>Compare Renewal Options (3 Quotes)</span>
          </button>
          <button
            className="px-space-md py-2.5 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container font-title-md text-body-sm transition flex items-center gap-1.5"
            onClick={() => setShowDropzone(!showDropzone)}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">upload_file</span>
            <span>Upload Policy Document (PDF/JPG)</span>
          </button>
          <button
            className="px-space-md py-2.5 rounded-lg bg-surface-container-low text-on-surface hover:bg-surface-container font-title-md text-body-sm transition flex items-center gap-1.5"
            onClick={onSaveGarage}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">garage</span>
            <span>{isSavedInGarage ? "✓ Saved in My Garage" : "Save in My Garage"}</span>
          </button>
        </div>
        <div className="flex items-center gap-space-xs">
          <button
            className="px-space-md py-2.5 rounded-lg bg-surface-container-high text-primary hover:bg-surface-container-highest font-title-md text-body-sm transition flex items-center gap-1.5"
            onClick={onOpenAdvisorModal}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">support_agent</span>
            <span>Talk to Kolkata RTO Advisor</span>
          </button>
        </div>
      </div>

      {/* Collapsible Drawer 1: Inline Vehicle Detail Correction Form */}
      {showCorrection && (
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md border-t-4 border-primary flex flex-col gap-space-md animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[24px]">construction</span>
              <h3 className="font-title-md text-title-md text-on-surface font-bold">
                Manual Vehicle Metadata Correction
              </h3>
            </div>
            <button
              className="text-on-surface-variant hover:text-on-surface"
              onClick={() => setShowCorrection(false)}
              type="button"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            If any technical specifications retrieved from Parivahan differ from your Physical RC Book, enter corrected parameters below:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-md">
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm font-semibold text-on-surface">
                Engine Number (Last 5 digits)
              </label>
              <input
                className="h-10 px-3 bg-surface-container-low rounded-lg font-label-numeric text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
                type="text"
                value={engineNo}
                onChange={(e) => setEngineNo(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm font-semibold text-on-surface">
                Fuel Variant Correction
              </label>
              <select
                className="h-10 px-3 bg-surface-container-low rounded-lg font-body-sm text-on-surface focus:outline-none focus:ring-2 focus:ring-primary"
                value={fuelVariant}
                onChange={(e) => setFuelVariant(e.target.value)}
              >
                <option>1.5L Turbo GDi Petrol</option>
                <option>1.5L CRDi Diesel</option>
                <option>1.5L MPi Petrol</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-label-sm text-label-sm font-semibold text-on-surface">
                Current Odometer (km)
              </label>
              <input
                className="h-10 px-3 bg-surface-container-low rounded-lg font-label-numeric text-body-sm focus:outline-none focus:ring-2 focus:ring-primary"
                type="text"
                value={odometer}
                onChange={(e) => setOdometer(e.target.value)}
              />
            </div>
          </div>
          <div className="flex justify-end gap-space-sm pt-space-xs">
            <button
              className="px-space-md py-2 rounded-lg bg-surface-container-low text-on-surface font-body-sm"
              onClick={() => setShowCorrection(false)}
              type="button"
            >
              Cancel
            </button>
            <button
              className="px-space-lg py-2 rounded-lg bg-primary text-on-primary font-body-sm font-semibold"
              onClick={handleSaveCorrection}
              type="button"
            >
              Save Corrections
            </button>
          </div>
        </div>
      )}

      {/* Collapsible Drawer 2: Document Dropzone for Previous Policy Papers */}
      {showDropzone && (
        <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-md border-t-4 border-secondary flex flex-col gap-space-md animate-in fade-in duration-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary text-[24px]">cloud_upload</span>
              <h3 className="font-title-md text-title-md text-on-surface font-bold">
                Upload Previous Policy or RC Card
              </h3>
            </div>
            <button
              className="text-on-surface-variant hover:text-on-surface"
              onClick={() => setShowDropzone(false)}
              type="button"
            >
              <span className="material-symbols-outlined">close</span>
            </button>
          </div>
          <label className="w-full border-2 border-dashed border-outline-variant hover:border-secondary p-space-lg rounded-xl flex flex-col items-center justify-center text-center cursor-pointer bg-surface-container-low/50 transition">
            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileUpload}
              className="hidden"
            />
            <span className="material-symbols-outlined text-[44px] text-secondary mb-2">upload_file</span>
            <span className="font-title-md text-body-md font-semibold text-on-surface">
              Drag &amp; drop your previous policy schedule or Registration Certificate
            </span>
            <span className="font-body-sm text-body-sm text-on-surface-variant mt-1">
              Supported formats: PDF, JPG, PNG • Max size: 12MB
            </span>
            <span className="mt-space-md px-space-md py-2 rounded-lg bg-primary text-on-primary font-body-sm font-semibold">
              Browse Files
            </span>
          </label>
          <div className="flex items-center justify-between text-body-sm text-on-surface-variant">
            <div className="flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[18px] text-secondary">document_scanner</span>
              <span>Automated AI Extraction reads Policy #, IDV, and Claims history in 4 seconds</span>
            </div>
            <span className="font-label-sm uppercase text-secondary font-bold">100% Optical OCR Accuracy</span>
          </div>
        </div>
      )}

      {/* Educational Explainer Accordion/Deck */}
      <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[24px]">school</span>
            <div>
              <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Institutional Advisory: Understanding Your Renewal Parameters
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Statutory rules governing claim settlements and maximum legal savings under IRDAI guidelines
              </p>
            </div>
          </div>
          <span className="text-on-surface-variant font-label-sm text-label-sm uppercase font-semibold">
            Regulatory Knowledge Base
          </span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-space-md pt-space-xs">
          <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-2">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <span className="material-symbols-outlined text-[20px]">calculate</span>
              <span className="font-title-md text-title-md">1. IDV Calculation</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Insured Declared Value is the maximum sum insured payable in total vehicle loss or theft. It equals manufacturer listing price minus age-based depreciation (max 40% for 3+ years old).
            </p>
          </div>
          <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-2">
            <div className="flex items-center gap-2 text-secondary font-semibold">
              <span className="material-symbols-outlined text-[20px]">security</span>
              <span className="font-title-md text-title-md">2. Zero Depreciation</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Eliminates out-of-pocket expenses for replaced metal, nylon, and rubber components. Essential for vehicles under 5 years old; guarantees up to 98% reimbursement on accidental repairs.
            </p>
          </div>
          <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-2">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <span className="material-symbols-outlined text-[20px]">swap_horiz</span>
              <span className="font-title-md text-title-md">3. NCB Portability</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              No Claim Bonus belongs to the policyholder, not the car or previous insurer. You can transfer your 35% bonus across insurers seamlessly without losing accrued credits.
            </p>
          </div>
          <div className="p-space-md rounded-xl bg-surface-container-low flex flex-col gap-2">
            <div className="flex items-center gap-2 text-primary font-semibold">
              <span className="material-symbols-outlined text-[20px]">policy</span>
              <span className="font-title-md text-title-md">4. Comprehensive vs TP</span>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
              Third Party (TP) is legally required under Motor Vehicles Act, covering third-party bodily injury. Comprehensive adds Own Damage (OD) safeguarding your ₹11.4L Creta against theft, fire &amp; crashes.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// STEP 3: COMPARE RENEWAL OPTIONS & ADD-ONS
// =========================================================================
export function Step3QuotesComparison({
  vehicle,
  onSelectPlan,
  onBackToDashboard,
}) {
  const [idv, setIdv] = useState(1140000);
  const [sortBy, setSortBy] = useState("recommended");
  const [addons, setAddons] = useState({
    zd: true,
    rsa: true,
    eng: true,
    rti: false,
    cons: false,
    tyre: false,
  });

  const toggleAddon = (key) => {
    setAddons((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const appliedCount = Object.values(addons).filter(Boolean).length;

  // Addon price adjustments
  const addonCost =
    (addons.zd ? 4120 : 0) +
    (addons.rsa ? 499 : 0) +
    (addons.eng ? 1850 : 0) +
    (addons.rti ? 2400 : 0) +
    (addons.cons ? 850 : 0) +
    (addons.tyre ? 1200 : 0);

  // IDV bump delta
  const idvDelta = Math.round((idv - 1140000) * 0.012);

  // Base quotes
  const quotes = [
    {
      id: "hdfc",
      insurer: "HDFC ERGO",
      planName: "Current Insurer (Instant)",
      abbr: "HE",
      csr: "98.4%",
      basePrem: 14671,
      origPrem: 24850,
      idvOffered: inr(idv),
      garages: "68 Garages",
      badge: "Current Insurer",
      isBest: false,
      color: "bg-surface-container-high text-primary",
      features: [
        { text: "Zero Depreciation Included", ok: addons.zd },
        { text: "24x7 Roadside Assistance", ok: addons.rsa },
        { text: "Engine & Gearbox Cover", ok: addons.eng },
        { text: "No Inspection Required", ok: false },
      ],
    },
    {
      id: "icici",
      insurer: "ICICI Lombard",
      planName: "Comprehensive Shield",
      abbr: "IC",
      csr: "98.9%",
      basePrem: 14211,
      origPrem: 25200,
      idvOffered: inr(idv),
      garages: "74 Garages",
      badge: "Best Value • Highest Garages",
      isBest: true,
      color: "bg-primary text-on-primary",
      features: [
        { text: "Zero Depreciation Included", ok: addons.zd },
        { text: "24x7 Roadside Assistance", ok: addons.rsa },
        { text: "Engine & Gearbox Cover", ok: addons.eng },
        { text: "Free Consumables Cover Included", ok: true, highlight: true },
      ],
    },
    {
      id: "bajaj",
      insurer: "Bajaj Allianz",
      planName: "DriveSmart Motor Plan",
      abbr: "BA",
      csr: "97.8%",
      basePrem: 13421,
      origPrem: 23900,
      idvOffered: inr(Math.round(idv * 0.956)),
      garages: "59 Garages",
      badge: "Economy Tier",
      isBest: false,
      color: "bg-surface-container-high text-primary",
      features: [
        { text: "Zero Depreciation Included", ok: addons.zd },
        { text: "24x7 Roadside Assistance", ok: addons.rsa },
        { text: "Engine Cover Not Included", ok: false },
        { text: "Instant Self-Inspection (App)", ok: true },
      ],
    },
  ];

  const sortedQuotes = [...quotes].sort((a, b) => {
    if (sortBy === "lowest") return a.basePrem - b.basePrem;
    if (sortBy === "csr") return parseFloat(b.csr) - parseFloat(a.csr);
    return 0; // recommended order
  });

  return (
    <div className="flex flex-col gap-space-lg w-full transition-opacity duration-300">
      {/* Top Policy Parameter Filter Bar */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col md:flex-row items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md flex-wrap">
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-bold">
              Insured Declared Value (IDV)
            </span>
            <div className="flex items-center gap-2 mt-1">
              <input
                className="w-36 accent-primary"
                id="idv-range-slider"
                max="1140000"
                min="980000"
                step="10000"
                type="range"
                value={idv}
                onChange={(e) => setIdv(Number(e.target.value))}
              />
              <span className="font-label-numeric text-title-md font-bold text-on-surface">
                {inr(idv)}
              </span>
            </div>
          </div>
          <div className="h-8 w-px bg-surface-container-high hidden md:block"></div>
          <div className="flex flex-col">
            <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-bold">
              Accrued NCB Bonus
            </span>
            <div className="flex items-center gap-1 text-secondary font-bold font-label-numeric mt-1">
              <span className="material-symbols-outlined text-[18px]">verified</span>
              <span>35% No Claim Bonus</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-surface-container-low px-space-md py-2 rounded-xl">
          <span className="material-symbols-outlined text-primary text-[20px]">sort</span>
          <span className="font-body-sm text-body-sm text-on-surface-variant">Sort By:</span>
          <select
            className="bg-transparent font-title-md text-body-sm text-on-surface font-semibold focus:outline-none"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
          >
            <option value="recommended">Value For Money (Recommended)</option>
            <option value="lowest">Lowest Premium First</option>
            <option value="csr">Highest Settlement Ratio</option>
          </select>
        </div>
      </div>

      {/* Add-on Customizer Pills Rail */}
      <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col gap-space-xs">
        <div className="flex items-center justify-between">
          <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface-variant">
            Customize Add-on Protection Bundles
          </span>
          <span className="font-body-sm text-body-sm text-primary font-bold">
            {appliedCount} of 6 Add-ons Applied
          </span>
        </div>
        <div className="flex flex-wrap gap-2 pt-1">
          <button
            className={`px-3 py-1.5 rounded-lg font-body-sm font-semibold flex items-center gap-1.5 shadow-sm transition ${
              addons.zd ? "bg-primary-container text-on-primary" : "bg-surface-container-low text-on-surface hover:bg-surface-container"
            }`}
            onClick={() => toggleAddon("zd")}
            type="button"
          >
            <span className={`material-symbols-outlined text-[16px] ${addons.zd ? "text-secondary-fixed" : "text-on-surface-variant"}`}>
              {addons.zd ? "check_circle" : "add"}
            </span>
            <span>Zero Depreciation</span>
            <span className="font-label-numeric text-xs opacity-75">+₹4,120</span>
          </button>

          <button
            className={`px-3 py-1.5 rounded-lg font-body-sm font-semibold flex items-center gap-1.5 shadow-sm transition ${
              addons.rsa ? "bg-primary-container text-on-primary" : "bg-surface-container-low text-on-surface hover:bg-surface-container"
            }`}
            onClick={() => toggleAddon("rsa")}
            type="button"
          >
            <span className={`material-symbols-outlined text-[16px] ${addons.rsa ? "text-secondary-fixed" : "text-on-surface-variant"}`}>
              {addons.rsa ? "check_circle" : "add"}
            </span>
            <span>24x7 Roadside Assistance</span>
            <span className="font-label-numeric text-xs opacity-75">+₹499</span>
          </button>

          <button
            className={`px-3 py-1.5 rounded-lg font-body-sm font-semibold flex items-center gap-1.5 shadow-sm transition ${
              addons.eng ? "bg-primary-container text-on-primary" : "bg-surface-container-low text-on-surface hover:bg-surface-container"
            }`}
            onClick={() => toggleAddon("eng")}
            type="button"
          >
            <span className={`material-symbols-outlined text-[16px] ${addons.eng ? "text-secondary-fixed" : "text-on-surface-variant"}`}>
              {addons.eng ? "check_circle" : "add"}
            </span>
            <span>Engine &amp; Gearbox Protect</span>
            <span className="font-label-numeric text-xs opacity-75">+₹1,850</span>
          </button>

          <button
            className={`px-3 py-1.5 rounded-lg font-body-sm font-medium flex items-center gap-1.5 transition ${
              addons.rti ? "bg-primary-container text-on-primary font-semibold" : "bg-surface-container-low text-on-surface hover:bg-surface-container"
            }`}
            onClick={() => toggleAddon("rti")}
            type="button"
          >
            <span className={`material-symbols-outlined text-[16px] ${addons.rti ? "text-secondary-fixed" : "text-on-surface-variant"}`}>
              {addons.rti ? "check_circle" : "add"}
            </span>
            <span>Return to Invoice (RTI)</span>
            <span className="font-label-numeric text-xs text-on-surface-variant">+₹2,400</span>
          </button>

          <button
            className={`px-3 py-1.5 rounded-lg font-body-sm font-medium flex items-center gap-1.5 transition ${
              addons.cons ? "bg-primary-container text-on-primary font-semibold" : "bg-surface-container-low text-on-surface hover:bg-surface-container"
            }`}
            onClick={() => toggleAddon("cons")}
            type="button"
          >
            <span className={`material-symbols-outlined text-[16px] ${addons.cons ? "text-secondary-fixed" : "text-on-surface-variant"}`}>
              {addons.cons ? "check_circle" : "add"}
            </span>
            <span>Consumables Cover</span>
            <span className="font-label-numeric text-xs text-on-surface-variant">+₹850</span>
          </button>

          <button
            className={`px-3 py-1.5 rounded-lg font-body-sm font-medium flex items-center gap-1.5 transition ${
              addons.tyre ? "bg-primary-container text-on-primary font-semibold" : "bg-surface-container-low text-on-surface hover:bg-surface-container"
            }`}
            onClick={() => toggleAddon("tyre")}
            type="button"
          >
            <span className={`material-symbols-outlined text-[16px] ${addons.tyre ? "text-secondary-fixed" : "text-on-surface-variant"}`}>
              {addons.tyre ? "check_circle" : "add"}
            </span>
            <span>Tyre &amp; Rim Shield</span>
            <span className="font-label-numeric text-xs text-on-surface-variant">+₹1,200</span>
          </button>
        </div>
      </div>

      {/* 3-Way Policy Quote Comparison Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-space-lg items-stretch">
        {sortedQuotes.map((q) => {
          const calculatedPrem = Math.max(9999, q.basePrem + addonCost + idvDelta);
          const gst = Math.round(calculatedPrem * 0.18);

          return (
            <div
              key={q.id}
              className={`rounded-xl p-space-lg flex flex-col justify-between relative overflow-hidden transition-all duration-200 ${
                q.isBest
                  ? "bg-surface-container-lowest shadow-md border-2 border-primary/20 bg-gradient-to-b from-surface-container-low/60 to-surface-container-lowest"
                  : "bg-surface-container-lowest shadow-sm border border-outline-variant/30"
              }`}
            >
              {q.isBest && (
                <div className="absolute top-0 right-0 bg-primary text-on-primary font-label-sm text-[10px] tracking-wider px-3 py-1 rounded-bl-lg font-bold uppercase">
                  Best Value • Highest Garages
                </div>
              )}

              <div className={`flex flex-col gap-space-md ${q.isBest ? "pt-2" : ""}`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold font-title-md ${q.color}`}>
                      {q.abbr}
                    </div>
                    <div>
                      <h3 className="font-title-md text-title-md text-on-surface font-bold">{q.insurer}</h3>
                      <span className="font-body-sm text-body-sm text-on-surface-variant">{q.planName}</span>
                    </div>
                  </div>
                  <span className="bg-secondary/10 text-secondary font-label-numeric text-label-sm font-bold px-2 py-0.5 rounded">
                    {q.csr} Settlement
                  </span>
                </div>

                {/* Price Container */}
                <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col gap-1">
                  <span className="font-label-sm text-label-sm uppercase text-on-surface-variant font-bold">
                    Annual Comprehensive Renewal
                  </span>
                  <div className="flex items-baseline gap-2">
                    <span className="font-label-numeric text-headline-lg font-bold text-on-surface">
                      {inr(calculatedPrem)}
                    </span>
                    <span className="text-body-sm text-on-surface-variant line-through font-label-numeric">
                      {inr(q.origPrem)}
                    </span>
                  </div>
                  {q.isBest ? (
                    <span className="text-[12px] font-body-sm text-secondary font-semibold">
                      Save ₹460 vs current policy • +18% GST (₹{inr(gst).replace("₹", "")})
                    </span>
                  ) : (
                    <span className="text-[12px] font-body-sm text-on-surface-variant">
                      +18% statutory GST (₹{inr(gst).replace("₹", "")}) calculated at checkout
                    </span>
                  )}
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 text-body-sm">
                  <div className="p-2 rounded bg-surface-container-low flex flex-col">
                    <span className="text-on-surface-variant text-[11px]">IDV Offered</span>
                    <span className="font-label-numeric font-bold text-on-surface">{q.idvOffered}</span>
                  </div>
                  <div className="p-2 rounded bg-surface-container-low flex flex-col">
                    <span className="text-on-surface-variant text-[11px]">Kolkata Garages</span>
                    <span className={`font-label-numeric font-bold ${q.isBest ? "text-secondary" : "text-on-surface"}`}>
                      {q.garages}
                    </span>
                  </div>
                </div>

                {/* Add-on Inclusion List */}
                <div className="flex flex-col gap-2 pt-1 font-body-sm text-body-sm">
                  {q.features.map((f, i) => (
                    <div
                      key={i}
                      className={`flex items-center gap-2 ${
                        f.highlight
                          ? "text-secondary font-semibold"
                          : f.ok
                          ? "text-on-surface font-medium"
                          : "text-on-surface-variant"
                      }`}
                    >
                      <span
                        className={`material-symbols-outlined text-[18px] ${
                          f.ok ? "text-secondary" : "text-outline-variant"
                        }`}
                      >
                        {f.ok ? (f.highlight ? "verified" : "check_circle") : "cancel"}
                      </span>
                      <span>{f.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-space-lg">
                <button
                  className={`w-full py-3 rounded-lg font-title-md text-body-md transition flex items-center justify-center gap-2 ${
                    q.isBest
                      ? "bg-secondary text-on-secondary hover:bg-secondary/90 shadow-sm"
                      : "bg-primary text-on-primary hover:bg-slate-800"
                  }`}
                  onClick={() =>
                    onSelectPlan({
                      ...q,
                      calculatedPrem,
                      gst,
                      total: calculatedPrem + gst,
                    })
                  }
                  type="button"
                >
                  <span>Select {q.insurer}</span>
                  <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// =========================================================================
// ADVISOR CALLBACK MODAL (PRIORITY HELP)
// =========================================================================
export function AdvisorCallbackModal({
  isOpen,
  onClose,
  onSubmit,
  mobile,
  vehicle,
}) {
  const [phone, setPhone] = useState(mobile ? `+91 ${mobile}` : "+91 98301 44829");
  const [slot, setSlot] = useState("Instant (Within 120 seconds)");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-primary/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-surface-container-lowest max-w-md w-full rounded-2xl p-space-lg shadow-2xl flex flex-col gap-space-md animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full bg-surface-container-high flex items-center justify-center text-primary">
              <span className="material-symbols-outlined text-[24px]">support_agent</span>
            </div>
            <div>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-semibold">
                Priority Callback Request
              </h3>
              <span className="font-body-sm text-body-sm text-on-surface-variant">
                Kolkata RTO Dedicated Helpdesk
              </span>
            </div>
          </div>
          <button className="text-on-surface-variant hover:text-on-surface" onClick={onClose} type="button">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <p className="font-body-sm text-body-sm text-on-surface-variant">
          Have specific queries regarding No Claim Bonus transfer or Zero Dep claim settlement on your {vehicle || "vehicle"}? Speak directly to our IRDAI certified specialist.
        </p>

        <div className="flex flex-col gap-space-sm">
          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-on-surface font-semibold">
              Your Mobile Number
            </label>
            <input
              className="h-10 px-3 bg-surface-container-low rounded-lg font-label-numeric text-body-sm text-on-surface"
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-label-sm text-label-sm text-on-surface font-semibold">
              Preferred Callback Slot
            </label>
            <select
              className="h-10 px-3 bg-surface-container-low rounded-lg font-body-sm text-on-surface"
              value={slot}
              onChange={(e) => setSlot(e.target.value)}
            >
              <option>Instant (Within 120 seconds)</option>
              <option>Today: 02:00 PM - 04:00 PM</option>
              <option>Today: 06:00 PM - 08:00 PM</option>
              <option>Tomorrow Morning (10:00 AM)</option>
            </select>
          </div>
        </div>

        <div className="pt-space-xs flex items-center justify-end gap-2">
          <button
            className="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-body-sm"
            onClick={onClose}
            type="button"
          >
            Cancel
          </button>
          <button
            className="px-5 py-2 rounded-lg bg-secondary text-on-secondary font-title-md text-body-sm font-semibold flex items-center gap-1.5"
            onClick={() => onSubmit({ phone, slot })}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">call</span>
            <span>Request Free Callback</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// STEP 5: CONFIRMATION, TIMELINE & REMINDERS (DONE VIEW)
// =========================================================================
export function Step5Confirmation({
  leadId,
  vehicle,
  plan,
  onReset,
  onOpenGarage,
}) {
  return (
    <div className="flex flex-col gap-space-lg w-full max-w-4xl mx-auto py-space-md animate-in fade-in duration-300">
      <div className="bg-surface-container-lowest rounded-2xl p-space-xl shadow-sm border border-outline-variant/30 flex flex-col gap-space-lg text-center items-center">
        <div className="w-16 h-16 rounded-full bg-secondary-container text-on-secondary-container flex items-center justify-center">
          <span className="material-symbols-outlined text-[36px]">check_circle</span>
        </div>

        <div className="flex flex-col gap-1 items-center">
          <span className="bg-secondary/10 text-secondary font-label-numeric text-label-sm px-3 py-1 rounded-full font-bold">
            STATUTORY BOOKING REF: {leadId || "LD-1043"}
          </span>
          <h1 className="font-headline-lg text-headline-lg text-on-surface font-bold mt-2">
            Renewal Consultation &amp; Plan Locked!
          </h1>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-lg">
            Your quotation request for <strong>{formatPlate(vehicle)}</strong> with <strong>{plan?.insurer || "HDFC ERGO"}</strong> has been securely logged with our Kolkata Central RTO desk.
          </p>
        </div>

        {/* Timeline Sequence */}
        <div className="w-full bg-surface-container-low p-space-lg rounded-xl text-left flex flex-col gap-space-md">
          <h3 className="font-title-md text-title-md text-on-surface font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-primary text-[20px]">schedule</span>
            <span>Statutory Non-Lapse Timeline</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-space-md">
            <div className="flex flex-col gap-1 border-l-2 border-secondary pl-3">
              <span className="font-label-numeric text-xs font-bold text-secondary">T+0 MINS (NOW)</span>
              <span className="font-body-sm font-semibold text-on-surface">Data Verification</span>
              <span className="font-body-sm text-xs text-on-surface-variant">Underwriting parameters validated with MoRTH</span>
            </div>
            <div className="flex flex-col gap-1 border-l-2 border-primary pl-3">
              <span className="font-label-numeric text-xs font-bold text-primary">T+120 SECONDS</span>
              <span className="font-body-sm font-semibold text-on-surface">Kolkata RTO Connect</span>
              <span className="font-body-sm text-xs text-on-surface-variant">Priority call from Bengali/English specialist</span>
            </div>
            <div className="flex flex-col gap-1 border-l-2 border-outline-variant pl-3">
              <span className="font-label-numeric text-xs font-bold text-on-surface-variant">T+24 HOURS</span>
              <span className="font-body-sm font-semibold text-on-surface">Policy Issue</span>
              <span className="font-body-sm text-xs text-on-surface-variant">Signed e-Policy dispatched to WhatsApp</span>
            </div>
            <div className="flex flex-col gap-1 border-l-2 border-outline-variant pl-3">
              <span className="font-label-numeric text-xs font-bold text-on-surface-variant">28 NOV 2024</span>
              <span className="font-body-sm font-semibold text-on-surface">Continuous Cover</span>
              <span className="font-body-sm text-xs text-on-surface-variant">Zero gap in coverage; 35% NCB protected</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-space-md pt-space-xs">
          <button
            className="px-space-lg py-3 rounded-lg bg-primary text-on-primary font-title-md text-body-md hover:bg-slate-800 transition flex items-center gap-2"
            onClick={onOpenGarage}
            type="button"
          >
            <span className="material-symbols-outlined text-[20px]">garage</span>
            <span>View in My Garage</span>
          </button>
          <button
            className="px-space-lg py-3 rounded-lg bg-surface-container text-on-surface font-title-md text-body-md hover:bg-surface-container-high transition"
            onClick={onReset}
            type="button"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
