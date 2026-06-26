import React, { useState, useEffect } from "react";
import { X, Check, Loader2, QrCode, Smartphone, Sparkles, Award } from "lucide-react";

export default function PaymentGateway({ activePayment, onSuccess, onCancel }) {
  const [payMethod, setPayMethod] = useState("qr"); // qr, upi
  const [upiId, setUpiId] = useState("marcus@okaxis");
  const [status, setStatus] = useState("idle"); // idle, processing, success
  const [processMsg, setProcessMsg] = useState("Initializing NPCI Session...");
  const [txnHash, setTxnHash] = useState("");

  const { issueId, amount, issueTitle } = activePayment || {};

  useEffect(() => {
    if (status === "processing") {
      const messages = [
        "Initializing NPCI Security Session...",
        "Awaiting citizen device approval...",
        "Validating consensus handshake...",
        "Generating cryptographic receipt hash..."
      ];

      let currentMsgIndex = 0;
      const interval = setInterval(() => {
        currentMsgIndex++;
        if (currentMsgIndex < messages.length) {
          setProcessMsg(messages[currentMsgIndex]);
        }
      }, 700);

      const timeout = setTimeout(() => {
        // Complete payment
        const hash = "TXN-" + Math.floor(100000000000 + Math.random() * 900000000000) + "-IN";
        setTxnHash(hash);
        setStatus("success");
        clearInterval(interval);
      }, 3000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [status]);

  if (!activePayment) return null;

  const handleStartPayment = (e) => {
    e.preventDefault();
    setStatus("processing");
  };

  const handleComplete = () => {
    onSuccess(issueId, amount);
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: "var(--bg-alpha-80)",
      backdropFilter: "blur(8px)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 99999,
      animation: "fadeIn 0.25s ease-out forwards"
    }}>
      <div className="glass-panel" style={{
        width: "100%",
        maxWidth: "400px",
        background: "var(--grad-dark-card)",
        border: "1px solid var(--glass-border)",
        boxShadow: "0 0 40px rgba(6,182,212,0.15)",
        borderRadius: "var(--radius-md)",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        position: "relative",
        animation: "scaleIn 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards"
      }}>
        {/* Header */}
        <div className="flex-between" style={{ borderBottom: "1px solid var(--glass-border)", paddingBottom: "10px" }}>
          <div className="flex-gap-sm">
            <Sparkles size={16} style={{ color: "var(--accent-secondary)" }} />
            <h3 style={{ fontSize: "1.05rem" }}>Secure UPI Civic Gateway</h3>
          </div>
          {status !== "processing" && (
            <button
              onClick={onCancel}
              style={{ background: "transparent", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Content States */}
        {status === "idle" && (
          <form onSubmit={handleStartPayment} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={{ background: "rgba(255,255,255,0.03)", padding: "10px 14px", borderRadius: "var(--radius-sm)", border: "1px solid var(--glass-border)" }}>
              <div style={{ fontSize: "0.7rem", color: "var(--text-secondary)" }}>Contributing Pledges for:</div>
              <div style={{ fontSize: "0.85rem", fontWeight: "bold", margin: "2px 0" }}>{issueTitle}</div>
              <div style={{ fontSize: "1.1rem", color: "var(--accent-success)", fontWeight: "800", marginTop: "4px" }}>
                ₹{amount * 80} INR <span style={{ fontSize: "0.75rem", fontWeight: "normal", color: "var(--text-muted)" }}>(${amount} USD Equivalent)</span>
              </div>
            </div>

            {/* Selector */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
              <button
                type="button"
                onClick={() => setPayMethod("qr")}
                className="glass-btn"
                style={{
                  justifyContent: "center",
                  borderColor: payMethod === "qr" ? "var(--accent-secondary)" : "var(--glass-border)",
                  background: payMethod === "qr" ? "rgba(6,182,212,0.1)" : "transparent"
                }}
              >
                <QrCode size={14} /> BharatQR Scan
              </button>
              <button
                type="button"
                onClick={() => setPayMethod("upi")}
                className="glass-btn"
                style={{
                  justifyContent: "center",
                  borderColor: payMethod === "upi" ? "var(--accent-secondary)" : "var(--glass-border)",
                  background: payMethod === "upi" ? "rgba(6,182,212,0.1)" : "transparent"
                }}
              >
                <Smartphone size={14} /> UPI VPA Id
              </button>
            </div>

            {/* QR Screen */}
            {payMethod === "qr" && (
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", margin: "10px 0" }}>
                {/* SVG Visual Mock QR Code */}
                <div style={{
                  padding: "16px",
                  background: "white",
                  borderRadius: "8px",
                  boxShadow: "0 0 20px rgba(255,255,255,0.05)"
                }}>
                  <svg width="140" height="140" viewBox="0 0 100 100" style={{ display: "block" }}>
                    {/* Corners */}
                    <rect x="0" y="0" width="30" height="30" fill="#0A0F1D" />
                    <rect x="5" y="5" width="20" height="20" fill="white" />
                    <rect x="10" y="10" width="10" height="10" fill="#0A0F1D" />

                    <rect x="70" y="0" width="30" height="30" fill="#0A0F1D" />
                    <rect x="75" y="5" width="20" height="20" fill="white" />
                    <rect x="80" y="10" width="10" height="10" fill="#0A0F1D" />

                    <rect x="0" y="70" width="30" height="30" fill="#0A0F1D" />
                    <rect x="5" y="75" width="20" height="20" fill="white" />
                    <rect x="10" y="80" width="10" height="10" fill="#0A0F1D" />

                    {/* Dotted Grid Mockup */}
                    <rect x="35" y="5" width="8" height="8" fill="#0A0F1D" />
                    <rect x="55" y="12" width="10" height="6" fill="#0A0F1D" />
                    <rect x="40" y="20" width="12" height="8" fill="#0A0F1D" />
                    <rect x="15" y="40" width="15" height="10" fill="#0A0F1D" />
                    <rect x="50" y="45" width="20" height="15" fill="#0A0F1D" />
                    <rect x="80" y="40" width="12" height="18" fill="#0A0F1D" />
                    <rect x="35" y="75" width="15" height="15" fill="#0A0F1D" />
                    <rect x="70" y="70" width="20" height="8" fill="#0A0F1D" />
                    <rect x="85" y="82" width="10" height="10" fill="#0A0F1D" />
                  </svg>
                </div>
                <div style={{ fontSize: "0.7rem", color: "var(--text-muted)", textAlign: "center" }}>
                  Scan using GPay, PhonePe, BHIM or any banking app
                </div>
              </div>
            )}

            {/* UPI ID VPA Screen */}
            {payMethod === "upi" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>Virtual Payment Address (VPA)</label>
                <input
                  type="text"
                  className="glass-input"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="name@upi"
                  required
                />
                <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>
                  Enter your VPA and look for a notification on your smartphone app.
                </span>
              </div>
            )}

            <button type="submit" className="glass-btn glass-btn-primary" style={{ justifyContent: "center", marginTop: "10px" }}>
              Authorize Payment (₹{amount * 80})
            </button>
          </form>
        )}

        {status === "processing" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "40px 10px", gap: "16px" }}>
            <Loader2 className="loader-spin" size={48} style={{ color: "var(--accent-secondary)" }} />
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
              <span style={{ fontSize: "0.9rem", fontWeight: "bold" }}>Processing Transaction</span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", textAlign: "center" }}>{processMsg}</span>
            </div>
          </div>
        )}

        {status === "success" && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {/* Success icon */}
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", margin: "10px 0" }}>
              <div style={{
                width: "48px",
                height: "48px",
                borderRadius: "50%",
                background: "rgba(16, 185, 129, 0.1)",
                border: "2px solid var(--accent-success)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 0 15px rgba(16, 185, 129, 0.3)"
              }}>
                <Check size={24} style={{ color: "var(--accent-success)" }} />
              </div>
              <span style={{ fontSize: "1rem", fontWeight: "bold", color: "var(--accent-success)" }}>Pledge Confirmed!</span>
            </div>

            {/* Receipt Summary */}
            <div style={{
              background: "var(--bg-alpha-60)",
              border: "1px solid var(--glass-border)",
              borderRadius: "var(--radius-sm)",
              padding: "12px 14px",
              fontSize: "0.75rem",
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            }}>
              <div className="flex-between">
                <span style={{ color: "var(--text-secondary)" }}>Transaction ID:</span>
                <span style={{ fontFamily: "monospace", color: "var(--text-primary)" }}>{txnHash.substring(0, 16)}...</span>
              </div>
              <div className="flex-between">
                <span style={{ color: "var(--text-secondary)" }}>Pledged Project:</span>
                <span style={{ fontWeight: "bold", maxWidth: "160px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={issueTitle}>
                  {issueTitle}
                </span>
              </div>
              <div className="flex-between" style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "8px", marginTop: "4px" }}>
                <span style={{ color: "var(--text-secondary)" }}>Total Charged:</span>
                <span style={{ fontWeight: "bold", color: "var(--accent-success)" }}>₹{amount * 80} INR</span>
              </div>
            </div>

            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "rgba(99, 102, 241, 0.05)",
              border: "1px solid rgba(99, 102, 241, 0.2)",
              borderRadius: "var(--radius-sm)",
              padding: "8px 10px"
            }}>
              <Award size={18} style={{ color: "var(--accent-warning)", flexShrink: 0 }} />
              <div style={{ display: "flex", flexDirection: "column", fontSize: "0.65rem", color: "var(--text-secondary)" }}>
                <span style={{ color: "var(--text-primary)", fontWeight: "bold" }}>+{amount * 10} XP & +{amount * 2} Karma Points</span>
                Registered to your citizen docket profile.
              </div>
            </div>

            <button onClick={handleComplete} className="glass-btn glass-btn-primary" style={{ justifyContent: "center" }}>
              Collect Rewards & Receipt
            </button>
          </div>
        )}
      </div>

      {/* Global CSS inject for scanning and loaders */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        .loader-spin {
          animation: spin-kf 1s linear infinite;
        }
      `}</style>
    </div>
  );
}
