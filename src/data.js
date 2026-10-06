export const STATES = {
  WB: "West Bengal", MH: "Maharashtra", DL: "Delhi", KA: "Karnataka", TN: "Tamil Nadu",
  UP: "Uttar Pradesh", GJ: "Gujarat", RJ: "Rajasthan", TS: "Telangana", TG: "Telangana",
  AP: "Andhra Pradesh", KL: "Kerala", MP: "Madhya Pradesh", HR: "Haryana", PB: "Punjab",
  BR: "Bihar", OR: "Odisha", OD: "Odisha", AS: "Assam", JH: "Jharkhand", CG: "Chhattisgarh",
  UK: "Uttarakhand", HP: "Himachal Pradesh", GA: "Goa", JK: "Jammu & Kashmir", CH: "Chandigarh"
};

export function formatPlate(raw) {
  if (!raw) return "WB 02 AB 1234";
  const c = raw.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (!c) return "WB 02 AB 1234";
  const bh = c.match(/^(\d{2})(BH)(\d{4})([A-Z]{1,2})$/);
  if (bh) return `${bh[1]} ${bh[2]} ${bh[3]} ${bh[4]}`;
  const st = c.match(/^([A-Z]{2})(\d{1,2})([A-Z]{1,3})(\d{4})$/);
  if (st) return `${st[1]} ${st[2].padStart(2, "0")} ${st[3]} ${st[4]}`;
  return raw.toUpperCase();
}

export const inr = (n) => "₹" + Number(n || 0).toLocaleString("en-IN");

export const mask = (m) => {
  const s = String(m || "9876543210").replace(/\D/g, "");
  if (s.length < 4) return "98XXXXXX10";
  return s.slice(0, 2) + "XXXXXX" + s.slice(-2);
};

export function deriveVehicleDetails(plateStr) {
  const clean = (plateStr || "WB02AB1234").toUpperCase().replace(/[^A-Z0-9]/g, "");
  const isBH = /^\d{2}BH/.test(clean);
  const stCode = clean.slice(0, 2);
  const stateName = isBH ? "Bharat (BH) National Series" : (STATES[stCode] || "West Bengal");
  const rto = isBH ? "BH-Series" : (clean.match(/^[A-Z]{2}\d{1,2}/)?.[0] || "WB02");
  let hash = 0;
  for (let i = 0; i < clean.length; i++) hash = (hash * 31 + clean.charCodeAt(i)) % 10000;
  const models = [
    { type: "Private car", make: "Maruti Suzuki", model: "Swift VXi 1.2L", fuel: "Petrol", reg: "2022", baseIdv: 410000, basePrem: 8420, currentInsurer: "Sample Insurer A", policyNo: "POL-WB-884120" },
    { type: "Private car", make: "Hyundai", model: "Creta SX 1.5L", fuel: "Petrol", reg: "2023", baseIdv: 640000, basePrem: 11250, currentInsurer: "Sample Insurer B", policyNo: "POL-WB-512904" },
    { type: "Two-wheeler", make: "Honda", model: "Activa 125 DLX", fuel: "Petrol", reg: "2021", baseIdv: 58000, basePrem: 1890, currentInsurer: "Sample Insurer A", policyNo: "POL-WB-229184" },
    { type: "Private car", make: "Tata Motors", model: "Nexon EV LR", fuel: "Electric", reg: "2024", baseIdv: 780000, basePrem: 12400, currentInsurer: "Sample Insurer C", policyNo: "POL-WB-904311" },
  ];
  const picked = models[hash % models.length];
  const days = ((hash % 42) + 8); // 8 to 49 days left (Kolkata target segment <= 45 days)
  const expDate = new Date(Date.now() + days * 86400000).toLocaleDateString("en-IN", {
    day: "2-digit", month: "short", year: "numeric"
  });
  const policyStatus = days < 0
    ? "Expired or verification required"
    : days <= 30
    ? "Renewal due soon"
    : "Active policy";

  return {
    type: picked.type,
    make: picked.make,
    model: picked.model,
    fuel: picked.fuel,
    reg: picked.reg,
    state: stateName,
    rto,
    ncb: 35,
    expiry: expDate,
    days,
    baseIdv: picked.baseIdv,
    est: picked.basePrem,
    currentInsurer: picked.currentInsurer,
    policyNo: picked.policyNo,
    policyType: "Comprehensive",
    policyStatus,
    verificationStatus: "Demo data",
    nickname: clean.startsWith("WB") ? "Kolkata Daily Commuter" : "Family Vehicle",
    notFound: false,
    uploadedDocName: null,
  };
}

export const ADDON_OPTIONS = [
  { id: "zd", label: "Zero depreciation", price: 1150, desc: "Full part replacement cost without depreciation deduction at claim time." },
  { id: "rsa", label: "24x7 Roadside assistance", price: 450, desc: "Towing, flat tyre, battery jumpstart, and emergency fuel assistance across Kolkata & highways." },
  { id: "eng", label: "Engine & gearbox protect", price: 890, desc: "Covers waterlogging / monsoon hydrostatic lock and lubricant leakage." },
  { id: "ncb", label: "NCB protection", price: 580, desc: "Keeps your No Claim Bonus discount intact even if you make 1 claim." },
];

export const PLANS = [
  {
    id: "A",
    tag: "best",
    label: "Best match for your preferences",
    rankingReason: "Best coverage for selected budget · Useful for newer vehicles",
    insurer: "Sample Insurer A (Eastern General)",
    planName: "Comprehensive Shield Plus",
    coverType: "comprehensive",
    sponsored: false,
    premium: 8420,
    idv: "₹4,10,000",
    idvNum: 410000,
    csr: "96.4%",
    garages: 38,
    kolkataGarages: "38 in Kolkata (Salt Lake, Kasba, Behala, Howrah)",
    deductible: "₹1,000",
    claimProcess: "WhatsApp / App inspection + cashless garage",
    zeroDepIncluded: true,
    rsaIncluded: true,
    coverageSummary: [
      "Accidental own-damage + fire, theft & natural calamities",
      "Mandatory third-party liability + ₹15L Personal Accident cover",
      "Zero depreciation & 24x7 roadside assistance included",
    ],
    exclusions: [
      "Normal wear and tear, mechanical/electrical breakdown",
      "Driving without a valid licence or under influence",
      "Consequential engine damage unless Engine Protect is active",
    ],
    rows: [
      ["Cover type", "Comprehensive"],
      ["Zero depreciation", "Included"],
      ["Roadside assistance", "Included (24x7)"],
      ["Cashless garages in Kolkata", "38 garages"],
      ["Claim settlement ratio", "96.4%"],
      ["Claim process", "App + cashless garage"],
      ["Compulsory deductible", "₹1,000"],
    ],
    why: "Recommended by customer-fit ranking: includes Zero Depreciation and 38 Kolkata cashless garages within 5% of the lowest price.",
  },
  {
    id: "B",
    tag: "alt",
    label: "Lowest premium",
    rankingReason: "Lowest premium · Standard comprehensive cover",
    insurer: "Sample Insurer B (Metro Assure)",
    planName: "Standard Smart Cover",
    coverType: "comprehensive",
    sponsored: false,
    premium: 7980,
    idv: "₹3,85,000",
    idvNum: 385000,
    csr: "93.8%",
    garages: 21,
    kolkataGarages: "21 in Kolkata (Park Circus, New Town, Tollygunge)",
    deductible: "₹2,000",
    claimProcess: "Phone intimation + garage survey",
    zeroDepIncluded: false,
    rsaIncluded: false,
    coverageSummary: [
      "Standard own-damage cover for accidents, theft, fire & floods",
      "Mandatory third-party liability + ₹15L Personal Accident cover",
      "Lower annual premium with standard part depreciation rules",
    ],
    exclusions: [
      "20%–50% depreciation on replaced plastic/metal parts at claim time",
      "Roadside towing unless added separately",
      "Driving without valid registration or licence",
    ],
    rows: [
      ["Cover type", "Comprehensive"],
      ["Zero depreciation", "Not included"],
      ["Roadside assistance", "Optional add-on"],
      ["Cashless garages in Kolkata", "21 garages"],
      ["Claim settlement ratio", "93.8%"],
      ["Claim process", "Phone + garage"],
      ["Compulsory deductible", "₹2,000"],
    ],
    why: "Lowest base comprehensive premium, ideal if your vehicle is older than 5 years and you prefer lower upfront cost.",
  },
  {
    id: "C",
    tag: "spon",
    label: "Sponsored",
    rankingReason: "Includes roadside assistance · High IDV ceiling",
    insurer: "Sample Insurer C (Bengal Crown Motor)",
    planName: "Zero-Dep Elite Care",
    coverType: "comprehensive",
    sponsored: true,
    sponsorDisclosure: "Sponsored placement. We may receive compensation if you purchase this policy. Kept separate from the customer-fit score.",
    premium: 8890,
    idv: "₹4,20,000",
    idvNum: 420000,
    csr: "95.2%",
    garages: 30,
    kolkataGarages: "30 in Kolkata (EM Bypass, Alipore, Dum Dum, Garia)",
    deductible: "₹500",
    claimProcess: "Dedicated surveyor + doorstep pickup",
    zeroDepIncluded: true,
    rsaIncluded: true,
    coverageSummary: [
      "Higher IDV (₹4.20L) with Zero Depreciation & Consumables cover",
      "Free doorstep pickup/drop at 30 partner workshops in Kolkata",
      "Low ₹500 voluntary + compulsory deductible",
    ],
    exclusions: [
      "Tyre/alloy damage unless damaged in an insured accident",
      "Unauthorised commercial usage of private vehicle",
      "Pre-existing body dents prior to policy inspection",
    ],
    rows: [
      ["Cover type", "Comprehensive"],
      ["Zero depreciation", "Included"],
      ["Roadside assistance", "Included (24x7)"],
      ["Cashless garages in Kolkata", "30 garages"],
      ["Claim settlement ratio", "95.2%"],
      ["Claim process", "Doorstep pickup + app"],
      ["Compulsory deductible", "₹500"],
    ],
    why: "Commercial partner placement. Offers higher IDV and low ₹500 deductible; shown transparently outside our unbiased Best Match score.",
  },
  {
    id: "D",
    tag: "alt",
    label: "Quote only · Statutory cover",
    rankingReason: "Meets legal third-party mandate · Lowest statutory outlay",
    insurer: "Sample Insurer D (National Liability Pool)",
    planName: "Third-Party Liability Only",
    coverType: "third-party",
    sponsored: false,
    premium: 3416,
    idv: "— (Third-party only)",
    idvNum: 0,
    csr: "91.8%",
    garages: 0,
    kolkataGarages: "Not applicable (no own-damage cashless repair)",
    deductible: "₹1,000",
    claimProcess: "Online tribunal / third-party claim desk",
    zeroDepIncluded: false,
    rsaIncluded: false,
    coverageSummary: [
      "Covers legal liability for bodily injury or death of third parties",
      "Covers third-party property damage up to ₹7.5 Lakh",
      "Includes mandatory ₹15 Lakh Owner-Driver Personal Accident cover",
    ],
    exclusions: [
      "Zero coverage for damage, theft, fire, or flood to your own vehicle",
      "No cashless garage repair for own vehicle",
      "No NCB accumulation on standalone third-party policy",
    ],
    rows: [
      ["Cover type", "Third-party only"],
      ["Zero depreciation", "Not applicable"],
      ["Roadside assistance", "Optional"],
      ["Cashless garages in Kolkata", "—"],
      ["Claim settlement ratio", "91.8%"],
      ["Claim process", "Online claim portal"],
      ["Compulsory deductible", "₹1,000"],
    ],
    why: "IRDAI-regulated statutory third-party cover. Protects against legal liability to others but does not cover your own vehicle.",
  },
];

export const TERMS = [
  [
    "IDV (Insured Declared Value)",
    "The maximum amount your insurer pays if your vehicle is stolen or damaged beyond repair. It equals the manufacturer's listed price minus standard depreciation. Choosing a slightly higher IDV increases your payout ceiling for a modest premium difference."
  ],
  [
    "Zero depreciation (Bumper-to-Bumper)",
    "Standard policies deduct 20%–50% depreciation on plastic, rubber, glass, and metal parts when settling a repair bill. Zero-depreciation removes that deduction so the insurer covers the full value of replaced parts."
  ],
  [
    "NCB (No Claim Bonus)",
    "A renewal discount of 20% to 50% on your own-damage premium for every claim-free year. Your NCB belongs to you personally and transfers even if you switch insurers."
  ],
  [
    "Third-party vs Comprehensive cover",
    "Third-party cover is mandatory by law and pays only for injury, death, or property damage caused to others. Comprehensive cover includes mandatory third-party liability plus protection for your own vehicle against accidents, theft, fire, and floods."
  ],
];

export const REMINDER_TIMELINE = [
  { days: 45, type: "Educational message", desc: "Plain-language guide on checking your NCB, IDV, and monsoon/zero-dep add-ons before renewal.", defaultOn: true },
  { days: 30, type: "Comparison invitation", desc: "Side-by-side renewal comparison link with updated quotes from partner insurers.", defaultOn: true },
  { days: 15, type: "Renewal reminder", desc: "Timely alert to lock in your renewal rate and avoid inspection delays.", defaultOn: true },
  { days: 7, type: "Urgent reminder", desc: "Priority alert before policy lapse so your No Claim Bonus (NCB) stays protected.", defaultOn: true },
  { days: 0, type: "Expiry-date policy status", desc: "Final status check on expiry day to confirm active coverage or assist with break-in inspection.", defaultOn: true },
];

export const CONSENT_PURPOSES = [
  { id: "rem_motor", label: "I agree to receive motor-insurance renewal reminders.", channel: "SMS & Email", required: false },
  { id: "wa_msg", label: "I agree to receive WhatsApp messages about my vehicle renewal.", channel: "WhatsApp", required: false },
  { id: "phone_call", label: "I agree to receive phone calls from the platform or authorised partners.", channel: "Phone Call", required: false },
  { id: "partner_promo", label: "I agree to receive promotional offers from insurance partners.", channel: "Email / SMS", required: false },
  { id: "health_offers", label: "I agree to receive health-insurance offers.", channel: "Email / SMS", required: false },
  { id: "loan_offers", label: "I agree to receive loan and financial-product offers.", channel: "Email / SMS", required: false },
];

export const INITIAL_CONSENT_RECORDS = [
  {
    id: "CNS-901",
    userId: "USR-KOL-101",
    purposeId: "rem_motor",
    purpose: "Motor-insurance renewal reminders",
    channel: "SMS & Email",
    noticeVersion: "v2.1-DPDP-2026",
    timestamp: "2026-10-06 09:30 IST",
    sourcePage: "OTP Verification Screen",
    status: "Granted",
    withdrawnAt: null,
  },
  {
    id: "CNS-902",
    userId: "USR-KOL-101",
    purposeId: "wa_msg",
    purpose: "WhatsApp renewal updates",
    channel: "WhatsApp",
    noticeVersion: "v2.1-DPDP-2026",
    timestamp: "2026-10-06 09:30 IST",
    sourcePage: "OTP Verification Screen",
    status: "Granted",
    withdrawnAt: null,
  },
  {
    id: "CNS-903",
    userId: "USR-KOL-101",
    purposeId: "phone_call",
    purpose: "Phone calls from platform or authorised partners",
    channel: "Phone Call",
    noticeVersion: "v2.1-DPDP-2026",
    timestamp: "2026-10-06 09:32 IST",
    sourcePage: "Request Callback Form",
    status: "Granted",
    withdrawnAt: null,
  },
  {
    id: "CNS-904",
    userId: "USR-KOL-101",
    purposeId: "partner_promo",
    purpose: "Promotional offers from insurance partners",
    channel: "Email / SMS",
    noticeVersion: "v2.1-DPDP-2026",
    timestamp: "—",
    sourcePage: "Manage Consent Page",
    status: "Not granted",
    withdrawnAt: null,
  },
  {
    id: "CNS-905",
    userId: "USR-KOL-101",
    purposeId: "health_offers",
    purpose: "Health-insurance cross-sell offers",
    channel: "Email / SMS",
    noticeVersion: "v2.1-DPDP-2026",
    timestamp: "—",
    sourcePage: "Manage Consent Page",
    status: "Not granted",
    withdrawnAt: null,
  },
  {
    id: "CNS-906",
    userId: "USR-KOL-101",
    purposeId: "loan_offers",
    purpose: "Loan and financial-product offers",
    channel: "Email / SMS",
    noticeVersion: "v2.1-DPDP-2026",
    timestamp: "—",
    sourcePage: "Manage Consent Page",
    status: "Not granted",
    withdrawnAt: null,
  },
];

export const INITIAL_COMM_HISTORY = [
  { id: "MSG-401", channel: "SMS", template: "45-Day Educational Guide (NCB & IDV)", sentAt: "01 Oct 2026, 10:15 IST", status: "Delivered", retries: 0 },
  { id: "MSG-402", channel: "WhatsApp", template: "30-Day Renewal Comparison Ready", sentAt: "05 Oct 2026, 11:02 IST", status: "Delivered", retries: 0 },
  { id: "MSG-403", channel: "Email", template: "Saved Quotation Summary (Sample Insurer A)", sentAt: "06 Oct 2026, 09:40 IST", status: "Queued (Scheduled Job)", retries: 0 },
];

export const SEED_LEADS = [
  { id: "LD-1042", veh: "WB 06 CD 4421", mob: "98XXXXXX21", type: "Car", plan: "Sample Insurer A", leadType: "Request a callback", days: 12, rem: true, wa: true, mkt: false, status: "Called", lang: "Bengali", slot: "Morning, 9am to 12pm" },
  { id: "LD-1041", veh: "WB 74 AK 0098", mob: "90XXXXXX45", type: "Bike", plan: "Sample Insurer B", leadType: "Get partner quotation", days: 31, rem: true, wa: false, mkt: false, status: "New", lang: "English", slot: "Afternoon, 12pm to 4pm" },
  { id: "LD-1040", veh: "WB 02 AM 7713", mob: "89XXXXXX07", type: "Car", plan: "Sample Insurer C", leadType: "Renew with current insurer", days: -4, rem: true, wa: true, mkt: false, status: "Quote sent", lang: "Bengali", slot: "Evening, 4pm to 8pm" },
];
