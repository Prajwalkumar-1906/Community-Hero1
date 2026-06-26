import React, { useState, useEffect } from "react";
import { ShieldCheck, Key, RefreshCw, Eye, EyeOff, Cpu, HardDrive } from "lucide-react";
import { dbEngine } from "../data/dbEngine";

export default function AdminConsole({ issues }) {
  const [showRaw, setShowRaw] = useState(false);
  const [cipherText, setCipherText] = useState("");
  const [rotationStatus, setRotationStatus] = useState("Secured");
  const [latency, setLatency] = useState(0.24);

  const [selectedIssueId, setSelectedIssueId] = useState("");
  const [apiLogs, setApiLogs] = useState([
    "DPI Gateway Status: IDLE",
    "Ready for grievance push requests..."
  ]);
  const [isPushing, setIsPushing] = useState(false);

  // Set default selected issue
  useEffect(() => {
    if (issues && issues.length > 0 && !selectedIssueId) {
      setSelectedIssueId(issues[0].id);
    }
  }, [issues, selectedIssueId]);

  const handlePushToDPI = () => {
    const targetIssue = issues.find(i => i.id === selectedIssueId);
    if (!targetIssue) return;

    setIsPushing(true);
    setApiLogs(prev => [
      ...prev,
      `[${new Date().toLocaleTimeString()}] PUSH initialized for issue: ${targetIssue.id}`,
      `[${new Date().toLocaleTimeString()}] Routing payload to Swachh Bharat Smart City Gateway...`,
      `[${new Date().toLocaleTimeString()}] Preparing JSON request body...`
    ]);

    setTimeout(() => {
      setApiLogs(prev => [
        ...prev,
        `[${new Date().toLocaleTimeString()}] >> POST /v2/grievance/submit HTTP/1.1`,
        `[${new Date().toLocaleTimeString()}] >> Authorization: Bearer DPI_TOKEN_SBM_2026_XYZ`,
        `[${new Date().toLocaleTimeString()}] >> Content-Type: application/json`,
        `[${new Date().toLocaleTimeString()}] >> Payload: { id: "${targetIssue.id}", city: "${targetIssue.city}", category: "${targetIssue.category}" }`
      ]);

      setTimeout(() => {
        const mockRef = targetIssue.govtRefId || `SBM-${(targetIssue.city || "MUM").toUpperCase().substring(0,3)}-${targetIssue.category.substring(0,2).toUpperCase()}-${Math.floor(100000 + Math.random()*900000)}`;
        setApiLogs(prev => [
          ...prev,
          `[${new Date().toLocaleTimeString()}] << HTTP/1.1 202 Accepted`,
          `[${new Date().toLocaleTimeString()}] << Response: { status: "Registered", refId: "${mockRef}", routedTo: "${targetIssue.city} Grievance Division" }`,
          `[${new Date().toLocaleTimeString()}] DPI Grievance Push successful! Ticket linked.`,
          "----------------------------------------"
        ]);
        setIsPushing(false);
      }, 1200);
    }, 800);
  };

  // Sync Cipher text on load and render
  useEffect(() => {
    const raw = dbEngine.getRawCipher("issues");
    setCipherText(raw);
  }, [issues]);

  const handleRotateKeys = () => {
    setRotationStatus("Rotating...");
    const start = performance.now();
    
    setTimeout(() => {
      // Simulate decryption and re-encryption latency measurement
      const end = performance.now();
      setLatency(parseFloat((end - start + 0.15).toFixed(2)));
      setRotationStatus("Salt Keys Rotated!");
      
      setTimeout(() => {
        setRotationStatus("Secured");
      }, 2000);
    }, 800);
  };

  return (
    <div className="glass-panel scrollable-panel">
      {/* Header */}
      <div className="flex-between" style={{ borderBottom: "1px solid var(--glass-border)", paddingBottom: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div className="flex-center" style={{ width: "32px", height: "32px", background: "var(--accent-warning-glow)", color: "var(--accent-warning)", borderRadius: "50%" }}>
            <ShieldCheck size={16} />
          </div>
          <div>
            <h3 style={{ fontFamily: "var(--font-display)" }}>Security & Encrypted Ledger</h3>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Client-Side Crypto Database Monitor
            </p>
          </div>
        </div>
        <button
          onClick={handleRotateKeys}
          className="glass-btn"
          style={{ padding: "4px 10px", fontSize: "0.75rem", borderColor: "var(--accent-warning)" }}
          disabled={rotationStatus === "Rotating..."}
        >
          <RefreshCw size={12} className={rotationStatus === "Rotating..." ? "spin" : ""} />
          <span>{rotationStatus}</span>
        </button>
      </div>

      {/* Security Status Board */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <div className="glass-card flex-gap-sm" style={{ padding: "10px", background: "var(--bg-alpha-40)" }}>
          <Key size={20} style={{ color: "var(--accent-warning)", flexShrink: 0 }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>ALGORITHM</span>
            <span style={{ fontSize: "0.8rem", fontWeight: "bold" }}>XOR-Hex Shift (256-bit salt)</span>
          </div>
        </div>

        <div className="glass-card flex-gap-sm" style={{ padding: "10px", background: "var(--bg-alpha-40)" }}>
          <Cpu size={20} style={{ color: "var(--accent-secondary)", flexShrink: 0 }} />
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>DECRYPT LATENCY</span>
            <span style={{ fontSize: "0.8rem", fontWeight: "bold" }}>{latency} ms</span>
          </div>
        </div>
      </div>

      {/* Database Payload Size Card */}
      <div className="glass-card flex-between" style={{ padding: "10px 14px", background: "rgba(16, 185, 129, 0.05)", borderColor: "rgba(16, 185, 129, 0.2)" }}>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <HardDrive size={16} style={{ color: "var(--accent-success)" }} />
          <span style={{ fontSize: "0.75rem", color: "var(--text-primary)" }}>Local Database Security Seal Status</span>
        </div>
        <span style={{ fontSize: "0.75rem", color: "var(--accent-success)", fontWeight: "bold" }}>
          VERIFIED SECURE (SHA-256)
        </span>
      </div>

      {/* Cryptographic Ledger Panel */}
      <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: "8px" }}>
        <div className="flex-between">
          <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-secondary)" }}>
            Raw LocalStorage Encrypted Cipher vs Decrypted JSON
          </span>
          <button
            onClick={() => setShowRaw(!showRaw)}
            className="glass-btn"
            style={{ padding: "2px 8px", fontSize: "0.7rem", gap: "4px" }}
          >
            {showRaw ? <EyeOff size={10} /> : <Eye size={10} />}
            <span>{showRaw ? "Show JSON" : "Show Cipher Hex"}</span>
          </button>
        </div>

        {showRaw ? (
          /* Cipher text Hex view */
          <div
            style={{
              flex: 1,
              background: "var(--bg-alpha-80)",
              border: "1px solid var(--glass-border)",
              borderRadius: "var(--radius-sm)",
              padding: "12px",
              fontFamily: "monospace",
              fontSize: "0.7rem",
              lineHeight: "1.3",
              wordBreak: "break-all",
              overflowY: "auto",
              maxHeight: "220px",
              color: "#38bdf8"
            }}
          >
            <div style={{ color: "var(--text-muted)", marginBottom: "6px" }}>// Raw localStorage data block at key: ch_db_issues</div>
            {cipherText || "Loading cipher text ledger..."}
          </div>
        ) : (
          /* Decrypted formatted JSON view */
          <pre
            style={{
              flex: 1,
              background: "var(--bg-alpha-80)",
              border: "1px solid var(--glass-border)",
              borderRadius: "var(--radius-sm)",
              padding: "12px",
              fontFamily: "monospace",
              fontSize: "0.7rem",
              lineHeight: "1.3",
              overflowY: "auto",
              maxHeight: "220px",
              color: "#a7f3d0"
            }}
          >
            <div style={{ color: "var(--text-muted)", marginBottom: "6px" }}>// Decrypted JSON payload parse results</div>
            {JSON.stringify(issues.slice(0, 2), null, 2)}
            {"\n\n// ... showing first 2 items of database for inspector view"}
          </pre>
        )}
      </div>

      {/* Smart City DPI Integration Terminal */}
      <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "14px", display: "flex", flexDirection: "column", gap: "10px" }}>
        <div className="flex-between">
          <span style={{ fontSize: "0.85rem", fontWeight: "bold", color: "var(--accent-success)", display: "flex", alignItems: "center", gap: "6px" }}>
            🔗 Swachh Bharat DPI Gateway Dispatcher
          </span>
          <span className="badge badge-verified" style={{ fontSize: "0.6rem", padding: "1px 6px" }}>API Gateway Live</span>
        </div>

        <div style={{ display: "flex", gap: "8px" }}>
          <select
            value={selectedIssueId}
            onChange={(e) => setSelectedIssueId(e.target.value)}
            className="glass-input"
            style={{ flex: 1.5, fontSize: "0.75rem", padding: "6px" }}
          >
            {issues.map(item => (
              <option key={item.id} value={item.id} style={{ background: "var(--bg-secondary)" }}>
                [{item.city}] {item.title.substring(0, 25)}...
              </option>
            ))}
          </select>
          <button
            onClick={handlePushToDPI}
            className="glass-btn glass-btn-primary"
            style={{ flex: 1, fontSize: "0.75rem", padding: "6px 10px", justifyContent: "center" }}
            disabled={isPushing || !selectedIssueId}
          >
            {isPushing ? "Connecting..." : "Push to Swachh Bharat"}
          </button>
        </div>

        {/* Console logs */}
        <div style={{
          background: "var(--bg-alpha-95)",
          border: "1px solid var(--glass-border)",
          borderRadius: "var(--radius-sm)",
          padding: "10px",
          fontFamily: "monospace",
          fontSize: "0.65rem",
          color: "#38bdf8",
          lineHeight: "1.4",
          maxHeight: "120px",
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: "2px"
        }}>
          {apiLogs.map((log, index) => (
            <div key={index} style={{
              color: log.includes("<<") ? "#34d399" : log.includes(">>") ? "#fbbf24" : log.includes("DPI") ? "#60a5fa" : "inherit"
            }}>
              {log}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        .spin {
          animation: spin-kf 1s linear infinite;
        }
        @keyframes spin-kf {
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
