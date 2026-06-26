import React from "react";
import { X, ShieldCheck, Printer, Share2, Award } from "lucide-react";

export default function DigitalCertificate({ certificateData, onClose }) {
  if (!certificateData) return null;

  const { citizenName, title, city, govtRefId, amount, date, isVolunteer } = certificateData;

  const txnHash = `0x${Array.from({ length: 40 }, () =>
    "0123456789abcdef"[Math.floor(Math.random() * 16)]
  ).join("")}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "var(--bg-alpha-90)",
        backdropFilter: "blur(12px)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10100,
        padding: "20px"
      }}
    >
      <div
        className="glass-panel"
        style={{
          width: "100%",
          maxWidth: "600px",
          background: "var(--grad-cert)",
          border: "2px solid rgba(16, 185, 129, 0.3)",
          boxShadow: "0 0 40px rgba(16, 185, 129, 0.15)",
          borderRadius: "var(--radius-lg)",
          padding: "30px",
          position: "relative",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          backgroundImage: `
            radial-gradient(circle at 100% 0%, rgba(16, 185, 129, 0.08) 0%, transparent 40%),
            radial-gradient(circle at 0% 100%, rgba(99, 102, 241, 0.08) 0%, transparent 40%)
          `
        }}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            background: "transparent",
            border: "none",
            color: "var(--text-secondary)",
            cursor: "pointer",
            outline: "none"
          }}
        >
          <X size={20} />
        </button>

        {/* Certificate Frame Borders */}
        <div style={{
          border: "1px dashed rgba(16, 185, 129, 0.2)",
          padding: "16px",
          borderRadius: "var(--radius-md)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: "16px"
        }}>
          {/* Ashoka Chakra / Government Badge Header */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
            <div style={{
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              border: "2.5px solid var(--accent-success)",
              background: "rgba(16, 185, 129, 0.1)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 0 15px rgba(16, 185, 129, 0.2)"
            }}>
              {/* Ashoka Chakra 24-spoke SVG */}
              <svg width="30" height="30" viewBox="0 0 100 100" style={{ color: "var(--accent-success)", fill: "currentColor" }}>
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" />
                <circle cx="50" cy="50" r="8" stroke="currentColor" strokeWidth="2" fill="none" />
                {Array.from({ length: 24 }).map((_, i) => (
                  <line
                    key={i}
                    x1="50"
                    y1="50"
                    x2={50 + 37 * Math.cos((i * 2 * Math.PI) / 24)}
                    y2={50 + 37 * Math.sin((i * 2 * Math.PI) / 24)}
                    stroke="currentColor"
                    strokeWidth="1.5"
                  />
                ))}
              </svg>
            </div>
            <span style={{
              fontSize: "0.65rem",
              fontWeight: "800",
              letterSpacing: "0.15em",
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              marginTop: "4px"
            }}>
              Ministry of Housing and Urban Affairs • Govt of India
            </span>
            <span style={{
              fontSize: "0.6rem",
              fontWeight: "600",
              color: "var(--text-muted)",
              textTransform: "uppercase",
              letterSpacing: "0.1em"
            }}>
              Swachh Bharat Smart City Initiative (SBM-U 2.0)
            </span>
          </div>

          {/* Certificate Title */}
          <div style={{ marginTop: "6px" }}>
            <h2 style={{
              fontFamily: "var(--font-display)",
              fontSize: "1.4rem",
              fontWeight: "800",
              background: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.02em"
            }}>
              CIVIC INTEL RESOLUTION CREDENTIAL
            </h2>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", marginTop: "2px" }}>
              CR-DPI SECURE LEDGER ID: {govtRefId}
            </p>
          </div>

          {/* Body Text */}
          <div style={{ margin: "14px 0", maxWidth: "450px" }}>
            <p style={{
              fontSize: "0.85rem",
              color: "var(--text-primary)",
              lineHeight: "1.5",
              fontWeight: "500"
            }}>
              This is to formally recognize and record the civic contribution of citizen
            </p>
            <p style={{
              fontSize: "1.2rem",
              fontWeight: "800",
              color: "var(--text-primary)",
              margin: "6px 0",
              fontFamily: "var(--font-display)",
              letterSpacing: "0.03em"
            }}>
              {citizenName}
            </p>
            <p style={{
              fontSize: "0.8rem",
              color: "var(--text-secondary)",
              lineHeight: "1.5"
            }}>
              for actively volunteering resources towards the hyperlocal restoration of{" "}
              <strong>"{title}"</strong> in the metropolitan zone of <strong>{city}</strong>.
              {isVolunteer ? (
                <span>
                  {" "}Marcus Vance joined the citizen <strong>Fix Crew</strong> to coordinate labor, logistics, and neighborhood debris cleanups.
                </span>
              ) : (
                <span>
                  {" "}Contributed a micro-funding ledger pledge of <strong>₹{amount * 80} INR</strong> to finance direct repair operations.
                </span>
              )}
            </p>
          </div>

          {/* Cryptographic metadata & seals */}
          <div style={{
            width: "100%",
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "16px",
            borderTop: "1px solid var(--glass-border)",
            paddingTop: "14px",
            textAlign: "left"
          }}>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", textTransform: "uppercase" }}>DPI Transaction Hash</span>
              <span style={{ fontSize: "0.65rem", fontFamily: "monospace", color: "var(--accent-secondary)", wordBreak: "break-all" }}>
                {txnHash}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
              <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", textTransform: "uppercase" }}>Authorization Timestamp</span>
              <span style={{ fontSize: "0.65rem", color: "var(--text-secondary)" }}>
                {new Date(date).toLocaleString("en-IN", { timeZone: "IST" })} IST
              </span>
            </div>
          </div>

          {/* Signatures */}
          <div style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: "10px",
            borderTop: "1px solid var(--glass-border)",
            paddingTop: "14px"
          }}>
            {/* Municipal Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <ShieldCheck size={16} style={{ color: "var(--accent-success)" }} />
              <span style={{ fontSize: "0.65rem", fontWeight: "bold", color: "var(--text-secondary)" }}>
                Verified Civic Intel Seal
              </span>
            </div>

            {/* Signature 1 */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
              <span style={{
                fontFamily: "'Courier New', Courier, monospace",
                fontSize: "0.85rem",
                fontStyle: "italic",
                color: "var(--text-primary)",
                opacity: 0.8,
                transform: "rotate(-2deg)"
              }}>
                A. R. Kelkar
              </span>
              <div style={{ width: "80px", height: "1px", background: "var(--text-muted)" }} />
              <span style={{ fontSize: "0.55rem", color: "var(--text-muted)" }}>
                Municipal Commissioner
              </span>
            </div>

            {/* Signature 2 */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
              <span style={{
                fontFamily: "'Courier New', Courier, monospace",
                fontSize: "0.85rem",
                fontStyle: "italic",
                color: "var(--text-primary)",
                opacity: 0.8,
                transform: "rotate(1deg)"
              }}>
                SmartCity-DPI
              </span>
              <div style={{ width: "80px", height: "1px", background: "var(--text-muted)" }} />
              <span style={{ fontSize: "0.55rem", color: "var(--text-muted)" }}>
                Directorate Seal v2.4
              </span>
            </div>
          </div>
        </div>

        {/* Action button tools */}
        <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
          <button
            onClick={handlePrint}
            className="glass-btn"
            style={{ fontSize: "0.75rem", padding: "6px 12px" }}
          >
            <Printer size={12} />
            <span>Print Certificate</span>
          </button>
          <button
            onClick={() => {
              navigator.clipboard.writeText(`DPI Credential verification for ${citizenName}: Govt Ref ${govtRefId}. Txn: ${txnHash}`);
              alert("Credential hash copied to clipboard!");
            }}
            className="glass-btn glass-btn-primary"
            style={{ fontSize: "0.75rem", padding: "6px 12px" }}
          >
            <Share2 size={12} />
            <span>Verify & Share</span>
          </button>
        </div>
      </div>
    </div>
  );
}
