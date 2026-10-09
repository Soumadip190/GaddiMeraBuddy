import React, { useState, useEffect } from "react";
import { ArrowUpRight, PhoneCall, Car, ShieldCheck, X } from "lucide-react";

// =========================================================================
// REUSABLE INFO / LEGAL MODAL (About Us, FAQs, Privacy, Terms, Disclaimer)
// Strictly factual to this platform — no invented insurer partnerships,
// regulatory authorizations, or fictional addresses.
// =========================================================================
const FOOTER_DOCS = {
  about: {
    tag: "COMPANY // ABOUT INSUREDRIVE",
    title: "About InsureDrive",
    subtitle: "An interactive motor-insurance educational, comparison, and renewal exploration platform built for Indian vehicle owners.",
    sections: [
      {
        heading: "What We Do",
        body: "InsureDrive helps car owners in India understand how motor insurance works before making a renewal decision. From decoding Insured Declared Value (IDV) and No Claim Bonus (NCB) slabs to comparing Third-Party versus Comprehensive coverage and optional add-ons, our goal is to replace insurance jargon with plain-English clarity.",
      },
      {
        heading: "Platform Nature & Scope",
        body: "InsureDrive is an educational and interactive comparison interface—not an insurance company or underwriter. We do not issue policies, bind risk, or process live insurance underwriting. All vehicle profiles, insurer names, and premium figures shown on the platform are illustrative sample records designed to demonstrate how coverage parameters affect renewal decisions.",
      },
      {
        heading: "Designed for Indian Road Conditions",
        body: "Whether you are evaluating Zero Depreciation for city traffic, Engine Protection for monsoon waterlogging, or tracking renewal reminders across multiple family vehicles in My Garage, InsureDrive puts every key decision point in one transparent workspace.",
      },
    ],
  },
  faqs: {
    tag: "SUPPORT // FREQUENTLY ASKED QUESTIONS",
    title: "Frequently Asked Questions",
    subtitle: "Common questions about motor insurance renewal, coverage comparisons, and how this platform works.",
    sections: [
      {
        heading: "1. Are the quotes and vehicle details on InsureDrive real?",
        body: "No. All quotes, insurer names (such as Bharati Shield, Dakshin General, Purba Motor, and Nagarik Act Cover), and vehicle records (such as WB 02 AB 1234) are illustrative mock samples created for educational and comparison demonstration.",
      },
      {
        heading: "2. What is the difference between Third-Party and Comprehensive cover?",
        body: "Third-Party Liability cover is the mandatory legal minimum required under the Motor Vehicles Act in India; it only covers injury, death, or property damage caused to a third party. Comprehensive cover includes mandatory Third-Party liability plus Own-Damage protection for your own vehicle against accidents, theft, fire, and floods.",
      },
      {
        heading: "3. What happens to my No Claim Bonus (NCB) if I switch insurers at renewal?",
        body: "Your accumulated No Claim Bonus (ranging from 20% to 50%) belongs to you as the registered owner and transfers when you switch insurers at renewal, provided you renew within 90 days of your previous policy's expiry date.",
      },
      {
        heading: "4. How can I speak with an advisor?",
        body: "You can use the 'Request Callback' option in the footer or on the Renewal Snapshot dashboard to schedule a callback slot in Bengali, Hindi, or English.",
      },
    ],
  },
  privacy: {
    tag: "LEGAL // PRIVACY NOTICE",
    title: "Privacy Policy",
    subtitle: "How registration numbers, mobile verification inputs, and preferences are handled in this application.",
    sections: [
      {
        heading: "1. Local & Session Data Processing",
        body: "Registration numbers, mobile numbers entered during the mandatory demo OTP verification step (demo code 123456), garage vehicle entries, and reminder toggles are processed locally within your browser session to personalize the interactive renewal views.",
      },
      {
        heading: "2. Consent & Communication Preferences",
        body: "During OTP verification and callback requests, you can review and toggle optional permissions for expiry reminders (45, 30, 15, and 7 days prior to expiry) and WhatsApp updates. You may update these reminder stages at any time inside My Garage.",
      },
      {
        heading: "3. No Unauthorized Third-Party Sharing",
        body: "Because this platform operates as an illustrative educational and comparison application, your inputs are not transmitted to external insurance underwriters or commercial lead brokers.",
      },
    ],
  },
  terms: {
    tag: "LEGAL // TERMS OF USE",
    title: "Terms and Conditions",
    subtitle: "Conditions governing the use of the InsureDrive comparison and educational interface.",
    sections: [
      {
        heading: "1. Educational & Illustrative Use Only",
        body: "By accessing and using InsureDrive, you acknowledge that all policy comparisons, IDV figures, deductibles, and premium calculations are illustrative examples intended to help users understand motor insurance concepts.",
      },
      {
        heading: "2. Not an Insurance Contract or Quote",
        body: "Completing a simulated review or demo checkout on this website does not constitute an application for insurance, a binding quotation, a payment transaction, or the issuance of an insurance policy.",
      },
      {
        heading: "3. Policy Wording Precedence",
        body: "Actual motor insurance coverage, premium rates, add-on eligibility, deductibles, and claim settlement rules are governed strictly by the respective insurer's official policy schedule and wording.",
      },
    ],
  },
  disclaimer: {
    tag: "LEGAL // PLATFORM DISCLAIMER",
    title: "Insurance & Mock-Data Disclaimer",
    subtitle: "Important notice regarding illustrative data, coverage descriptions, and comparison metrics.",
    sections: [
      {
        heading: "Illustrative Data Notice",
        body: "Insurance information displayed on this platform is intended to help users understand and compare available options. Coverage, premiums, eligibility, exclusions, and policy conditions depend on the relevant insurer and policy wording. Any illustrative or mock data is not an insurance quote or a confirmation of coverage.",
      },
      {
        heading: "No Underwriting or Regulatory Claim",
        body: "InsureDrive is not an insurance company and does not underwrite risk or guarantee savings. Users making real-world financial or insurance decisions should verify policy terms directly with a licensed insurer or advisor.",
      },
    ],
  },
};

export function SiteFooter({
  car,
  garageCount = 2,
  onNavigate,
  onOpenTopic,
  onOpenCallback,
  onOpenBuyReview,
}) {
  const [activeDocKey, setActiveDocKey] = useState(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    if (!activeDocKey) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setActiveDocKey(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeDocKey]);

  const activeDoc = activeDocKey ? FOOTER_DOCS[activeDocKey] : null;

  const handleGuideClick = (topicId) => {
    if (onOpenTopic) {
      onOpenTopic(topicId);
    } else if (onNavigate) {
      onNavigate("learn-more");
    }
  };

  return (
    <>
      <footer className="ed-footer" aria-label="Site footer">
        {/* 1. DISTINCTIVE EDITORIAL CLOSING BANNER */}
        <div className="ed-footer-banner">
          <div className="ed-footer-banner-left">
            <div className="ed-footer-eyebrow-row">
              <span className="ed-footer-pixel-badge">INSURANCE / INDIA</span>
              <span className="ed-footer-mono-note">// RENEWAL NOTES · EDITION {currentYear}</span>
            </div>
            <h2 className="ed-footer-Statement">
              KNOW YOUR{" "}
              <span className="ed-footer-lime-word">
                COVER.
                <svg
                  className="ed-footer-underline"
                  viewBox="0 0 180 14"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M3 10C48 3 128 3 177 9"
                    stroke="#378FF5"
                    strokeWidth="4.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>{" "}
              OWN YOUR <span className="ed-footer-lime-pill">CHOICE.</span>
            </h2>
          </div>

          <div className="ed-footer-banner-right">
            <div className="ed-footer-vehicle-chip">
              <span className="ed-footer-vehicle-label">ACTIVE SAMPLE VEHICLE</span>
              <div className="ed-footer-vehicle-row">
                <span className="ed-footer-mini-plate">
                  <small>IND</small>
                  {car?.plate || "WB 02 AB 1234"}
                </span>
                <span className="ed-footer-vehicle-meta">
                  {car?.make || "Maruti Suzuki Swift"} · {car?.ncb ?? 35}% NCB
                </span>
              </div>
            </div>

            <div className="ed-footer-banner-ctas">
              <button
                type="button"
                className="ed-footer-primary-btn"
                onClick={() => onNavigate("plans")}
              >
                <span>Compare Policies</span>
                <ArrowUpRight size={16} strokeWidth={2.4} aria-hidden="true" />
              </button>
              <button
                type="button"
                className="ed-footer-secondary-btn"
                onClick={onOpenCallback}
              >
                <PhoneCall size={14} aria-hidden="true" />
                <span>Talk to an Advisor</span>
              </button>
            </div>
          </div>
        </div>

        {/* 2. MAIN FOOTER GRID: LEFT BRAND COLUMN + 4 NAVIGATION COLUMNS */}
        <div className="ed-footer-main">
          {/* Left Brand Area */}
          <div className="ed-footer-brand-col">
            <button
              type="button"
              className="ref-brand ed-footer-brand-btn"
              onClick={() => onNavigate("overview")}
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

            <p className="ed-footer-brand-headline">
              A clearer way to renew your car insurance.
            </p>

            <p className="ed-footer-brand-desc">
              Helping Indian vehicle owners understand policy coverage, decode IDV and NCB benefits, and explore motor insurance renewal options with confidence.
            </p>

            {/* Compact Contact & Support Box (Strictly using real platform capabilities) */}
            <div className="ed-footer-contact-card">
              <div className="ed-footer-contact-head">
                <span className="ed-footer-pixel-mini">ADVISOR DESK</span>
                <span className="ed-footer-contact-badge">Illustrative Demo</span>
              </div>
              <p className="ed-footer-contact-text">
                Callback support available in <b>Bengali, Hindi &amp; English</b> across Morning (9am–12pm), Afternoon (12pm–4pm), and Evening (4pm–8pm) slots.
              </p>
              <button
                type="button"
                className="ed-footer-callback-link"
                onClick={onOpenCallback}
              >
                <span>Schedule a callback request</span>
                <ArrowUpRight size={13} aria-hidden="true" />
              </button>
            </div>
          </div>

          {/* 4 Organized Navigation Columns */}
          <div className="ed-footer-nav-grid" role="navigation" aria-label="Footer navigation">
            {/* Column 1: Explore */}
            <div className="ed-footer-col">
              <div className="ed-footer-col-title">
                <span className="ed-footer-col-num">01</span>
                <span>Explore</span>
              </div>
              <ul className="ed-footer-list">
                <li>
                  <button
                    type="button"
                    className="ed-footer-link"
                    onClick={() => onNavigate("overview")}
                  >
                    Home
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="ed-footer-link"
                    onClick={() => onNavigate("plans")}
                  >
                    Compare Policies
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="ed-footer-link"
                    onClick={() => {
                      if (onOpenBuyReview) {
                        onOpenBuyReview("A");
                      } else {
                        onNavigate("plans");
                      }
                    }}
                  >
                    Check Renewal
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="ed-footer-link"
                    onClick={() => onNavigate("learn-more")}
                  >
                    Learn More
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="ed-footer-link"
                    onClick={() => onNavigate("garage")}
                  >
                    My Garage ({garageCount})
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 2: Insurance Guides */}
            <div className="ed-footer-col">
              <div className="ed-footer-col-title">
                <span className="ed-footer-col-num">02</span>
                <span>Insurance Guides</span>
              </div>
              <ul className="ed-footer-list">
                <li>
                  <button
                    type="button"
                    className="ed-footer-link"
                    onClick={() => handleGuideClick("third-party-insurance")}
                  >
                    Third-Party Insurance
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="ed-footer-link"
                    onClick={() => handleGuideClick("comprehensive-insurance")}
                  >
                    Comprehensive Insurance
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="ed-footer-link"
                    onClick={() => handleGuideClick("own-damage-cover")}
                  >
                    Own-Damage Insurance
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="ed-footer-link"
                    onClick={() => handleGuideClick("insured-declared-value")}
                  >
                    IDV Explained
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="ed-footer-link"
                    onClick={() => handleGuideClick("no-claim-bonus")}
                  >
                    No Claim Bonus
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="ed-footer-link"
                    onClick={() => handleGuideClick("addon-covers")}
                  >
                    Add-ons and Coverage
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 3: Company */}
            <div className="ed-footer-col">
              <div className="ed-footer-col-title">
                <span className="ed-footer-col-num">03</span>
                <span>Company</span>
              </div>
              <ul className="ed-footer-list">
                <li>
                  <button
                    type="button"
                    className="ed-footer-link"
                    onClick={() => setActiveDocKey("about")}
                  >
                    About Us
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="ed-footer-link"
                    onClick={onOpenCallback}
                  >
                    Contact
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="ed-footer-link"
                    onClick={() => setActiveDocKey("faqs")}
                  >
                    FAQs
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="ed-footer-link"
                    onClick={() => onNavigate("otp")}
                  >
                    OTP Verification
                  </button>
                </li>
              </ul>
            </div>

            {/* Column 4: Legal */}
            <div className="ed-footer-col">
              <div className="ed-footer-col-title">
                <span className="ed-footer-col-num">04</span>
                <span>Legal</span>
              </div>
              <ul className="ed-footer-list">
                <li>
                  <button
                    type="button"
                    className="ed-footer-link"
                    onClick={() => setActiveDocKey("privacy")}
                  >
                    Privacy Policy
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="ed-footer-link"
                    onClick={() => setActiveDocKey("terms")}
                  >
                    Terms and Conditions
                  </button>
                </li>
                <li>
                  <button
                    type="button"
                    className="ed-footer-link"
                    onClick={() => setActiveDocKey("disclaimer")}
                  >
                    Disclaimer
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 3. INSURANCE-SPECIFIC DISCLAIMER */}
        <div className="ed-footer-disclaimer" role="note" aria-label="Insurance platform disclaimer">
          <div className="ed-footer-disclaimer-tag">
            <ShieldCheck size={14} aria-hidden="true" />
            <span>IMPORTANT PLATFORM &amp; MOCK-DATA NOTICE</span>
          </div>
          <p className="ed-footer-disclaimer-text">
            Insurance information displayed on this platform is intended to help users understand and compare available options. Coverage, premiums, eligibility, exclusions, and policy conditions depend on the relevant insurer and policy wording. Any illustrative or mock data (including sample vehicle records, insurer names, and annual premium figures) is not an insurance quote or a confirmation of coverage. InsureDrive is an educational comparison interface and does not underwrite insurance policies.
          </p>
        </div>

        {/* 4. BOTTOM BAR */}
        <div className="ed-footer-bottom">
          <div className="ed-footer-bottom-left">
            <span className="ed-footer-copy">
              © {currentYear} InsureDrive. All rights reserved.
            </span>
            <span className="ed-footer-sep" aria-hidden="true">·</span>
            <div className="ed-footer-bottom-links">
              <button
                type="button"
                className="ed-footer-bottom-link"
                onClick={() => setActiveDocKey("privacy")}
              >
                Privacy Policy
              </button>
              <span className="ed-footer-sep" aria-hidden="true">/</span>
              <button
                type="button"
                className="ed-footer-bottom-link"
                onClick={() => setActiveDocKey("terms")}
              >
                Terms
              </button>
              <span className="ed-footer-sep" aria-hidden="true">/</span>
              <button
                type="button"
                className="ed-footer-bottom-link"
                onClick={() => setActiveDocKey("disclaimer")}
              >
                Disclaimer
              </button>
            </div>
          </div>

          <div className="ed-footer-signoff">
            <span className="ed-footer-signoff-dot" aria-hidden="true" />
            <span>BUILT FOR CLARITY. DESIGNED FOR DRIVERS.</span>
          </div>
        </div>
      </footer>

      {/* Modal Window for About Us, FAQs, Privacy Policy, Terms & Conditions, and Disclaimer */}
      {activeDoc && (
        <div
          className="lm-modal-scrim on"
          onClick={(e) => {
            if (e.target === e.currentTarget) setActiveDocKey(null);
          }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="footer-doc-title"
        >
          <div className="lm-modal-window">
            <button
              type="button"
              className="lm-modal-close"
              onClick={() => setActiveDocKey(null)}
              aria-label="Close dialog"
            >
              <X width={18} height={18} />
            </button>

            <div className="lm-modal-head">
              <div className="lm-modal-kicker" style={{ position: "relative", zIndex: 1 }}>
                <span className="lm-modal-cat">{activeDoc.tag}</span>
              </div>
              <h2 id="footer-doc-title" style={{ position: "relative", zIndex: 1 }}>
                {activeDoc.title}
              </h2>
              <p className="lm-modal-sub" style={{ position: "relative", zIndex: 1 }}>
                {activeDoc.subtitle}
              </p>
            </div>

            <div className="lm-modal-body">
              {activeDoc.sections.map((sec, idx) => (
                <div key={idx} className="lm-section">
                  <div className="lm-sec-label">{sec.heading}</div>
                  <p className="lm-sec-text">{sec.body}</p>
                </div>
              ))}
            </div>

            <div className="lm-modal-foot">
              <button
                type="button"
                className="btn ghost sm"
                onClick={() => setActiveDocKey(null)}
              >
                Close
              </button>
              <button
                type="button"
                className="btn sm"
                onClick={() => {
                  setActiveDocKey(null);
                  onNavigate("plans");
                }}
              >
                Explore Policy Comparison →
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
