import React, { useState, useEffect, useRef } from "react";
import { createRoot } from "react-dom/client";
import "./src/index.css";
import { AppleSpotlight } from "./src/components/ui/apple-spotlight.jsx";
import { searchPlans } from "./src/lib/searchPlans.js";
import { LearnMorePage, INSURANCE_TOPICS, InsuranceTermModal, BlueGeometricDoodleBg } from "./src/LearnMorePage.jsx";
import { SiteFooter } from "./src/SiteFooter.jsx";
import { Search, ShieldCheck, Wrench, Shield, TrendingDown, Menu, X, ArrowUpRight, UserCheck, Car } from "lucide-react";
import HERO_IMAGE from "./src/assets/images/hero_car_renewal_couple_1791530230297.jpg";
import CARD_IMG_COMPARE from "./src/assets/images/card_compare_policies_1791530244196.jpg";
import CARD_IMG_UNDERSTAND from "./src/assets/images/card_understand_coverage_1791530255068.jpg";
import CARD_IMG_RENEW from "./src/assets/images/card_renew_confidence_1791530266488.jpg";

// =========================================================================
// DEMO DATA (Illustrative / Mock Data)
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

const SAMPLE_MODELS = [
  { make: "Maruti Suzuki Swift VXi", year: "2022", insurer: "Sample Insurer A", idv: 410000, ncb: 35, days: 23 },
  { make: "Hyundai Creta SX", year: "2021", insurer: "Sample Insurer B", idv: 780000, ncb: 25, days: 14 },
  { make: "Tata Nexon XZ+", year: "2023", insurer: "Eastern General", idv: 690000, ncb: 20, days: 31 },
  { make: "Honda City ZX", year: "2020", insurer: "Metro Assure", idv: 620000, ncb: 45, days: 19 },
];

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
  call: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 0 0 5 5L15 13l5 2v4a2 2 0 0 1-2 2A16 16 0 0 1 3 6a2 2 0 0 1 2-2" />
    </svg>
  ),
};

// Paperclip SVG Ornament (Matches the 4 category cards in reference image)
function PaperclipOrnament() {
  return (
    <svg className="ref-paperclip" viewBox="0 0 36 54" fill="none" aria-hidden="true">
      <path
        d="M22.5 12L10.5 32.5C8.2 36.4 9.5 41.4 13.4 43.7C17.3 46 22.3 44.7 24.6 40.8L33.5 25.5C36.8 19.9 34.9 12.7 29.3 9.4C23.7 6.1 16.5 8 13.2 13.6L4.5 28.5"
        stroke="#B4B8C2"
        strokeWidth="3.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

// =========================================================================
// MAIN COMPONENT
// =========================================================================
export default function App() {
  const [car, setCar] = useState(INITIAL_CAR);
  const [view, setView] = useState("otp"); // otp (mandatory first) | overview | plans | compare | garage | learn-more
  const [addons, setAddons] = useState(new Set());
  const [cmp, setCmp] = useState([]);
  const [showDiff, setShowDiff] = useState(false);
  const [reminders, setReminders] = useState({ 45: true, 30: true, 15: true, 7: true, 0: true });
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [garage, setGarage] = useState(INITIAL_GARAGE);
  const [toastMsg, setToastMsg] = useState("");
  const [sheet, setSheet] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [homeTopicModal, setHomeTopicModal] = useState(null);

  // Hero Registration Lookup Form State
  const [regDraft, setRegDraft] = useState(INITIAL_CAR.plate);
  const [regError, setRegError] = useState("");

  // Image Fallback States
  const [imgFailed, setImgFailed] = useState({});

  // OTP Verification States
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

  useEffect(() => {
    if (view !== "plans") {
      setSpotOpen(false);
      setSpotQuery("");
    }
  }, [view]);

  useEffect(() => {
    if (view !== "plans") return;
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && (e.key === "k" || e.key === "K")) {
        e.preventDefault();
        setSpotOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [view]);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(""), 2800);
  };

  // Format and validate Indian registration numbers
  const formatRegPlate = (rawInput) => {
    const cleaned = rawInput.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 10);
    if (/^[A-Z]{2}[0-9]{2}[A-Z]{1,2}[0-9]{4}$/.test(cleaned)) {
      return cleaned.replace(/^([A-Z]{2})([0-9]{2})([A-Z]{1,2})([0-9]{4})$/, "$1 $2 $3 $4");
    }
    return cleaned;
  };

  const isValidRegPlate = (rawInput) => {
    const cleaned = rawInput.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const std = /^[A-Z]{2}[0-9]{1,2}[A-Z]{0,3}[0-9]{4}$/;
    const bh = /^[0-9]{2}BH[0-9]{4}[A-Z]{1,2}$/;
    return std.test(cleaned) || bh.test(cleaned);
  };

  const handleHeroRegSubmit = (e) => {
    e.preventDefault();
    if (!isValidRegPlate(regDraft)) {
      setRegError("Enter a valid format like WB 02 AB 1234 or 22BH1234AB");
      return;
    }
    setRegError("");
    const formatted = formatRegPlate(regDraft);
    const seed = formatted.split("").reduce((acc, ch) => acc + ch.charCodeAt(0), 0);
    const model = SAMPLE_MODELS[seed % SAMPLE_MODELS.length];
    setCar({
      plate: formatted,
      make: model.make,
      year: model.year,
      insurer: model.insurer,
      days: model.days,
      ncb: model.ncb,
      idv: model.idv,
      type: "Private car",
    });
    setRegDraft(formatted);
    showToast(`Illustrative details loaded for ${formatted}`);
  };

  // Sync with Plate Scanner custom event from index.html
  useEffect(() => {
    const handleIntroOpen = (e) => {
      if (e.detail?.plate) {
        const raw = e.detail.plate.toUpperCase().trim();
        const formatted = formatRegPlate(raw);
        setCar((prev) => ({
          ...prev,
          plate: formatted || raw,
        }));
        setRegDraft(formatted || raw);
      }
      if (e.detail?.mobile) {
        setMobileNumber(e.detail.mobile.replace(/\D/g, ""));
      }
      // Require mandatory OTP verification immediately after intro video
      setIsVerified(false);
      setVerificationSuccess(false);
      setStep(1);
      setView("otp");
    };

    window.addEventListener("insuredrive:open", handleIntroOpen);
    if (typeof window !== "undefined" && window.__INITIAL_PLATE__) {
      const formatted = formatRegPlate(window.__INITIAL_PLATE__);
      setCar((prev) => ({ ...prev, plate: formatted }));
      setRegDraft(formatted);
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

  const spotShortcuts = [
    { label: "Lowest price", icon: <TrendingDown style={{ width: 13, height: 13 }} /> },
    { label: "Zero depreciation", icon: <ShieldCheck style={{ width: 13, height: 13 }} /> },
    { label: "Roadside", icon: <Wrench style={{ width: 13, height: 13 }} /> },
    { label: "Third party", icon: <Shield style={{ width: 13, height: 13 }} /> },
  ];

  const handleSpotSelect = (res) => {
    setSpotOpen(false);
    const targetPlanId = res.id;
    if (!targetPlanId) return;

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

  const navigateTo = (newView, anchorId = null) => {
    if (!isVerified && newView !== "otp") {
      setView("otp");
      setMobileMenuOpen(false);
      showToast("Please complete OTP verification to continue");
      return;
    }
    setView(newView);
    setMobileMenuOpen(false);
    if (typeof window !== "undefined") {
      try {
        const targetPath = newView === "learn-more" ? "/learn-more" : "/";
        if (window.location.pathname !== targetPath) {
          window.history.pushState({ view: newView }, "", targetPath + window.location.search);
        }
      } catch (_) {}
    }
    if (anchorId) {
      setTimeout(() => {
        const target = document.getElementById(anchorId);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 60);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const handlePopState = (e) => {
      if (!isVerified) {
        setView("otp");
        return;
      }
      if (window.location.pathname === "/learn-more") {
        setView("learn-more");
      } else if (e.state?.view) {
        setView(e.state.view);
      } else {
        setView("overview");
      }
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, [isVerified]);

  // Open topic modal from homepage coverage cards
  const openCoverageTopic = (topicId) => {
    const found = INSURANCE_TOPICS.find((t) => t.id === topicId);
    if (found) {
      setHomeTopicModal(found);
    }
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
        showToast(`✓ Phone & vehicle verified for ${car.plate}!`);
      }, 650);
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
      {/* Main Website Canvas */}
      <div className="app">
        {/* ================= COMPACT WHITE NAVIGATION BAR ================= */}
        <header className="top">
          <div className="ref-navbar">
            {/* Left: Dual-Pill Brand Mark (Lime Green + Primary Blue) */}
            <button
              type="button"
              className="ref-brand"
              onClick={() => navigateTo("overview")}
              aria-label="InsureDrive Home"
            >
              <span className="ref-brand-lime" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <circle cx="8.5" cy="9.5" r="1.6" fill="#202124" />
                  <circle cx="15.5" cy="9.5" r="1.6" fill="#202124" />
                  <path
                    d="M7.5 14.2C8.8 16 11 16.8 12 16.8C13 16.8 15.2 16 16.5 14.2"
                    stroke="#202124"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
              <span className="ref-brand-blue">InsureDrive</span>
            </button>

            {/* Center: Navigation Links */}
            <nav className="ref-nav-links" aria-label="Main navigation">
              <button
                type="button"
                className={`ref-nav-link ${view === "overview" ? "active" : ""}`}
                onClick={() => navigateTo("overview")}
              >
                Home
              </button>
              <button
                type="button"
                className={`ref-nav-link ${view === "plans" || view === "compare" ? "active" : ""}`}
                onClick={() => navigateTo("plans")}
              >
                Compare Policies
              </button>
              <button
                type="button"
                className={`ref-nav-link ${view === "learn-more" ? "active" : ""}`}
                onClick={() => navigateTo("learn-more")}
              >
                Learn More
              </button>
              <button
                type="button"
                className={`ref-nav-link ${view === "garage" ? "active" : ""}`}
                onClick={() => navigateTo("garage")}
              >
                My Garage ({garage.length})
              </button>
            </nav>

            {/* Right: Active Plate / OTP Controls + Rounded Blue Primary Button */}
            <div className="ref-nav-right">
              {isVerified ? (
                <div
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-[#E8E8E8] bg-white text-[#202124]"
                  title="Verified vehicle"
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: "#1f7a3f" }} />
                  <span>{car.plate}</span>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => navigateTo("otp")}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border border-[#E8E8E8] bg-white text-[#202124] hover:border-[#378FF5] transition-colors cursor-pointer"
                  title="Open vehicle & mobile OTP verification"
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: "#378FF5" }} />
                  <span>{car.plate}</span>
                </button>
              )}

              <button
                type="button"
                className="ref-mobile-toggle"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          {/* Responsive Mobile Menu Drawer */}
          {mobileMenuOpen && (
            <div className="ref-mobile-drawer" role="navigation" aria-label="Mobile navigation">
              <button
                type="button"
                className={`ref-nav-link ${view === "overview" ? "active" : ""}`}
                onClick={() => navigateTo("overview")}
              >
                Home
              </button>
              <button
                type="button"
                className={`ref-nav-link ${view === "plans" || view === "compare" ? "active" : ""}`}
                onClick={() => navigateTo("plans")}
              >
                Compare Policies
              </button>
              <button
                type="button"
                className={`ref-nav-link ${view === "learn-more" ? "active" : ""}`}
                onClick={() => navigateTo("learn-more")}
              >
                Learn More
              </button>
              <button
                type="button"
                className={`ref-nav-link ${view === "garage" ? "active" : ""}`}
                onClick={() => navigateTo("garage")}
              >
                My Garage ({garage.length})
              </button>
              {!isVerified && (
                <button
                  type="button"
                  className={`ref-nav-link ${view === "otp" ? "active" : ""}`}
                  onClick={() => navigateTo("otp")}
                >
                  OTP Verification ({car.plate})
                </button>
              )}
            </div>
          )}
        </header>

        {/* ================= MAIN VIEW CONTENT ================= */}
        <main id="main">
          {/* ================= OTP VERIFICATION VIEW ================= */}
          {view === "otp" && (
            <div className="otp2-wrapper">
              <div style={{ marginBottom: 12, display: "flex", justifyContent: isVerified ? "space-between" : "flex-end", alignItems: "center" }}>
                {isVerified && (
                  <button type="button" className="btn ghost sm" onClick={() => navigateTo("overview")}>
                    ← Back to Home
                  </button>
                )}
                <span className="pill">Mandatory OTP Verification (Demo code: 123456)</span>
              </div>
              <div className="otp2-bezel">
                <div className="otp2-screen">
                  <div className="otp2-statusbar">
                    <div className="otp2-clock">
                      <span>{currentTime}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, opacity: 0.9 }}>
                      <span style={{ fontSize: 10 }}>VERIFICATION GATEWAY</span>
                      <span style={{ opacity: 0.5 }}>·</span>
                      <span style={{ fontSize: 10 }}>DEMO MODE</span>
                    </div>
                    <div className="otp2-status-right">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-label="Signal">
                        <path d="M2 20h.01" />
                        <path d="M7 20v-4" />
                        <path d="M12 20v-8" />
                        <path d="M17 20V4" />
                      </svg>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-label="Encrypted">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                      </svg>
                    </div>
                  </div>

                  <div className="otp2-stepper" role="tablist" aria-label="Verification Steps">
                    <button
                      type="button"
                      className={`otp2-step-pill ${step === 1 ? "active" : step > 1 ? "done" : ""}`}
                      onClick={() => setStep(1)}
                    >
                      <span>{step > 1 ? "✓" : "1"}</span>
                      <span>Confirm</span>
                    </button>
                    <span style={{ color: "var(--mut)", opacity: 0.5, fontSize: 11 }}>›</span>
                    <button
                      type="button"
                      className={`otp2-step-pill ${step === 2 ? "active" : verificationSuccess ? "done" : ""}`}
                      onClick={() => setStep(2)}
                    >
                      <span>{verificationSuccess ? "✓" : "2"}</span>
                      <span>Code</span>
                    </button>
                    <span style={{ color: "var(--mut)", opacity: 0.5, fontSize: 11 }}>›</span>
                    <button
                      type="button"
                      className={`otp2-step-pill ${step === 3 || verificationSuccess ? (verificationSuccess ? "done" : "active") : ""}`}
                      onClick={() => setStep(3)}
                    >
                      <span>{verificationSuccess ? "✓" : "3"}</span>
                      <span>Consent</span>
                    </button>
                  </div>

                  <div className="otp2-body">
                    {step === 1 && (
                      <>
                        <div className="otp2-header">
                          <h2>Confirm Vehicle &amp; Mobile</h2>
                          <p>
                            Verify your mobile number to link sample vehicle details and review illustrative renewal options.
                          </p>
                        </div>

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
                                Current Insurer: <b style={{ color: "var(--ink)" }}>{car.insurer}</b> · Illustrative Record
                              </div>
                            </div>
                          </div>
                          <div>
                            <span className="pill warn" style={{ fontSize: 11.5, fontWeight: 700 }}>
                              Renewal in {car.days} days
                            </span>
                          </div>
                        </div>

                        <div className="otp2-phone-box">
                          <div className="otp2-phone-row">
                            <span style={{ fontSize: 13, fontWeight: 600, color: "var(--ink)" }}>
                              Mobile Number
                            </span>
                            <button
                              type="button"
                              onClick={() => setIsEditingPhone(!isEditingPhone)}
                              style={{
                                fontSize: 12,
                                fontWeight: 700,
                                color: "var(--color-primary)",
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
                              aria-label="Mobile Number"
                            />
                            <div style={{ paddingRight: 12, display: "flex", alignItems: "center" }}>
                              <span className="pill ok" style={{ fontSize: 11 }}>
                                Sample Linked ✓
                              </span>
                            </div>
                          </div>
                        </div>

                        <button
                          type="button"
                          className="otp2-verify-btn"
                          onClick={() => {
                            setStep(2);
                            showToast(`Demo OTP dispatched to +91 ${mobileNumber}`);
                          }}
                        >
                          <span>Send OTP to Mobile →</span>
                        </button>
                      </>
                    )}

                    {step === 2 && (
                      <>
                        <div className="otp2-header">
                          <h2>Enter Verification OTP</h2>
                          <p>
                            Enter the 6-digit demo code sent to <b style={{ color: "var(--ink)" }}>+91 {mobileNumber}</b>.{" "}
                            <button
                              type="button"
                              onClick={() => setStep(1)}
                              style={{
                                color: "var(--color-primary)",
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
                            <div className="otp2-hsrp">
                              <div className="otp2-chakra" />
                              <span className="otp2-hsrp-txt">IND</span>
                            </div>

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

                          {otpError && (
                            <div className="otp2-err" role="alert">
                              {otpError}
                            </div>
                          )}
                        </div>

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
                                  showToast("New demo OTP dispatched via SMS");
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

                        <div className="otp2-consent-card">
                          <label className="otp2-consent-row">
                            <input
                              type="checkbox"
                              checked={consentMandatory}
                              onChange={(e) => setConsentMandatory(e.target.checked)}
                            />
                            <span>
                              <b>Consent to Process Renewal Info:</b> I authorize InsureDrive to use my registration and mobile details to display illustrative renewal quotes.{" "}
                              <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>[Required]</span>
                            </span>
                          </label>

                          <button
                            type="button"
                            className="otp2-expander-toggle"
                            onClick={() => setConsentExpanded(!consentExpanded)}
                          >
                            <span>
                              {consentExpanded
                                ? "▲ Hide optional reminder permissions"
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
                                  <b>WhatsApp Renewal Updates:</b> Enable policy summary updates and roadside assistance support on WhatsApp.
                                </span>
                              </label>
                            </div>
                          )}
                        </div>

                        <button
                          type="button"
                          disabled={
                            isSubmittingOtp ||
                            verificationSuccess ||
                            !consentMandatory ||
                            otpDigits.join("").length < 6
                          }
                          onClick={handleVerifyOtp}
                          className={`otp2-verify-btn ${verificationSuccess ? "otp2-btn-success" : ""}`}
                        >
                          {verificationSuccess ? (
                            <span>✓ Verified! Returning to Homepage...</span>
                          ) : isSubmittingOtp ? (
                            <span>Verifying demo code...</span>
                          ) : (
                            <span>Verify OTP &amp; Continue →</span>
                          )}
                        </button>
                      </>
                    )}

                    {step === 3 && (
                      <>
                        <div className="otp2-header">
                          <h2>Consent &amp; Reminder Preferences</h2>
                          <p>Manage your communication and data preferences for {car.plate}.</p>
                        </div>

                        <div className="otp2-consent-card" style={{ gap: 14 }}>
                          <label className="otp2-consent-row">
                            <input
                              type="checkbox"
                              checked={consentMandatory}
                              onChange={(e) => setConsentMandatory(e.target.checked)}
                            />
                            <span>
                              <b>Mandatory Renewal Processing:</b> I authorize InsureDrive to process vehicle details to display illustrative renewal quotes.{" "}
                              <span style={{ color: "var(--color-primary)", fontWeight: 700 }}>[Required]</span>
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
                              <b>WhatsApp Updates:</b> Enable policy summary updates on WhatsApp.
                            </span>
                          </label>
                        </div>

                        <div style={{ display: "flex", gap: 10 }}>
                          <button
                            type="button"
                            onClick={() => setStep(2)}
                            className="btn ghost block"
                            style={{ flex: 1, height: 50 }}
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
                            className="otp2-verify-btn"
                            style={{ flex: 1, height: 50 }}
                          >
                            {otpDigits.join("").length === 6 ? "Verify & Proceed →" : "Enter Code (Step 2) →"}
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================= HOMEPAGE / OVERVIEW VIEW ================= */}
          {view === "overview" && (
            <div className="view on">
              {/* 1. HERO SECTION (Recreates Reference Left Headline + Right Tilted Visual & Lime Ribbons) */}
              <section className="ref-hero" aria-label="Hero">
                <div className="ref-hero-left">
                  <div className="ed-eyebrow-row">
                    <span className="ed-pixel-tag">01 // YOUR NEXT MOVE</span>
                    <span className="ed-rot-note">BUILT FOR INDIAN DRIVERS</span>
                  </div>

                  <div className="ref-hero-kicker">
                    <span>Illustrative Motor Insurance Platform</span>
                    <span>·</span>
                    <span>{isVerified ? "✓ Mobile Verified" : `Sample Plate: ${car.plate}`}</span>
                  </div>

                  <h1 className="ref-hero-title">
                    Car Insurance,{" "}
                    <span className="ed-oversize">WITHOUT</span> the{" "}
                    <span className="ed-underline-wrap">
                      GUESSWORK.
                      <svg className="ed-underline-svg" viewBox="0 0 240 20" fill="none" aria-hidden="true">
                        <path
                          d="M4 14C62 5 154 4 236 13"
                          stroke="#378FF5"
                          strokeWidth="6"
                          strokeLinecap="round"
                        />
                      </svg>
                    </span>{" "}
                    <span className="ed-lime-block">RENEW SMARTER.</span>
                  </h1>

                  <p className="ref-hero-sub">
                    Compare coverage, understand your options, and make a more informed renewal decision — all in one place.
                  </p>

                  {/* Retained Vehicle Registration Input Form Positioned Naturally in Hero */}
                  <form className="ref-hero-regform" onSubmit={handleHeroRegSubmit} noValidate>
                    <div className="ref-hero-regform-label">
                      <span>Check Vehicle Registration (Illustrative Data)</span>
                    </div>
                    <div className="ref-hero-regform-row">
                      <div className="ref-reg-input-wrap">
                        <span className="ref-reg-ind">IND</span>
                        <input
                          type="text"
                          value={regDraft}
                          onChange={(e) => {
                            setRegDraft(e.target.value.toUpperCase());
                            if (regError) setRegError("");
                          }}
                          placeholder="WB 02 AB 1234"
                          maxLength={14}
                          aria-label="Vehicle Registration Number"
                          className="ref-reg-input"
                        />
                      </div>
                      <button type="submit" className="btn sm" style={{ height: 44, padding: "0 18px" }}>
                        Load Vehicle
                      </button>
                    </div>
                    {regError && (
                      <div style={{ color: "var(--t-bad)", fontSize: 12, marginTop: 6, fontWeight: 500 }} role="alert">
                        {regError}
                      </div>
                    )}
                  </form>

                  {/* Primary & Secondary CTAs Matching Reference Button Styling */}
                  <div className="ref-hero-actions">
                    <button
                      type="button"
                      className="ref-cta-split"
                      onClick={() => navigateTo("plans")}
                    >
                      <span>Check Renewal</span>
                      <span className="ref-cta-split-circle" aria-hidden="true">
                        <ArrowUpRight size={18} strokeWidth={2.4} />
                      </span>
                    </button>

                    <button
                      type="button"
                      className="ref-cta-secondary"
                      onClick={() => navigateTo("overview", "explore-coverage")}
                    >
                      <span>Explore Coverage</span>
                    </button>
                  </div>
                </div>

                {/* Right-Side Visual Collage Matching Reference Image */}
                <div className="ref-hero-right">
                  {/* Lime-Green (#B9F32D) Decorative Sweeping Geometric Ribbons Behind Photo */}
                  <svg
                    className="ref-hero-ribbons"
                    viewBox="0 0 500 460"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    {/* Top-left lime sweeping ribbon */}
                    <path
                      d="M42 128C92 42 204 16 308 38"
                      stroke="#B9F32D"
                      strokeWidth="44"
                      strokeLinecap="round"
                    />
                    <path
                      d="M28 286C88 264 152 292 198 342"
                      stroke="#B9F32D"
                      strokeWidth="38"
                      strokeLinecap="round"
                    />
                    {/* Bottom-right lime sweeping arc */}
                    <path
                      d="M275 415C356 410 432 362 468 292"
                      stroke="#B9F32D"
                      strokeWidth="36"
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Floating Tilted Illustrative Insurance Summary Card (Matches Reference Floating Card) */}
                  <div className="ref-hero-float-card">
                    <span className="ref-hero-float-dot" aria-hidden="true" />
                    <span className="ref-hero-float-tag">Illustrative Sample Data</span>
                    <p className="ref-hero-float-text">
                      <b>{car.plate}</b> ({car.make}) renewal due in <b>{car.days} days</b> · Keep your{" "}
                      <b>{car.ncb}% NCB</b> with sample plans starting from <b>{inr(loPrice)}/yr</b>
                    </p>
                  </div>

                  {/* Playful Blue Mascot / Shield Emblem at Bottom-Right of Photo */}
                  <svg
                    className="ref-hero-buddy"
                    viewBox="0 0 120 120"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                  >
                    <path
                      d="M60 12C66 12 70 18 70 24C88 27 104 42 104 62C104 86 86 106 60 110C34 106 16 86 16 62C16 42 32 27 50 24C50 18 54 12 60 12Z"
                      fill="#378FF5"
                    />
                    <circle cx="44" cy="58" r="6" fill="#202124" />
                    <circle cx="42" cy="56" r="2" fill="#FFFFFF" />
                    <circle cx="76" cy="58" r="6" fill="#202124" />
                    <circle cx="74" cy="56" r="2" fill="#FFFFFF" />
                    <path
                      d="M49 74C53 79 67 79 71 74"
                      stroke="#202124"
                      strokeWidth="3.5"
                      strokeLinecap="round"
                    />
                    <circle cx="34" cy="66" r="5" fill="#90C2FF" opacity="0.65" />
                    <circle cx="86" cy="66" r="5" fill="#90C2FF" opacity="0.65" />
                  </svg>
                </div>
              </section>

              {/* 2. ACTIVE VEHICLE SNAPSHOT & QUICK ACTIONS (Preserves All Existing Dashboard Widgets) */}
              <section
                className="ref-snapshot-section"
                style={{ marginBottom: 48 }}
                aria-label="Vehicle renewal snapshot and quick actions"
              >
                <div className="ref-snapshot-head">
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", marginBottom: 8 }}>
                      <span className="ed-pixel-tag">02 // LIVE TELEMETRY</span>
                      <span className="plate" style={{ fontSize: 15 }}>
                        <small>IND</small>
                        {car.plate}
                      </span>
                      <span className="pill warn">Renewal due in {car.days} days</span>
                    </div>
                    <h2 style={{ margin: 0 }}>
                      Your {car.make} ({car.year}){" "}
                      <span className="ed-lime-block">Renewal Snapshot</span>
                    </h2>
                  </div>

                  <div className="ringbox" aria-label={`${car.days} days left of a 45 day renewal window`}>
                    <svg viewBox="0 0 140 140">
                      <circle cx="70" cy="70" r="60" fill="none" stroke="#E8E8E8" strokeWidth="10" />
                      <circle
                        className="ring"
                        style={{ "--off": urgencyRingOffset }}
                        cx="70"
                        cy="70"
                        r="60"
                        fill="none"
                        stroke="#378FF5"
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
                </div>

                <div className="tiles">
                  <div className="tile">
                    <span className="lbl">Illustrative quotes for your car</span>
                    <div className="big">
                      {inr(loPrice)} – {inr(hiPrice)}
                    </div>
                    <div className="range">
                      <div className="line" />
                      <div
                        className="fill"
                        style={{
                          left: `${getDotPos(loPrice)}%`,
                          width: `${getDotPos(hiPrice) - getDotPos(loPrice)}%`,
                        }}
                      />
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
                    <p className="mut" style={{ fontSize: 13.5 }}>
                      Spread of {inr(hiPrice - loPrice)} across 3 sample comprehensive plans.
                    </p>
                  </div>

                  <div className="tile">
                    <span className="lbl">Your current sample cover</span>
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
                      2 gaps to review at renewal
                    </span>
                  </div>

                  <div className="tile">
                    <span className="lbl">Bonus and insured value</span>
                    <div className="big">
                      {car.ncb}% <span style={{ fontSize: 15, fontWeight: 500 }} className="mut">No Claim Bonus</span>
                    </div>
                    <p className="mut" style={{ fontSize: 13.5 }}>
                      Sample IDV {inr(car.idv)}. Renew before expiry so your accumulated bonus carries over.
                    </p>
                    <p className="mut" style={{ fontSize: 13, marginTop: "auto", paddingTop: 10 }}>
                      Current insurer: <b style={{ color: "var(--color-text)" }}>{car.insurer}</b>
                    </p>
                  </div>
                </div>

                <div className="acts">
                  <button type="button" className="act" onClick={() => openBuyReview("A")}>
                    <span className="ic">{SVG_ICONS.renew}</span>
                    Renew now
                    <small>Review sample summary</small>
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
                  <button
                    type="button"
                    className="act"
                    onClick={() => showToast("Policy PDF upload is a future feature in this demo")}
                  >
                    <span className="ic">{SVG_ICONS.up}</span>
                    Upload policy
                    <small>Future feature preview</small>
                  </button>
                  <button type="button" className="act" onClick={openCallback}>
                    <span className="ic">{SVG_ICONS.call}</span>
                    Talk to an advisor
                    <small>Bengali, Hindi or English</small>
                  </button>
                </div>
              </section>

              {/* 3. LARGE BLUE CATEGORY SECTION ("Explore Insurance Coverage") */}
              <section
                id="explore-coverage"
                className="ref-blue-section"
                aria-labelledby="explore-coverage-heading"
              >
                <BlueGeometricDoodleBg />
                <div className="ref-blue-header">
                  <div className="ed-eyebrow-row">
                    <span className="ed-pixel-tag on-blue">03 // PROTECTION TIERS</span>
                    <span className="ed-rot-note">LESS GUESSWORK. MORE CLARITY.</span>
                  </div>
                  <h2 id="explore-coverage-heading" className="ref-blue-title">
                    Explore Insurance{" "}
                    <span className="ed-lime-block on-blue">KNOW YOUR COVER</span>
                  </h2>
                </div>

                <div className="ref-cat-grid">
                  {/* Category Card 1: Third-Party Insurance */}
                  <button
                    type="button"
                    className="ref-cat-card"
                    onClick={() => openCoverageTopic("third-party-insurance")}
                  >
                    <PaperclipOrnament />
                    <div>
                      <h3 className="ref-cat-card-title">Third-Party Insurance</h3>
                      <p className="ref-cat-card-desc">
                        Mandatory legal liability cover for injury, death, or property damage caused to third parties.
                      </p>
                    </div>
                    <div className="ref-cat-card-bottom">
                      <span className="ref-cat-pill">Legal minimum</span>
                    </div>
                  </button>

                  {/* Category Card 2: Comprehensive Insurance */}
                  <button
                    type="button"
                    className="ref-cat-card"
                    onClick={() => openCoverageTopic("comprehensive-insurance")}
                  >
                    <PaperclipOrnament />
                    <div>
                      <h3 className="ref-cat-card-title">Comprehensive Insurance</h3>
                      <p className="ref-cat-card-desc">
                        Combines third-party liability with own-damage vehicle protection, subject to policy terms.
                      </p>
                    </div>
                    <div className="ref-cat-card-bottom">
                      <span className="ref-cat-pill">Full cover</span>
                    </div>
                  </button>

                  {/* Category Card 3: Own-Damage Insurance */}
                  <button
                    type="button"
                    className="ref-cat-card"
                    onClick={() => openCoverageTopic("own-damage-cover")}
                  >
                    <PaperclipOrnament />
                    <div>
                      <h3 className="ref-cat-card-title">Own-Damage Insurance</h3>
                      <p className="ref-cat-card-desc">
                        Standalone cover for accidental collision, fire, theft, or flood damage to your insured car, subject to policy terms.
                      </p>
                    </div>
                    <div className="ref-cat-card-bottom">
                      <span className="ref-cat-pill">Own vehicle</span>
                    </div>
                  </button>

                  {/* Category Card 4: Add-ons & Extra Protection */}
                  <button
                    type="button"
                    className="ref-cat-card"
                    onClick={() => openCoverageTopic("addon-covers")}
                  >
                    <PaperclipOrnament />
                    <div>
                      <h3 className="ref-cat-card-title">Add-ons &amp; Extra Protection</h3>
                      <p className="ref-cat-card-desc">
                        Optional benefits such as Zero Depreciation, 24x7 Roadside Assistance, and Engine Protection where eligible.
                      </p>
                    </div>
                    <div className="ref-cat-card-bottom">
                      <span className="ref-cat-pill">4 add-ons</span>
                    </div>
                  </button>
                </div>
              </section>

              {/* 4. LOWER THREE-CARD GRID ("Explore Your Insurance Options") */}
              <section className="ref-options-section" aria-labelledby="explore-options-heading">
                <div className="ref-options-head">
                  <div>
                    <div className="ed-eyebrow-row">
                      <span className="ed-pixel-tag">04 // DECISION MATRIX</span>
                    </div>
                    <h2 id="explore-options-heading" className="ref-options-title">
                      Explore Your{" "}
                      <span className="ed-lime-block">INSURANCE OPTIONS</span>
                    </h2>
                  </div>
                </div>

                <div className="ref-options-grid">
                  {/* Card 1: Compare Policies */}
                  <article className="ref-option-card">
                    <div className="ref-option-thumb">
                      <div className="ref-option-thumb-badges">
                        <div className="ref-option-thumb-row">
                          <span className="ref-thumb-pill">Illustrative</span>
                          <span className="ref-thumb-pill">Online</span>
                        </div>
                        <span className="ref-thumb-pill dark">Popular Comparison 🔥</span>
                      </div>
                      {!imgFailed.c1 ? (
                        <img
                          src={CARD_IMG_COMPARE}
                          alt="Four colorful miniature cars with protection shields side by side"
                          referrerPolicy="no-referrer"
                          onError={() => setImgFailed((p) => ({ ...p, c1: true }))}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#E4F0FF] text-[#378FF5]">
                          <ShieldCheck size={48} />
                        </div>
                      )}
                    </div>

                    <div className="ref-option-body">
                      <h3 className="ref-option-title">Compare Policies</h3>
                      <p className="ref-option-desc">
                        Review available policy options and understand how coverage differs.
                      </p>

                      <div className="ref-option-rating">
                        <span style={{ color: "#FFB800", fontSize: 14 }}>★</span>
                        <b>96.4%</b>
                        <span>(highest sample CSR across 4 plans)</span>
                      </div>

                      <div className="ref-option-tags">
                        <span className="ref-pastel-tag pink">#idv-comparison</span>
                        <span className="ref-pastel-tag blue">#for-car-owners</span>
                      </div>

                      <div className="ref-option-stats">
                        <div className="ref-option-stat">
                          <span>Sample Range</span>
                          <b>{inr(loPrice)} – {inr(hiPrice)}</b>
                        </div>
                        <div className="ref-option-stat">
                          <span>Network Garages</span>
                          <b>Up to 38 local</b>
                        </div>
                      </div>

                      <div className="ref-option-foot">
                        <span className="ref-option-meta">
                          <UserCheck size={14} />
                          <span>4 illustrative plans</span>
                        </span>
                        <button
                          type="button"
                          className="ref-option-btn"
                          onClick={() => navigateTo("plans")}
                        >
                          <span>Compare</span>
                          <ArrowUpRight size={14} />
                        </button>
                      </div>
                    </div>
                  </article>

                  {/* Card 2: Understand Your Coverage */}
                  <article className="ref-option-card">
                    <div className="ref-option-thumb">
                      <div className="ref-option-thumb-badges">
                        <div className="ref-option-thumb-row">
                          <span className="ref-thumb-pill">Free Guide</span>
                          <span className="ref-thumb-pill">20 Topics</span>
                        </div>
                      </div>
                      {!imgFailed.c2 ? (
                        <img
                          src={CARD_IMG_UNDERSTAND}
                          alt="Happy family smiling inside their modern car"
                          referrerPolicy="no-referrer"
                          onError={() => setImgFailed((p) => ({ ...p, c2: true }))}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#DDF5C1] text-[#202124]">
                          <Shield size={48} />
                        </div>
                      )}
                    </div>

                    <div className="ref-option-body">
                      <h3 className="ref-option-title">Understand Your Coverage</h3>
                      <p className="ref-option-desc">
                        Learn about IDV, deductibles, exclusions, and policy benefits.
                      </p>

                      <div className="ref-option-tags" style={{ marginTop: 2 }}>
                        <span className="ref-pastel-tag green">#idv-and-ncb</span>
                        <span className="ref-pastel-tag pink">#exclusions</span>
                        <span className="ref-pastel-tag yellow">#for-every-driver</span>
                      </div>

                      <div className="ref-option-stats">
                        <div className="ref-option-stat">
                          <span>Core Concepts</span>
                          <b>20 terms</b>
                        </div>
                        <div className="ref-option-stat">
                          <span>Add-on Guides</span>
                          <b>4 riders</b>
                        </div>
                      </div>

                      <div className="ref-option-foot">
                        <span className="ref-option-meta">
                          <UserCheck size={14} />
                          <span>Plain-English Handbook</span>
                        </span>
                        <button
                          type="button"
                          className="ref-option-btn"
                          onClick={() => navigateTo("learn-more")}
                        >
                          <span>Learn More</span>
                          <ArrowUpRight size={14} />
                        </button>
                      </div>
                    </div>
                  </article>

                  {/* Card 3: Renew With Confidence */}
                  <article className="ref-option-card">
                    <div className="ref-option-thumb">
                      <div className="ref-option-thumb-badges">
                        <div className="ref-option-thumb-row">
                          <span className="ref-thumb-pill">Illustrative</span>
                          <span className="ref-thumb-pill">Instant Check</span>
                        </div>
                      </div>
                      {!imgFailed.c3 ? (
                        <img
                          src={CARD_IMG_RENEW}
                          alt="Stylized 3D hands doing a friendly fist bump beneath a car key emblem on a bright blue background"
                          referrerPolicy="no-referrer"
                          onError={() => setImgFailed((p) => ({ ...p, c3: true }))}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-[#378FF5] text-white">
                          <Car size={48} />
                        </div>
                      )}
                    </div>

                    <div className="ref-option-body">
                      <h3 className="ref-option-title">Renew With Confidence</h3>
                      <p className="ref-option-desc">
                        Understand your renewal options and the information needed to proceed.
                      </p>

                      <div className="ref-option-rating">
                        <span style={{ color: "#FFB800", fontSize: 14 }}>★</span>
                        <b>{car.ncb}% NCB</b>
                        <span>(retained on timely renewal for {car.plate})</span>
                      </div>

                      <div className="ref-option-tags">
                        <span className="ref-pastel-tag blue">#ncb-protection</span>
                        <span className="ref-pastel-tag green">#policy-check</span>
                      </div>

                      <div className="ref-option-stats">
                        <div className="ref-option-stat">
                          <span>Sample IDV</span>
                          <b>{inr(car.idv)}</b>
                        </div>
                        <div className="ref-option-stat">
                          <span>Window Left</span>
                          <b>{car.days} days</b>
                        </div>
                      </div>

                      <div className="ref-option-foot">
                        <span className="ref-option-meta">
                          <UserCheck size={14} />
                          <span>{car.plate}</span>
                        </span>
                        <button
                          type="button"
                          className="ref-option-btn"
                          onClick={() => openBuyReview("A")}
                        >
                          <span>Check Renewal</span>
                          <ArrowUpRight size={14} />
                        </button>
                      </div>
                    </div>
                  </article>
                </div>
              </section>
            </div>
          )}

          {/* ================= PLANS VIEW ================= */}
          {view === "plans" && (
            <div className="view on">
              <div className="head">
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", marginBottom: 8 }}>
                    <span className="ed-pixel-tag">05 // QUOTE COMPARISON</span>
                    <span className="plate" style={{ fontSize: 14 }}>
                      <small>IND</small>
                      {car.plate}
                    </span>
                    <span className="pill">Illustrative Quotes</span>
                  </div>
                  <h2>
                    Compare With <span className="ed-lime-block">CLARITY</span> · {car.make}
                  </h2>
                  <p className="mut">
                    Sorted by Best match. Toggle optional add-ons below to see how illustrative prices change.
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
                    <kbd style={{ fontSize: "10.5px", padding: "1px 5px", background: "var(--color-surface-muted)", border: "1px solid var(--color-border)", borderRadius: 4, fontFamily: "var(--mono)" }}>
                      Ctrl K
                    </kbd>
                  </button>
                  <span className="pill ok">3 comprehensive + 1 third party</span>
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
                      <span className={`pill ${p.cls}`} style={{ alignSelf: "flex-start" }}>{p.badge}</span>
                      <div>
                        <div className="who">{p.insurer} · Illustrative</div>
                        <h3>{p.name}</h3>
                      </div>
                      <div className="price">
                        {inr(getPrice(p))}
                        <small> / year, sample price incl. GST</small>
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
                        Review plan
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
                  <h2 style={{ marginTop: 18 }}>Side-by-side policy comparison</h2>
                  <p className="mut">Compare illustrative coverage, IDV, deductibles, and included add-ons.</p>
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
                            <div style={{ fontFamily: "var(--disp)", fontSize: 20, fontWeight: 700, margin: "10px 0 2px" }}>
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
                      { k: "Yearly sample price", val: (p) => getPrice(p), fmt: inr, best: "min" },
                      { k: "Car insured for (IDV)", val: (p) => p.idv, fmt: (v) => (v ? inr(v) : "Not applicable"), best: "max", skip0: true },
                      { k: "Claims settled (CSR)", val: (p) => p.csr, fmt: (v) => v + "%", best: "max", bar: [85, 100] },
                      { k: "Cashless garages", val: (p) => p.garages, fmt: (v) => v || "None", best: "max", bar: [0, 40] },
                      { k: "Compulsory deductible", val: (p) => p.ded, fmt: inr, best: "min" },
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
                              Select · {inr(getPrice(p))}
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
                  <div className="ed-eyebrow-row">
                    <span className="ed-pixel-tag">06 // FLEET TRACKER</span>
                  </div>
                  <h2>
                    My Garage &amp; <span className="ed-lime-block">RENEWAL TIMELINE</span>
                  </h2>
                  <p className="mut">Track your vehicles, illustrative renewal timelines, and reminder preferences.</p>
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

                    <div className="chips" style={{ marginBottom: 0 }}>
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
                          setRegDraft(g.plate);
                          navigateTo("plans");
                        }}
                      >
                        Compare plans
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
                          setRegDraft(g.plate);
                          navigateTo("overview");
                        }}
                      >
                        Open snapshot
                      </button>
                    </div>

                    {g.quotes > 0 && (
                      <span className="mut" style={{ fontSize: 13.5 }}>
                        {g.quotes} saved illustrative quotes
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
                <h3>Renewal Reminders</h3>
                <p className="mut" style={{ fontSize: 14, marginTop: 4 }}>
                  Configure when you want renewal alerts before policy expiry.
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

          {/* ================= LEARN MORE VIEW ================= */}
          {view === "learn-more" && (
            <LearnMorePage car={car} onNavigate={navigateTo} />
          )}
        </main>

        {/* Premium Editorial Footer inside Main Canvas (excluded from OTP page) */}
        {view !== "otp" && (
          <SiteFooter
            car={car}
            garageCount={garage.length}
            onNavigate={navigateTo}
            onOpenTopic={openCoverageTopic}
            onOpenCallback={openCallback}
            onOpenBuyReview={openBuyReview}
          />
        )}
      </div>

      {/* Homepage Coverage Modal (when clicking any of the 4 cards in the Blue Category Section) */}
      <InsuranceTermModal
        topic={homeTopicModal}
        onClose={() => setHomeTopicModal(null)}
        onNavigateToPlans={() => navigateTo("plans")}
      />

      {/* Floating compare pill */}
      <div className={`float ${cmp.length > 0 && view === "plans" ? "show" : ""}`} role="status">
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
        isOpen={spotOpen && view === "plans"}
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
                  <h2>Before you proceed</h2>
                  <p className="mut" style={{ marginTop: 6 }}>
                    Review the illustrative coverage summary, exclusions, and sample premium breakdown.
                  </p>

                  <div className="sum">
                    <div>
                      <div className="mut" style={{ fontSize: 13 }}>
                        {p.insurer} (Illustrative)
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
                    <summary>Sample price breakdown</summary>
                    <div className="line">
                      <span>Base sample premium ({car.type.toLowerCase()}, taxes included)</span>
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
                      <span>Total Illustrative Premium</span>
                      <span>{inr(currentPrice)}</span>
                    </div>
                    <div className="line">
                      <span>Compulsory deductible at claim</span>
                      <span>{inr(p.ded)}</span>
                    </div>
                  </details>

                  <details className="acc">
                    <summary>Important disclosure</summary>
                    <ul>
                      <li>
                        <span>Insurer: {p.insurer}. Ranking is illustrative based on coverage and deductible parameters.</span>
                      </li>
                      {p.sponsored && (
                        <li>
                          <span>This is a sample sponsored placement and is not counted in the Best match ranking.</span>
                        </li>
                      )}
                      <li>
                        <span>Illustrative data only: no real insurance policy is bound or issued in this demo.</span>
                      </li>
                    </ul>
                  </details>

                  <label className="chk">
                    <input
                      type="checkbox"
                      checked={sheet.agreed}
                      onChange={(e) => setSheet({ ...sheet, agreed: e.target.checked })}
                    />
                    <span>I have reviewed the illustrative coverage, exclusions, and sample price breakdown.</span>
                  </label>

                  <button
                    type="button"
                    className="btn block"
                    disabled={!sheet.agreed}
                    onClick={() => openPayment(p.id)}
                  >
                    Continue to demo checkout
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
                  <h2>Demo Checkout</h2>
                  <p className="mut" style={{ marginTop: 6 }}>
                    Illustrative checkout step. No real payment is processed.
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
                    Complete Demo Renewal ({inr(currentPrice)})
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
                  <h2>Illustrative Renewal Complete</h2>
                  <p className="mut" style={{ marginTop: 6 }}>
                    {p.name} selected for {car.plate}. (Demo confirmation — no actual policy issued.)
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
                    Optional. You can adjust reminder stages anytime in My Garage.
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
                  Request a callback to discuss your renewal options.
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
                  <span>I agree to receive a phone call about my motor insurance renewal.</span>
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
                    showToast("Callback requested for your chosen slot.");
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
                  Enter a registration number to track illustrative renewal dates and saved quotes.
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
                    const raw = formatRegPlate(sheet.regNo.trim());
                    const newEntry = {
                      plate: raw,
                      nick: sheet.nick.trim() || "City Commuter",
                      make: "Passenger Vehicle",
                      insurer: "Sample Insurer",
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
