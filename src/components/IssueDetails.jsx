import React, { useState } from "react";
import {
  Calendar,
  User,
  MapPin,
  Heart,
  Users,
  MessageSquare,
  DollarSign,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Play,
  Send
} from "lucide-react";
import { getAssignedAgency } from "../data/mockData";
export default function IssueDetails({
  issue,
  currentUser,
  isAdmin,
  onVerify,
  onVolunteer,
  onDonate,
  onAddComment,
  onUpdateStatus
}) {
  const [commentText, setCommentText] = useState("");
  const [adminNote, setAdminNote] = useState("");
  const [donateAmount, setDonateAmount] = useState(10);

  if (!issue) {
    return (
      <div className="glass-panel flex-center" style={{ height: "100%", flexDirection: "column", color: "var(--text-muted)", gap: "10px", minHeight: "350px" }}>
        <MessageSquare size={36} />
        <p style={{ textAlign: "center", maxWidth: "250px" }}>Select a pin on the map or click a report in the list to view community resolution progress.</p>
      </div>
    );
  }

  const {
    id,
    title,
    category,
    status,
    severity,
    description,
    locationName,
    reportedBy,
    reportedDate,
    upvotes,
    verifiedCount,
    userVerified,
    volunteers = [],
    crowdFunding,
    image,
    comments = [],
    history = []
  } = issue;

  const isVolunteered = volunteers.includes(currentUser.name);

  // Formatting date helper
  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  const handlePostComment = (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(id, commentText);
    setCommentText("");
  };

  const handleAdminStatusChange = (newStatus) => {
    onUpdateStatus(id, newStatus, adminNote || `Status updated to ${newStatus} by authority.`);
    setAdminNote("");
  };

  // Compute severity and status classes
  let severityClass = "badge-minor";
  if (severity === "Critical") severityClass = "badge-critical";
  else if (severity === "Major") severityClass = "badge-major";

  let statusClass = "badge-reported";
  if (status === "Verified") statusClass = "badge-verified";
  else if (status === "In Progress") statusClass = "badge-inprogress";
  else if (status === "Resolved") statusClass = "badge-resolved";

  return (
    <div className="glass-panel scrollable-panel">
      {/* Title & Metadata */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", marginBottom: "8px" }}>
          <h3 style={{ fontSize: "1.2rem", fontFamily: "var(--font-display)" }}>{title}</h3>
          <div style={{ display: "flex", gap: "6px" }}>
            <span className={`badge ${severityClass}`}>{severity}</span>
            <span className={`badge ${statusClass}`}>{status}</span>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", fontSize: "0.8rem", color: "var(--text-secondary)" }}>
          <div className="flex-gap-sm">
            <User size={12} />
            <span>{reportedBy}</span>
          </div>
          <div className="flex-gap-sm">
            <Calendar size={12} />
            <span>{formatDate(reportedDate)}</span>
          </div>
          <div className="flex-gap-sm">
            <MapPin size={12} />
            <span>{locationName}</span>
          </div>
        </div>
      </div>

      {/* Image Thumbnail with Overlay */}
      {image && (
        <div style={{ position: "relative", width: "100%", height: "160px", borderRadius: "var(--radius-md)", overflow: "hidden", border: "1px solid var(--glass-border)" }}>
          <img src={image} alt={title} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          <div style={{ position: "absolute", bottom: "8px", left: "8px", background: "rgba(0,0,0,0.6)", padding: "4px 8px", borderRadius: "4px", fontSize: "0.75rem", color: "#a5b4fc" }}>
            Category: {category}
          </div>
        </div>
      )}

      {/* Description */}
      <div style={{ background: "var(--bg-alpha-40)", padding: "12px", borderRadius: "var(--radius-sm)", border: "1px solid var(--glass-border)" }}>
        <p style={{ fontSize: "0.85rem", lineHeight: "1.4", color: "var(--text-primary)" }}>{description}</p>
      </div>

      {/* Citizen Collaboration Actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        {/* Verify and Upvote Button */}
        <button
          onClick={() => onVerify(id)}
          className="glass-btn"
          style={{
            borderColor: userVerified ? "var(--accent-primary)" : "var(--glass-border)",
            background: userVerified ? "var(--accent-primary-glow)" : "var(--bg-tertiary)",
            justifyContent: "center"
          }}
        >
          <Heart size={14} fill={userVerified ? "var(--accent-primary)" : "none"} style={{ color: userVerified ? "var(--accent-primary)" : "inherit" }} />
          <span>{userVerified ? "Verified!" : "Verify Issue"} ({upvotes})</span>
        </button>

        {/* Volunteer Button */}
        <button
          onClick={() => onVolunteer(id)}
          className="glass-btn"
          style={{
            borderColor: isVolunteered ? "var(--accent-success)" : "var(--glass-border)",
            background: isVolunteered ? "var(--accent-success-glow)" : "var(--bg-tertiary)",
            justifyContent: "center"
          }}
        >
          <Users size={14} style={{ color: isVolunteered ? "var(--accent-success)" : "inherit" }} />
          <span>{isVolunteered ? "Volunteering" : "Join Fix Crew"} ({volunteers.length})</span>
        </button>
      </div>

      {/* Crowdfunding Section (If enabled) */}
      {crowdFunding && crowdFunding.enabled && (
        <div style={{ background: "rgba(6, 182, 212, 0.05)", border: "1px solid rgba(6, 182, 212, 0.2)", borderRadius: "var(--radius-md)", padding: "12px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div className="flex-between">
            <span style={{ fontSize: "0.8rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px", color: "var(--accent-secondary)" }}>
              <TrendingUp size={14} /> Local Crowdfunding Active
            </span>
            <span style={{ fontSize: "0.8rem", fontWeight: "bold" }}>
              ${crowdFunding.current} / ${crowdFunding.target}
            </span>
          </div>

          {/* Progress bar */}
          <div className="progress-bar-container">
            <div
              className="progress-bar-fill"
              style={{
                width: `${Math.min(100, (crowdFunding.current / crowdFunding.target) * 100)}%`,
                background: "var(--grad-cyan-blue)"
              }}
            />
          </div>

          <div className="flex-between" style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>
            <span>{crowdFunding.contributors} neighbors contributed</span>
            <span>{Math.round((crowdFunding.current / crowdFunding.target) * 100)}% Funded</span>
          </div>

          {/* Quick Donation Trigger */}
          {crowdFunding.current < crowdFunding.target ? (
            <div style={{ display: "flex", gap: "8px", marginTop: "4px" }}>
              <select
                value={donateAmount}
                onChange={(e) => setDonateAmount(Number(e.target.value))}
                className="glass-input"
                style={{ flex: 1, padding: "4px 8px", fontSize: "0.8rem" }}
              >
                <option value={5}>$5</option>
                <option value={10}>$10</option>
                <option value={20}>$20</option>
                <option value={50}>$50</option>
              </select>
              <button
                onClick={() => onDonate(id, donateAmount)}
                className="glass-btn glass-btn-secondary"
                style={{ flex: 2, padding: "4px 10px", fontSize: "0.8rem", justifyContent: "center" }}
              >
                <DollarSign size={12} /> Pledge Micro-Fund
              </button>
            </div>
          ) : (
            <div style={{ fontSize: "0.75rem", color: "var(--accent-success)", fontWeight: "600", textAlign: "center" }}>
              Funding Goal Achieved! Volunteer action has been fully financed.
            </div>
          )}
        </div>
      )}

      {/* GOVERNMENT DPI API DISPATCH DOCKET */}
      <div style={{
        background: "rgba(16, 185, 129, 0.03)",
        border: "1px solid rgba(16, 185, 129, 0.2)",
        borderRadius: "var(--radius-md)",
        padding: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        marginTop: "4px"
      }}>
        <div className="flex-between">
          <span style={{ fontSize: "0.8rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "6px", color: "var(--accent-success)" }}>
            🟢 Government Action Dispatch
          </span>
          <span style={{
            fontSize: "0.6rem",
            padding: "1px 6px",
            background: "rgba(16, 185, 129, 0.15)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            borderRadius: "3px",
            color: "var(--accent-success)",
            fontWeight: "700"
          }}>
            CONNECTED
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px", fontSize: "0.75rem" }}>
          <div className="flex-between">
            <span style={{ color: "var(--text-secondary)" }}>Assigned Body:</span>
            <span style={{ fontWeight: "700", color: "var(--text-primary)" }}>{getAssignedAgency(issue.city || "Mumbai", category)}</span>
          </div>
          <div className="flex-between">
            <span style={{ color: "var(--text-secondary)" }}>API Gateway:</span>
            <span style={{ color: "var(--text-primary)", fontFamily: "monospace" }}>Swachhata Smart City REST v2.4</span>
          </div>
          <div className="flex-between">
            <span style={{ color: "var(--text-secondary)" }}>Govt Ticket Ref:</span>
            <span style={{ fontWeight: "bold", color: "var(--accent-secondary)", fontFamily: "monospace" }}>{issue.govtRefId || `SBM-${(issue.city || "Mumbai").toUpperCase().substring(0,3)}-${category.substring(0,2).toUpperCase()}-${Math.floor(100000 + (id.charCodeAt(id.length - 1) || 5) * 12345) % 900000 + 100000}`}</span>
          </div>
        </div>
      </div>

      {/* CIVIL AUTHORITY / ADMIN RESOLUTION CONSOLE */}
      {isAdmin && (
        <div style={{ background: "rgba(245, 158, 11, 0.05)", border: "1px solid rgba(245, 158, 11, 0.2)", borderRadius: "var(--radius-md)", padding: "12px", display: "flex", flexDirection: "column", gap: "10px" }}>
          <span style={{ fontSize: "0.8rem", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px", color: "var(--accent-warning)" }}>
            <AlertTriangle size={14} /> Authority Console
          </span>

          <input
            type="text"
            className="glass-input"
            style={{ fontSize: "0.8rem", padding: "8px" }}
            placeholder="Official status note / action report..."
            value={adminNote}
            onChange={(e) => setAdminNote(e.target.value)}
          />

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
            <button
              onClick={() => handleAdminStatusChange("In Progress")}
              className="glass-btn"
              style={{ fontSize: "0.8rem", padding: "6px", borderColor: "rgba(245, 158, 11, 0.4)", justifyContent: "center" }}
              disabled={status === "In Progress"}
            >
              <Clock size={12} /> Dispatch Workers
            </button>
            <button
              onClick={() => handleAdminStatusChange("Resolved")}
              className="glass-btn"
              style={{ fontSize: "0.8rem", padding: "6px", borderColor: "rgba(16, 185, 129, 0.4)", justifyContent: "center" }}
              disabled={status === "Resolved"}
            >
              <CheckCircle size={12} /> Confirm Fixed
            </button>
          </div>
        </div>
      )}

      {/* vertical timeline history */}
      <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "12px" }}>
        <h4 style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "10px" }}>Issue History & Steps</h4>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {history.map((h, index) => (
            <div key={index} style={{ display: "flex", gap: "10px", position: "relative" }}>
              {/* timeline line */}
              {index < history.length - 1 && (
                <div style={{ position: "absolute", left: "6px", top: "14px", bottom: "-14px", width: "2px", background: "var(--glass-border)" }} />
              )}
              {/* timeline dot */}
              <div style={{
                width: "14px",
                height: "14px",
                borderRadius: "50%",
                background: h.status === "Resolved" ? "var(--accent-success)" : h.status === "In Progress" ? "var(--accent-warning)" : "var(--accent-primary)",
                border: "3px solid var(--bg-secondary)",
                marginTop: "2px",
                zIndex: 2
              }} />
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "0.8rem", fontWeight: "600" }}>{h.status}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{formatDate(h.date)}</span>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginTop: "2px" }}>{h.note}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* COMMENTS SECTION */}
      <div style={{ borderTop: "1px solid var(--glass-border)", paddingTop: "12px", display: "flex", flexDirection: "column", flex: 1 }}>
        <h4 style={{ fontSize: "0.9rem", color: "var(--text-secondary)", marginBottom: "10px", display: "flex", alignItems: "center", gap: "6px" }}>
          <MessageSquare size={14} /> Comments ({comments.length})
        </h4>

        {/* Comment list */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px", overflowY: "auto", flex: 1, maxHeight: "200px", marginBottom: "12px", paddingRight: "4px" }}>
          {comments.length === 0 ? (
            <span style={{ fontSize: "0.8rem", color: "var(--text-muted)", fontStyle: "italic" }}>No comments yet. Start the conversation.</span>
          ) : (
            comments.map((c) => (
              <div key={c.id} style={{ background: "rgba(18, 24, 41, 0.4)", border: "1px solid var(--glass-border)", borderRadius: "var(--radius-sm)", padding: "8px 10px" }}>
                <div className="flex-between" style={{ marginBottom: "4px" }}>
                  <div className="flex-gap-sm">
                    <span style={{ fontSize: "0.8rem", fontWeight: "bold" }}>{c.author}</span>
                    <span style={{
                      fontSize: "0.65rem",
                      padding: "1px 6px",
                      borderRadius: "3px",
                      background: c.role === "Civil Authority" || c.role === "City Inspector" ? "rgba(245,158,11,0.15)" : "rgba(255,255,255,0.06)",
                      color: c.role === "Civil Authority" || c.role === "City Inspector" ? "var(--accent-warning)" : "var(--text-secondary)"
                    }}>
                      {c.role}
                    </span>
                  </div>
                  <span style={{ fontSize: "0.7rem", color: "var(--text-muted)" }}>{formatDate(c.date)}</span>
                </div>
                <p style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>{c.content}</p>
              </div>
            ))
          )}
        </div>

        {/* Add comment form */}
        <form onSubmit={handlePostComment} style={{ display: "flex", gap: "8px", position: "relative" }}>
          <input
            type="text"
            className="glass-input"
            style={{ padding: "8px 12px", fontSize: "0.8rem" }}
            placeholder="Add to resolution discussion..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
          />
          <button type="submit" className="glass-btn" style={{ padding: "8px 12px" }}>
            <Send size={12} />
          </button>
        </form>
      </div>
    </div>
  );
}
