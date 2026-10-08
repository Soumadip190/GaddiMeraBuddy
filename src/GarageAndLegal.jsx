import React, { useState } from "react";
import { formatPlate, deriveVehicleDetails, inr, REMINDER_TIMELINE } from "./data.js";

export function GarageView({
  activeVehicle,
  onSelectVehicle,
  savedVehicles = [],
  setSavedVehicles,
  savedQuotes = [],
  remind = [45, 30, 15, 7, 0],
  setRemind = () => {},
  commHistory = [],
  setCommHistory = () => {},
  onOpenConsent,
  onRequestQuoteFromSaved,
}) {
  const safeVehicles = Array.isArray(savedVehicles) ? savedVehicles : [];
  const safeQuotes = Array.isArray(savedQuotes) ? savedQuotes : [];
  const safeRemind = Array.isArray(remind) ? remind : [45, 30, 15, 7, 0];
  const safeHistory = Array.isArray(commHistory) ? commHistory : [];

  const [newPlate, setNewPlate] = useState("");
  const [newNickname, setNewNickname] = useState("");
  const [err, setErr] = useState("");
  const [editingNick, setEditingNick] = useState(null);
  const [nickDraft, setNickDraft] = useState("");

  const addVehicle = (e) => {
    e.preventDefault();
    const cleaned = newPlate.toUpperCase().replace(/[^A-Z0-9]/g, "");
    const validStd = /^[A-Z]{2}[0-9]{1,2}[A-Z]{0,3}[0-9]{4}$/.test(cleaned);
    const validBh = /^[0-9]{2}BH[0-9]{4}[A-Z]{1,2}$/.test(cleaned);
    if (!validStd && !validBh) {
      setErr("Enter a valid registration number like WB02AB1234 or 22BH1234AB");
      return;
    }
    const fmtPlate = formatPlate(cleaned);
    if (savedVehicles.some((v) => v.plate === fmtPlate)) {
      setErr("That vehicle is already in your garage.");
      return;
    }
    const details = deriveVehicleDetails(fmtPlate);
    const nextItem = {
      plate: fmtPlate,
      nickname: newNickname.trim() || details.nickname || "Kolkata Commuter",
      addedAt: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
      history: [`Saved to My Garage on ${new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })}`],
    };
    const updated = [nextItem, ...savedVehicles];
    setSavedVehicles(updated);
    setNewPlate("");
    setNewNickname("");
    setErr("");
  };

  const saveNickname = (plate) => {
    setSavedVehicles(
      savedVehicles.map((v) => (v.plate === plate ? { ...v, nickname: nickDraft.trim() || v.nickname } : v))
    );
    setEditingNick(null);
  };

  const triggerTestReminder = (days) => {
    const item = REMINDER_TIMELINE.find((r) => r.days === days);
    const nextMsg = {
      id: "MSG-" + (404 + commHistory.length),
      channel: "WhatsApp & SMS",
      template: `${days === 0 ? "Expiry-Day" : days + "-Day"} ${item?.type || "Reminder"} (${activeVehicle})`,
      sentAt: "Just now (IST)",
      status: "Queued (Duplicate-checked)",
      retries: 0,
    };
    setCommHistory([nextMsg, ...commHistory]);
  };

  return (
    <div className="fade">
      <div className="row" style={{ justifyContent: "space-between", alignItems: "flex-end", marginBottom: 10 }}>
        <div>
          <h1>My Garage. <span>Saved vehicles, quotations, 5-stage reminders & history.</span></h1>
          <p className="sub" style={{ marginBottom: 14 }}>
            Manage your household cars and two-wheelers in Kolkata, customize nicknames, review saved partner quotations, and control your automated expiry reminder queue.
          </p>
        </div>
        <button type="button" className="btn ghost sm" onClick={onOpenConsent} style={{ marginBottom: 14 }}>
          Manage consent & channels →
        </button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 18 }}>
        {/* Saved Vehicles Card */}
        <div className="card">
          <h2>Saved vehicles ({savedVehicles.length})</h2>
          <p className="note" style={{ marginBottom: 14 }}>
            Select any vehicle to open its dashboard, or assign a nickname (e.g. "Dad's Scooter", "Salt Lake Sedan").
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {savedVehicles.map((item) => {
              const info = deriveVehicleDetails(item.plate);
              const isCurrent = item.plate === activeVehicle;
              const statusTone = info.days < 0 ? "r" : info.days <= 30 ? "w" : "y";
              return (
                <div
                  key={item.plate}
                  style={{
                    padding: "16px",
                    background: "rgba(255,255,255,0.75)",
                    backdropFilter: "blur(8px)",
                    border: isCurrent ? "2px solid var(--accent)" : "1px solid var(--glass-border)",
                    borderRadius: 18,
                    boxShadow: isCurrent ? "0 6px 20px rgba(46,74,139,0.12)" : "none",
                  }}
                >
                  <div className="row" style={{ justifyContent: "space-between", marginBottom: 6 }}>
                    <div className="row" style={{ gap: 8 }}>
                      <span className="plate-chip"><small>IND</small>{item.plate}</span>
                      <span className={"pill " + statusTone}>{info.policyStatus}</span>
                      {isCurrent && <span className="pill y">Active</span>}
                    </div>
                    <button
                      type="button"
                      className={"btn sm " + (isCurrent ? "" : "ghost")}
                      onClick={() => onSelectVehicle(item.plate)}
                    >
                      {isCurrent ? "Viewing" : "Compare renewal options"}
                    </button>
                  </div>

                  <div className="row" style={{ justifyContent: "space-between", marginTop: 6 }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: 14.5 }}>
                        “{item.nickname}” · <span style={{ fontWeight: 500, color: "var(--mut)" }}>{info.make} {info.model}</span>
                      </div>
                      <div className="note">
                        Expires <b>{info.expiry}</b> ({info.days} days left) · Current: {info.currentInsurer}
                      </div>
                    </div>
                    <button
                      type="button"
                      className="btn ghost sm"
                      onClick={() => { setEditingNick(item.plate); setNickDraft(item.nickname); }}
                    >
                      Edit nickname
                    </button>
                  </div>

                  {editingNick === item.plate && (
                    <div className="row" style={{ marginTop: 10, gap: 8 }}>
                      <input
                        value={nickDraft}
                        onChange={(e) => setNickDraft(e.target.value)}
                        placeholder="Vehicle nickname"
                        aria-label="Vehicle nickname"
                        style={{ flex: 1, padding: "8px 12px", border: "1.5px solid #bfbeb6", borderRadius: 10 }}
                      />
                      <button type="button" className="btn sm" onClick={() => saveNickname(item.plate)}>Save</button>
                      <button type="button" className="btn ghost sm" onClick={() => setEditingNick(null)}>Cancel</button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <form onSubmit={addVehicle} style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--line)" }}>
            <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 8 }}>Add another vehicle to My Garage</div>
            <div className="row" style={{ gap: 8 }}>
              <input
                value={newPlate}
                onChange={(e) => setNewPlate(e.target.value.toUpperCase())}
                placeholder="Reg no. e.g. WB02AB1234"
                maxLength={14}
                aria-label="Add vehicle registration number"
                style={{ flex: 1, minWidth: 150, padding: "10px 14px", border: "1.5px solid #bfbeb6", borderRadius: 999, background: "#fff" }}
              />
              <input
                value={newNickname}
                onChange={(e) => setNewNickname(e.target.value)}
                placeholder="Nickname (optional)"
                maxLength={28}
                aria-label="Vehicle nickname"
                style={{ flex: 1, minWidth: 140, padding: "10px 14px", border: "1.5px solid #bfbeb6", borderRadius: 999, background: "#fff" }}
              />
              <button type="submit" className="btn sm" style={{ color: "#ffffff" }}>
                + Add vehicle
              </button>
            </div>
            {err && <div style={{ color: "var(--bad)", fontSize: 13, marginTop: 8 }}>{err}</div>}
          </form>
        </div>

        {/* 5-Stage Reminder Schedule Card */}
        <div className="card">
          <h2>5-Stage Automated Reminder Schedule</h2>
          <p className="note" style={{ marginBottom: 14 }}>
            Scheduled job queue with IST time-zone handling, duplicate-message prevention, and instant stop on opt-out.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {REMINDER_TIMELINE.map((r) => {
              const on = safeRemind.includes(r.days);
              return (
                <div
                  key={r.days}
                  style={{
                    padding: "12px 14px",
                    background: "#fff",
                    border: "1.5px solid var(--line)",
                    borderRadius: 14,
                  }}
                >
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <label className="row" style={{ gap: 10, cursor: "pointer", flex: 1 }}>
                      <input
                        type="checkbox"
                        checked={on}
                        onChange={() =>
                          setRemind(on ? safeRemind.filter((x) => x !== r.days) : [...safeRemind, r.days])
                        }
                        style={{ width: 18, height: 18, accentColor: "var(--ink)" }}
                      />
                      <div>
                        <b style={{ fontSize: 14 }}>
                          {r.days === 0 ? "Expiry date (0 days)" : `${r.days} days before expiry`} · {r.type}
                        </b>
                        <div className="note">{r.desc}</div>
                      </div>
                    </label>
                    <button
                      type="button"
                      className="btn ghost sm"
                      onClick={() => triggerTestReminder(r.days)}
                    >
                      Queue test
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Saved Quotations & Renewal History */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: 18, marginTop: 18 }}>
        <div className="card">
          <h2>Saved Quotations ({savedQuotes.length})</h2>
          <p className="note" style={{ marginBottom: 12 }}>
            Quotations you bookmarked during comparison so you can review or request a partner callback later.
          </p>
          {savedQuotes.length === 0 ? (
            <div className="banner" style={{ marginBottom: 0 }}>
              No saved quotations yet. Click "Save quote" on any policy card in the Compare step to bookmark it here.
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {savedQuotes.map((q) => (
                <div
                  key={q.id + q.vehicle}
                  className="row"
                  style={{
                    justifyContent: "space-between",
                    padding: "14px 18px",
                    background: "rgba(255,255,255,0.75)",
                    border: "1px solid var(--glass-border)",
                    borderRadius: 16,
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 600 }}>{q.insurer} · {q.planName}</div>
                    <div className="note">
                      Vehicle: <b>{q.vehicle}</b> · IDV {q.adjustedIdv || q.idv} · <b>{inr(q.totalWithTax || Math.round(q.premium * 1.18))} incl. GST</b>
                    </div>
                  </div>
                  <button
                    type="button"
                    className="btn sm"
                    onClick={() => onRequestQuoteFromSaved(q)}
                  >
                    Request callback
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="card">
          <h2>Renewal & Communication History</h2>
          <p className="note" style={{ marginBottom: 12 }}>
            Delivery-status tracking, retry counter, and renewal audit log (IST timezone).
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {commHistory.map((m) => (
              <div
                key={m.id}
                className="row"
                style={{
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  background: "#fff",
                  border: "1.5px solid var(--line)",
                  borderRadius: 12,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: 13.5 }}>{m.template}</div>
                  <div className="note">{m.channel} · {m.sentAt} · Retries: {m.retries}</div>
                </div>
                <span className="pill y">{m.status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function LegalAndConsentView({
  consentRecords,
  setConsentRecords,
  channels,
  setChannels,
  mobile,
  vehicle,
  onDeleteData,
}) {
  const [subTab, setSubTab] = useState("consent");
  const [deletionMsg, setDeletionMsg] = useState("");

  const togglePurpose = (id) => {
    const now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST";
    setConsentRecords(
      consentRecords.map((r) => {
        if (r.id !== id) return r;
        const granting = r.status !== "Granted";
        return {
          ...r,
          status: granting ? "Granted" : "Withdrawn",
          timestamp: granting ? now : r.timestamp,
          withdrawnAt: granting ? null : now,
          sourcePage: "Manage Consent Page",
        };
      })
    );
  };

  const stopPartnerMarketing = () => {
    const now = new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }) + " IST";
    setConsentRecords(
      consentRecords.map((r) =>
        ["partner_promo", "health_offers", "loan_offers"].includes(r.purposeId)
          ? { ...r, status: "Withdrawn", withdrawnAt: now, sourcePage: "Manage Consent Stop-All" }
          : r
      )
    );
  };

  const handleDeleteRequest = () => {
    setDeletionMsg(
      `Data deletion request (DEL-${Math.floor(1000 + Math.random() * 9000)}) logged for +91 ${mobile} and ${vehicle}. All saved vehicles, quotes, and active reminder schedules have been queued for erasure in compliance with the DPDP Act.`
    );
    if (onDeleteData) onDeleteData();
  };

  return (
    <div className="fade">
      <h1>Privacy, Consent & Support Center. <span>DPDP Act compliance & transparent disclosures.</span></h1>
      <p className="sub">
        Control every communication channel and purpose separately, view audit timestamps, read our partner commission disclosure, or request complete data deletion.
      </p>

      <div className="row" style={{ gap: 8, marginBottom: 20 }}>
        {[
          ["consent", "Manage Consent & Channels"],
          ["about", "About Us & Kolkata Support"],
          ["privacy", "Privacy, Terms & Cookie Policy"],
          ["disclosure", "Partner & Commission Disclosure"],
          ["grievance", "Grievance Officer & Data Deletion"],
        ].map(([k, lbl]) => (
          <button
            type="button"
            key={k}
            onClick={() => setSubTab(k)}
            className={"chip-btn " + (subTab === k ? "on" : "")}
          >
            {lbl}
          </button>
        ))}
      </div>

      {subTab === "consent" && (
        <div style={{ display: "grid", gap: 18 }}>
          <div className="card">
            <div className="row" style={{ justifyContent: "space-between", marginBottom: 12 }}>
              <div>
                <h2 style={{ margin: 0 }}>Channel Switches (Instant Opt-Out)</h2>
                <p className="note">Turn individual communication channels on or off at any time. Scheduled reminders stop immediately upon opt-out.</p>
              </div>
              <button type="button" className="btn ghost sm" onClick={stopPartnerMarketing}>
                Stop all partner & cross-sell marketing
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
              {[
                ["sms", "SMS Messages"],
                ["wa", "WhatsApp Updates"],
                ["email", "Email Summaries"],
                ["calls", "Advisor Phone Calls"],
              ].map(([key, label]) => (
                <label
                  key={key}
                  className="row"
                  style={{
                    justifyContent: "space-between",
                    padding: "12px 14px",
                    background: "#fff",
                    border: "1.5px solid var(--line)",
                    borderRadius: 12,
                    cursor: "pointer",
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{label}</span>
                  <input
                    type="checkbox"
                    checked={!!channels[key]}
                    onChange={() => setChannels({ ...channels, [key]: !channels[key] })}
                    style={{ width: 18, height: 18, accentColor: "var(--ink)" }}
                  />
                </label>
              ))}
            </div>
          </div>

          <div className="card">
            <h2>Granular Purpose-Level Consent Ledger</h2>
            <p className="note" style={{ marginBottom: 14 }}>
              We never bundle future marketing into one broad checkbox. Every purpose is recorded separately with User ID, Notice Version, Source Page, and Withdrawal Timestamp.
            </p>
            <div className="tbl">
              <table>
                <thead>
                  <tr>
                    <th>Consent ID & User</th>
                    <th>Purpose</th>
                    <th>Channel</th>
                    <th>Notice Version & Source</th>
                    <th>Granted / Withdrawn Timestamp</th>
                    <th>Status & Action</th>
                  </tr>
                </thead>
                <tbody>
                  {consentRecords.map((r) => (
                    <tr key={r.id}>
                      <td>
                        <b>{r.id}</b>
                        <div className="note">{r.userId}</div>
                      </td>
                      <td><b>{r.purpose}</b></td>
                      <td>{r.channel}</td>
                      <td>
                        <div>{r.noticeVersion}</div>
                        <div className="note">{r.sourcePage}</div>
                      </td>
                      <td>
                        <div>Granted: {r.timestamp}</div>
                        {r.withdrawnAt && <div className="note" style={{ color: "var(--bad)" }}>Withdrawn: {r.withdrawnAt}</div>}
                      </td>
                      <td>
                        <div className="row" style={{ gap: 8 }}>
                          <span className={"pill " + (r.status === "Granted" ? "y" : r.status === "Withdrawn" ? "r" : "")}>
                            {r.status}
                          </span>
                          <button type="button" className="btn ghost sm" onClick={() => togglePurpose(r.id)}>
                            {r.status === "Granted" ? "Withdraw" : "Grant"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {subTab === "about" && (
        <div className="card">
          <h2>About InsureDrive · Kolkata’s Vehicle-Insurance Renewal Assistant</h2>
          <p className="sub">
            "A simple vehicle-insurance renewal assistant that helps users understand, compare and renew policies, save vehicles, and receive consent-based expiry reminders."
          </p>
          <div className="grid">
            <div className="cell"><small>Initial Target Segment</small><b>Private Car & Two-Wheeler Owners in Kolkata</b></div>
            <div className="cell"><small>Languages Supported</small><b>Bengali, English & Hindi</b></div>
            <div className="cell"><small>Primary Focus Window</small><b>Policies expiring within 45 days</b></div>
            <div className="cell"><small>Support Desk</small><b>Salt Lake Sector V, Kolkata 700091 · +91 33 4001 8820</b></div>
          </div>
          <p className="note">
            Unlike national comparison marketplaces that bombard users with telemarketing calls, InsureDrive focuses on plain-language policy explanations, local Kolkata cashless garage clarity, help for expired or complicated policies, and strictly consent-based renewal reminders.
          </p>
        </div>
      )}

      {subTab === "privacy" && (
        <div className="card">
          <h2>Privacy Policy, Terms of Service & Cookie Policy</h2>
          <div style={{ display: "grid", gap: 14, marginTop: 12 }}>
            <div style={{ padding: 14, background: "#fff", borderRadius: 12, border: "1px solid var(--line)" }}>
              <h3>1. Privacy Notice (DPDP Act 2023 Compliant)</h3>
              <p className="note">
                We collect your vehicle registration number, mobile number, and optional policy documents solely to display renewal options, prepare quotations through authorised partners, and send the expiry reminders you explicitly opt into. Health-insurance or loan offers are never sent unless separately consented.
              </p>
            </div>
            <div style={{ padding: 14, background: "#fff", borderRadius: 12, border: "1px solid var(--line)" }}>
              <h3>2. Terms of Service</h3>
              <p className="note">
                InsureDrive operates as a vehicle-insurance renewal assistant and lead facilitator during MVP validation. Final policy underwriting, inspection, and issuance are performed by IRDAI-licensed insurers or brokers.
              </p>
            </div>
            <div style={{ padding: 14, background: "#fff", borderRadius: 12, border: "1px solid var(--line)" }}>
              <h3>3. Cookie & Local Storage Policy</h3>
              <p className="note">
                We use strictly necessary browser storage (`idv.vehicles`) to keep your saved garage vehicles and reminder preferences available on your device. No third-party advertising trackers are loaded without consent.
              </p>
            </div>
          </div>
        </div>
      )}

      {subTab === "disclosure" && (
        <div className="card">
          <h2>Partner & Commission Disclosure</h2>
          <p className="sub">
            How our recommendations and commercial placements work:
          </p>
          <ul style={{ lineHeight: 1.7, fontSize: 14.5 }}>
            <li><b>Unbiased Customer-Fit Ranking:</b> Our "Best match for your preferences" and "Lowest premium" labels are calculated purely on coverage, IDV, deductible, add-ons, and nearby Kolkata cashless garages.</li>
            <li><b>Transparent Sponsorship:</b> Commercial partner campaigns are always marked with a visible badge: <i>"Sponsored placement. We may receive compensation if you purchase this policy."</i></li>
            <li><b>Partner Compensation:</b> When you request a partner quotation or purchase a policy through an authorised partner, we may receive a referral or marketing fee where permitted by regulation. This never increases your premium.</li>
          </ul>
        </div>
      )}

      {subTab === "grievance" && (
        <div className="card">
          <h2>Grievance Redressal & Right to Data Deletion</h2>
          <p className="note" style={{ marginBottom: 14 }}>
            Data Protection & Grievance Officer: <b>Anirban Chatterjee</b> · Email: <b>privacy-grievance@insuredrive.in</b> · Address: Godrej Waterside Tower II, Salt Lake Sector V, Kolkata – 700091. Turnaround time: Within 72 hours.
          </p>
          <div style={{ padding: 16, background: "#fff", border: "1.5px solid var(--line)", borderRadius: 14 }}>
            <h3>Request immediate deletion of your personal data</h3>
            <p className="note" style={{ marginBottom: 12 }}>
              Erase your mobile number (+91 {mobile}), vehicle records ({vehicle}), saved quotations, and all scheduled reminders.
            </p>
            <button type="button" className="btn" onClick={handleDeleteRequest}>
              Request data deletion now
            </button>
            {deletionMsg && (
              <div className="banner" style={{ marginTop: 12, marginBottom: 0 }}>
                <b>Confirmed:</b> {deletionMsg}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
