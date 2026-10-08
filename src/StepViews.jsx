import React, { useState } from "react";
import { formatPlate, inr } from "./data.js";

// =========================================================================
// STEP 2: POLICY HEALTH & UNDERWRITING METRICS (HTML 2)
// =========================================================================
export function Step2PolicyHealthView({
  vehicle,
  onCompareQuotes,
  onQuickRenew,
  onOpenAdvisorModal,
  onOpenConsent,
}) {
  const [ocrModalOpen, setOcrModalOpen] = useState(false);
  const [callbackDrawerOpen, setCallbackDrawerOpen] = useState(false);
  const [accordionOpen, setAccordionOpen] = useState({ idv: true, zeroDep: false, sec146: false });
  const [callbackSlot, setCallbackSlot] = useState("Immediate Priority (Within 15 mins)");
  const [callbackSent, setCallbackSent] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 3500);
  };

  const toggleAccordion = (key) => {
    setAccordionOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleOcrExtract = () => {
    setOcrModalOpen(false);
    showToast("AI OCR successfully parsed previous policy: 35% NCB verified, zero prior claim flags.");
  };

  const handleCallbackDispatch = () => {
    setCallbackSent(true);
    setTimeout(() => {
      setCallbackDrawerOpen(false);
      setCallbackSent(false);
      showToast(`Callback confirmed for ${callbackSlot}. Advisor assigned: Debasis Sengupta.`);
      if (onOpenAdvisorModal) onOpenAdvisorModal();
    }, 1000);
  };

  return (
    <div className="flex flex-col w-full space-y-space-xl transition-opacity duration-300">
      {toastMsg && (
        <div className="fixed top-20 right-6 z-50 bg-primary text-on-primary px-4 py-3 rounded-xl flex items-center justify-between shadow-xl max-w-md">
          <div className="flex items-center gap-2 font-body-sm">
            <span className="material-symbols-outlined text-secondary-fixed text-[20px]">check_circle</span>
            <span>{toastMsg}</span>
          </div>
          <button type="button" onClick={() => setToastMsg("")} className="text-white/80 hover:text-white ml-2">
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>
      )}

      {/* Vehicle Health Hero & Status Ribbon */}
      <div className="px-space-lg py-space-md bg-surface-container-low rounded-2xl shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-start lg:items-center justify-between gap-space-md">
          {/* Vehicle Identification Capsule */}
          <div className="flex flex-wrap items-center gap-space-md">
            {/* HSRP Plate Element */}
            <div className="flex items-center bg-surface-container-lowest px-3 py-1.5 rounded-lg shadow-sm border border-outline-variant/30">
              <div className="bg-primary text-on-primary px-1.5 py-0.5 rounded-sm font-label-plate text-[11px] tracking-widest mr-2 flex items-center gap-1">
                <span>IND</span>
                <div className="w-1.5 h-1.5 rounded-full bg-secondary-fixed"></div>
              </div>
              <span className="font-label-plate text-headline-sm text-on-surface tracking-wider uppercase font-bold">
                {formatPlate(vehicle) || "WB 02 AB 1234"}
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Hyundai Creta 1.5 SX Turbo Petrol
                </span>
                <span className="bg-surface-container-high px-2 py-0.5 rounded text-on-surface-variant font-label-sm text-label-sm uppercase font-semibold">
                  2021 Model
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-secondary">location_on</span>
                  RTO: Kolkata Central (WB-02)
                </span>
                <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                <span className="flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px] text-secondary">corporate_fare</span>
                  Underwriter: Bajaj Allianz Gen. Ins.
                </span>
                <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                <span className="font-label-numeric text-body-sm text-on-surface font-semibold">
                  Policy: #OG-24-1904-1801-0004921
                </span>
              </div>
            </div>
          </div>

          {/* Expiry Urgency Gauge & Live Counter */}
          <div className="flex items-center gap-space-md w-full lg:w-auto justify-between lg:justify-end bg-surface-container-lowest px-space-md py-space-sm rounded-xl shadow-sm">
            <div className="flex items-center gap-3">
              <div className="relative w-11 h-11 flex items-center justify-center">
                <svg className="w-11 h-11 transform -rotate-90" viewBox="0 0 36 36">
                  <path
                    className="text-surface-container-high"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                  ></path>
                  <path
                    className="text-error"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    stroke="currentColor"
                    strokeDasharray="75, 100"
                    strokeLinecap="round"
                    strokeWidth="3"
                  ></path>
                </svg>
                <span className="absolute font-label-numeric text-[12px] font-bold text-error">18d</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-error font-bold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-error animate-ping"></span>
                  Expiring Soon
                </span>
                <span className="font-body-sm text-body-sm text-on-surface-variant font-medium">
                  Lapses 28 Nov 2024 (23:59 IST)
                </span>
              </div>
            </div>
            <div className="hidden sm:flex flex-col items-end pl-space-md">
              <span className="font-label-sm text-label-sm text-on-surface-variant">Grace Buffer</span>
              <span className="font-label-numeric text-body-sm font-semibold text-secondary">
                0 Days Post-Expiry
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 4-Column Key Underwriting Metrics Grid */}
      <section>
        <div className="flex items-center justify-between mb-space-md">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
              Actuarial Assessment
            </span>
            <h2 className="font-headline-md text-headline-md text-on-surface font-bold">
              Underwriting Health &amp; Active Portfolio
            </h2>
          </div>
          <div className="flex items-center gap-1 bg-surface-container-high px-space-sm py-1 rounded-lg">
            <span className="material-symbols-outlined text-secondary text-[16px]">verified</span>
            <span className="font-label-sm text-label-sm text-on-surface-variant">VAHAN-II Synced 14m ago</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
          {/* Metric 1: Cashless Garages */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary-container">
                <span className="material-symbols-outlined text-[22px]">car_repair</span>
              </div>
              <span className="bg-secondary-container/40 text-on-secondary-container font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold">
                +120 This Month
              </span>
            </div>
            <div className="mt-space-md">
              <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                Cashless Workshop Network
              </div>
              <div className="font-label-numeric text-headline-lg text-on-surface font-bold tracking-tight mt-0.5">
                8,400<span className="text-secondary">+</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Authorized OEM partner locations across all Indian states &amp; UTs.
              </p>
            </div>
            <div className="mt-space-sm pt-space-xs flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
              <span>
                In Kolkata Region: <strong>38 Centers</strong>
              </span>
              <span className="material-symbols-outlined text-[16px] text-secondary">arrow_forward</span>
            </div>
          </div>

          {/* Metric 2: Claim Settlement Ratio */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-lg bg-secondary-container/30 flex items-center justify-center text-secondary">
                <span className="material-symbols-outlined text-[22px]">verified_user</span>
              </div>
              <span className="bg-surface-container text-on-surface-variant font-label-sm text-label-sm px-2 py-0.5 rounded-full font-semibold">
                IRDAI Certified
              </span>
            </div>
            <div className="mt-space-md">
              <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                Claim Settlement Ratio
              </div>
              <div className="font-label-numeric text-headline-lg text-secondary font-bold tracking-tight mt-0.5">
                98.4<span className="text-headline-sm">%</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Audited annual claims resolution rate for private motor class.
              </p>
            </div>
            <div className="mt-space-sm pt-space-xs flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
              <span>
                Avg. Turnaround: <strong>4.2 Working Days</strong>
              </span>
              <span className="material-symbols-outlined text-[16px] text-secondary">check_circle</span>
            </div>
          </div>

          {/* Metric 3: IDV Declared Value */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary-container">
                <span className="material-symbols-outlined text-[22px]">account_balance_wallet</span>
              </div>
              <span className="bg-surface-container-high text-on-surface-variant font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold">
                Standard 20% Dep.
              </span>
            </div>
            <div className="mt-space-md">
              <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                Insured Declared Value (IDV)
              </div>
              <div className="font-label-numeric text-headline-lg text-on-surface font-bold tracking-tight mt-0.5">
                ₹11,40,000
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Maximum indemnified sum insured for constructive total loss / theft.
              </p>
            </div>
            <div className="mt-space-sm pt-space-xs flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
              <span>
                Adjustable Window: <strong>₹10.2L - ₹12.5L</strong>
              </span>
              <span className="material-symbols-outlined text-[16px] text-secondary">tune</span>
            </div>
          </div>

          {/* Metric 4: Active NCB Discount */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between group hover:shadow-md transition-all">
            <div className="flex items-start justify-between">
              <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary-container">
                <span className="material-symbols-outlined text-[22px]">savings</span>
              </div>
              <span className="bg-secondary-container/50 text-on-secondary-container font-label-sm text-label-sm px-2 py-0.5 rounded-full font-bold">
                Tier 3 Intact
              </span>
            </div>
            <div className="mt-space-md">
              <div className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                Active No-Claim Bonus
              </div>
              <div className="font-label-numeric text-headline-lg text-on-surface font-bold tracking-tight mt-0.5">
                35<span className="text-headline-sm">%</span>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                Carried forward across last 2 renewal cycles without recorded claims.
              </p>
            </div>
            <div className="mt-space-sm pt-space-xs flex items-center justify-between text-on-surface-variant font-label-sm text-label-sm">
              <span>
                Next Slab at Renewal: <strong>45% NCB</strong>
              </span>
              <span className="material-symbols-outlined text-[16px] text-secondary">trending_up</span>
            </div>
          </div>
        </div>
      </section>

      {/* Operational Split: Actions & Technical Manifest */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-space-lg items-start">
        {/* Primary Transaction Execution Center (7 Cols) */}
        <div className="lg:col-span-7 space-y-space-md">
          <div className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-lg">
            <div className="flex items-start justify-between gap-space-sm">
              <div>
                <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                  Statutory Action Station
                </span>
                <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                  Available Renewal Pathways
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
                  Select an automated pathway to maintain compliance under Section 146 of the Motor Vehicles Act.
                </p>
              </div>
              <div className="p-2 bg-surface-container rounded-lg">
                <span className="material-symbols-outlined text-secondary text-[24px]">shield_with_heart</span>
              </div>
            </div>

            {/* Primary Flow Options */}
            <div className="space-y-space-sm">
              {/* Pathway A: Full Marketplace Comparison */}
              <div className="p-space-md bg-surface-container-low rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md hover:bg-surface-container transition-all">
                <div className="flex items-start gap-space-sm">
                  <div className="w-10 h-10 rounded-lg bg-primary text-on-primary flex items-center justify-center font-bold">
                    <span className="material-symbols-outlined text-[20px]">compare</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-title-md text-title-md text-on-surface font-bold">
                        Compare 4 Verified Renewal Quotes
                      </h4>
                      <span className="bg-secondary text-on-secondary font-label-sm text-[10px] px-2 py-0.5 rounded font-semibold uppercase">
                        Recommended
                      </span>
                    </div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Includes HDFC ERGO, ICICI Lombard, Tata AIG &amp; Digit with Zero-Dep match.
                    </p>
                    <div className="flex items-center gap-3 mt-1.5 font-label-sm text-label-sm text-secondary font-semibold">
                      <span>Est. Savings: ₹3,240</span>
                      <span className="w-1 h-1 rounded-full bg-outline-variant"></span>
                      <span>Instant NCB Porting</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onCompareQuotes}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-primary-container text-on-primary font-title-md text-body-sm font-semibold hover:bg-primary transition-colors shadow-sm cursor-pointer"
                >
                  <span>View Quotes</span>
                  <span className="material-symbols-outlined text-[16px] ml-1">arrow_forward</span>
                </button>
              </div>

              {/* Pathway B: Instant 1-Click Rollover */}
              <div className="p-space-md bg-surface-container-lowest rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-space-md shadow-sm border border-outline-variant/30">
                <div className="flex items-start gap-space-sm">
                  <div className="w-10 h-10 rounded-lg bg-surface-container flex items-center justify-center text-primary-container">
                    <span className="material-symbols-outlined text-[20px]">sync</span>
                  </div>
                  <div>
                    <h4 className="font-title-md text-title-md text-on-surface font-bold">
                      Instant 1-Click Renewal (Bajaj Allianz)
                    </h4>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Rollover existing terms with no inspection gap or documentation.
                    </p>
                    <div className="flex items-center gap-2 mt-1 font-label-numeric text-body-sm text-on-surface">
                      <span className="font-bold">₹16,420</span>
                      <span className="text-on-surface-variant text-[11px]">(Includes 18% GST + Zero Dep Addon)</span>
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={onQuickRenew}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-lg bg-secondary text-on-secondary font-title-md text-body-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm cursor-pointer"
                >
                  <span>Renew Instantly</span>
                  <span className="material-symbols-outlined text-[16px] ml-1">flash_on</span>
                </button>
              </div>

              {/* Dual Utility Triggers */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm pt-space-xs">
                {/* OCR Upload Trigger */}
                <button
                  type="button"
                  onClick={() => setOcrModalOpen(true)}
                  className="p-space-sm bg-surface-container-low rounded-xl text-left flex items-start gap-3 hover:bg-surface-container transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-on-surface shadow-xs">
                    <span className="material-symbols-outlined text-[18px]">document_scanner</span>
                  </div>
                  <div>
                    <div className="font-title-md text-body-sm font-bold text-on-surface">Upload Policy Copy</div>
                    <div className="font-body-sm text-[12px] text-on-surface-variant">OCR scan PDF or JPEG</div>
                  </div>
                </button>

                {/* Callback Trigger */}
                <button
                  type="button"
                  onClick={() => setCallbackDrawerOpen(true)}
                  className="p-space-sm bg-surface-container-low rounded-xl text-left flex items-start gap-3 hover:bg-surface-container transition-all cursor-pointer"
                >
                  <div className="w-8 h-8 rounded-lg bg-surface-container-lowest flex items-center justify-center text-on-surface shadow-xs">
                    <span className="material-symbols-outlined text-[18px]">support_agent</span>
                  </div>
                  <div>
                    <div className="font-title-md text-body-sm font-bold text-on-surface">Specialist Callback</div>
                    <div className="font-body-sm text-[12px] text-on-surface-variant">Talk with Senior Underwriter</div>
                  </div>
                </button>
              </div>
            </div>

            {/* DPDP Statutory Security Ribbon */}
            <div className="p-space-sm bg-surface-container-low rounded-lg flex items-center justify-between gap-space-sm">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[16px]">lock</span>
                <span className="font-label-sm text-[11px] text-on-surface-variant uppercase tracking-wider font-semibold">
                  DPDP Act 2023 Compliant · Encrypted Broker Transmission
                </span>
              </div>
              <button
                type="button"
                onClick={onOpenConsent}
                className="font-label-sm text-[11px] text-secondary font-bold hover:underline cursor-pointer"
              >
                Ledger Consent #9841
              </button>
            </div>
          </div>
        </div>

        {/* Vehicle Specification & Inspection Ledger (5 Cols) */}
        <div className="lg:col-span-5 space-y-space-md">
          {/* Technical RC Specifications Card */}
          <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm space-y-space-md">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[20px]">engineering</span>
                <h3 className="font-title-md text-title-md text-on-surface font-bold">Vehicle Technical Manifest</h3>
              </div>
              <span className="font-label-sm text-label-sm text-secondary bg-secondary-container/40 px-2 py-0.5 rounded font-bold uppercase">
                Verified RC
              </span>
            </div>

            {/* Spec Key-Values */}
            <div className="space-y-space-xs font-body-sm text-body-sm">
              <div className="flex items-center justify-between py-1.5 px-2 bg-surface-container-low rounded">
                <span className="text-on-surface-variant">Engine Number</span>
                <span className="font-label-numeric font-semibold text-on-surface">G4FS-MA049182</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2 bg-surface-container-lowest rounded">
                <span className="text-on-surface-variant">Chassis Number</span>
                <span className="font-label-numeric font-semibold text-on-surface">MALC381CLNM092811</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2 bg-surface-container-low rounded">
                <span className="text-on-surface-variant">Registration Date</span>
                <span className="font-label-numeric font-semibold text-on-surface">14 Oct 2021 (3.1 Yrs Old)</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2 bg-surface-container-lowest rounded">
                <span className="text-on-surface-variant">Engine Displacement</span>
                <span className="font-label-numeric font-semibold text-on-surface">1,482 cc (Turbo Petrol)</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2 bg-surface-container-low rounded">
                <span className="text-on-surface-variant">Seating Capacity</span>
                <span className="font-label-numeric font-semibold text-on-surface">5 Persons (Inc. Driver)</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2 bg-surface-container-lowest rounded">
                <span className="text-on-surface-variant">Fuel Type &amp; Tank</span>
                <span className="font-label-numeric font-semibold text-on-surface">Petrol / 50 Litres</span>
              </div>
              <div className="flex items-center justify-between py-1.5 px-2 bg-surface-container-low rounded">
                <span className="text-on-surface-variant">Hypothecation (Financier)</span>
                <span className="font-title-md text-[13px] font-bold text-on-surface">HDFC Bank Ltd (Auto Loan)</span>
              </div>
            </div>

            {/* Historical Loss Ratio Capsule */}
            <div className="p-space-sm bg-surface-container-low rounded-lg space-y-1">
              <div className="flex items-center justify-between text-on-surface font-title-md text-body-sm font-bold">
                <span>Past Claims History</span>
                <span className="text-secondary font-semibold">Clean Docket</span>
              </div>
              <div className="flex items-center gap-2 text-on-surface-variant font-body-sm text-[12px]">
                <span className="material-symbols-outlined text-secondary text-[16px]">check_circle</span>
                <span>
                  <strong>0 claims recorded</strong> across last 24 months. NCB protected.
                </span>
              </div>
            </div>
          </div>

          {/* Physical Visual Representation Image Placement */}
          <div className="relative rounded-xl overflow-hidden shadow-sm bg-surface-container-high h-44">
            <img
              className="w-full h-full object-cover"
              alt="Hyundai Creta Showroom Photograph"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDZB4z0i9eYdRYUgJMUqOT62AzqctgVc6pZNTUpgx0kWRYAfDXEIA4lDp5n_fabVNVTCh-9V4qtnUAQ8SZR3Ct7HgNw4siExerFtBox9UD_sxuFf3eJtWEqL4arJgD6xV-lgUr7x-Nm3rWRtWnxPfeb_JWUcTzijDqRgB49C9MAc1DJJdR8SJcyoRn_H66Zu3-afPNsyf_u2sfvK5FfVbI-vBsa0mbk0kXrRBN75-W3"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-transparent to-transparent flex items-end p-space-md">
              <div className="flex items-center justify-between w-full text-on-primary">
                <div>
                  <div className="font-title-md text-body-sm font-bold">Vehicle Photographic Profile</div>
                  <div className="font-body-sm text-[12px] opacity-80">
                    Last physical inspection verified on 18 Oct 2023
                  </div>
                </div>
                <span className="material-symbols-outlined text-[20px]">image</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Regulatory Underwriting & Insurance Mechanics Educational Guide (Accordion) */}
      <section className="bg-surface-container-lowest p-space-lg rounded-xl shadow-sm space-y-space-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-space-sm">
            <div className="w-10 h-10 rounded-lg bg-surface-container-high flex items-center justify-center text-primary-container">
              <span className="material-symbols-outlined text-[22px]">menu_book</span>
            </div>
            <div>
              <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary font-bold">
                Statutory Advisory
              </span>
              <h3 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Essential Motor Insurance Mechanics &amp; Mandates
              </h3>
            </div>
          </div>
          <span className="font-label-sm text-label-sm text-on-surface-variant font-semibold">
            General Insurance Council Guidance
          </span>
        </div>
        <div className="space-y-space-sm">
          {/* Accordion Item 1: IDV Calculation */}
          <div className="rounded-lg bg-surface-container-low overflow-hidden">
            <button
              className="w-full px-space-md py-3.5 flex items-center justify-between text-left hover:bg-surface-container transition-colors cursor-pointer"
              onClick={() => toggleAccordion("idv")}
              type="button"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary text-[20px]">calculate</span>
                <span className="font-title-md text-title-md text-on-surface font-semibold">
                  How is my Insured Declared Value (IDV) Calculated?
                </span>
              </div>
              <span
                className={`material-symbols-outlined chevron-icon text-on-surface-variant transition-transform ${
                  accordionOpen.idv ? "rotate-180" : ""
                }`}
              >
                expand_more
              </span>
            </button>
            {accordionOpen.idv && (
              <div className="px-space-md pb-space-md pt-1 text-on-surface-variant font-body-sm text-body-sm space-y-2">
                <p>
                  IDV is the current maximum market value fixed by IRDAI tariffs upon which compensation is determined during total vehicle loss or theft. It is calculated based on the manufacturer's listed selling price minus standard age-based statutory depreciation slabs:
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 font-label-numeric text-[12px]">
                  <div className="p-2 bg-surface-container-lowest rounded">Up to 6 mos: <strong>5%</strong></div>
                  <div className="p-2 bg-surface-container-lowest rounded">1 to 2 yrs: <strong>20%</strong></div>
                  <div className="p-2 bg-surface-container-lowest rounded">2 to 3 yrs: <strong>30%</strong></div>
                  <div className="p-2 bg-surface-container-lowest rounded">3 to 4 yrs: <strong>40% (Current)</strong></div>
                </div>
                <p className="pt-1">
                  Artificially lowering IDV saves trivial premium amounts but exposes you to major settlement deficits in serious accidents.
                </p>
              </div>
            )}
          </div>

          {/* Accordion Item 2: Zero Depreciation Mechanics */}
          <div className="rounded-lg bg-surface-container-low overflow-hidden">
            <button
              className="w-full px-space-md py-3.5 flex items-center justify-between text-left hover:bg-surface-container transition-colors cursor-pointer"
              onClick={() => toggleAccordion("zeroDep")}
              type="button"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-secondary text-[20px]">swipe_left</span>
                <span className="font-title-md text-title-md text-on-surface font-semibold">
                  Zero-Depreciation (Bumper-to-Bumper) Waiver vs Standard Comprehensive
                </span>
              </div>
              <span
                className={`material-symbols-outlined chevron-icon text-on-surface-variant transition-transform ${
                  accordionOpen.zeroDep ? "rotate-180" : ""
                }`}
              >
                expand_more
              </span>
            </button>
            {accordionOpen.zeroDep && (
              <div className="px-space-md pb-space-md pt-1 text-on-surface-variant font-body-sm text-body-sm space-y-2">
                <p>
                  In standard policies, replacement of consumable elements attracts mandatory out-of-pocket costs: 50% on rubber, nylon, and plastic parts; 30% on fiberglass; and up to 50% on metal panels. A Zero-Depreciation add-on mandates 100% claim absorption by the insurer, leaving only the standard compulsory deductible of ₹1,000 to be borne by the car owner.
                </p>
              </div>
            )}
          </div>

          {/* Accordion Item 3: Section 146 Motor Vehicles Act */}
          <div className="rounded-lg bg-surface-container-low overflow-hidden">
            <button
              className="w-full px-space-md py-3.5 flex items-center justify-between text-left hover:bg-surface-container transition-colors cursor-pointer"
              onClick={() => toggleAccordion("sec146")}
              type="button"
            >
              <div className="flex items-center gap-3">
                <span className="material-symbols-outlined text-error text-[20px]">gavel</span>
                <span className="font-title-md text-title-md text-on-surface font-semibold">
                  Statutory Liabilities Under Section 146 of the Motor Vehicles Act (1988)
                </span>
              </div>
              <span
                className={`material-symbols-outlined chevron-icon text-on-surface-variant transition-transform ${
                  accordionOpen.sec146 ? "rotate-180" : ""
                }`}
              >
                expand_more
              </span>
            </button>
            {accordionOpen.sec146 && (
              <div className="px-space-md pb-space-md pt-1 text-on-surface-variant font-body-sm text-body-sm space-y-2">
                <p className="text-on-surface">
                  Plying a motorized vehicle in a public space without a valid Third-Party Liability insurance policy is a cognizable legal offense in India:
                </p>
                <ul className="list-disc pl-5 space-y-1">
                  <li><strong>First Offense:</strong> Punishable with an immediate court compound fine of ₹2,000 and/or imprisonment up to 3 months.</li>
                  <li><strong>Repeat Offense:</strong> Penalty escalates to ₹4,000 fine and/or up to 3 months imprisonment.</li>
                  <li><strong>Direct Exposure:</strong> Uncapped civil indemnification obligations for third-party fatalities or bodily injuries without an underwriter buffer.</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Interactive OCR File Upload Dialog Modal */}
      {ocrModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-container/60 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest max-w-lg w-full rounded-xl shadow-xl overflow-hidden p-space-lg space-y-space-md animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[24px]">document_scanner</span>
                <h3 className="font-title-md text-title-md text-on-surface font-bold">
                  Policy Document Extraction (OCR)
                </h3>
              </div>
              <button
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface cursor-pointer"
                onClick={() => setOcrModalOpen(false)}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Upload your previous policy copy from any Indian General Insurer. Our computer-vision parser will auto-verify NCB eligibility, IDV depreciation, and addon parity within 30 seconds.
            </p>
            <div
              onClick={handleOcrExtract}
              className="p-space-lg bg-surface-container-low rounded-xl text-center flex flex-col items-center justify-center space-y-2 cursor-pointer hover:bg-surface-container transition-colors border-2 border-dashed border-outline-variant/50"
            >
              <span className="material-symbols-outlined text-[36px] text-secondary">cloud_upload</span>
              <div className="font-title-md text-body-sm font-bold text-on-surface">
                Click to select or drag &amp; drop policy file
              </div>
              <div className="font-label-sm text-[11px] text-on-surface-variant">
                PDF, JPEG, or PNG up to 10MB · IRDAI Masked Processing
              </div>
            </div>
            <div className="flex items-center justify-end gap-space-sm pt-space-xs">
              <button
                className="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-body-sm font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
                onClick={() => setOcrModalOpen(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-primary-container text-on-primary font-body-sm font-semibold hover:bg-primary transition-colors cursor-pointer"
                onClick={handleOcrExtract}
                type="button"
              >
                Extract Document
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Underwriter Callback Request Drawer */}
      {callbackDrawerOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary-container/60 backdrop-blur-sm p-4">
          <div className="bg-surface-container-lowest max-w-md w-full rounded-xl shadow-xl p-space-lg space-y-space-md animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[24px]">headset_mic</span>
                <h3 className="font-title-md text-title-md text-on-surface font-bold">
                  Request Advisor Consultation
                </h3>
              </div>
              <button
                className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container hover:text-on-surface cursor-pointer"
                onClick={() => setCallbackDrawerOpen(false)}
                type="button"
              >
                <span className="material-symbols-outlined text-[20px]">close</span>
              </button>
            </div>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Speak directly with an IRDAI-certified Motor Underwriting Specialist regarding IDV adjustments or previous claim settlements.
            </p>
            <div className="space-y-3 font-body-sm text-body-sm">
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold mb-1">
                  Registered Phone
                </label>
                <input
                  className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-on-surface font-label-numeric font-medium focus:outline-none focus:ring-1 focus:ring-primary"
                  readOnly
                  type="text"
                  value="+91 98301 24901"
                />
              </div>
              <div>
                <label className="block font-label-sm text-label-sm text-on-surface-variant uppercase font-semibold mb-1">
                  Preferred Time Slot
                </label>
                <select
                  value={callbackSlot}
                  onChange={(e) => setCallbackSlot(e.target.value)}
                  className="w-full px-3 py-2 bg-surface-container-low rounded-lg text-on-surface font-body-sm focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
                >
                  <option>Immediate Priority (Within 15 mins)</option>
                  <option>Today: 02:00 PM - 04:00 PM</option>
                  <option>Today: 05:00 PM - 07:00 PM</option>
                  <option>Tomorrow Morning (10:00 AM)</option>
                </select>
              </div>
            </div>
            <div className="flex items-center justify-end gap-space-sm pt-space-xs">
              <button
                className="px-4 py-2 rounded-lg bg-surface-container text-on-surface font-body-sm font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
                onClick={() => setCallbackDrawerOpen(false)}
                type="button"
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded-lg bg-secondary text-on-secondary font-body-sm font-semibold hover:bg-emerald-700 transition-colors flex items-center gap-1 cursor-pointer"
                onClick={handleCallbackDispatch}
                disabled={callbackSent}
                type="button"
              >
                {callbackSent ? (
                  <>
                    <span className="material-symbols-outlined text-[16px] animate-spin">refresh</span>
                    <span>Dispatching...</span>
                  </>
                ) : (
                  <span>Confirm Dispatch</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =========================================================================
// STEP 3: COMPARE QUOTES & ADD-ONS (HTML 3)
// =========================================================================
export function Step3QuotesComparisonView({
  vehicle,
  onSelectPlan,
  onProceedToCallback,
  onOpenConsent,
}) {
  const [selectedPlanType, setSelectedPlanType] = useState("comprehensive");
  const [idv, setIdv] = useState(1140000);
  const [addons, setAddons] = useState({
    zeroDep: true,
    rsa: true,
    engine: true,
    consumables: false,
    key: false,
    rti: false,
  });

  const addonPrices = {
    zeroDep: 3150,
    rsa: 499,
    engine: 1240,
    consumables: 650,
    key: 320,
    rti: 1850,
  };

  const toggleAddon = (k) => {
    setAddons((prev) => ({ ...prev, [k]: !prev[k] }));
  };

  const selectedCount = Object.values(addons).filter(Boolean).length;
  const totalAddonCost = Object.entries(addons).reduce(
    (sum, [k, v]) => (v ? sum + addonPrices[k] : sum),
    0
  );

  const plans = [
    {
      id: "hdfc",
      abbr: "HE",
      insurer: "HDFC ERGO",
      planName: "Optima Drive Shield",
      badge: "Best Match",
      badgeClass: "bg-primary text-on-primary",
      ratio: "98.6% Ratio",
      netPrice: 14820,
      origPrice: 22800,
      garages: "11,200+ Garages",
      sla: "< 4 Hours",
      deductible: "₹1,000 Flat",
      pills: ["Zero Dep", "RSA 24x7", "Engine Shield"],
      isBest: true,
    },
    {
      id: "icici",
      abbr: "IL",
      insurer: "ICICI Lombard",
      planName: "Complete Car Shield",
      badge: "Value Pick",
      badgeClass: "bg-surface-container-high text-on-surface",
      ratio: "97.9% Ratio",
      netPrice: 13990,
      origPrice: 21500,
      garages: "9,800+ Garages",
      sla: "Under 6 Hours",
      deductible: "₹1,000 Flat",
      pills: ["Zero Dep", "RSA 24x7"],
      isBest: false,
    },
    {
      id: "tata",
      abbr: "TA",
      insurer: "Tata AIG",
      planName: "Auto Secure Plus",
      badge: "Max Network",
      badgeClass: "bg-surface-container-high text-on-surface",
      ratio: "99.1% Ratio",
      netPrice: 15410,
      origPrice: 23700,
      garages: "12,450+ Garages",
      sla: "Under 4 Hours",
      deductible: "₹1,000 Flat",
      pills: ["Zero Dep", "RSA 24x7", "Engine Shield"],
      isBest: false,
    },
    {
      id: "digit",
      abbr: "DG",
      insurer: "Go Digit",
      planName: "Self-Drive Guard",
      badge: "Fast Digital",
      badgeClass: "bg-surface-container text-on-surface-variant",
      ratio: "96.4% Ratio",
      netPrice: 12850,
      origPrice: 19800,
      garages: "7,400+ Garages",
      sla: "Instant AI",
      deductible: "₹1,000 Flat",
      pills: ["Zero Dep", "RSA 24x7"],
      isBest: false,
    },
  ];

  return (
    <div className="flex flex-col w-full space-y-space-xl transition-opacity duration-300">
      {/* Top Strip */}
      <div className="px-space-lg py-space-md bg-surface-container-low rounded-2xl flex flex-col gap-space-sm shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-space-md">
          <div className="flex items-center gap-space-md">
            <div className="inline-flex items-center bg-surface-container-lowest px-2.5 py-1 rounded-lg shadow-sm">
              <div className="bg-primary text-on-primary px-1.5 py-0.5 rounded-sm font-label-plate text-label-sm tracking-widest mr-2">
                IND
              </div>
              <span className="font-label-plate text-label-plate text-on-surface uppercase tracking-wider font-bold">
                {formatPlate(vehicle) || "WB 02 AB 1234"}
              </span>
            </div>
            <div className="h-6 w-px bg-outline-variant"></div>
            <div>
              <h1 className="font-headline-sm text-headline-sm text-on-surface font-bold">
                Compare Quotes &amp; Add-ons
              </h1>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Step 3 of 5 • IRDAI Statutory Comparison Matrix • Hyundai Creta 1.5 SX (2022)
              </p>
            </div>
          </div>
          <div className="flex items-center gap-space-sm">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-surface-container rounded-lg font-label-sm text-label-sm text-on-surface font-semibold">
              <span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
              <span>NCB 35% Transferred</span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary-container/40 text-on-secondary-container rounded-lg font-label-sm text-label-sm font-semibold">
              <span className="material-symbols-outlined text-[16px]">lock_clock</span>
              <span>Quotes Locked: 14m 28s</span>
            </div>
          </div>
        </div>

        {/* Active Vehicle & DPDP Micro Strip */}
        <div className="flex flex-wrap items-center justify-between gap-space-sm pt-space-xs text-on-surface-variant font-body-sm text-body-sm border-t border-surface-container-high/40">
          <div className="flex flex-wrap items-center gap-space-md">
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">speed</span>
              Odometer: <strong className="font-label-numeric text-body-sm text-on-surface font-semibold">24,180 km</strong>
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">local_gas_station</span>
              Fuel: <strong className="font-body-sm text-on-surface font-semibold">Petrol 1497cc</strong>
            </span>
            <span className="flex items-center gap-1">
              <span className="material-symbols-outlined text-[16px]">location_on</span>
              RTO: <strong className="font-body-sm text-on-surface font-semibold">WB-02 (Kolkata Central)</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-secondary flex items-center gap-1 font-semibold">
              <span className="material-symbols-outlined text-[14px]">shield</span>
              DPDP 2023 Consented Session
            </span>
            <button
              onClick={onOpenConsent}
              className="text-on-surface-variant hover:text-on-surface font-label-sm text-label-sm underline cursor-pointer"
              type="button"
            >
              Audit Log
            </button>
          </div>
        </div>
      </div>

      {/* 1. Filter & Customization Toolbar */}
      <section className="bg-surface-container-lowest rounded-xl p-space-lg shadow-sm flex flex-col gap-space-md">
        <div className="flex flex-wrap items-center justify-between gap-space-md pb-space-xs">
          <div className="flex items-center gap-space-sm">
            <div className="w-8 h-8 rounded-lg bg-surface-container flex items-center justify-center text-on-surface">
              <span className="material-symbols-outlined text-[18px]">tune</span>
            </div>
            <div>
              <h2 className="font-title-md text-title-md text-on-surface font-bold">
                Policy Structure &amp; Valuation
              </h2>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Tune your insured vehicle declared value and rider pack
              </p>
            </div>
          </div>
          {/* Plan Type Switcher */}
          <div className="inline-flex p-1 bg-surface-container rounded-lg gap-1">
            <button
              onClick={() => setSelectedPlanType("all")}
              className={`px-3 py-1.5 rounded-lg font-body-sm text-body-sm transition-colors cursor-pointer ${
                selectedPlanType === "all" ? "bg-primary-container text-on-primary font-bold shadow-sm" : "text-on-surface-variant hover:text-on-surface"
              }`}
              type="button"
            >
              All Plans (9)
            </button>
            <button
              onClick={() => setSelectedPlanType("comprehensive")}
              className={`px-3.5 py-1.5 rounded-lg font-title-md text-body-sm font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                selectedPlanType === "comprehensive" ? "bg-primary-container text-on-primary shadow-sm" : "text-on-surface-variant hover:text-on-surface"
              }`}
              type="button"
            >
              <span className="material-symbols-outlined text-[16px]">verified</span>
              Comprehensive Package
            </button>
            <button
              onClick={() => setSelectedPlanType("tp")}
              className={`px-3 py-1.5 rounded-lg font-body-sm text-body-sm transition-colors cursor-pointer ${
                selectedPlanType === "tp" ? "bg-primary-container text-on-primary font-bold shadow-sm" : "text-on-surface-variant hover:text-on-surface"
              }`}
              type="button"
            >
              Third-Party Only
            </button>
          </div>
        </div>

        {/* IDV Selector Dynamic Block */}
        <div className="p-space-md bg-surface-container-low rounded-xl flex flex-col lg:flex-row lg:items-center justify-between gap-space-md">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <span className="font-title-md text-body-sm font-bold text-on-surface">
                Vehicle IDV (Insured Declared Value)
              </span>
              <span className="material-symbols-outlined text-on-surface-variant text-[16px] cursor-help">info</span>
            </div>
            <span className="font-body-sm text-body-sm text-on-surface-variant">
              IRDAI depreciation schedule recommends ₹11,40,000 for 2-3 year old private cars
            </span>
          </div>
          {/* Chips */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { val: 1020000, label: "-10% Lower", text: "₹10,20,000" },
              { val: 1140000, label: "Recommended", text: "₹11,40,000", isRec: true },
              { val: 1250000, label: "+10% Higher", text: "₹12,50,000" },
              { val: 1310000, label: "+15% Max", text: "₹13,10,000" },
            ].map((chip) => {
              const active = idv === chip.val;
              return (
                <button
                  key={chip.val}
                  type="button"
                  onClick={() => setIdv(chip.val)}
                  className={`px-3 py-2 rounded-lg font-label-numeric text-body-sm transition-all text-left cursor-pointer ${
                    active ? "bg-primary text-on-primary shadow-sm" : "bg-surface-container-lowest text-on-surface hover:bg-surface-container"
                  }`}
                >
                  <span
                    className={`block font-label-sm text-label-sm uppercase font-bold flex items-center gap-0.5 ${
                      active ? (chip.isRec ? "text-secondary-fixed" : "text-primary-fixed-dim") : "text-on-surface-variant"
                    }`}
                  >
                    {chip.isRec && <span className="material-symbols-outlined text-[12px]">star</span>}
                    {chip.label}
                  </span>
                  <span className="font-bold">{chip.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Add-ons Live Selection Matrix */}
        <div className="flex flex-col gap-space-sm pt-space-xs">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-on-surface-variant font-bold">
              Select Add-on Riders (Zero Deductible Shield Active)
            </span>
            <span className="font-body-sm text-body-sm text-secondary font-semibold">
              {selectedCount} riders selected • +{inr(totalAddonCost)} added
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-space-sm">
            {[
              { key: "zeroDep", icon: "car_repair", title: "Zero Depreciation", desc: "100% claim payout on fibre & plastic", cost: 3150, badge: "Popular", badgeCol: "text-secondary" },
              { key: "rsa", icon: "support", title: "24x7 RSA Assistance", desc: "Towing up to 50km, flat tyre, jumpstart", cost: 499, badge: "India-wide", badgeCol: "text-on-surface-variant" },
              { key: "engine", icon: "oil_barrel", title: "Engine & Gearbox", desc: "Water ingress & hydrostatic lock protection", cost: 1240, badge: "Monsoon", badgeCol: "text-secondary" },
              { key: "consumables", icon: "build", title: "Consumables Cover", desc: "Nuts, bolts, engine oil, coolant cost", cost: 650, badge: "Optional", badgeCol: "text-on-surface-variant" },
              { key: "key", icon: "key", title: "Key Replacement", desc: "Smart key & tumbler set up to ₹25,000", cost: 320, badge: "Optional", badgeCol: "text-on-surface-variant" },
              { key: "rti", icon: "receipt_long", title: "Return to Invoice", desc: "Ex-showroom price payout on write-off", cost: 1850, badge: "High Tier", badgeCol: "text-on-surface-variant" },
            ].map((ad) => {
              const active = addons[ad.key];
              return (
                <label
                  key={ad.key}
                  className={`cursor-pointer flex flex-col justify-between p-space-sm rounded-xl transition-all select-none border ${
                    active ? "bg-surface-container-high border-secondary/40 shadow-sm" : "bg-surface-container-low border-transparent hover:bg-surface-container"
                  }`}
                >
                  <div className="flex items-start justify-between gap-1 mb-2">
                    <span className="material-symbols-outlined text-[20px] text-primary">{ad.icon}</span>
                    <input
                      checked={active}
                      onChange={() => toggleAddon(ad.key)}
                      className="w-4 h-4 rounded text-secondary focus:ring-0 accent-secondary cursor-pointer"
                      type="checkbox"
                    />
                  </div>
                  <div>
                    <div className="font-title-md text-body-sm font-bold text-on-surface">{ad.title}</div>
                    <div className="font-label-sm text-label-sm text-on-surface-variant">{ad.desc}</div>
                  </div>
                  <div className="mt-2 pt-2 bg-surface-container-low/60 -mx-space-sm -mb-space-sm px-space-sm pb-space-sm rounded-b-xl flex items-center justify-between">
                    <span className="font-label-numeric text-body-sm font-bold text-on-surface">+{inr(ad.cost)}</span>
                    <span className={`font-label-sm text-[10px] font-bold uppercase ${ad.badgeCol}`}>{ad.badge}</span>
                  </div>
                </label>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2. Quotation Cards Grid with Instant Selection */}
      <section className="flex flex-col gap-space-md">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Live Insurer Quotations
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Direct API pricing retrieved via IRDAI Broker Link #842 with 35% NCB deduction applied
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-2 font-label-sm text-label-sm text-on-surface-variant font-semibold">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary inline-block"></span>
            <span>Fast-track Settlement Active</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-space-md">
          {plans.map((p) => (
            <div
              key={p.id}
              className={`bg-surface-container-lowest rounded-xl shadow-md p-space-md flex flex-col justify-between relative transition-transform hover:-translate-y-1 border ${
                p.isBest ? "border-primary/30" : "border-outline-variant/30"
              }`}
            >
              <div
                className={`absolute -top-3 left-4 px-2.5 py-0.5 rounded-full font-label-sm text-[10px] uppercase tracking-wider font-bold shadow-sm flex items-center gap-1 ${p.badgeClass}`}
              >
                {p.isBest && <span className="material-symbols-outlined text-[12px] text-secondary-fixed">star</span>}
                {p.badge}
              </div>
              <div>
                <div className="flex items-start justify-between gap-2 mt-1 mb-space-sm">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center font-title-md text-title-md font-bold text-on-surface">
                      {p.abbr}
                    </div>
                    <div>
                      <h3 className="font-title-md text-title-md text-on-surface font-bold">{p.insurer}</h3>
                      <span className="font-label-sm text-label-sm text-on-surface-variant">{p.planName}</span>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-secondary-container/40 text-on-secondary-container font-label-sm text-[10px] font-bold">
                    {p.ratio}
                  </span>
                </div>
                {/* Price display */}
                <div className="bg-surface-container-low p-space-sm rounded-lg mb-space-sm">
                  <div className="flex items-baseline justify-between">
                    <div>
                      <div className="font-label-sm text-label-sm text-on-surface-variant uppercase">Net with 18% GST</div>
                      <div className="font-headline-md text-headline-md font-bold text-on-surface leading-none tracking-tight">
                        {inr(p.netPrice)}
                        <span className="font-body-sm text-body-sm font-normal text-on-surface-variant">/yr</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="line-through text-on-surface-variant font-label-numeric text-body-sm">
                        {inr(p.origPrice)}
                      </span>
                      <div className="font-label-sm text-label-sm text-secondary font-bold">Save 35% NCB</div>
                    </div>
                  </div>
                </div>
                {/* Key metrics & add-on micro pills */}
                <div className="space-y-2 mb-space-md">
                  <div className="flex items-center justify-between text-body-sm font-body-sm">
                    <span className="text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">local_convenience_store</span> Cashless Network
                    </span>
                    <span className="font-label-numeric text-body-sm font-semibold text-on-surface">{p.garages}</span>
                  </div>
                  <div className="flex items-center justify-between text-body-sm font-body-sm">
                    <span className="text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">bolt</span> Settlement SLA
                    </span>
                    <span className="font-label-numeric text-body-sm font-semibold text-secondary">{p.sla}</span>
                  </div>
                  <div className="flex items-center justify-between text-body-sm font-body-sm">
                    <span className="text-on-surface-variant flex items-center gap-1">
                      <span className="material-symbols-outlined text-[16px]">money_off</span> Compulsory Ded.
                    </span>
                    <span className="font-label-numeric text-body-sm font-semibold text-on-surface">{p.deductible}</span>
                  </div>
                  <div className="pt-2 flex flex-wrap gap-1">
                    {p.pills.map((pill, pi) => (
                      <span key={pi} className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-[10px]">
                        {pill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => {
                    if (onSelectPlan) onSelectPlan(p);
                    if (onProceedToCallback) onProceedToCallback(p);
                  }}
                  className={`w-full h-11 rounded-lg font-title-md text-body-sm font-bold flex items-center justify-center gap-2 transition-colors shadow-sm cursor-pointer ${
                    p.isBest ? "bg-primary text-on-primary hover:bg-slate-800" : "bg-surface-container hover:bg-surface-container-high text-on-surface"
                  }`}
                >
                  <span>{p.isBest ? "Lock & Request Callback" : "Choose Plan"}</span>
                  <span className="material-symbols-outlined text-[18px]">
                    {p.isBest ? "phone_in_talk" : "arrow_forward"}
                  </span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Visual Richness Break: Visual Claim Settlements Infographic Banner */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-space-md">
        {/* Graph Card: Cashless Network Spread */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-space-sm">
            <div className="font-title-md text-body-sm font-bold text-on-surface">Cashless Workshop Distribution</div>
            <span className="font-label-sm text-label-sm text-secondary font-bold">Kolkata RTO Radius (30km)</span>
          </div>
          <div className="w-full flex items-end justify-between gap-2 h-24 pt-4">
            <div className="flex-1 flex flex-col items-center gap-1">
              <span className="font-label-numeric text-[11px] font-bold text-on-surface">142</span>
              <div className="w-full bg-primary rounded-t" style={{ height: "68%" }}></div>
              <span className="font-label-sm text-[10px] text-on-surface-variant font-semibold">HDFC</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1">
              <span className="font-label-numeric text-[11px] font-bold text-on-surface">118</span>
              <div className="w-full bg-surface-container-high rounded-t" style={{ height: "54%" }}></div>
              <span className="font-label-sm text-[10px] text-on-surface-variant font-semibold">ICICI</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1">
              <span className="font-label-numeric text-[11px] font-bold text-secondary font-bold">165</span>
              <div className="w-full bg-secondary rounded-t" style={{ height: "82%" }}></div>
              <span className="font-label-sm text-[10px] text-on-surface font-bold">Tata AIG</span>
            </div>
            <div className="flex-1 flex flex-col items-center gap-1">
              <span className="font-label-numeric text-[11px] font-bold text-on-surface">94</span>
              <div className="w-full bg-surface-container-high rounded-t" style={{ height: "44%" }}></div>
              <span className="font-label-sm text-[10px] text-on-surface-variant font-semibold">Digit</span>
            </div>
          </div>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-space-sm pt-space-xs">
            Tata AIG provides the nearest authorized Hyundai workshop at 1.4 km (EM Bypass).
          </p>
        </div>

        {/* Center Feature Card: Inspection-Free Transition */}
        <div className="bg-primary-container text-on-primary p-space-md rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="font-label-sm text-label-sm text-secondary-fixed uppercase tracking-wider font-bold">
              Zero Inspection Risk
            </span>
            <span className="material-symbols-outlined text-secondary-fixed text-[20px]">verified_user</span>
          </div>
          <div className="py-space-sm">
            <h4 className="font-headline-sm text-headline-sm text-on-primary font-bold">
              Existing Policy Valid for 28 Days
            </h4>
            <p className="font-body-sm text-body-sm text-on-primary-container mt-1">
              Renewing before expiration bypasses mandatory physical or video vehicle inspection per IRDAI Circular Section 64VB. Instant cashless endorsement issue.
            </p>
          </div>
          <div className="flex items-center gap-2 text-on-primary font-label-sm text-label-sm font-semibold">
            <span className="material-symbols-outlined text-[16px] text-secondary-fixed">check_circle</span>
            <span>Automatic Parivahan NCB Validation Succeeded</span>
          </div>
        </div>

        {/* Right Card: Advisor Desk Micro Prompt */}
        <div className="bg-surface-container-lowest p-space-md rounded-xl shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-surface-container flex items-center justify-center font-title-md text-title-md font-bold text-on-surface">
              DS
            </div>
            <div>
              <div className="font-title-md text-body-sm font-bold text-on-surface">Advisor Consultation</div>
              <div className="font-label-sm text-label-sm text-secondary font-semibold">Debasis Sengupta • IRDA #48921</div>
            </div>
          </div>
          <div className="py-space-sm text-body-sm font-body-sm text-on-surface-variant">
            “For your Creta Petrol 1.5 SX in Kolkata, opting for Zero Dep plus Engine Protector guarantees zero out-of-pocket monsoon waterlogging liability.”
          </div>
          <button
            onClick={() => onProceedToCallback && onProceedToCallback(plans[0])}
            className="w-full py-2 bg-surface-container hover:bg-surface-container-high text-on-surface rounded-lg font-title-md text-body-sm font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            type="button"
          >
            <span className="material-symbols-outlined text-[16px]">schedule</span>
            <span>Book Free 10-Min Advisory Call</span>
          </button>
        </div>
      </div>

      {/* 3. Side-by-Side Comparison Matrix Table */}
      <section className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg flex flex-col gap-space-md">
        <div className="flex flex-wrap items-center justify-between gap-space-md">
          <div>
            <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold">
              Technical Comparison Matrix
            </h2>
            <p className="font-body-sm text-body-sm text-on-surface-variant">
              Direct feature-by-feature evaluation under IRDAI Product Filing guidelines
            </p>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low text-on-surface">
                <th className="p-space-md font-title-md text-body-sm font-bold w-1/4 rounded-l-lg">Feature &amp; Terms</th>
                <th className="p-space-md font-title-md text-body-sm font-bold w-1/4">
                  <div className="flex items-center gap-2">
                    <span>HDFC ERGO</span>
                    <span className="px-2 py-0.5 bg-primary text-on-primary font-label-sm text-[10px] rounded uppercase">Best Match</span>
                  </div>
                  <div className="font-label-numeric text-headline-sm font-bold mt-1 text-on-surface">₹14,820</div>
                </th>
                <th className="p-space-md font-title-md text-body-sm font-bold w-1/4">
                  <div className="flex items-center gap-2">
                    <span>ICICI Lombard</span>
                    <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant font-label-sm text-[10px] rounded uppercase">Value</span>
                  </div>
                  <div className="font-label-numeric text-headline-sm font-bold mt-1 text-on-surface">₹13,990</div>
                </th>
                <th className="p-space-md font-title-md text-body-sm font-bold w-1/4 rounded-r-lg">
                  <div className="flex items-center gap-2">
                    <span>Tata AIG</span>
                    <span className="px-2 py-0.5 bg-surface-container text-on-surface-variant font-label-sm text-[10px] rounded uppercase">Network</span>
                  </div>
                  <div className="font-label-numeric text-headline-sm font-bold mt-1 text-on-surface">₹15,410</div>
                </th>
              </tr>
            </thead>
            <tbody className="font-body-sm text-body-sm">
              <tr className="hover:bg-surface-container-low/50 transition-colors border-b border-surface-container-low">
                <td className="p-space-md font-title-md text-body-sm font-semibold text-on-surface">Claim Settlement Ratio</td>
                <td className="p-space-md font-label-numeric font-bold text-on-surface">98.6%</td>
                <td className="p-space-md font-label-numeric font-bold text-on-surface">97.9%</td>
                <td className="p-space-md font-label-numeric font-bold text-secondary">99.1% (Highest)</td>
              </tr>
              <tr className="hover:bg-surface-container-low/50 transition-colors border-b border-surface-container-low">
                <td className="p-space-md font-title-md text-body-sm font-semibold text-on-surface">Cashless Garages Across India</td>
                <td className="p-space-md font-label-numeric font-semibold">11,200+ Garages</td>
                <td className="p-space-md font-label-numeric font-semibold">9,800+ Garages</td>
                <td className="p-space-md font-label-numeric font-semibold text-secondary">12,450+ Garages (Leader)</td>
              </tr>
              <tr className="hover:bg-surface-container-low/50 transition-colors border-b border-surface-container-low">
                <td className="p-space-md font-title-md text-body-sm font-semibold text-on-surface">Minor Claim SLA (Self-Survey)</td>
                <td className="p-space-md font-bold text-secondary">Under 4 Hours</td>
                <td className="p-space-md font-medium text-on-surface">Under 6 Hours</td>
                <td className="p-space-md font-bold text-secondary">Under 4 Hours</td>
              </tr>
              <tr className="hover:bg-surface-container-low/50 transition-colors border-b border-surface-container-low">
                <td className="p-space-md font-title-md text-body-sm font-semibold text-on-surface">Compulsory Excess / Deductible</td>
                <td className="p-space-md font-label-numeric">₹1,000 Flat</td>
                <td className="p-space-md font-label-numeric">₹1,000 Flat</td>
                <td className="p-space-md font-label-numeric">₹1,000 Flat</td>
              </tr>
              <tr className="bg-surface-container-low">
                <td className="p-space-md font-label-sm uppercase font-bold text-on-surface-variant">Direct Policy Checkout</td>
                <td className="p-space-md">
                  <button
                    type="button"
                    onClick={() => onProceedToCallback && onProceedToCallback(plans[0])}
                    className="w-full py-2 bg-primary text-on-primary rounded-lg font-title-md text-body-sm font-bold hover:bg-slate-800 transition cursor-pointer"
                  >
                    Proceed with HDFC
                  </button>
                </td>
                <td className="p-space-md">
                  <button
                    type="button"
                    onClick={() => onProceedToCallback && onProceedToCallback(plans[1])}
                    className="w-full py-2 bg-surface-container-high hover:bg-surface-container text-on-surface rounded-lg font-title-md text-body-sm font-bold transition cursor-pointer"
                  >
                    Proceed with ICICI
                  </button>
                </td>
                <td className="p-space-md">
                  <button
                    type="button"
                    onClick={() => onProceedToCallback && onProceedToCallback(plans[2])}
                    className="w-full py-2 bg-surface-container-high hover:bg-surface-container text-on-surface rounded-lg font-title-md text-body-sm font-bold transition cursor-pointer"
                  >
                    Proceed with Tata AIG
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* DPDP Trust Container */}
      <div className="bg-surface-container-low p-space-md rounded-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-space-md">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-secondary">
            <span className="material-symbols-outlined text-[22px]">policy</span>
          </div>
          <div>
            <div className="font-title-md text-body-sm font-bold text-on-surface">
              DPDP Act (2023) Notice &amp; Insurer Disclosures
            </div>
            <div className="font-body-sm text-body-sm text-on-surface-variant">
              Vehicle specifications retrieved under tokenized authorization for quotation calculations only. No data is stored or commercialized without unrevoked consent.
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="px-2.5 py-1 bg-surface-container-lowest rounded font-label-numeric text-[11px] text-on-surface font-semibold">
            TOKEN: VAHAN-842-WB02-SEC
          </span>
          <button
            type="button"
            onClick={onOpenConsent}
            className="px-3 py-1 bg-surface-container hover:bg-surface-container-high text-on-surface rounded font-label-sm text-label-sm font-semibold transition-colors cursor-pointer"
          >
            Manage Consent
          </button>
        </div>
      </div>
    </div>
  );
}

// =========================================================================
// STEP 4 & 5: ADVISOR CONSULTATION & 5-STAGE SENTINEL TIMELINE (HTML 4)
// =========================================================================
export function Step4And5AdvisorAndTimelineView({
  vehicle,
  plan,
  onBookingConfirmed,
  onOpenGarage,
}) {
  const [channel, setChannel] = useState("phone");
  const [slot, setSlot] = useState("afternoon");
  const [lang, setLang] = useState("English");
  const [dpdpAgreed, setDpdpAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isBooked, setIsBooked] = useState(false);

  const handleBooking = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsBooked(true);
      if (onBookingConfirmed) onBookingConfirmed({ channel, slot, lang });
    }, 1200);
  };

  return (
    <div className="flex flex-col w-full space-y-space-xl transition-opacity duration-300">
      {/* Top Context & Workflow Breadcrumb Band */}
      <div className="px-space-lg py-space-md bg-surface-container-lowest shadow-sm rounded-2xl flex flex-col md:flex-row md:items-center justify-between gap-space-md">
        <div className="flex items-center gap-space-md flex-wrap">
          <div className="flex items-center gap-space-xs px-2.5 py-1 bg-surface-container-low rounded-lg text-on-surface font-label-sm text-label-sm">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse"></span>
            <span className="uppercase font-bold tracking-wider text-secondary">Step 4 &amp; 5</span>
            <span className="text-on-surface-variant font-normal">/ Active Quote Session</span>
          </div>
          <div className="flex items-center gap-2 bg-surface-container px-3 py-1 rounded-xl">
            <div className="bg-primary text-on-primary px-1.5 py-0.5 rounded-sm font-label-plate text-[10px] tracking-widest leading-none">
              IND
            </div>
            <span className="font-label-plate text-label-plate text-on-surface uppercase font-bold">
              {formatPlate(vehicle) || "WB 02 AB 1234"}
            </span>
          </div>
          <div className="h-4 w-px bg-outline-variant/40 hidden md:block"></div>
          <span className="font-title-md text-body-sm text-on-surface-variant">Hyundai Creta SX 1.5L Petrol (2022)</span>
        </div>
        {/* Policy Locking Summary Pill */}
        <div className="flex items-center gap-space-sm bg-primary-container text-on-primary px-space-md py-2 rounded-full shadow-sm">
          <span className="material-symbols-outlined text-[18px] text-secondary-fixed">verified</span>
          <div className="flex items-center gap-2">
            <span className="font-title-md text-body-sm font-bold">
              {plan?.insurer || "HDFC ERGO"} {plan?.planName || "Optima Drive"}
            </span>
            <span className="text-on-primary-container">•</span>
            <span className="font-label-numeric text-label-numeric font-bold text-secondary-fixed">
              {inr(plan?.netPrice || 14820)}
            </span>
            <span className="font-label-sm text-[10px] text-on-primary-container tracking-wider uppercase">
              GST Incl.
            </span>
          </div>
        </div>
      </div>

      {/* Main Workspace Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-space-lg items-start">
        {/* Section A: Request Expert Callback & Binding Desk (7 Cols) */}
        <div className="xl:col-span-7 space-y-space-md">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="p-space-lg bg-surface-container-low/70 flex flex-col sm:flex-row sm:items-center justify-between gap-space-sm">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-label-sm text-label-sm uppercase tracking-widest text-secondary font-bold">
                    Binding Desk Priority
                  </span>
                  <span className="px-2 py-0.5 rounded bg-secondary-container text-on-secondary-container font-label-sm text-[10px] font-bold uppercase">
                    SLA &lt; 15 Mins
                  </span>
                </div>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-bold tracking-tight">
                  Request Tele-Advisor Consultation
                </h2>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Schedule an IRDAI-certified underwriter to review custom zero-dep rider discounts and finalize policy issuance.
                </p>
              </div>
              <div className="flex sm:flex-col items-end justify-center shrink-0">
                <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">Session Key</span>
                <span className="font-label-numeric text-body-sm font-bold text-on-surface">IRDA-2489-WB</span>
              </div>
            </div>

            {/* Form Fields */}
            <div className="p-space-lg space-y-space-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-space-md">
                <div className="space-y-1.5">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold flex items-center justify-between">
                    <span>Registered Vehicle Owner</span>
                    <span className="text-secondary font-bold">RC Match</span>
                  </label>
                  <div className="flex items-center h-11 px-3 bg-surface-container-low rounded-lg text-on-surface font-title-md text-body-md font-semibold">
                    <span className="material-symbols-outlined text-[18px] text-on-surface-variant mr-2">person</span>
                    <input
                      className="bg-transparent border-0 outline-none w-full text-on-surface font-title-md text-body-md font-semibold cursor-not-allowed"
                      readOnly
                      type="text"
                      value="Rahul Sharma"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold flex items-center justify-between">
                    <span>Masked Contact Terminal</span>
                    <span className="text-secondary font-semibold flex items-center gap-0.5">
                      <span className="material-symbols-outlined text-[12px]">lock</span> DPDP Shielded
                    </span>
                  </label>
                  <div className="flex items-center h-11 px-3 bg-surface-container-low rounded-lg text-on-surface font-label-numeric text-label-numeric">
                    <span className="material-symbols-outlined text-[18px] text-secondary mr-2">verified_user</span>
                    <span className="text-on-surface tracking-wider font-bold">+91 98301 •••••</span>
                    <span className="ml-auto px-1.5 py-0.5 rounded bg-surface-container font-label-sm text-[10px] text-on-surface-variant font-bold uppercase">
                      TRAI DND Exempt
                    </span>
                  </div>
                </div>
              </div>

              {/* Contact Channel Toggle */}
              <div className="space-y-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                  Preferred Secure Channel
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-space-sm">
                  <button
                    type="button"
                    onClick={() => setChannel("phone")}
                    className={`flex items-center justify-between p-space-sm rounded-xl transition-all shadow-sm cursor-pointer ${
                      channel === "phone" ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface hover:bg-surface-container"
                    }`}
                  >
                    <div className="flex items-center gap-space-sm text-left">
                      <div className="w-9 h-9 rounded-lg bg-surface-container-lowest/15 flex items-center justify-center">
                        <span className={`material-symbols-outlined text-[20px] ${channel === "phone" ? "text-secondary-fixed" : "text-primary"}`}>
                          phone_in_talk
                        </span>
                      </div>
                      <div>
                        <div className="font-title-md text-body-sm font-bold">Direct Secure Phone Call</div>
                        <div className="font-label-sm text-[11px] opacity-75">Recorded IRDAI Regulatory Line</div>
                      </div>
                    </div>
                    {channel === "phone" && (
                      <span className="material-symbols-outlined text-[18px] text-secondary-fixed">check_circle</span>
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => setChannel("whatsapp")}
                    className={`flex items-center justify-between p-space-sm rounded-xl transition-all shadow-sm cursor-pointer ${
                      channel === "whatsapp" ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface hover:bg-surface-container"
                    }`}
                  >
                    <div className="flex items-center gap-space-sm text-left">
                      <div className="w-9 h-9 rounded-lg bg-surface-container-highest flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px] text-secondary">chat</span>
                      </div>
                      <div>
                        <div className="font-title-md text-body-sm font-bold">Official WhatsApp Desk</div>
                        <div className="font-label-sm text-[11px] opacity-75">Green-Tick Verified InsureDrive</div>
                      </div>
                    </div>
                    {channel === "whatsapp" && (
                      <span className="material-symbols-outlined text-[18px] text-secondary-fixed">check_circle</span>
                    )}
                  </button>
                </div>
              </div>

              {/* Preferred Time Slot */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                    Callback Appointment Window
                  </label>
                  <span className="font-label-sm text-[11px] text-secondary font-bold">Today: Dec 04, 2025</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-space-sm">
                  {[
                    { id: "morning", title: "Morning", time: "9:00 AM – 12:00 PM", note: "Underwriter Round 1", icon: "wb_twilight" },
                    { id: "afternoon", title: "Afternoon (Recommended)", time: "1:00 PM – 4:00 PM", note: "High Dispatch Availability", icon: "sunny" },
                    { id: "evening", title: "Evening", time: "4:00 PM – 8:00 PM", note: "Executive Binding Desk", icon: "bedtime" },
                  ].map((s) => {
                    const active = slot === s.id;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => setSlot(s.id)}
                        className={`p-space-sm rounded-xl text-left transition-all cursor-pointer ${
                          active ? "bg-primary text-on-primary shadow-sm" : "bg-surface-container-low hover:bg-surface-container text-on-surface"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className={`font-label-sm text-label-sm font-bold uppercase tracking-wider ${active ? "text-primary-fixed-dim" : "text-on-surface-variant"}`}>
                            {s.title}
                          </span>
                          <span className={`material-symbols-outlined text-[16px] ${active ? "text-secondary-fixed" : "text-on-surface-variant"}`}>
                            {s.icon}
                          </span>
                        </div>
                        <div className="font-title-md text-body-sm font-bold">{s.time}</div>
                        <div className={`font-label-sm text-[10px] mt-1 ${active ? "text-secondary-fixed" : "text-on-surface-variant"}`}>
                          {s.note}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Language Pills */}
              <div className="space-y-2">
                <label className="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">
                  Assigned Advisor Language
                </label>
                <div className="flex flex-wrap gap-2">
                  {["English", "Hindi (हिंदी)", "Bengali (বাংলা)"].map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => setLang(l)}
                      className={`px-4 py-2 rounded-xl font-title-md text-body-sm font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
                        lang === l ? "bg-primary text-on-primary shadow-sm" : "bg-surface-container-low text-on-surface hover:bg-surface-container"
                      }`}
                    >
                      <span>{l}</span>
                      {lang === l && <span className="material-symbols-outlined text-[14px]">check</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* DPDP Consent */}
              <div className="p-space-md bg-surface-container-low rounded-xl space-y-space-sm">
                <div className="flex items-start gap-space-sm">
                  <input
                    checked={dpdpAgreed}
                    onChange={(e) => setDpdpAgreed(e.target.checked)}
                    className="mt-0.5 w-4 h-4 rounded text-secondary bg-surface-container-lowest focus:ring-0 cursor-pointer accent-secondary"
                    id="dpdpConsent"
                    type="checkbox"
                  />
                  <label className="font-body-sm text-body-sm text-on-surface leading-snug cursor-pointer select-none" htmlFor="dpdpConsent">
                    <span className="font-bold text-on-surface">DPDP Act (2023) Statutory Consent:</span> I authorize InsureDrive Technologies Private Limited and IRDAI Broker #842 to contact me exclusively for policy renewal verification, vehicle risk binding, and statutory disclosure advisory regarding registration <span className="font-label-plate text-[11px] font-bold">WB 02 AB 1234</span>. Data shall not be rented or marketed to unlisted third parties.
                  </label>
                </div>
              </div>

              {/* Primary Action CTA */}
              <div className="space-y-space-xs pt-1">
                <button
                  type="button"
                  onClick={handleBooking}
                  disabled={isSubmitting || !dpdpAgreed}
                  className={`w-full h-12 rounded-xl font-title-md text-body-lg font-bold flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer ${
                    isBooked
                      ? "bg-secondary text-on-secondary"
                      : "bg-primary hover:bg-slate-800 text-on-primary active:scale-[0.99]"
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <span className="material-symbols-outlined text-[20px] animate-spin">refresh</span>
                      <span>Transmitting Binding Request...</span>
                    </>
                  ) : isBooked ? (
                    <>
                      <span className="material-symbols-outlined text-[20px] text-secondary-fixed">task_alt</span>
                      <span>Appointment Booked &amp; Quote Locked!</span>
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-[20px] text-secondary-fixed">schedule_send</span>
                      <span>Confirm Callback Request &amp; Lock Quote</span>
                      <span className="ml-1 px-2 py-0.5 rounded bg-surface-container-lowest/15 font-label-numeric text-[12px] text-secondary-fixed">
                        {inr(plan?.netPrice || 14820)}
                      </span>
                    </>
                  )}
                </button>
                <div className="flex items-center justify-center gap-space-md text-on-surface-variant font-label-sm text-label-sm pt-1">
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-secondary">check_circle</span> Zero Cold Calls
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-secondary">check_circle</span> Rate Guarantee for 72 Hours
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <span className="material-symbols-outlined text-[14px] text-secondary">check_circle</span> No Spam Commitment
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Assigned Certified Advisor Widget */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-space-md">
              <div className="flex items-center gap-space-md">
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-primary-container text-on-primary flex items-center justify-center font-headline-sm text-headline-sm font-bold shadow-sm">
                    DS
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-secondary-container flex items-center justify-center text-on-secondary-container shadow-sm">
                    <span className="material-symbols-outlined text-[12px] font-bold">verified</span>
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-title-md text-title-md font-bold text-on-surface truncate">Debasis Sengupta</h3>
                    <span className="px-2 py-0.5 rounded bg-surface-container text-on-surface font-label-sm text-[10px] font-bold uppercase">
                      Senior Underwriter
                    </span>
                  </div>
                  <div className="font-body-sm text-body-sm text-on-surface-variant flex items-center gap-1.5 mt-0.5">
                    <span className="material-symbols-outlined text-[15px] text-secondary">directions_car</span>
                    <span>Specialist: Hyundai / Private Passenger Motor Vehicles</span>
                  </div>
                  <div className="flex items-center gap-space-md font-label-sm text-label-sm text-on-surface-variant mt-1.5">
                    <span className="flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px] text-secondary">military_tech</span> Lic. IRDAI-BRK-99214
                    </span>
                    <span className="flex items-center gap-1 font-bold text-secondary">
                      <span className="w-1.5 h-1.5 rounded-full bg-secondary"></span> Desk Online
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center shrink-0 pt-2 sm:pt-0">
                <span className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">Hotline Direct Extension</span>
                <div className="font-label-numeric text-label-numeric font-bold text-on-surface flex items-center gap-1">
                  <span className="material-symbols-outlined text-[16px] text-secondary">support_agent</span>
                  <span>Ext #4082</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section B: 5-Stage Automated Sentinel Timeline (5 Cols) */}
        <div className="xl:col-span-5 space-y-space-md">
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-lg space-y-space-md">
            <div className="flex items-center justify-between pb-space-sm">
              <div>
                <div className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-secondary text-[22px]">history_toggle_off</span>
                  <h3 className="font-title-md text-title-md font-bold text-on-surface">5-Stage Automated Sentinel</h3>
                </div>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                  Automated policy breach prevention engine syncs with VAHAN expiry schedule.
                </p>
              </div>
              <span className="px-2 py-1 rounded bg-surface-container text-on-surface font-label-numeric text-[11px] font-bold">
                28 Days Left
              </span>
            </div>

            {/* Timeline Track */}
            <div className="relative pl-6 space-y-space-lg before:content-[''] before:absolute before:left-3 before:top-3 before:bottom-3 before:w-0.5 before:bg-surface-container-highest">
              {/* Stage 1 */}
              <div className="relative">
                <div className="absolute -left-6 top-0 w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[14px] font-bold">done</span>
                </div>
                <div className="bg-surface-container-low rounded-xl p-space-md space-y-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold text-secondary">
                      Stage 1 · 45 Days Prior
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-[10px] font-bold">
                      Executed
                    </span>
                  </div>
                  <div className="font-title-md text-body-sm font-bold text-on-surface">Initial Market Preview &amp; IDV Audit</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Baseline quote benchmarking and motor fleet inspection valuation sent.</p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-label-sm text-[11px] text-on-surface-variant">SMS / Email Notification</span>
                    <span className="font-label-sm text-[10px] text-secondary font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">mark_email_read</span> Delivered
                    </span>
                  </div>
                </div>
              </div>

              {/* Stage 2 */}
              <div className="relative">
                <div className="absolute -left-6 top-0 w-6 h-6 rounded-full bg-secondary text-on-secondary flex items-center justify-center shadow-sm">
                  <span className="material-symbols-outlined text-[14px] font-bold">done</span>
                </div>
                <div className="bg-surface-container-low rounded-xl p-space-md space-y-space-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold text-secondary">
                      Stage 2 · 30 Days Prior
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-surface-container text-on-surface-variant font-label-sm text-[10px] font-bold">
                      Executed
                    </span>
                  </div>
                  <div className="font-title-md text-body-sm font-bold text-on-surface">Early-Bird NCB Lock Offer (50%)</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">No-Claim-Bonus certificate verified through IIB portal; discount frozen.</p>
                  <div className="flex items-center justify-between pt-2">
                    <span className="font-label-sm text-[11px] text-on-surface-variant">WhatsApp Document Push</span>
                    <span className="font-label-sm text-[10px] text-secondary font-bold flex items-center gap-1">
                      <span className="material-symbols-outlined text-[13px]">done_all</span> Delivered
                    </span>
                  </div>
                </div>
              </div>

              {/* Stage 3 */}
              <div className="relative">
                <div className="absolute -left-6 top-0 w-6 h-6 rounded-full bg-primary text-on-primary flex items-center justify-center shadow-md ring-4 ring-primary-fixed">
                  <span className="material-symbols-outlined text-[14px] text-secondary-fixed">play_arrow</span>
                </div>
                <div className="bg-surface-container-lowest rounded-xl p-space-md shadow-md space-y-space-sm bg-gradient-to-br from-surface-container-low to-surface-container-lowest border border-primary/20">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold text-primary flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-secondary animate-ping"></span> Stage 3 · Today's Milestone
                    </span>
                    <span className="px-2 py-0.5 rounded bg-primary text-on-primary font-label-sm text-[10px] font-bold uppercase">
                      Pending Call
                    </span>
                  </div>
                  <div>
                    <div className="font-title-md text-title-md font-bold text-on-surface">Active Callback Scheduled (4:30 PM)</div>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-0.5">
                      Tele-advisor Debasis Sengupta queued to lock zero-dep add-on package before price index revision.
                    </p>
                  </div>
                </div>
              </div>

              {/* Stage 4 */}
              <div className="relative">
                <div className="absolute -left-6 top-0 w-6 h-6 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center">
                  <span className="material-symbols-outlined text-[14px]">lock_clock</span>
                </div>
                <div className="bg-surface-container-low rounded-xl p-space-md space-y-space-xs opacity-90">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold text-on-surface-variant">
                      Stage 4 · 7 Days Prior
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-surface-container-high text-on-surface-variant font-label-sm text-[10px] font-bold">
                      Upcoming
                    </span>
                  </div>
                  <div className="font-title-md text-body-sm font-bold text-on-surface">Urgent Alert: Avoid Break-in Inspection Fees</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Statutory waiver expires. Lapsing causes self-inspection mandates and potential premium surcharge (up to +18%).
                  </p>
                </div>
              </div>

              {/* Stage 5 */}
              <div className="relative">
                <div className="absolute -left-6 top-0 w-6 h-6 rounded-full bg-surface-container-high text-on-surface-variant flex items-center justify-center">
                  <span className="material-symbols-outlined text-[14px]">crisis_alert</span>
                </div>
                <div className="bg-surface-container-low rounded-xl p-space-md space-y-space-xs opacity-90">
                  <div className="flex items-center justify-between">
                    <span className="font-label-sm text-label-sm uppercase tracking-wider font-bold text-error">
                      Stage 5 · Expiry Zero Hour
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-error-container text-on-error-container font-label-sm text-[10px] font-bold">
                      Final Call
                    </span>
                  </div>
                  <div className="font-title-md text-body-sm font-bold text-on-surface">Final Notice &amp; Instant Issuance Gateway</div>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">
                    Automated SMS binding link with zero underwriting delay. Immediate PDF policy dispatched to WhatsApp &amp; mParivahan.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Summary & Cost Breakdown Card */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm p-space-md space-y-space-sm border border-outline-variant/30">
            <div className="font-title-md text-body-sm font-bold text-on-surface flex items-center justify-between">
              <span>Locked Policy Cost Snapshot</span>
              <span className="font-label-sm text-[10px] text-secondary font-bold uppercase bg-secondary-container/40 px-2 py-0.5 rounded">
                Special Broker Tariff
              </span>
            </div>
            <div className="space-y-1.5 font-body-sm text-body-sm">
              <div className="flex items-center justify-between text-on-surface-variant">
                <span>Basic Own Damage (OD) Premium</span>
                <span className="font-label-numeric text-on-surface">₹7,850</span>
              </div>
              <div className="flex items-center justify-between text-on-surface-variant">
                <span>Third Party Liability (IRDAI Mandated)</span>
                <span className="font-label-numeric text-on-surface">₹3,416</span>
              </div>
              <div className="flex items-center justify-between text-on-surface-variant">
                <span>Zero Depreciation + RSA Add-on Rider</span>
                <span className="font-label-numeric text-on-surface">₹2,850</span>
              </div>
              <div className="flex items-center justify-between text-secondary font-semibold">
                <span>No-Claim Bonus (50% Deduction)</span>
                <span className="font-label-numeric font-bold">- ₹3,925</span>
              </div>
              <div className="flex items-center justify-between text-on-surface-variant pt-1">
                <span>Net GST (18%)</span>
                <span className="font-label-numeric text-on-surface">₹2,260</span>
              </div>
            </div>
            <div className="pt-2 flex items-center justify-between border-t border-surface-container-high/40">
              <div>
                <div className="font-label-sm text-[10px] text-on-surface-variant uppercase tracking-wider">Total Payable</div>
                <div className="font-headline-sm text-headline-sm font-bold text-on-surface font-label-numeric">₹14,820</div>
              </div>
              <div className="text-right">
                <div className="font-label-sm text-[10px] text-secondary font-bold">TOTAL SAVINGS</div>
                <div className="font-label-numeric text-body-md font-bold text-secondary">₹4,310 (22%)</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
