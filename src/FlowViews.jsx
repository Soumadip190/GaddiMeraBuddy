import React, { useState } from "react";
import { ShieldCheck, Wrench, Award, Scale } from "lucide-react";
import { inr, TERMS } from "./data.js";
import { Feature } from "@/components/ui/feature-section-with-bento-grid";

export function VehicleDashboard({
  vehicle,
  vData,
  setVData,
  onSaveGarage,
  isSavedInGarage,
  onRenewCurrent,
  onCompareOptions,
  onBuyNew,
  onContactAgent,
}) {
  const [editing, setEditing] = useState(false);
  const [uploadModal, setUploadModal] = useState(false);
  const [docName, setDocName] = useState(vData.uploadedDocName || "");

  const statusTone =
    vData.notFound
      ? "w"
      : vData.policyStatus === "Active policy"
      ? "y"
      : vData.policyStatus === "Renewal due soon"
      ? "w"
      : "r";

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setDocName(file.name);
      setVData({
        ...vData,
        uploadedDocName: file.name,
        verificationStatus: "Uploaded policy document",
        notFound: false,
        policyStatus: vData.days <= 30 ? "Renewal due soon" : "Active policy",
      });
      setUploadModal(false);
    }
  };

  return (
    <div className="fade">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
        <div>
          <div className="row" style={{ gap: 8, marginBottom: 8 }}>
            <span className="pill">Kolkata · Bengali & English Support</span>
            <span className={"pill " + statusTone}>{vData.notFound ? "Information unavailable" : vData.policyStatus}</span>
            <span className="pill">{vData.verificationStatus || "Demo data"}</span>
          </div>
          <h1>Vehicle & Policy Dashboard. <span>Understand your cover before you renew.</span></h1>
          <p className="sub" style={{ maxWidth: 740, marginBottom: 12 }}>
            A simple vehicle-insurance renewal assistant that helps you understand, compare and renew policies, save vehicles in My Garage, and receive consent-based expiry reminders.
          </p>
        </div>
        <div className="row" style={{ gap: 8, marginBottom: 12 }}>
          <button
            type="button"
            className="btn ghost sm"
            onClick={() => setVData({ ...vData, notFound: !vData.notFound })}
          >
            {vData.notFound ? "Show matched policy record" : "Simulate 'No policy found'"}
          </button>
          <button
            type="button"
            className={"btn sm " + (isSavedInGarage ? "ghost" : "")}
            onClick={onSaveGarage}
            style={{ color: "#ffffff" }}
          >
            {isSavedInGarage ? "✓ Saved in My Garage" : "+ Save in My Garage"}
          </button>
        </div>
      </div>

      {vData.notFound ? (
        <div className="card" style={{ marginBottom: 20, border: "2px solid #e5cb83", background: "#fffdf7" }}>
          <h2>We could not find a matching policy.</h2>
          <p className="sub" style={{ marginBottom: 16 }}>
            We could not find a matching policy. You can upload your policy document, enter the expiry date manually, or request help.
          </p>
          <div className="row" style={{ gap: 10 }}>
            <button type="button" className="btn" onClick={() => setUploadModal(true)}>
              Upload policy document
            </button>
            <button type="button" className="btn ghost" onClick={() => { setVData({ ...vData, notFound: false }); setEditing(true); }}>
              Enter expiry date manually
            </button>
            <button type="button" className="btn ghost" onClick={onContactAgent}>
              Request help from Kolkata support
            </button>
          </div>
        </div>
      ) : (
        <div className="card">
          <div className="banner">
            <b>Demo data · Clear verification status: {vData.verificationStatus || "Demo data"}.</b> These details are generated for this MVP and are not fetched from live VAHAN. You can upload your policy PDF or edit any field below.
          </div>

          <div className="row" style={{ justifyContent: "space-between", alignItems: "center" }}>
            <div className="row" style={{ gap: 10 }}>
              <span className="plate-chip" style={{ fontSize: 20, padding: "4px 12px" }}><small>IND</small>{vehicle}</span>
              <span className="pill">{vData.state} ({vData.rto})</span>
              {vData.nickname && <span className="pill">“{vData.nickname}”</span>}
            </div>
            <div className="row" style={{ gap: 8 }}>
              <span className={"pill " + statusTone}>{vData.policyStatus}</span>
              <span className="pill y">{vData.days < 0 ? `Expired ${Math.abs(vData.days)} days ago` : `Renewal in ${vData.days} days`}</span>
            </div>
          </div>

          <div className="my-5">
            <Feature
              badgeText="Vehicle & Policy Overview"
              heading={`Insurance details for ${vehicle}`}
              subheading="Key registration, coverage, expiry countdown, and verification details for your vehicle."
              items={[
                {
                  title: "Registration & Make / Model",
                  description: `${vehicle} · ${vData.make} ${vData.model} (${vData.fuel}) · ${vData.type} (${vData.reg})`,
                  icon: ShieldCheck,
                  colSpan: 2,
                },
                {
                  title: "Current Policy Status",
                  description: `${vData.policyStatus} · ${vData.currentInsurer || "Sample Insurer A"}`,
                  icon: Award,
                  colSpan: 1,
                },
                {
                  title: "Policy Type & Number",
                  description: `${vData.policyType || "Comprehensive"} · ${vData.policyNo || "POL-WB-884120"}`,
                  icon: Wrench,
                  colSpan: 1,
                },
                {
                  title: "Policy Expiry & Verification Status",
                  description: `Expires ${vData.expiry} (${vData.days} days countdown) · ${vData.verificationStatus || "Demo data"} · NCB ${vData.ncb}%`,
                  icon: Scale,
                  colSpan: 2,
                },
              ]}
            />
          </div>

          {docName && (
            <div className="row" style={{ marginBottom: 16, padding: "10px 14px", background: "#e5f2ea", borderRadius: 12, border: "1px solid #9dcbb0", justifyContent: "space-between" }}>
              <span style={{ fontSize: 13.5, fontWeight: 600 }}>Uploaded policy document: {docName} (Verified status updated)</span>
              <button type="button" className="btn ghost sm" onClick={() => setUploadModal(true)}>Replace file</button>
            </div>
          )}

          {editing && (
            <div style={{ background: "#fff", border: "1.5px solid var(--line)", borderRadius: 16, padding: 16, marginBottom: 18 }}>
              <h3 style={{ marginBottom: 12 }}>Correct or manually enter vehicle & policy details</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 12 }}>
                <label className="field" style={{ marginBottom: 0 }}>
                  <span>Vehicle nickname</span>
                  <input
                    value={vData.nickname || ""}
                    onChange={(e) => setVData({ ...vData, nickname: e.target.value })}
                    placeholder="e.g. Salt Lake Office Car"
                  />
                </label>
                <label className="field" style={{ marginBottom: 0 }}>
                  <span>Vehicle type</span>
                  <select
                    value={vData.type}
                    onChange={(e) => {
                      const isBike = e.target.value === "Two-wheeler";
                      setVData({
                        ...vData,
                        type: e.target.value,
                        make: isBike ? "Honda" : "Maruti Suzuki",
                        model: isBike ? "Activa 125 DLX" : "Swift VXi 1.2L",
                        est: isBike ? 1890 : 8420,
                      });
                    }}
                  >
                    <option>Private car</option>
                    <option>Two-wheeler</option>
                  </select>
                </label>
                <label className="field" style={{ marginBottom: 0 }}>
                  <span>Fuel type</span>
                  <select value={vData.fuel} onChange={(e) => setVData({ ...vData, fuel: e.target.value })}>
                    <option>Petrol</option>
                    <option>Diesel</option>
                    <option>CNG</option>
                    <option>Electric</option>
                  </select>
                </label>
                <label className="field" style={{ marginBottom: 0 }}>
                  <span>Policy status</span>
                  <select
                    value={vData.policyStatus}
                    onChange={(e) => setVData({ ...vData, policyStatus: e.target.value, verificationStatus: "Manually verified" })}
                  >
                    <option>Active policy</option>
                    <option>Renewal due soon</option>
                    <option>Expired or verification required</option>
                    <option>Information unavailable</option>
                    <option>Quote only</option>
                    <option>Demo data</option>
                  </select>
                </label>
                <label className="field" style={{ marginBottom: 0 }}>
                  <span>Policy expiry date</span>
                  <input
                    value={vData.expiry}
                    onChange={(e) => setVData({ ...vData, expiry: e.target.value, verificationStatus: "Manually verified" })}
                  />
                </label>
                <label className="field" style={{ marginBottom: 0 }}>
                  <span>No Claim Bonus (NCB)</span>
                  <select
                    value={vData.ncb}
                    onChange={(e) => {
                      const ncb = Number(e.target.value);
                      const est = Math.round(8420 * (1 - (ncb - 35) * 0.006));
                      setVData({ ...vData, ncb, est });
                    }}
                  >
                    {[0, 20, 25, 35, 45, 50].map((n) => (
                      <option key={n} value={n}>{n}% discount</option>
                    ))}
                  </select>
                </label>
              </div>
            </div>
          )}

          <div style={{ borderTop: "1px solid var(--line)", paddingTop: 18, marginTop: 8 }}>
            <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 10 }}>Choose your path for {vehicle}:</div>
            <div className="row" style={{ justifyContent: "space-between", gap: 10 }}>
              <div className="row" style={{ gap: 8 }}>
                <button type="button" className="btn" onClick={onCompareOptions} style={{ color: "#fff3f3" }}>
                  Compare renewal options →
                </button>
                <button type="button" className="btn ghost" onClick={onRenewCurrent}>
                  Renew with current insurer ({vData.currentInsurer || "Sample Insurer A"})
                </button>
                <button type="button" className="btn ghost" onClick={onBuyNew}>
                  Buy new insurance
                </button>
              </div>
              <div className="row" style={{ gap: 8 }}>
                <button type="button" className="btn ghost sm" onClick={() => setUploadModal(true)}>
                  Upload policy PDF
                </button>
                <button type="button" className="btn ghost sm" onClick={() => setEditing(!editing)}>
                  {editing ? "Done editing" : "Correct policy details"}
                </button>
                <button type="button" className="btn ghost sm" onClick={onContactAgent}>
                  Contact agent
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {uploadModal && (
        <div className="card" style={{ marginTop: 16, background: "#fff", border: "2px solid var(--ink)" }}>
          <div className="row" style={{ justifyContent: "space-between", marginBottom: 10 }}>
            <h3 style={{ margin: 0 }}>Upload previous policy document (PDF / Image)</h3>
            <button type="button" className="btn ghost sm" onClick={() => setUploadModal(false)}>Close</button>
          </div>
          <p className="note" style={{ marginBottom: 12 }}>
            Uploading your previous policy helps our Kolkata team verify your exact IDV, previous NCB slab, and expiry date before issuing a partner quotation.
          </p>
          <input
            type="file"
            accept=".pdf,.png,.jpg,.jpeg"
            onChange={handleFileUpload}
            aria-label="Upload policy file"
            style={{ marginBottom: 12 }}
          />
          <div className="row" style={{ gap: 8 }}>
            <button
              type="button"
              className="btn sm"
              onClick={() => {
                setDocName("previous_motor_policy_2025.pdf");
                setVData({
                  ...vData,
                  uploadedDocName: "previous_motor_policy_2025.pdf",
                  verificationStatus: "Uploaded policy document",
                  notFound: false,
                  policyStatus: "Renewal due soon",
                });
                setUploadModal(false);
              }}
            >
              Use sample policy PDF (Demo)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export function PolicyListingAndCompare({
  vehicle,
  vData,
  plans,
  addonOptions,
  selectedAddons,
  setSelectedAddons,
  compareIds,
  setCompareIds,
  onInspectPolicy,
  onSaveQuotation,
  savedQuoteIds,
  onBack,
  onPick,
}) {
  const [coverFilter, setCoverFilter] = useState("all");
  const [idvBump, setIdvBump] = useState(0);
  const [searchQ, setSearchQ] = useState("");
  const [showDiffOnly, setShowDiffOnly] = useState(false);

  const toggleAddon = (id) => {
    setSelectedAddons((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleCompare = (id) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const scaleFactor = vData.type === "Two-wheeler" ? 0.28 : 1;
  const idvMultiplier = 1 + idvBump / 100;

  const computedPlans = plans
    .filter((p) => coverFilter === "all" || p.coverType === coverFilter)
    .filter((p) =>
      !searchQ.trim() ||
      (p.insurer + " " + p.planName + " " + p.rankingReason).toLowerCase().includes(searchQ.toLowerCase())
    )
    .map((p) => {
      const isTp = p.coverType === "third-party";
      const zdAdjustment = !isTp && selectedAddons.includes("zd") && !p.zeroDepIncluded ? 1150 : 0;
      const otherAddons = isTp
        ? (selectedAddons.includes("rsa") ? 450 : 0)
        : selectedAddons
            .filter((id) => id !== "zd")
            .reduce((s, id) => s + (addonOptions.find((a) => a.id === id)?.price || 0), 0);
      const ncbDelta = isTp ? 0 : Math.round((35 - (vData.ncb || 35)) * 45);
      const idvPremDelta = isTp ? 0 : Math.round(p.premium * (idvBump * 0.008));
      const basePrem = Math.max(
        999,
        Math.round((p.premium + zdAdjustment + otherAddons + ncbDelta + idvPremDelta) * scaleFactor)
      );
      const gst = Math.round(basePrem * 0.18);
      const totalWithTax = basePrem + gst;
      const adjustedIdvNum = isTp ? 0 : Math.round(p.idvNum * scaleFactor * idvMultiplier);
      const rows = p.rows.map(([k, v]) => {
        if (!isTp && k === "Zero depreciation" && selectedAddons.includes("zd")) return [k, "Included"];
        if (k === "Roadside assistance" && selectedAddons.includes("rsa")) return [k, "Included (24x7)"];
        return [k, v];
      });
      return {
        ...p,
        adjustedPremium: basePrem,
        gst,
        totalWithTax,
        adjustedIdv: isTp ? "— (Third-party only)" : inr(adjustedIdvNum),
        rows,
      };
    });

  const comparedList = computedPlans.filter((p) => compareIds.includes(p.id));

  const matrixRows = [
    ["Annual Premium (incl. 18% GST)", (p) => inr(p.totalWithTax) + " (Base " + inr(p.adjustedPremium) + ")"],
    ["Insured Declared Value (IDV)", (p) => p.adjustedIdv],
    ["Cover Type", (p) => p.coverType === "third-party" ? "Third-party only" : "Comprehensive"],
    ["Zero Depreciation", (p) => p.rows.find((r) => r[0] === "Zero depreciation")?.[1] || "—"],
    ["Roadside Assistance", (p) => p.rows.find((r) => r[0] === "Roadside assistance")?.[1] || "—"],
    ["Cashless Garages in Kolkata", (p) => p.kolkataGarages],
    ["Claim Settlement Ratio", (p) => p.csr],
    ["Compulsory Deductible", (p) => p.deductible],
    ["Claim Process", (p) => p.claimProcess],
    ["Commercial Placement", (p) => p.sponsored ? "Sponsored placement" : "Unbiased customer-fit ranking"],
  ].filter(([, getter]) => {
    if (!showDiffOnly || comparedList.length < 2) return true;
    const vals = comparedList.map(getter);
    return new Set(vals).size > 1;
  });

  return (
    <div id="compare-section" className="fade" style={{ marginTop: 32, scrollMarginTop: 24 }}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
        <div>
          <div className="row" style={{ gap: 8, marginBottom: 6 }}>
            <span className="pill">Customer-fit ranking separated from Sponsored placement</span>
            <span className="pill y">Demo data · All prices shown with 18% GST</span>
          </div>
          <h1>Compare renewal options. <span>Explainable recommendations for {vehicle}.</span></h1>
          <p className="sub" style={{ maxWidth: 720, marginBottom: 14 }}>
            Customer-fit ranking is calculated strictly from price, coverage, IDV, deductible, add-ons, and Kolkata garage network. Commercial sponsorship is clearly labelled and never alters our Best Match score.
          </p>
        </div>
        {onBack && (
          <button type="button" className="btn ghost sm" onClick={onBack} style={{ marginBottom: 14 }}>
            ← Back to OTP verification
          </button>
        )}
      </div>

      <div className="addon-bar">
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 12, paddingBottom: 12, borderBottom: "1px solid var(--line)", gap: 10 }}>
          <div className="row" style={{ gap: 6 }}>
            <span style={{ fontSize: 13.5, fontWeight: 600 }}>Cover filter:</span>
            {[
              ["all", "All policies (4)"],
              ["comprehensive", "Comprehensive (3)"],
              ["third-party", "Third-party only (1)"],
            ].map(([val, lbl]) => (
              <button
                type="button"
                key={val}
                onClick={() => setCoverFilter(val)}
                className={"chip-btn " + (coverFilter === val ? "on" : "")}
              >
                {lbl}
              </button>
            ))}
          </div>

          <div className="row" style={{ gap: 6 }}>
            <span style={{ fontSize: 13.5, fontWeight: 600 }}>IDV setting:</span>
            {[-10, 0, 10, 15].map((pct) => (
              <button
                type="button"
                key={pct}
                onClick={() => setIdvBump(pct)}
                className={"chip-btn " + (idvBump === pct ? "on" : "")}
              >
                {pct === 0 ? "Standard IDV" : (pct > 0 ? `+${pct}% IDV` : `${pct}% IDV`)}
              </button>
            ))}
          </div>

          <input
            value={searchQ}
            onChange={(e) => setSearchQ(e.target.value)}
            placeholder="Search insurer or feature..."
            aria-label="Search policies"
            style={{ padding: "7px 12px", border: "1.5px solid #bfbeb6", borderRadius: 999, fontSize: 13.5, minWidth: 190 }}
          />
        </div>

        <div className="row" style={{ justifyContent: "space-between", marginBottom: 8 }}>
          <div>
            <b style={{ fontSize: 14 }}>Important Add-ons (Better fit for selected add-ons)</b>
            <span className="note" style={{ marginLeft: 8 }}>
              Select add-ons to recalculate total premium including 18% GST
            </span>
          </div>
          <span className="pill">{compareIds.length} selected for side-by-side compare (min 2)</span>
        </div>
        <div className="row" style={{ gap: 8 }}>
          {addonOptions.map((a) => {
            const active = selectedAddons.includes(a.id);
            return (
              <button
                type="button"
                key={a.id}
                onClick={() => toggleAddon(a.id)}
                className={"chip-btn " + (active ? "on" : "")}
                title={a.desc}
              >
                <span>{active ? "✓" : "+"}</span>
                <span>{a.label}</span>
                <span style={{ opacity: 0.75, fontSize: 12 }}>({inr(Math.round(a.price * scaleFactor))})</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="cmp">
        {computedPlans.map((p) => {
          const inCompare = compareIds.includes(p.id);
          const isSavedQuote = savedQuoteIds.includes(p.id);
          return (
            <div key={p.id} className={"plan " + (p.tag === "best" ? "best" : "")}>
              <div className="row" style={{ justifyContent: "space-between", marginBottom: 6 }}>
                <span className={"badge " + p.tag} style={{ marginBottom: 0 }}>{p.label}</span>
                <label className="row" style={{ gap: 5, fontSize: 12.5, cursor: "pointer", fontWeight: 600 }}>
                  <input
                    type="checkbox"
                    checked={inCompare}
                    onChange={() => toggleCompare(p.id)}
                    style={{ accentColor: "var(--ink)" }}
                  />
                  Add to compare
                </label>
              </div>

              <div style={{ fontSize: 12.5, color: "var(--ok)", fontWeight: 600, marginBottom: 4 }}>
                {p.rankingReason}
              </div>
              <div style={{ fontWeight: 700, fontSize: 17 }}>{p.insurer}</div>
              <div className="note" style={{ marginBottom: 6 }}>{p.planName}</div>

              <div className="price">{inr(p.totalWithTax)} <span style={{ fontSize: 13, fontWeight: 500, color: "var(--mut)" }}>incl. GST</span></div>
              <div className="note">
                Base {inr(p.adjustedPremium)} + 18% GST ({inr(p.gst)}) · IDV: <b>{p.adjustedIdv}</b>
              </div>

              {p.sponsored && (
                <div className="banner" style={{ marginTop: 10, marginBottom: 6, padding: "8px 10px", fontSize: 12.5 }}>
                  <b>Sponsored placement.</b> We may receive compensation if you purchase this policy.
                </div>
              )}

              <ul>
                {p.rows.map(([a, b]) => (
                  <li key={a}>
                    <span>{a}</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>

              <div className="why">
                <b>Why recommended: </b>
                {p.why}
              </div>

              <div className="row" style={{ gap: 8, marginTop: "auto" }}>
                <button
                  type="button"
                  className={"btn " + (p.tag === "best" ? "" : "ghost")}
                  onClick={() => onPick({ ...p, premium: p.adjustedPremium, totalWithTax: p.totalWithTax, idv: p.adjustedIdv, addons: selectedAddons, actionType: "Get partner quotation" })}
                  style={p.id === "A" ? { flex: 1, color: "#ffffff" } : { flex: 1 }}
                >
                  Get partner quotation →
                </button>
              </div>
              <div className="row" style={{ gap: 6, marginTop: 8, justifyContent: "space-between" }}>
                <button type="button" className="btn ghost sm" onClick={() => onInspectPolicy(p)} style={{ flex: 1 }}>
                  Policy details & exclusions
                </button>
                <button
                  type="button"
                  className="btn ghost sm"
                  onClick={() => onSaveQuotation(p)}
                  title="Save quotation to My Garage"
                >
                  {isSavedQuote ? "✓ Saved quote" : "Save quote"}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Dedicated Side-by-Side Compare Section (Minimum 2 policies) */}
      <div className="card" style={{ marginTop: 28, background: "#fff" }}>
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <h2 style={{ margin: 0 }}>
              Side-by-Side Policy Comparison <span>({comparedList.length} selected · minimum 2 recommended)</span>
            </h2>
            <p className="note" style={{ marginTop: 4 }}>
              Sticky feature column on mobile & desktop · Toggle "Show differences only" to focus on what changes.
            </p>
          </div>
          <div className="row" style={{ gap: 10 }}>
            <label className="row" style={{ gap: 6, fontSize: 13.5, fontWeight: 600, cursor: "pointer" }}>
              <input
                type="checkbox"
                checked={showDiffOnly}
                onChange={(e) => setShowDiffOnly(e.target.checked)}
                style={{ width: 16, height: 16, accentColor: "var(--ink)" }}
              />
              Show differences only
            </label>
            {compareIds.length < plans.length && (
              <button type="button" className="btn ghost sm" onClick={() => setCompareIds(plans.map((x) => x.id))}>
                Select all 4
              </button>
            )}
          </div>
        </div>

        {comparedList.length < 2 ? (
          <div className="banner" style={{ marginBottom: 0 }}>
            Select at least <b>2 policies</b> using the "Add to compare" checkbox on the cards above to view the side-by-side comparison matrix.
          </div>
        ) : (
          <div className="tbl">
            <table>
              <thead>
                <tr>
                  <th style={{ position: "sticky", left: 0, background: "#f1f0ea", zIndex: 2 }}>Feature / Specification</th>
                  {comparedList.map((p) => (
                    <th key={p.id}>
                      <div>{p.insurer}</div>
                      <span className={"badge " + p.tag} style={{ marginTop: 4, display: "inline-block" }}>
                        {p.sponsored ? "Sponsored placement" : p.label}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {matrixRows.map(([label, getter]) => (
                  <tr key={label}>
                    <td style={{ position: "sticky", left: 0, background: "#fff", fontWeight: 600, zIndex: 1 }}>{label}</td>
                    {comparedList.map((p) => (
                      <td key={p.id}>{getter(p)}</td>
                    ))}
                  </tr>
                ))}
                <tr>
                  <td style={{ position: "sticky", left: 0, background: "#fff", fontWeight: 600, zIndex: 1 }}>Choose Action</td>
                  {comparedList.map((p, colIdx) => (
                    <td key={p.id}>
                      <div className="row" style={{ gap: 6 }}>
                        <button
                          type="button"
                          className="btn sm"
                          style={
                            colIdx === 0
                              ? { color: "#fff9f9" }
                              : colIdx === 1
                              ? { color: "#f6f3f3" }
                              : undefined
                          }
                          onClick={() => onPick({ ...p, premium: p.adjustedPremium, totalWithTax: p.totalWithTax, idv: p.adjustedIdv, addons: selectedAddons, actionType: "Request a callback" })}
                        >
                          Request a callback
                        </button>
                        <button type="button" className="btn ghost sm" onClick={() => onInspectPolicy(p)}>
                          Full details
                        </button>
                      </div>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Plain-language insurance glossary (Bento Grid) */}
      <Feature
        badgeText="Insurance Guide"
        heading="Plain-language insurance explanations"
        subheading="Understand the key terms before you decide on your vehicle renewal."
        items={TERMS.map(([title, description], idx) => ({
          title,
          description,
          icon: [ShieldCheck, Wrench, Award, Scale][idx % 4],
          colSpan: idx === 0 || idx === 3 ? 2 : 1,
        }))}
      />
    </div>
  );
}

export function PolicyDetailsModal({ policy, vehicle, onClose, onAddCompare, inCompare, onRequestCallback, onBuyRenew }) {
  if (!policy) return null;
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Policy details"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 60,
        background: "rgba(20,20,20,0.55)",
        display: "grid",
        placeItems: "center",
        padding: 16,
      }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="card" style={{ width: "min(680px, 100%)", maxHeight: "90vh", overflowY: "auto", background: "#fff" }}>
        <div className="row" style={{ justifyContent: "space-between", marginBottom: 10 }}>
          <span className={"badge " + policy.tag} style={{ marginBottom: 0 }}>{policy.label}</span>
          <button type="button" className="btn ghost sm" onClick={onClose}>Close ✕</button>
        </div>

        <h2 style={{ fontSize: 24 }}>{policy.insurer} · {policy.planName}</h2>
        <p className="note" style={{ marginBottom: 14 }}>
          Vehicle: <b>{vehicle}</b> · Payment frequency: <b>Annual single premium</b> · Status: <b>Demo quotation</b>
        </p>

        {policy.sponsored && (
          <div className="banner">
            <b>Sponsored placement.</b> We may receive compensation if you purchase this policy.
          </div>
        )}

        <div className="grid">
          <div className="cell"><small>Total Premium (incl. 18% GST)</small><b>{inr(policy.totalWithTax || Math.round(policy.premium * 1.18))} / yr</b></div>
          <div className="cell"><small>Base Premium (excl. GST)</small><b>{inr(policy.adjustedPremium || policy.premium)}</b></div>
          <div className="cell"><small>Insured Declared Value (IDV)</small><b>{policy.adjustedIdv || policy.idv}</b></div>
          <div className="cell"><small>Compulsory Deductible</small><b>{policy.deductible}</b></div>
          <div className="cell"><small>Claim Settlement Ratio</small><b>{policy.csr}</b></div>
          <div className="cell"><small>Cashless Garages</small><b>{policy.kolkataGarages}</b></div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 14, marginBottom: 18 }}>
          <div style={{ padding: 14, borderRadius: 14, background: "#f4f9f5", border: "1px solid #b7dfc5" }}>
            <h3 style={{ fontSize: 15, marginBottom: 8 }}>What is covered</h3>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, lineHeight: 1.6 }}>
              {(policy.coverageSummary || []).map((c) => <li key={c}>{c}</li>)}
            </ul>
          </div>
          <div style={{ padding: 14, borderRadius: 14, background: "#fdf4f3", border: "1px solid #f1b9b4" }}>
            <h3 style={{ fontSize: 15, marginBottom: 8 }}>Key exclusions (What is not covered)</h3>
            <ul style={{ margin: 0, paddingLeft: 18, fontSize: 13.5, lineHeight: 1.6 }}>
              {(policy.exclusions || []).map((x) => <li key={x}>{x}</li>)}
            </ul>
          </div>
        </div>

        <div className="why" style={{ marginBottom: 18 }}>
          <b>Claim process & Kolkata support: </b>{policy.claimProcess}. Local surveyor assistance available across Kolkata & Howrah pin codes.
        </div>

        <div className="row" style={{ justifyContent: "space-between", gap: 10 }}>
          <button type="button" className="btn ghost" onClick={() => onAddCompare(policy.id)}>
            {inCompare ? "✓ In Compare List" : "+ Add to compare"}
          </button>
          <div className="row" style={{ gap: 8 }}>
            <button type="button" className="btn ghost" onClick={() => { onClose(); onRequestCallback(policy); }}>
              Contact agent / Callback
            </button>
            <button type="button" className="btn" onClick={() => { onClose(); onBuyRenew(policy); }}>
              Get partner quotation →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function RequestCallback({ vehicle, plan, onBack, onSend }) {
  const [mode, setMode] = useState("call");
  const [f, setF] = useState({
    name: "",
    time: "Morning, 9am to 12pm",
    lang: "Bengali",
    actionType: plan?.actionType || "Request a callback",
    notes: "",
  });
  const up = (k) => (e) => setF({ ...f, [k]: e.target.value });
  const basePrem = plan?.adjustedPremium || plan?.premium || 8420;
  const gst = Math.round(basePrem * 0.18);
  const totalWithGst = basePrem + gst;

  return (
    <div className="narrow fade">
      <h1>{f.actionType}. <span>Kolkata advisor & partner assistance.</span></h1>
      <p className="sub">
        You selected <b>{plan?.insurer}</b> for <b>{vehicle}</b>. We do not collect online payments during MVP validation—an authorised partner advisor will share your verified quotation and assist with renewal.
      </p>

      <div className="card" style={{ marginBottom: 16, padding: "16px 20px", background: "#fff" }}>
        <div className="row" style={{ justifyContent: "space-between" }}>
          <div>
            <span className={"badge " + (plan?.tag || "best")} style={{ marginBottom: 6, display: "inline-block" }}>
              {plan?.label || "Selected Plan"}
            </span>
            <div style={{ fontWeight: 600, fontSize: 16 }}>{plan?.insurer} · {plan?.planName || "Comprehensive"}</div>
            <div className="note">
              IDV: {plan?.idv} · Base: {inr(basePrem)} + 18% GST ({inr(gst)}) = <b>{inr(totalWithGst)} incl. taxes</b>
            </div>
          </div>
          <button type="button" className="btn ghost sm" onClick={onBack}>
            Change plan
          </button>
        </div>
      </div>

      <div className="card">
        <div className="seg" role="tablist" aria-label="Preferred contact method">
          <button type="button" className={mode === "call" ? "on" : ""} onClick={() => setMode("call")}>
            Request a callback (Phone)
          </button>
          <button type="button" className={mode === "wa" ? "on" : ""} onClick={() => setMode("wa")}>
            Get quotation on WhatsApp
          </button>
        </div>

        <label className="field">
          <span>Purpose of request</span>
          <select value={f.actionType} onChange={up("actionType")}>
            <option>Request a callback</option>
            <option>Get partner quotation</option>
            <option>Renew with current insurer</option>
            <option>Buy new insurance</option>
            <option>Help with expired or complicated policy</option>
          </select>
        </label>

        <label className="field">
          <span>Your full name</span>
          <input value={f.name} onChange={up("name")} placeholder="e.g. Soumadip Roy" />
        </label>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
          <label className="field">
            <span>Preferred language</span>
            <select value={f.lang} onChange={up("lang")}>
              <option>Bengali</option>
              <option>English</option>
              <option>Hindi</option>
            </select>
          </label>

          <label className="field">
            <span>Best time to contact you (IST)</span>
            <select value={f.time} onChange={up("time")}>
              <option>Morning, 9am to 12pm</option>
              <option>Afternoon, 12pm to 4pm</option>
              <option>Evening, 4pm to 8pm</option>
            </select>
          </label>
        </div>

        <label className="field">
          <span>Specific question for the advisor (Optional)</span>
          <input
            value={f.notes}
            onChange={up("notes")}
            placeholder="e.g. Confirm 35% NCB transfer or Salt Lake cashless garage list"
          />
        </label>

        <p className="note" style={{ marginBottom: 14 }}>
          Consent notice (v2.1-DPDP-2026): By submitting this request, you authorise InsureDrive to share your registration number, name, and mobile number with the selected insurer partner solely for this motor-insurance quotation.
        </p>

        <div className="row" style={{ justifyContent: "space-between", marginTop: 10 }}>
          <button type="button" className="btn ghost" onClick={onBack}>
            ← Back to compare
          </button>
          <button
            type="button"
            className="btn"
            disabled={f.name.trim().length < 2}
            onClick={() => onSend({ ...f, mode, plan })}
            style={{ flex: 1 }}
          >
            {f.actionType} →
          </button>
        </div>
      </div>
    </div>
  );
}

export function DoneView({ ref_, vehicle, plan, lastReq, remind, setRemind, onRestart, onOpenGarage, onAdmin }) {
  const basePrem = plan?.adjustedPremium || plan?.premium || 8420;
  const totalWithTax = plan?.totalWithTax || Math.round(basePrem * 1.18);

  return (
    <div className="narrow fade">
      <div className="card">
        <div className="tick">✓</div>
        <h1 style={{ fontSize: 32 }}>Quotation & callback scheduled.</h1>
        <p className="sub">
          Lead reference <b style={{ color: "var(--ink)" }}>{ref_}</b>. A Kolkata advisor for <b>{plan?.insurer}</b> will reach you via{" "}
          <b>{lastReq?.mode === "wa" ? "WhatsApp" : "phone call"}</b> ({lastReq?.time || "Morning, 9am to 12pm"} · {lastReq?.lang || "Bengali"}).
        </p>

        <div className="grid" style={{ marginTop: 12, marginBottom: 22 }}>
          <div className="cell"><small>Vehicle saved</small><b>{vehicle}</b></div>
          <div className="cell"><small>Selected insurer</small><b>{plan?.insurer}</b></div>
          <div className="cell"><small>Premium (incl. GST)</small><b>{inr(totalWithTax)}/yr</b></div>
          <div className="cell"><small>Insured value (IDV)</small><b>{plan?.idv || "₹4,10,000"}</b></div>
        </div>

        <h2>Consent-based expiry reminder schedule</h2>
        <p className="note">Select which automated milestones should be queued for {vehicle} before expiry:</p>
        <div className="row" style={{ margin: "12px 0 24px", gap: 8 }}>
          {[
            [45, "45d: Educational guide"],
            [30, "30d: Comparison invite"],
            [15, "15d: Renewal alert"],
            [7, "7d: Urgent reminder"],
            [0, "Expiry day status"],
          ].map(([n, label]) => {
            const active = remind.includes(n);
            return (
              <button
                type="button"
                key={n}
                className={"btn sm " + (active ? "" : "ghost")}
                onClick={() =>
                  setRemind(active ? remind.filter((x) => x !== n) : [...remind, n])
                }
              >
                {active ? "✓ " : "+ "}{label}
              </button>
            );
          })}
        </div>

        <div className="row" style={{ justifyContent: "space-between", borderTop: "1px solid var(--line)", paddingTop: 18 }}>
          <button type="button" className="btn ghost" onClick={onRestart}>
            ← Back to comparison
          </button>
          <div className="row" style={{ gap: 8 }}>
            <button type="button" className="btn ghost" onClick={onOpenGarage}>
              Open My Garage
            </button>
            <button type="button" className="btn" onClick={onAdmin}>
              View in Admin Dashboard →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

