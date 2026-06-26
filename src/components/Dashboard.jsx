import React from "react";
import { Cpu, AlertCircle, BarChart3, Clock, CheckCircle2, TrendingUp, Zap, HelpCircle } from "lucide-react";
import { PREDICTIVE_INSIGHTS } from "../data/mockData";

export default function Dashboard({ issues }) {
  // Statistics Calculations
  const totalIssues = issues.length;
  const resolvedIssues = issues.filter((i) => i.status === "Resolved").length;
  const activeIssues = totalIssues - resolvedIssues;
  const resolutionRate = totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0;
  const criticalIssues = issues.filter((i) => i.severity === "Critical" && i.status !== "Resolved").length;

  // Volunteers Sum
  const totalVolunteers = issues.reduce((sum, current) => sum + (current.volunteers?.length || 0), 0);

  // Issues by Category Chart Data
  const categories = [
    { name: "Roads & Mobility", color: "var(--accent-primary)" },
    { name: "Streetlights & Safety", color: "var(--accent-secondary)" },
    { name: "Water & Sanitation", color: "var(--accent-success)" },
    { name: "Waste Management", color: "var(--accent-warning)" },
    { name: "Public Facilities", color: "var(--accent-danger)" }
  ];

  const categoryCounts = categories.map((cat) => {
    const count = issues.filter((i) => i.category === cat.name).length;
    const resolved = issues.filter((i) => i.category === cat.name && i.status === "Resolved").length;
    return {
      ...cat,
      count,
      resolved
    };
  });

  const maxCount = Math.max(...categoryCounts.map((c) => c.count), 1);

  return (
    <div className="glass-panel scrollable-panel" style={{ gap: "20px" }}>
      {/* Header */}
      <div className="flex-between" style={{ borderBottom: "1px solid var(--glass-border)", paddingBottom: "12px" }}>
        <div className="flex-gap-sm">
          <BarChart3 size={20} style={{ color: "var(--accent-secondary)" }} />
          <h3>Impact & Analytics Console</h3>
        </div>
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", background: "rgba(10,15,29,0.5)", padding: "4px 8px", borderRadius: "4px" }}>
          Live Hyperlocal Feed
        </span>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "10px" }}>
        <div className="glass-card flex-center" style={{ flexDirection: "column", padding: "12px 6px", textAlign: "center" }}>
          <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Active Issues</span>
          <span style={{ fontSize: "1.4rem", fontFamily: "var(--font-display)", fontWeight: "bold", margin: "4px 0", color: "var(--accent-secondary)" }}>
            {activeIssues}
          </span>
          <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>{criticalIssues} Critical</span>
        </div>

        <div className="glass-card flex-center" style={{ flexDirection: "column", padding: "12px 6px", textAlign: "center" }}>
          <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Resolution Rate</span>
          <span style={{ fontSize: "1.4rem", fontFamily: "var(--font-display)", fontWeight: "bold", margin: "4px 0", color: "var(--accent-success)" }}>
            {resolutionRate}%
          </span>
          <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>{resolvedIssues} Fixed</span>
        </div>

        <div className="glass-card flex-center" style={{ flexDirection: "column", padding: "12px 6px", textAlign: "center" }}>
          <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Active Volunteers</span>
          <span style={{ fontSize: "1.4rem", fontFamily: "var(--font-display)", fontWeight: "bold", margin: "4px 0", color: "var(--accent-primary)" }}>
            {totalVolunteers}
          </span>
          <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>Total mobilizations</span>
        </div>

        <div className="glass-card flex-center" style={{ flexDirection: "column", padding: "12px 6px", textAlign: "center" }}>
          <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "uppercase" }}>Est. Response</span>
          <span style={{ fontSize: "1.4rem", fontFamily: "var(--font-display)", fontWeight: "bold", margin: "4px 0", color: "var(--accent-warning)" }}>
            14.2h
          </span>
          <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>-1.5h this week</span>
        </div>
      </div>

      {/* SVG Charts Section */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Issues by Category Bar Chart */}
        <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "12px", minHeight: "220px" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-secondary)" }}>
            Issues Distribution by Category
          </span>

          <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1, justifyContent: "center" }}>
            {categoryCounts.map((cat, idx) => {
              const widthPct = Math.max(10, (cat.count / maxCount) * 100);
              return (
                <div key={idx} style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div className="flex-between" style={{ fontSize: "0.7rem" }}>
                    <span style={{ color: "var(--text-primary)" }}>{cat.name}</span>
                    <span style={{ fontWeight: "bold" }}>{cat.count} <span style={{ color: "var(--text-muted)", fontWeight: "normal" }}>({cat.resolved} fixed)</span></span>
                  </div>
                  <div className="progress-bar-container" style={{ height: "6px", background: "rgba(255,255,255,0.03)" }}>
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${widthPct}%`,
                        background: cat.color,
                        boxShadow: `0 0 8px ${cat.color}80`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Resolution Rate Area Chart (SVG Vector Drawing) */}
        <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <div className="flex-between">
            <span style={{ fontSize: "0.8rem", fontWeight: "600", color: "var(--text-secondary)" }}>
              Weekly Resolution Performance
            </span>
            <span style={{ fontSize: "0.7rem", color: "var(--accent-success)", fontWeight: "600" }}>
              +8.5% MoM
            </span>
          </div>

          <div style={{ flex: 1, position: "relative", display: "flex", alignItems: "flex-end", height: "120px", marginTop: "10px" }}>
            {/* SVG Glowing Line & Grid */}
            <svg viewBox="0 0 100 40" style={{ width: "100%", height: "100%", overflow: "visible" }}>
              <defs>
                <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--accent-secondary)" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="var(--accent-secondary)" stopOpacity="0.0" />
                </linearGradient>
              </defs>

              {/* Grid Lines */}
              <line x1="0" y1="10" x2="100" y2="10" stroke="var(--glass-border)" strokeWidth="0.25" strokeDasharray="1,1" />
              <line x1="0" y1="20" x2="100" y2="20" stroke="var(--glass-border)" strokeWidth="0.25" strokeDasharray="1,1" />
              <line x1="0" y1="30" x2="100" y2="30" stroke="var(--glass-border)" strokeWidth="0.25" strokeDasharray="1,1" />

              {/* Area */}
              <path
                d="M 0 35 L 20 28 L 40 30 L 60 22 L 80 15 L 100 12 L 100 40 L 0 40 Z"
                fill="url(#areaGrad)"
              />

              {/* Line */}
              <path
                d="M 0 35 L 20 28 L 40 30 L 60 22 L 80 15 L 100 12"
                fill="none"
                stroke="var(--accent-secondary)"
                strokeWidth="1.2"
                style={{ filter: "drop-shadow(0px 0px 4px var(--accent-secondary))" }}
              />

              {/* Data points */}
              <circle cx="20" cy="28" r="1.5" fill="var(--bg-primary)" stroke="var(--accent-secondary)" strokeWidth="0.8" />
              <circle cx="60" cy="22" r="1.5" fill="var(--bg-primary)" stroke="var(--accent-secondary)" strokeWidth="0.8" />
              <circle cx="100" cy="12" r="1.5" fill="var(--bg-primary)" stroke="var(--accent-secondary)" strokeWidth="0.8" />
            </svg>

            {/* X Axis Labels */}
            <div style={{ position: "absolute", bottom: "-18px", width: "100%", display: "flex", justifyContent: "space-between", fontSize: "0.6rem", color: "var(--text-muted)" }}>
              <span>Wk 21</span>
              <span>Wk 22</span>
              <span>Wk 23</span>
              <span>Wk 24</span>
              <span>Wk 25</span>
              <span>Wk 26 (Current)</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI PREDICTIVE INSIGHTS */}
      <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "14px" }}>
        <div className="flex-gap-sm" style={{ marginBottom: "12px" }}>
          <Cpu size={16} style={{ color: "var(--accent-secondary)" }} />
          <h4 style={{ fontSize: "0.9rem" }}>AI Infrastructure Predictive Maintenance Risks</h4>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {PREDICTIVE_INSIGHTS.map((insight) => {
            const isHigh = insight.severity === "High";
            const isMedium = insight.severity === "Medium";
            const severityColor = isHigh ? "var(--accent-danger)" : isMedium ? "var(--accent-warning)" : "var(--accent-secondary)";

            return (
              <div
                key={insight.id}
                style={{
                  background: "var(--bg-alpha-40)",
                  border: `1px solid var(--glass-border)`,
                  borderLeft: `3px solid ${severityColor}`,
                  borderRadius: "var(--radius-sm)",
                  padding: "10px 14px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "4px"
                }}
              >
                <div className="flex-between">
                  <span style={{ fontSize: "0.8rem", fontWeight: "bold" }}>{insight.title}</span>
                  <div className="flex-gap-sm">
                    <span style={{ fontSize: "0.75rem", color: severityColor, fontWeight: "700" }}>{insight.probability} Probability</span>
                    <span className="badge" style={{
                      fontSize: "0.6rem",
                      padding: "1px 4px",
                      background: isHigh ? "rgba(239,68,68,0.15)" : isMedium ? "rgba(245,158,11,0.15)" : "rgba(6,182,212,0.15)",
                      color: severityColor,
                      borderColor: "transparent"
                    }}>
                      {insight.severity}
                    </span>
                  </div>
                </div>
                <span style={{ fontSize: "0.7rem", color: "var(--accent-secondary)", fontWeight: "500" }}>Zone: {insight.zone}</span>
                <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: "1.3", marginTop: "2px" }}>{insight.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
