import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import "./src/index.css";
import { AppleSpotlight } from "./src/components/ui/apple-spotlight.jsx";
import { searchPlans } from "./src/lib/searchPlans.js";
import { Search, ShieldCheck, Wrench, Shield, TrendingDown } from "lucide-react";

// =========================================================================
// DEMO DATA (From user HTML specification)
// =========================================================================
const inr = (n) => "₹" + Number(n).toLocaleString("en-IN");

const INITIAL_CAR = {
  plate: "WB 02 AB 1234",
  make: "Maruti Suzuki Swift VXi",
  year: "2022",
  insurer: "Sample Insurer A",
  days: 23,
  ncb: 35,
  idv: 410000,
  type: "Private car",
};

const ADDONS = [
  { id: "zd", label: "Zero depreciation", price: 1150 },
  { id: "rsa", label: "Roadside help 24x7", price: 450 },
  { id: "eng", label: "Engine protect", price: 890 },
  { id: "ncb", label: "Keep my 35% bonus", price: 580 },
];

const PLANS = [
  {
    id: "A",
    badge: "Best match",
    cls: "ok",
    insurer: "Eastern General",
    name: "Comprehensive Shield Plus",
    premium: 8420,
    idv: 410000,
    csr: 96.4,
    garages: 38,
    ded: 1000,
    inc: ["zd", "rsa"],
    hl: ["Zero depreciation included", "24x7 roadside help", "38 cashless garages in Kolkata"],
    covered: [
      "Accidents, fire, theft and natural calamities",
      "Third-party liability plus ₹15L personal accident cover",
      "Zero depreciation and 24x7 roadside help included",
    ],
    notCovered: [
      "Normal wear and tear, breakdowns",
      "Driving without a valid licence or under influence",
      "Engine damage from water unless Engine protect is added",
    ],
    why: "Ranked first on your needs: full parts cover and the most garages, within 5% of the lowest price.",
  },
  {
    id: "B",
    badge: "Lowest price",
    cls: "",
    insurer: "Metro Assure",
    name: "Standard Smart Cover",
    premium: 7980,
    idv: 385000,
    csr: 93.8,
    garages: 21,
    ded: 2000,
    inc: [],
    hl: ["Lowest yearly price", "Standard accident and theft cover", "21 cashless garages in Kolkata"],
    covered: [
      "Accidents, theft, fire and floods",
      "Third-party liability plus ₹15L personal accident cover",
      "Lower premium with standard part depreciation",
    ],
    notCovered: [
      "20% to 50% deducted on replaced parts at claim time",
      "Roadside towing unless added",
      "Driving without valid registration or licence",
    ],
    why: "Cheapest comprehensive option. Suits a vehicle older than 5 years.",
  },
  {
    id: "C",
    badge: "Sponsored",
    cls: "warn",
    sponsored: true,
    insurer: "Bengal Crown Motor",
    name: "Zero-Dep Elite Care",
    premium: 8890,
    idv: 420000,
    csr: 95.2,
    garages: 30,
    ded: 500,
    inc: ["zd", "rsa"],
    hl: ["Only ₹500 to pay at a claim", "Doorstep pickup and drop", "Highest insured value"],
    covered: [
      "Higher insured value with zero depreciation and consumables",
      "Free doorstep pickup and drop at 30 workshops",
      "Low ₹500 deductible",
    ],
    notCovered: [
      "Tyre or alloy damage unless from an insured accident",
      "Commercial use of a private vehicle",
      "Dents that existed before the policy inspection",
    ],
    why: "Paid placement. Shown separately and never counted in the Best match ranking.",
  },
  {
    id: "D",
    badge: "Legal minimum",
    cls: "",
    insurer: "National Liability Pool",
    name: "Third-Party Only",
    premium: 3416,
    idv: 0,
    csr: 91.8,
    garages: 0,
    ded: 1000,
    inc: [],
    noAdd: true,
    hl: ["Meets the legal requirement", "Covers damage you cause to others", "Does not cover your own car"],
    covered: [
      "Injury or death of third parties",
      "Third-party property damage up to ₹7.5L",
      "₹15L owner-driver personal accident cover",
    ],
    notCovered: [
      "Any damage, theft, fire or flood to your own vehicle",
      "Cashless garage repairs",
      "No Claim Bonus on a standalone third-party policy",
    ],
    why: "Cheapest on paper, but your own car is not protected.",
  },
];

const INITIAL_LEADS = [
  { id: "LD-1042", veh: "WB 06 CD 4421", mob: "98XXXXXX21", type: "Car", kind: "Request a callback", days: 12, status: "Called" },
  { id: "LD-1041", veh: "WB 74 AK 0098", mob: "90XXXXXX45", type: "Bike", kind: "Get partner quotation", days: 31, status: "New" },
  { id: "LD-1040", veh: "WB 02 AM 7713", mob: "89XXXXXX07", type: "Car", kind: "Renew with current insurer", days: -4, status: "Quote sent" },
];

const INITIAL_GARAGE = [
  { plate: "WB 02 AB 1234", nick: "Kolkata Daily Commuter", make: "Swift VXi", insurer: "Sample Insurer A", days: 23, quotes: 2 },
  { plate: "WB 06 CD 4421", nick: "Salt Lake Family Sedan", make: "Creta SX", insurer: "Sample Insurer B", days: 12, quotes: 0 },
];

const TIMELINE_STAGES = [
  [45, "Know your cover"],
  [30, "Compare prices"],
  [15, "Time to renew"],
  [7, "Last call"],
  [0, "Expiry day"],
];

const SVG_ICONS = {
  renew: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12a9 9 0 1 1-3-6.7L21 8" />
      <path d="M21 3v5h-5" />
    </svg>
  ),
  up: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 16V4M6 10l6-6 6 6M4 20h16" />
    </svg>
  ),
  bell: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 8a6 6 0 1 1 12 0c0 7 3 8 3 8H3s3-1 3-8M10 20a2 2 0 0 0 4 0" />
    </svg>
  ),
  call: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    </svg>
  ),
};

// =========================================================================
// MAIN COMPONENT
// =========================================================================
export default function App() {
  const [car, setCar] = useState(INITIAL_CAR);
  const [view, setView] = useState("overview"); // overview | plans | compare | otp | garage | admin
  const [addons, setAddons] = useState(new Set());
  const [cmp, setCmp] = useState([]);
  const [showDiff, setShowDiff] = useState(false);
  const [reminders, setReminders] = useState({ 45: true, 30: true, 15: true, 7: true, 0: true });
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [garage, setGarage] = useState(INITIAL_GARAGE);
  const [toastMsg, setToastMsg] = useState("");
  const [sheet, setSheet] = useState(null);

  // Dedicated Space for OTP Verification Page
  const [isVerified, setIsVerified] = useState(false);
  const [verificationSuccess, setVerificationSuccess] = useState(false);
  const [mobileNumber, setMobileNumber] = useState("9830144829");
  const [otpDigits, setOtpDigits] = useState(["", "", "", "", "", ""]);
  const [otpCountdown, setOtpCountdown] = useState(28);
  const [consentMandatory, setConsentMandatory] = useState(true);
  const [consentReminders, setConsentReminders] = useState(true);
  const [consentWhatsapp, setConsentWhatsapp] = useState(true);
  const [isSubmittingOtp, setIsSubmittingOtp] = useState(false);
  const otpInputRefs = useRef([]);

  // New OTP Redesign States
  const [step, setStep] = useState(1);
  const [otpError, setOtpError] = useState("");
  const [wrongShake, setWrongShake] = useState(false);
  const [consentExpanded, setConsentExpanded] = useState(false);
  const [activeSlot, setActiveSlot] = useState(0);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [currentTime, setCurrentTime] = useState(() => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const d = new Date();
      setCurrentTime(d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }));
    }, 30000);
    return () => clearInterval(timer);
  }, []);

  // Spotlight search states
  const [spotOpen, setSpotOpen] = useState(false);
  const [spotQuery, setSpotQuery] = useState("");
  const [highlightId, setHighlightId] = useState(null);

  // Close and reset spotlight when view changes away from plans or if not verified
  useEffect(() => {
    if (view !== "plans" || !isVerified) {
      setSpotOpen(false);
      setSpotQuery("");
    }
  }, [view, isVerified]);

  // Ctrl/Cmd+K listener: active ONLY on the Plans view (view === "plans" && isVerified)
  useEffect(() => {
    if (view !== "plans" || !isVerified) return;

    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setSpotOpen((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [view, isVerified]);

  // Toast notifier
  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2800);
  };

  // Sync with Plate Scanner custom event from index.html
  useEffect(() => {
    const handleIntroOpen = (e) => {
      if (e.detail?.plate) {
        const raw = e.detail.plate.toUpperCase().trim();
        const formatted = raw.length >= 8 ? raw.replace(/^([A-Z]{2})([0-9]{2})([A-Z]{1,2})([0-9]{4})$/, "$1 $2 $3 $4") : raw;
        setCar((prev) => ({
          ...prev,
          plate: formatted || raw,
        }));
      }
      if (e.detail?.mobile) {
        setMobileNumber(e.detail.mobile.replace(/\D/g, ""));
      }
      // Leave space for OTP page: automatically surface OTP Gate when completing intro
      setView("otp");
    };

    window.addEventListener("insuredrive:open", handleIntroOpen);
    if (typeof window !== "undefined" && window.__INITIAL_PLATE__) {
      setCar((prev) => ({ ...prev, plate: window.__INITIAL_PLATE__ }));
    }
    return () => window.removeEventListener("insuredrive:open", handleIntroOpen);
  }, []);

  // OTP Countdown timer
  useEffect(() => {
    if (otpCountdown > 0) {
      const timer = setTimeout(() => setOtpCountdown((c) => c - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [otpCountdown]);

  const hasAddon = (plan, addonId) => {
    return plan.inc.includes(addonId) || (!plan.noAdd && addons.has(addonId));
  };

  const getPrice = (plan) => {
    if (plan.noAdd) return plan.premium;
    const addedSum = ADDONS.filter((a) => addons.has(a.id) && !plan.inc.includes(a.id)).reduce(
      (sum, a) => sum + a.price,
      0
    );
    return plan.premium + addedSum;
  };

  const toggleAddon = (id) => {
    setAddons((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleCmp = (id) => {
    setCmp((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      if (prev.length >= 3) {
        showToast("You can compare up to 3 plans");
        return prev;
      }
      return [...prev, id];
    });
  };

  // Spotlight shortcuts for empty query
  const spotShortcuts = [
    { label: "Lowest price", icon: <TrendingDown style={{ width: 13, height: 13 }} /> },
    { label: "Zero depreciation", icon: <ShieldCheck style={{ width: 13, height: 13 }} /> },
    { label: "Roadside", icon: <Wrench style={{ width: 13, height: 13 }} /> },
    { label: "Third party", icon: <Shield style={{ width: 13, height: 13 }} /> },
  ];

  // Spotlight onSelect: close spotlight, smooth-scroll to plan card, flash ring for 1.8s
  const handleSpotSelect = (res) => {
    setSpotOpen(false);
    const targetPlanId = res.id;
    if (!targetPlanId) return;

    // Small delay to allow modal exit animation / layout sync
    setTimeout(() => {
      const el = document.getElementById(`plan-${targetPlanId}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        setHighlightId(targetPlanId);
        setTimeout(() => {
          setHighlightId((curr) => (curr === targetPlanId ? null : curr));
        }, 1800);
      }
    }, 100);
  };

  const navigateTo = (newView) => {
    setView(newView);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // OTP Handling functions
  const handleDigitChange = (index, value) => {
    const val = value.slice(-1).replace(/\D/g, "");
    const next = [...otpDigits];
    next[index] = val;
    setOtpDigits(next);
    if (otpError) setOtpError("");
    if (val && index < 5) {
      otpInputRefs.current[index + 1]?.focus();
      setActiveSlot(index + 1);
    } else if (val && index === 5) {
      setActiveSlot(5);
    }
  };

  const handleDigitKeyDown = (index, e) => {
    if (e.key === "Backspace") {
      if (!otpDigits[index] && index > 0) {
        otpInputRefs.current[index - 1]?.focus();
        setActiveSlot(index - 1);
      } else {
        const next = [...otpDigits];
        next[index] = "";
        setOtpDigits(next);
        if (otpError) setOtpError("");
      }
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted) {
      const next = ["", "", "", "", "", ""];
      for (let i = 0; i < pasted.length; i++) next[i] = pasted[i];
      setOtpDigits(next);
      if (otpError) setOtpError("");
      const targetIndex = Math.min(pasted.length, 5);
      otpInputRefs.current[targetIndex]?.focus();
      setActiveSlot(targetIndex);
    }
  };

  const fillDemoOtp = () => {
    setOtpDigits(["1", "2", "3", "4", "5", "6"]);
    if (otpError) setOtpError("");
    setActiveSlot(5);
    otpInputRefs.current[5]?.focus();
    showToast("Demo OTP (123456) filled");
  };

  const handleVerifyOtp = () => {
    const code = otpDigits.join("");
    if (code.length < 6) {
      setOtpError("Please enter all 6 digits of the verification code");
      setWrongShake(true);
      setTimeout(() => setWrongShake(false), 400);
      return;
    }
    if (!consentMandatory) {
      setOtpError("Mandatory underwriting processing consent is required");
      return;
    }
    if (code !== "123456") {
      setOtpError("Invalid code. Please enter demo code 123456.");
      setWrongShake(true);
      setTimeout(() => setWrongShake(false), 400);
      return;
    }

    setOtpError("");
    setIsSubmittingOtp(true);
    setTimeout(() => {
      setIsSubmittingOtp(false);
      setVerificationSuccess(true);
      setTimeout(() => {
        setIsVerified(true);
        setView("overview");
        showToast(`✓ Phone & vehicle verified for ${car.plate}! Access granted.`);
      }, 700);
    }, 350);
  };

  // Modals & Sheets
  const openBuyReview = (planId) => setSheet({ type: "buyReview", planId, agreed: false });
  const openPayment = (planId) => setSheet({ type: "payment", planId, payMethod: "UPI" });
  const openDone = (planId) => setSheet({ type: "done", planId, smsRemind: true, waRemind: true });
  const openCallback = () =>
    setSheet({
      type: "callback",
      name: "",
      lang: "Bengali",
      slot: "Afternoon, 12pm to 4pm",
      agreed: false,
    });
  const openAddVehicle = () => setSheet({ type: "addVehicle", regNo: "", nick: "" });
  const closeSheet = () => setSheet(null);

  // Price calculations
  const comprehensivePrices = PLANS.filter((p) => p.id !== "D").map((p) => getPrice(p));
  const loPrice = Math.min(...comprehensivePrices);
  const hiPrice = Math.max(...comprehensivePrices);
  const getDotPos = (priceVal) => 6 + ((priceVal - loPrice) / (hiPrice - loPrice || 1)) * 88;
  const urgencyRingOffset = 377 * (1 - Math.max(0, car.days) / 45);

  return (
    <div id="site" className="min-h-screen relative overflow-x-hidden">
      {/* Background Animated Blobs */}
      <div className="blobs" aria-hidden="true">
        <i />
        <i />
        <i />
      </div>

      {/* Background Driving Toy Cars */}
      <div className="cars" aria-hidden="true">
        <svg width="0" height="0" style={{ position: "absolute" }}>
          <defs>
            <symbol id="toycar" viewBox="0 0 80 40">
              <path
                d="M6 28v-6c0-2 1-3 3-4l9-2 8-9c1-1 3-2 5-2h16c2 0 4 1 5 2l9 9 8 2c2 1 3 2 3 4v6c0 1-1 2-2 2H8c-1 0-2-1-2-2z"
                fill="var(--c,currentColor)"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinejoin="round"
              />
              <path d="M28 10h10v9H22zM42 10h8l8 9H42z" fill="var(--bg)" opacity=".8" />
              <circle cx="23" cy="30" r="7" fill="currentColor" />
              <circle cx="23" cy="30" r="2.5" fill="var(--bg)" />
              <circle cx="58" cy="30" r="7" fill="currentColor" />
              <circle cx="58" cy="30" r="2.5" fill="var(--bg)" />
            </symbol>
          </defs>
        </svg>
        <svg className="car" style={{ top: "12%", "--w": "56px", "--t": "52s", "--d": "0s", "--c": "var(--t-blob-1, #c79a6b)" }} viewBox="0 0 80 40">
          <use href="#toycar" />
        </svg>
        <svg className="car rev" style={{ top: "27%", "--w": "72px", "--t": "66s", "--d": "-18s", "--c": "var(--t-blob-2, #a67c52)" }} viewBox="0 0 80 40">
          <use href="#toycar" />
        </svg>
        <svg className="car" style={{ top: "44%", "--w": "48px", "--t": "48s", "--d": "-9s", "--c": "var(--t-blob-3, #d9b88f)" }} viewBox="0 0 80 40">
          <use href="#toycar" />
        </svg>
        <svg className="car rev" style={{ top: "60%", "--w": "80px", "--t": "72s", "--d": "-30s", "--c": "var(--t-blob-1, #c79a6b)" }} viewBox="0 0 80 40">
          <use href="#toycar" />
        </svg>
        <svg className="car" style={{ top: "76%", "--w": "60px", "--t": "58s", "--d": "-22s", "--c": "var(--t-blob-2, #a67c52)" }} viewBox="0 0 80 40">
          <use href="#toycar" />
        </svg>
        <svg className="car rev" style={{ top: "90%", "--w": "52px", "--t": "50s", "--d": "-5s", "--c": "var(--t-blob-3, #d9b88f)" }} viewBox="0 0 80 40">
          <use href="#toycar" />
        </svg>
      </div>

      <div className="app">
        {/* Top Header Navigation */}
        {/* Top Header Navigation */}
        <header className="top">
          <div className="glass" style={{ justifyContent: "space-between" }}>
            <div className="brand" onClick={() => isVerified && navigateTo("overview")}>
              <span className="logo">◈</span>
              <span className="nm2">InsureDrive</span>
            </div>

            {isVerified ? (
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <nav className="tabs" aria-label="Main">
                  <button
                    type="button"
                    className={`tab ${view === "overview" ? "on" : ""}`}
                    onClick={() => navigateTo("overview")}
                  >
                    Overview
                  </button>
                  <button
                    type="button"
                    className={`tab ${view === "plans" || view === "compare" ? "on" : ""}`}
                    onClick={() => navigateTo("plans")}
                  >
                    Plans
                  </button>
                  <button
                    type="button"
                    className={`tab ${view === "garage" ? "on" : ""}`}
                    onClick={() => navigateTo("garage")}
                  >
                    My Garage
                  </button>
                  <button
                    type="button"
                    className={`tab ${view === "admin" ? "on" : ""}`}
                    onClick={() => navigateTo("admin")}
                  >
                    Admin ({leads.length})
                  </button>
                </nav>
                <div className="hidden md:flex items-center gap-2 pl-2 border-l border-[var(--line)]">
                  <span className="plate" style={{ fontSize: 13, padding: "2px 7px" }}>
                    <small style={{ fontSize: 8, padding: "1px 3px" }}>IND</small>
                    {car.plate}
                  </span>
                  <span className="pill ok" style={{ fontSize: 11, padding: "2px 8px" }}>
                    Verified ✓
                  </span>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 600, color: "var(--mut)" }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" style={{ color: "var(--ok)" }}>
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                  <span>Verification Gateway</span>
                </div>
                <span className="plate" style={{ fontSize: 14, padding: "2px 8px 2px 5px" }}>
                  <small style={{ fontSize: 9, padding: "1px 3px" }}>IND</small>
                  {car.plate}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* MAIN VIEW */}
        <main id="main">
          {!isVerified ? (
            <div className="otp2-wrapper">
              <div className="otp2-bezel">
                <div className="otp2-screen">
                  {/* Infotainment Status Bar with Live Clock and Signal / Lock */}
                  <div className="otp2-statusbar">
                    <div className="otp2-clock">
                      <span>{currentTime}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, opacity: 0.85 }}>
                      <span style={{ fontSize: 10 }}>INFOTAINMENT CONNECT</span>
                      <span style={{ opacity: 0.4 }}>·</span>
                      <span style={{ fontSize: 10 }}>VAHAN V3</span>
                    </div>
                    <div className="otp2-status-right">
                      {/* Cellular signal */}
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-label="Signal 4G LTE">
                        <path d="M2 20h.01" />
                        <path d="M7 20v-4" />
                        <path d="M12 20v-8" />
                        <path d="M17 20V4" />
                      </svg>
                      {/* Secure lock */}
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-label="TLS Encrypted">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                  </div>

                  {/* Three Step Dots Indicator */}
                  <div className="otp2-stepper" role="tablist" aria-label="Verification Steps">
                    <button
                      type="button"
                      className={`otp2-step-pill ${step === 1 ? "active" : step > 1 ? "done" : ""}`}
                      onClick={() => setStep(1)}
                      aria-current={step === 1 ? "step" : undefined}
                    >
                      <span>{step > 1 ? "✓" : "1"}</span>
                      <span>Confirm</span>
                    </button>
                    <span style={{ color: "var(--mut)", opacity: 0.4, fontSize: 11 }}>›</span>
                    <button
                      type="button"
                      className={`otp2-step-pill ${step === 2 ? "active" : verificationSuccess ? "done" : ""}`}
                      onClick={() => setStep(2)}
                      aria-current={step === 2 ? "step" : undefined}
                    >
                      <span>{verificationSuccess ? "✓" : "2"}</span>
                      <span>Code</span>
                    </button>
                    <span style={{ color: "var(--mut)", opacity: 0.4, fontSize: 11 }}>›</span>
                    <button
                      type="button"
                      className={`otp2-step-pill ${step === 3 || verificationSuccess ? (verificationSuccess ? "done" : "active") : ""}`}
                      onClick={() => setStep(3)}
                      aria-current={step === 3 ? "step" : undefined}
                    >
                      <span>{verificationSuccess ? "✓" : "3"}</span>
                      <span>Consent</span>
                    </button>
                  </div>

                  {/* Body Content */}
                  <div className="otp2-body">
                    {/* STEP 1: CONFIRM */}
                    {step === 1 && (
                      <>
                        <div className="otp2-header">
                          <h2>Confirm Vehicle &amp; Mobile</h2>
                          <p>
                            Statutory identity gateway under MoRTH VAHAN &amp; DPDP Act 2023. Verify your mobile number to unlock NCB records and instant policy quotes.
                          </p>
                        </div>

                        {/* Vehicle Plate Strip & Make */}
                        <div className="otp2-vehicle-box">
                          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                            <div className="otp2-mini-plate">
                              <span className="otp2-mini-ind">IND</span>
                              <span className="otp2-mini-chars">{car.plate}</span>
                            </div>
                            <div>
                              <div style={{ fontWeight: 700, fontSize: 15, color: "var(--ink)" }}>
                                {car.make} ({car.year})
                              </div>
                              <div style={{ fontSize: 12.5, color: "var(--mut)", marginTop: 2 }}>
                                Insurer: <b style={{ color: "var(--ink)" }}>{car.insurer}</b> · Regional Transport Office (RTO)
                              </div>
                            </div>
                          </div>
                          <div>
                            <span className="pill warn" style={{ fontSize: 11.5, fontWeight: 700 }}>
                              Renewal in {car.days} days
                            </span>
                          </div>
                        </div>

                        {/* Mobile Number with Inline Edit Field */}
                        <div className="otp2-phone-box">
                          <div className="otp2-phone-row">
                            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>
                              Registered Mobile Number
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsEditingPhone(!isEditingPhone)}
                              style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: "var(--ink)",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                textDecoration: "underline",
                                padding: 0,
                              }}
                            >
                              {isEditingPhone ? "Save Number" : "Change Number"}
                            </button>
                          </div>

                          <div className="otp2-phone-input-wrap">
                            <span className="otp2-phone-prefix">+91</span>
                            <input
                              type="tel"
                              maxLength={10}
                              value={mobileNumber}
                              onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, "").slice(0, 10))}
                              className="otp2-phone-input"
                              readOnly={!isEditingPhone}
                              placeholder="98XXXXXXXX"
                              aria-label="Registered Mobile Number"
                            />
                            <div style={{ paddingRight: 12, display: "flex", alignItems: "center" }}>
                              <span style={{ fontSize: 11, fontWeight: 700, color: "var(--t-ok-text, #5a3d2b)" }}>
                                VAHAN Linked ✓
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Step 1 Action */}
                        <button
                          type="button"
                          className="otp2-verify-btn otp2-pulse-ring"
                          onClick={() => {
                            setStep(2);
                            showToast(`OTP dispatched to +91 ${mobileNumber}`);
                          }}
                        >
                          <span>Send OTP to Mobile →</span>
                        </button>
                      </>
                    )}

                    {/* STEP 2: CODE */}
                    {step === 2 && (
                      <>
                        <div className="otp2-header">
                          <h2>Enter Verification OTP</h2>
                          <p>
                            Enter the 6-digit code sent to <b style={{ color: "var(--ink)" }}>+91 {mobileNumber}</b>.{" "}
                            <button
                              type="button"
                              onClick={() => setStep(1)}
                              style={{
                                color: "var(--ink)",
                                background: "none",
                                border: "none",
                                cursor: "pointer",
                                textDecoration: "underline",
                                fontSize: "inherit",
                                padding: 0,
                                fontWeight: 600,
                              }}
                            >
                              Edit number
                            </button>
                          </p>
                        </div>

                        {/* Plate-Style OTP Strip */}
                        <div className="otp2-plate-container">
                          <div
                            className={`otp2-plate ${wrongShake ? "otp2-shake" : ""}`}
                            onPaste={handleOtpPaste}
                            onClick={() => {
                              const firstEmpty = otpDigits.findIndex((d) => !d);
                              const target = firstEmpty === -1 ? 5 : firstEmpty;
                              otpInputRefs.current[target]?.focus();
                              setActiveSlot(target);
                            }}
                          >
                            {/* Glint Overlay */}
                            <div className={`otp2-glint ${verificationSuccess ? "otp2-glint-active" : ""}`} />

                            {/* Left HSRP Stamp */}
                            <div className="otp2-hsrp">
                              <div className="otp2-chakra" />
                              <span className="otp2-hsrp-txt">IND</span>
                            </div>

                            {/* 6 Digit Slots */}
                            <div className="otp2-digits">
                              {otpDigits.map((digit, i) => (
                                <div
                                  key={i}
                                  className="otp2-slot"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    otpInputRefs.current[i]?.focus();
                                    setActiveSlot(i);
                                  }}
                                >
                                  {digit ? (
                                    <span
                                      className={`otp2-glyph ${wrongShake ? "otp2-glyph-bad" : ""} ${
                                        verificationSuccess ? "otp2-glyph-ok" : ""
                                      }`}
                                    >
                                      {digit}
                                    </span>
                                  ) : activeSlot === i ? (
                                    <span className="otp2-caret" />
                                  ) : (
                                    <span className="otp2-dash">–</span>
                                  )}

                                  {/* Accessible real input overlay */}
                                  <input
                                    ref={(el) => (otpInputRefs.current[i] = el)}
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={1}
                                    autoComplete="one-time-code"
                                    value={digit}
                                    aria-label={`OTP Digit ${i + 1}`}
                                    onChange={(e) => handleDigitChange(i, e.target.value)}
                                    onKeyDown={(e) => handleDigitKeyDown(i, e)}
                                    onFocus={() => setActiveSlot(i)}
                                    className="otp2-native-input"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Error Feedback Under Plate */}
                          {otpError && (
                            <div className="otp2-err" role="alert">
                              {otpError}
                            </div>
                          )}
                        </div>

                        {/* Action Bar: Resend SVG Ring & Demo Autofill */}
                        <div className="otp2-action-bar">
                          <div className="otp2-resend-wrap">
                            <svg className="otp2-ring-svg" viewBox="0 0 36 36">
                              <path
                                className="otp2-ring-bg"
                                strokeWidth="3"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                              <path
                                className="otp2-ring-fill"
                                strokeWidth="3"
                                strokeDasharray="100"
                                strokeDashoffset={100 * (1 - Math.max(0, otpCountdown) / 30)}
                                strokeLinecap="round"
                                fill="none"
                                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                              />
                            </svg>
                            {otpCountdown > 0 ? (
                              <span>
                                Resend in <b style={{ color: "var(--ink)", fontFamily: "var(--mono)" }}>{otpCountdown}s</b>
                              </span>
                            ) : (
                              <button
                                type="button"
                                className="otp2-resend-btn"
                                onClick={() => {
                                  setOtpCountdown(30);
                                  showToast("New OTP dispatched via SMS");
                                }}
                              >
                                Resend OTP via SMS
                              </button>
                            )}
                          </div>

                          <button type="button" className="otp2-demo-btn" onClick={fillDemoOtp}>
                            ⚡ Demo Code: 123456 (Autofill)
                          </button>
                        </div>

                        {/* Collapsed Statutory Consent Architecture */}
                        <div className="otp2-consent-card">
                          <label className="otp2-consent-row">
                            <input
                              type="checkbox"
                              checked={consentMandatory}
                              onChange={(e) => setConsentMandatory(e.target.checked)}
                            />
                            <span>
                              <b>Mandatory Underwriting Processing:</b> I authorize InsureDrive to query MoRTH VAHAN &amp; IIB records to verify policy expiry and calculate cashless renewal plans.{" "}
                              <span style={{ color: "var(--warn)", fontWeight: 700 }}>[Mandatory]</span>
                            </span>
                          </label>

                          <button
                            type="button"
                            className="otp2-expander-toggle"
                            onClick={() => setConsentExpanded(!consentExpanded)}
                          >
                            <span>
                              {consentExpanded
                                ? "▲ Hide optional statutory permissions"
                                : "▼ What you're agreeing to (2 optional permissions)"}
                            </span>
                          </button>

                          {consentExpanded && (
                            <div className="otp2-sub-consents">
                              <label className="otp2-consent-row">
                                <input
                                  type="checkbox"
                                  checked={consentReminders}
                                  onChange={(e) => setConsentReminders(e.target.checked)}
                                />
                                <span>
                                  <b>Expiry Reminders:</b> Send scheduled renewal alerts 45, 30, 15, and 7 days prior to expiry via SMS and email.
                                </span>
                              </label>

                              <label className="otp2-consent-row">
                                <input
                                  type="checkbox"
                                  checked={consentWhatsapp}
                                  onChange={(e) => setConsentWhatsapp(e.target.checked)}
                                />
                                <span>
                                  <b>WhatsApp Renewal Assistant:</b> Enable instant policy PDF dispatch and 24x7 roadside claim support on WhatsApp.
                                </span>
                              </label>
                            </div>
                          )}
                        </div>

                        {/* Verify Button with Amber Pulse Ring */}
                        <button
                          type="button"
                          disabled={
                            isSubmittingOtp ||
                            verificationSuccess ||
                            !consentMandatory ||
                            otpDigits.join("").length < 6
                          }
                          onClick={handleVerifyOtp}
                          className={`otp2-verify-btn ${
                            !isSubmittingOtp &&
                            !verificationSuccess &&
                            consentMandatory &&
                            otpDigits.join("").length === 6
                              ? "otp2-pulse-ring"
                              : ""
                          } ${verificationSuccess ? "otp2-btn-success" : ""}`}
                        >
                          {verificationSuccess ? (
                            <span>✓ Identity Verified! Access Granted</span>
                          ) : isSubmittingOtp ? (
                            <span>
                              <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block mr-2" />
                              Verifying credentials with VAHAN...
                            </span>
                          ) : (
                            <span>Verify OTP &amp; Enter InsureDrive →</span>
                          )}
                        </button>
                      </>
                    )}

                    {/* STEP 3: CONSENT REVIEW (Standalone) */}
                    {step === 3 && (
                      <>
                        <div className="otp2-header">
                          <h2>Statutory Consent Architecture</h2>
                          <p>
                            Digital Personal Data Protection Act 2023 &amp; MoRTH Compliance review for {car.plate}.
                          </p>
                        </div>

                        <div className="otp2-consent-card" style={{ gap: 14 }}>
                          <label className="otp2-consent-row">
                            <input
                              type="checkbox"
                              checked={consentMandatory}
                              onChange={(e) => setConsentMandatory(e.target.checked)}
                            />
                            <span>
                              <b>Mandatory Underwriting Processing:</b> I authorize InsureDrive to query MoRTH VAHAN and IIB records to retrieve policy expiry details and calculate quotes.{" "}
                              <span style={{ color: "var(--warn)", fontWeight: 700 }}>[Mandatory]</span>
                            </span>
                          </label>

                          <label className="otp2-consent-row">
                            <input
                              type="checkbox"
                              checked={consentReminders}
                              onChange={(e) => setConsentReminders(e.target.checked)}
                            />
                            <span>
                              <b>Expiry Reminders:</b> Send scheduled renewal alerts 45, 30, 15, and 7 days prior to expiry via SMS and email.
                            </span>
                          </label>

                          <label className="otp2-consent-row">
                            <input
                              type="checkbox"
                              checked={consentWhatsapp}
                              onChange={(e) => setConsentWhatsapp(e.target.checked)}
                            />
                            <span>
                              <b>WhatsApp Renewal Assistant:</b> Enable instant policy PDF dispatch and 24x7 roadside claim support on WhatsApp.
                            </span>
                          </label>
                        </div>

                        <div style={{ display: "flex", gap: 10 }}>
                          <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="btn ghost block"
                            style={{ flex: 1, height: 50, borderRadius: 12 }}
                          >
                            ← Back to OTP Code
                          </button>
                          <button
                            type="button"
                            disabled={!consentMandatory}
                            onClick={() => {
                              if (otpDigits.join("").length === 6) {
                                handleVerifyOtp();
                              } else {
                                setStep(2);
                                showToast("Enter the 6-digit OTP to complete verification");
                              }
                            }}
                            className={`otp2-verify-btn ${consentMandatory && otpDigits.join("").length === 6 ? "otp2-pulse-ring" : ""}`}
                            style={{ flex: 1, height: 50 }}
                          >
                            {otpDigits.join("").length === 6 ? "Verify & Proceed →" : "Enter Code (Step 2) →"}
                          </button>
                        </div>
                      </>
                    )}

                    {/* Trust Badges Footer */}
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: 10,
                        paddingTop: 10,
                        borderTop: "1px dashed var(--line)",
                        fontSize: 11,
                        color: "var(--mut)",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                          <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                        </svg>
                        <span>256-Bit TLS</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <ellipse cx="12" cy="5" rx="9" ry="3" />
                          <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
                          <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
                        </svg>
                        <span>MoRTH VAHAN Database Sync</span>
                      </div>
                      <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                        </svg>
                        <span>IRDAI Compliance</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* ================= OVERVIEW VIEW ================= */}
              {view === "overview" && (
                <div className="view on">
                  <div
                    className="glass mb-3 p-3 px-4 rounded-2xl flex items-center justify-between text-sm border border-[var(--t-ok-line)]"
                    style={{ marginTop: 12, marginBottom: 8, background: "rgba(176, 137, 104, 0.14)" }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#b08968]" style={{ boxShadow: "0 0 8px rgba(176, 137, 104, 0.5)" }} />
                      <span style={{ color: "var(--ink)" }}>
                        <b>MoRTH VAHAN &amp; Aadhaar Verified:</b> Vehicle records for <b>{car.plate}</b> ({car.make}) verified with full NCB protection.
                      </span>
                    </div>
                    <span className="pill ok" style={{ fontSize: 11.5, padding: "2px 8px" }}>
                      Active ✓
                    </span>
                  </div>

              <section className="glass hero">
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <span className="plate">
                      <small>IND</small>
                      {car.plate}
                    </span>
                    {isVerified && (
                      <span className="pill ok">
                        ✓ Phone &amp; Plate Verified
                      </span>
                    )}
                  </div>
                  <h1>
                    Your {car.make.split(" ").slice(-2).join(" ")} needs renewal in {car.days} days
                  </h1>
                  <p>
                    Renew now and keep your {car.ncb}% No Claim Bonus. We found 3 plans from {inr(loPrice)}.
                  </p>
                  <div className="row">
                    <button type="button" className="btn" onClick={() => navigateTo("plans")}>
                      See my plans
                    </button>
                    <button type="button" className="btn ghost" onClick={() => openBuyReview("A")}>
                      Renew with {car.insurer}
                    </button>
                  </div>
                  <div className="row" style={{ marginTop: 18 }}>
                    <span className="pill warn">Renewal due soon</span>
                    <span className="pill">Demo data</span>
                  </div>
                </div>

                <div className="ringbox" aria-label={`${car.days} days left of a 45 day renewal window`}>
                  <svg viewBox="0 0 140 140">
                    <defs>
                      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0" stopColor="#d99a4e" />
                        <stop offset="1" stopColor="#b9770e" />
                      </linearGradient>
                    </defs>
                    <circle cx="70" cy="70" r="60" fill="none" stroke="rgba(255,235,210,.14)" strokeWidth="10" />
                    <circle
                      className="ring"
                      style={{ "--off": urgencyRingOffset }}
                      cx="70"
                      cy="70"
                      r="60"
                      fill="none"
                      stroke="url(#g)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      transform="rotate(-90 70 70)"
                    />
                  </svg>
                  <div className="mid">
                    <div>
                      <b>{car.days}</b>
                      <br />
                      <span>days left</span>
                    </div>
                  </div>
                </div>
              </section>

              <section className="tiles">
                <div className="glass tile">
                  <span className="lbl">Quotes for your car</span>
                  <div className="big">
                    {inr(loPrice)} – {inr(hiPrice)}
                  </div>
                  <div className="range">
                    <div className="line" />
                    <div className="fill" style={{ left: `${getDotPos(loPrice)}%`, width: `${getDotPos(hiPrice) - getDotPos(loPrice)}%` }} />
                    {PLANS.filter((p) => p.id !== "D").map((p) => {
                      const pr = getPrice(p);
                      return (
                        <span
                          key={p.id}
                          className={`dot ${pr === loPrice ? "best" : ""}`}
                          style={{ left: `${getDotPos(pr)}%` }}
                        />
                      );
                    })}
                    <em style={{ left: `${getDotPos(loPrice)}%` }}>lowest</em>
                    <em style={{ left: `${getDotPos(hiPrice)}%` }}>highest</em>
                  </div>
                  <p className="mut" style={{ fontSize: 14 }}>
                    Spread of {inr(hiPrice - loPrice)} across 3 comprehensive plans.
                  </p>
                </div>

                <div className="glass tile">
                  <span className="lbl">Your current cover</span>
                  <div className="checks">
                    <div>
                      <span className="dotk y">✓</span>Own damage
                    </div>
                    <div>
                      <span className="dotk y">✓</span>Third party
                    </div>
                    <div>
                      <span className="dotk n">✕</span>Zero depreciation
                    </div>
                    <div>
                      <span className="dotk n">✕</span>Roadside help
                    </div>
                  </div>
                  <span className="pill warn" style={{ alignSelf: "flex-start" }}>
                    2 gaps to fix at renewal
                  </span>
                </div>

                <div className="glass tile">
                  <span className="lbl">Bonus and value</span>
                  <div className="big">
                    {car.ncb}% <span style={{ fontSize: 16, fontWeight: 500 }} className="mut">No Claim Bonus</span>
                  </div>
                  <p className="mut" style={{ fontSize: 14.5 }}>
                    Insured value {inr(car.idv)}. Renew on time and your bonus carries over.
                  </p>
                  <p className="mut" style={{ fontSize: 14.5, marginTop: "auto" }}>
                    Next reminder in 8 days
                  </p>
                </div>
              </section>

              <section className="acts">
                <button type="button" className="act" onClick={() => openBuyReview("A")}>
                  <span className="ic">{SVG_ICONS.renew}</span>
                  Renew now
                  <small>Same insurer, one tap</small>
                </button>
                <button type="button" className="act" onClick={() => navigateTo("plans")}>
                  <span className="ic">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M4 7h10M4 17h16M4 12h6" />
                    </svg>
                  </span>
                  Compare plans
                  <small>Pick any two or three</small>
                </button>
                <button type="button" className="act" onClick={() => showToast("Upload opens here in the live product")}>
                  <span className="ic">{SVG_ICONS.up}</span>
                  Upload policy
                  <small>Auto-fills your details</small>
                </button>
                <button type="button" className="act" onClick={openCallback}>
                  <span className="ic">{SVG_ICONS.call}</span>
                  Talk to an advisor
                  <small>Bengali or English</small>
                </button>
              </section>
            </div>
          )}

          {/* ================= PLANS VIEW ================= */}
          {view === "plans" && (
            <div className="view on">
              <div className="head">
                <div>
                  <h2>Plans for your {car.make}</h2>
                  <p className="mut">
                    Sorted by Best match. Zero depreciation is pre-selected because your car is 3 years old.
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <button
                    type="button"
                    className="btn ghost sm"
                    onClick={() => setSpotOpen(true)}
                    style={{ display: "inline-flex", alignItems: "center", gap: 6 }}
                  >
                    <Search className="size-3.5" style={{ width: 14, height: 14 }} />
                    <span>Search plans</span>
                    <kbd style={{ fontSize: "10.5px", padding: "1px 5px", background: "var(--line)", borderRadius: 4, fontFamily: "var(--mono)" }}>
                      Ctrl K
                    </kbd>
                  </button>
                  <span className="pill">3 comprehensive + 1 third party</span>
                </div>
              </div>

              <div className="chips" role="group" aria-label="Add-ons">
                {ADDONS.map((a) => {
                  const on = addons.has(a.id);
                  return (
                    <button
                      type="button"
                      key={a.id}
                      className={`chip ${on ? "on" : ""}`}
                      onClick={() => toggleAddon(a.id)}
                      aria-pressed={on}
                    >
                      {on ? "✓" : "+"} {a.label} <small>{inr(a.price)}</small>
                    </button>
                  );
                })}
              </div>

              <div className="plans">
                {PLANS.map((p) => {
                  const sel = cmp.includes(p.id);
                  return (
                    <article
                      key={p.id}
                      id={`plan-${p.id}`}
                      className={`glass plan ${p.id === "A" ? "best" : ""} ${highlightId === p.id ? "plan-flash" : ""}`}
                    >
                      <span className={`pill ${p.cls}`}>{p.badge}</span>
                      <div>
                        <div className="who">{p.insurer}</div>
                        <h3>{p.name}</h3>
                      </div>
                      <div className="price">
                        {inr(getPrice(p))}
                        <small> / year, taxes included</small>
                      </div>
                      <ul className="hl">
                        {p.hl.map((h, idx) => (
                          <li key={idx}>
                            {p.id === "D" && idx === 2 ? <span className="dotk n">✕</span> : <span className="dotk y">✓</span>}
                            {h}
                          </li>
                        ))}
                      </ul>
                      {p.sponsored && <p className="spon">Paid placement. Not part of the Best match ranking.</p>}
                      <button type="button" className="btn block" onClick={() => openBuyReview(p.id)}>
                        Buy this plan
                      </button>
                      <label className="cmpbox">
                        <input
                          type="checkbox"
                          checked={sel}
                          onChange={() => toggleCmp(p.id)}
                        />
                        Add to compare
                      </label>
                    </article>
                  );
                })}
              </div>
            </div>
          )}

          {/* ================= COMPARE VIEW ================= */}
          {view === "compare" && (
            <div className="view on">
              <div className="head">
                <div>
                  <button type="button" className="btn ghost sm" onClick={() => navigateTo("plans")}>
                    ← Back to plans
                  </button>
                  <h2 style={{ marginTop: 18 }}>Side by side</h2>
                  <p className="mut">Only the things that set these plans apart.</p>
                </div>
                <label className="sw">
                  <input
                    type="checkbox"
                    checked={showDiff}
                    onChange={(e) => setShowDiff(e.target.checked)}
                  />
                  Show differences only
                </label>
              </div>

              <div className="glass cmpwrap">
                <table className="cmp">
                  <thead>
                    <tr>
                      <th />
                      {cmp.map((cid) => {
                        const p = PLANS.find((x) => x.id === cid);
                        if (!p) return null;
                        return (
                          <th key={p.id}>
                            <span className={`pill ${p.cls}`}>{p.badge}</span>
                            <div style={{ fontFamily: "var(--disp)", fontSize: 20, fontWeight: 600, margin: "10px 0 2px" }}>
                              {p.insurer}
                            </div>
                            <div className="mut" style={{ fontSize: 14, fontWeight: 400 }}>
                              {p.name}
                            </div>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { k: "Yearly price", val: (p) => getPrice(p), fmt: inr, best: "min" },
                      { k: "Car insured for", val: (p) => p.idv, fmt: (v) => (v ? inr(v) : "Not applicable"), best: "max", skip0: true },
                      { k: "Claims settled", val: (p) => p.csr, fmt: (v) => v + "%", best: "max", bar: [85, 100] },
                      { k: "Cashless garages", val: (p) => p.garages, fmt: (v) => v || "None", best: "max", bar: [0, 40] },
                      { k: "You pay first at a claim", val: (p) => p.ded, fmt: inr, best: "min" },
                      { k: "Zero depreciation", val: (p) => (hasAddon(p, "zd") ? 1 : 0), fmt: (v) => (v ? "Included" : "Not included"), best: "max" },
                      { k: "Roadside help", val: (p) => (hasAddon(p, "rsa") ? 1 : 0), fmt: (v) => (v ? "Included" : "Not included"), best: "max" },
                    ]
                      .filter((rowDef) => {
                        if (!showDiff) return true;
                        const ps = cmp.map((id) => PLANS.find((x) => x.id === id)).filter(Boolean);
                        const vals = ps.map((p) => rowDef.val(p));
                        return new Set(vals).size > 1;
                      })
                      .map((rowDef) => {
                        const ps = cmp.map((id) => PLANS.find((x) => x.id === id)).filter(Boolean);
                        const vals = ps.map((p) => rowDef.val(p));
                        const pool = vals.filter((v) => !(rowDef.skip0 && v === 0));
                        const target = rowDef.best === "min" ? Math.min(...pool) : Math.max(...pool);
                        const diff = new Set(vals).size > 1;

                        return (
                          <tr key={rowDef.k}>
                            <th scope="row">{rowDef.k}</th>
                            {ps.map((p, idx) => {
                              const v = vals[idx];
                              const win = diff && v === target && !(rowDef.skip0 && v === 0) && (rowDef.best !== "max" || target > 0);
                              const bar = rowDef.bar ? (
                                <div className="bar">
                                  <i style={{ width: `${Math.max(4, Math.min(100, ((v - rowDef.bar[0]) / (rowDef.bar[1] - rowDef.bar[0])) * 100))}%` }} />
                                </div>
                              ) : null;
                              return (
                                <td key={p.id} className={win ? "win" : ""}>
                                  {rowDef.fmt(v)}
                                  {bar}
                                  {win && <span className="tag">Best here</span>}
                                </td>
                              );
                            })}
                          </tr>
                        );
                      })}

                    <tr>
                      <th scope="row" />
                      {cmp.map((cid) => {
                        const p = PLANS.find((x) => x.id === cid);
                        if (!p) return null;
                        return (
                          <td key={p.id} style={{ borderBottom: 0 }}>
                            <button type="button" className="btn block" onClick={() => openBuyReview(p.id)}>
                              Buy · {inr(getPrice(p))}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          )}



          {/* ================= MY GARAGE VIEW ================= */}
          {view === "garage" && (
            <div className="view on">
              <div className="head">
                <div>
                  <h2>My Garage</h2>
                  <p className="mut">Every vehicle and its renewal date in one place.</p>
                </div>
              </div>

              <div className="garage">
                {garage.map((g) => (
                  <article key={g.plate} className="glass gcar">
                    <div className="top2">
                      <div>
                        <span className="plate">
                          <small>IND</small>
                          {g.plate}
                        </span>
                        <div className="nm" style={{ marginTop: 12 }}>
                          {g.nick}
                        </div>
                        <div className="mut" style={{ fontSize: 14 }}>
                          {g.make} · {g.insurer}
                        </div>
                      </div>
                      <span className={`pill ${g.days <= 15 ? "bad" : "warn"}`}>
                        {g.days} days left
                      </span>
                    </div>

                    <div className="meter" aria-hidden="true">
                      <i style={{ width: `${Math.max(6, 100 - (g.days / 45) * 100)}%` }} />
                    </div>

                    <div className="chips">
                      <button
                        type="button"
                        className="btn sm"
                        onClick={() => {
                          setCar({
                            plate: g.plate,
                            make: g.make,
                            year: "2022",
                            insurer: g.insurer,
                            days: g.days,
                            ncb: 35,
                            idv: 410000,
                            type: "Private car",
                          });
                          navigateTo("plans");
                        }}
                      >
                        Renew
                      </button>
                      <button
                        type="button"
                        className="btn ghost sm"
                        onClick={() => {
                          setCar({
                            plate: g.plate,
                            make: g.make,
                            year: "2022",
                            insurer: g.insurer,
                            days: g.days,
                            ncb: 35,
                            idv: 410000,
                            type: "Private car",
                          });
                          navigateTo("overview");
                        }}
                      >
                        Open dashboard
                      </button>
                    </div>

                    {g.quotes > 0 && (
                      <span className="mut" style={{ fontSize: 14 }}>
                        {g.quotes} saved quotes
                      </span>
                    )}
                  </article>
                ))}

                <button type="button" className="add" onClick={openAddVehicle}>
                  <b style={{ fontSize: 28, fontWeight: 400 }}>+</b>
                  Add a vehicle
                </button>
              </div>

              <section className="glass" style={{ padding: 26, marginTop: 20 }}>
                <h3>Reminders</h3>
                <p className="mut" style={{ fontSize: 14.5, marginTop: 4 }}>
                  We message you before expiry, only on channels you allow.
                </p>
                <div className="tl">
                  {TIMELINE_STAGES.map(([d, t]) => {
                    const on = reminders[d];
                    return (
                      <div key={d} className="st">
                        <div className={`nd ${on ? "" : "off"}`}>
                          {d ? d + "d" : "Day 0"}
                        </div>
                        <small>{t}</small>
                        <label>
                          <input
                            type="checkbox"
                            checked={on}
                            onChange={(e) =>
                              setReminders((prev) => ({ ...prev, [d]: e.target.checked }))
                            }
                            aria-label={`${d} day reminder`}
                          />
                        </label>
                      </div>
                    );
                  })}
                </div>
              </section>
            </div>
          )}

          {/* ================= ADMIN VIEW ================= */}
          {view === "admin" && (
            <div className="view on">
              <div className="head">
                <div>
                  <h2>Lead dashboard</h2>
                  <p className="mut">Callbacks, quotes and renewals in one list.</p>
                </div>
              </div>

              <div className="stats">
                <div className="glass stat">
                  <b>{leads.length}</b>
                  <span className="mut">Total leads</span>
                </div>
                <div className="glass stat">
                  <b>{leads.filter((l) => l.status === "New").length}</b>
                  <span className="mut">Awaiting a call</span>
                </div>
                <div className="glass stat">
                  <b>{leads.filter((l) => l.days >= 0 && l.days <= 45).length}</b>
                  <span className="mut">Expiring in 45 days</span>
                </div>
                <div className="glass stat">
                  <b>{leads.filter((l) => l.days < 0).length}</b>
                  <span className="mut">Expired</span>
                </div>
              </div>

              <div className="glass tblw">
                <table className="t">
                  <thead>
                    <tr>
                      <th>Lead</th>
                      <th>Vehicle</th>
                      <th>Request</th>
                      <th>Expiry</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leads.map((l) => (
                      <tr key={l.id}>
                        <td>
                          <b>{l.id}</b>
                          <div className="mut" style={{ fontSize: 13 }}>
                            {l.mob}
                          </div>
                        </td>
                        <td>
                          {l.veh}
                          <div className="mut" style={{ fontSize: 13 }}>
                            {l.type}
                          </div>
                        </td>
                        <td>{l.kind}</td>
                        <td>
                          <span
                            className={`pill ${
                              l.days < 0 ? "bad" : l.days <= 15 ? "warn" : "ok"
                            }`}
                          >
                            {l.days < 0 ? `${Math.abs(l.days)} days ago` : `In ${l.days} days`}
                          </span>
                        </td>
                        <td>
                          <select
                            value={l.status}
                            onChange={(e) => {
                              const newStatus = e.target.value;
                              setLeads((prev) =>
                                prev.map((item) => (item.id === l.id ? { ...item, status: newStatus } : item))
                              );
                              showToast(`Lead ${l.id} marked as ${newStatus}`);
                            }}
                            aria-label={`Status for ${l.id}`}
                          >
                            {["New", "Called", "Quote sent", "Converted", "Lost"].map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </main>

        <footer className="foot">
          <span>Demo data — quotes and vehicle details are samples for design review, not real offers.</span>
          <span>Privacy · Terms · Partner disclosure · Help</span>
        </footer>
      </div>

      {/* Floating compare pill */}
      <div className={`glass float ${cmp.length > 0 && view === "plans" ? "show" : ""}`} role="status">
        {cmp.length < 2 ? (
          <span>1 selected. Pick one more to compare.</span>
        ) : (
          <>
            <span>{cmp.length} plans selected</span>
            <button type="button" className="btn sm" onClick={() => navigateTo("compare")}>
              Compare now
            </button>
          </>
        )}
      </div>

      {/* Toast Notification */}
      <div className={`toast ${toastMsg ? "on" : ""}`} role="status">
        {toastMsg}
      </div>

      {/* Spotlight Search Modal (active for Plans view) */}
      <AppleSpotlight
        isOpen={spotOpen && view === "plans" && isVerified}
        onClose={() => setSpotOpen(false)}
        results={searchPlans(PLANS, spotQuery, getPrice)}
        onSelect={handleSpotSelect}
        shortcuts={spotShortcuts}
        query={spotQuery}
        onQueryChange={setSpotQuery}
      />

      {/* ================= MODAL / SHEET ================= */}
      <div
        className={`scrim ${sheet ? "on" : ""}`}
        onClick={(e) => {
          if (e.target.classList.contains("scrim")) closeSheet();
        }}
      >
        {sheet && (
          <div className="sheet" role="dialog" aria-modal="true">
            <button type="button" className="x" onClick={closeSheet} aria-label="Close">
              ✕
            </button>

            {/* Before You Buy */}
            {sheet.type === "buyReview" && (() => {
              const p = PLANS.find((x) => x.id === sheet.planId) || PLANS[0];
              const extra = p.noAdd ? [] : ADDONS.filter((a) => addons.has(a.id) && !p.inc.includes(a.id));
              const currentPrice = getPrice(p);

              return (
                <div>
                  <h2>Before you buy</h2>
                  <p className="mut" style={{ marginTop: 6 }}>
                    Take a minute to read this. It is what you are agreeing to.
                  </p>

                  <div className="sum">
                    <div>
                      <div className="mut" style={{ fontSize: 13.5 }}>
                        {p.insurer}
                      </div>
                      <b style={{ fontFamily: "var(--disp)", fontSize: 19 }}>{p.name}</b>
                    </div>
                    <b style={{ fontFamily: "var(--disp)", fontSize: 24 }}>{inr(currentPrice)}</b>
                  </div>

                  <details className="acc" open>
                    <summary>What is covered</summary>
                    <ul>
                      {p.covered.map((c, i) => (
                        <li key={i}>
                          <span className="dotk y">✓</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </details>

                  <details className="acc">
                    <summary>What is not covered</summary>
                    <ul>
                      {p.notCovered.map((c, i) => (
                        <li key={i}>
                          <span className="dotk n">✕</span>
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </details>

                  <details className="acc">
                    <summary>Price breakdown</summary>
                    <div className="line">
                      <span>Premium for {car.type.toLowerCase()}, taxes included</span>
                      <span>{inr(p.premium)}</span>
                    </div>
                    {p.inc.map((incId) => {
                      const found = ADDONS.find((a) => a.id === incId);
                      return (
                        <div key={incId} className="line">
                          <span>{found?.label}</span>
                          <span className="mut">Included</span>
                        </div>
                      );
                    })}
                    {extra.map((a) => (
                      <div key={a.id} className="line">
                        <span>{a.label}</span>
                        <span>{inr(a.price)}</span>
                      </div>
                    ))}
                    <div className="line tot">
                      <span>Total</span>
                      <span>{inr(currentPrice)}</span>
                    </div>
                    <div className="line">
                      <span>You pay first at a claim</span>
                      <span>{inr(p.ded)}</span>
                    </div>
                  </details>

                  <details className="acc">
                    <summary>Who you are buying from</summary>
                    <ul>
                      <li>
                        <span>Insurer: {p.insurer}. Our plan ranking is based on your needs, not on commission.</span>
                      </li>
                      {p.sponsored && (
                        <li>
                          <span>This is a sponsored placement. We may be paid if you buy it.</span>
                        </li>
                      )}
                      <li>
                        <span>Demo data: no real policy is issued in this design.</span>
                      </li>
                    </ul>
                  </details>

                  <label className="chk">
                    <input
                      type="checkbox"
                      checked={sheet.agreed}
                      onChange={(e) => setSheet({ ...sheet, agreed: e.target.checked })}
                    />
                    <span>I have read what is covered, what is not, and the price.</span>
                  </label>

                  <button
                    type="button"
                    className="btn block"
                    disabled={!sheet.agreed}
                    onClick={() => openPayment(p.id)}
                  >
                    Continue to payment
                  </button>
                </div>
              );
            })()}

            {/* Payment */}
            {sheet.type === "payment" && (() => {
              const p = PLANS.find((x) => x.id === sheet.planId) || PLANS[0];
              const currentPrice = getPrice(p);

              return (
                <div>
                  <h2>Payment</h2>
                  <p className="mut" style={{ marginTop: 6 }}>
                    Demo checkout. No money moves.
                  </p>

                  <div className="sum">
                    <b>{p.name}</b>
                    <b style={{ fontFamily: "var(--disp)", fontSize: 24 }}>{inr(currentPrice)}</b>
                  </div>

                  <div className="paym" role="group" aria-label="Payment method">
                    {["UPI", "Card", "Net banking"].map((m) => (
                      <button
                        type="button"
                        key={m}
                        className={sheet.payMethod === m ? "on" : ""}
                        onClick={() => setSheet({ ...sheet, payMethod: m })}
                      >
                        {m}
                      </button>
                    ))}
                  </div>

                  <button type="button" className="btn block" onClick={() => openDone(p.id)}>
                    Pay {inr(currentPrice)}
                  </button>
                </div>
              );
            })()}

            {/* You are covered */}
            {sheet.type === "done" && (() => {
              const p = PLANS.find((x) => x.id === sheet.planId) || PLANS[0];

              return (
                <div>
                  <div className="okring">✓</div>
                  <h2>You are covered</h2>
                  <p className="mut" style={{ marginTop: 6 }}>
                    {p.name} for {car.plate}. Policy PDF will appear here after real issuance.
                  </p>

                  <h3 style={{ marginTop: 24 }}>Remind me next year</h3>
                  <label className="chk">
                    <input type="checkbox" defaultChecked />
                    <span>SMS and email reminders before expiry</span>
                  </label>
                  <label className="chk">
                    <input type="checkbox" defaultChecked />
                    <span>WhatsApp reminders</span>
                  </label>
                  <p className="mut" style={{ fontSize: 13, marginBottom: 16 }}>
                    Optional. Change any time in My Garage. Offers for other products are never sent without a separate yes.
                  </p>

                  <div className="chips">
                    <button
                      type="button"
                      className="btn"
                      onClick={() => {
                        closeSheet();
                        showToast("Saved to My Garage");
                        navigateTo("garage");
                      }}
                    >
                      Save to My Garage
                    </button>
                  </div>
                </div>
              );
            })()}

            {/* Talk to advisor callback */}
            {sheet.type === "callback" && (
              <div>
                <h2>Talk to an advisor</h2>
                <p className="mut" style={{ marginTop: 6, marginBottom: 20 }}>
                  We will call you back. No obligation.
                </p>

                <label className="field">
                  Your name
                  <input
                    value={sheet.name}
                    onChange={(e) => setSheet({ ...sheet, name: e.target.value })}
                    autoComplete="name"
                    placeholder="Full name"
                  />
                </label>

                <label className="field">
                  Language
                  <select
                    value={sheet.lang}
                    onChange={(e) => setSheet({ ...sheet, lang: e.target.value })}
                  >
                    <option>Bengali</option>
                    <option>English</option>
                    <option>Hindi</option>
                  </select>
                </label>

                <label className="field">
                  Best time
                  <select
                    value={sheet.slot}
                    onChange={(e) => setSheet({ ...sheet, slot: e.target.value })}
                  >
                    <option>Morning, 9am to 12pm</option>
                    <option>Afternoon, 12pm to 4pm</option>
                    <option>Evening, 4pm to 8pm</option>
                  </select>
                </label>

                <label className="chk">
                  <input
                    type="checkbox"
                    checked={sheet.agreed}
                    onChange={(e) => setSheet({ ...sheet, agreed: e.target.checked })}
                  />
                  <span>I agree to receive a phone call about my renewal.</span>
                </label>

                <button
                  type="button"
                  className="btn block"
                  disabled={!sheet.agreed || !sheet.name.trim()}
                  onClick={() => {
                    const nextId = "LD-" + (1043 + leads.length - 3);
                    setLeads([
                      {
                        id: nextId,
                        veh: car.plate,
                        mob: mobileNumber ? mobileNumber.slice(0, 2) + "XXXXXX" + mobileNumber.slice(-2) : "98XXXXXX10",
                        type: "Car",
                        kind: `Request callback (${sheet.lang}, ${sheet.slot.split(",")[0]})`,
                        days: car.days,
                        status: "New",
                      },
                      ...leads,
                    ]);
                    closeSheet();
                    showToast("Callback requested. We will call in your chosen slot.");
                  }}
                >
                  Request callback
                </button>
              </div>
            )}

            {/* Add Vehicle */}
            {sheet.type === "addVehicle" && (
              <div>
                <h2>Add vehicle to My Garage</h2>
                <p className="mut" style={{ marginTop: 6, marginBottom: 20 }}>
                  Enter registration details to monitor renewals and saved quotations.
                </p>

                <label className="field">
                  Registration Number
                  <input
                    value={sheet.regNo}
                    onChange={(e) => setSheet({ ...sheet, regNo: e.target.value.toUpperCase() })}
                    placeholder="e.g. WB02AB5678"
                    maxLength={14}
                  />
                </label>

                <label className="field">
                  Nickname (optional)
                  <input
                    value={sheet.nick}
                    onChange={(e) => setSheet({ ...sheet, nick: e.target.value })}
                    placeholder="e.g. Family Hatchback"
                  />
                </label>

                <button
                  type="button"
                  className="btn block"
                  disabled={!sheet.regNo.trim()}
                  onClick={() => {
                    const raw = sheet.regNo.trim();
                    const newEntry = {
                      plate: raw,
                      nick: sheet.nick.trim() || "Kolkata City Ride",
                      make: "Passenger Vehicle",
                      insurer: "Partner Insurer",
                      days: 34,
                      quotes: 0,
                    };
                    setGarage([newEntry, ...garage]);
                    closeSheet();
                    showToast(`Added ${raw} to My Garage`);
                  }}
                >
                  Save vehicle
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Mount React Root
const mountEl = typeof document !== "undefined" ? document.getElementById("site") : null;
if (mountEl) {
  const root = createRoot(mountEl);
  root.render(<App />);
}
