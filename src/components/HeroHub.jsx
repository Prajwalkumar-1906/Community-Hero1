import React, { useState } from "react";
import { Trophy, Award, Target, Star, Calendar, MapPin, CheckCircle, Clock, Heart, Users, FileText, ChevronRight } from "lucide-react";
import * as Icons from "lucide-react";

export default function HeroHub({ user, leaderboard, issues = [], onSelectIssue, inboxMessages = [], onMarkRead, t = {} }) {
  const [hubTab, setHubTab] = useState("reports"); // reports, volunteer, ledger

  const renderBadgeIcon = (iconName, color) => {
    const IconComponent = Icons[iconName] || Icons.Award;
    return <IconComponent size={18} style={{ color: color }} />;
  };

  // Filter personal contributions
  const myReports = issues.filter((i) => i.reportedBy === user.name);
  const myVolunteering = issues.filter((i) => i.volunteers?.includes(user.name));
  const myLedger = user.ledger || [];

  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString("en-IN", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    });
  };

  return (
    <div className="glass-panel scrollable-panel" style={{ gap: "20px" }}>
      {/* Header */}
      <div className="flex-between" style={{ borderBottom: "1px solid var(--glass-border)", paddingBottom: "12px" }}>
        <div className="flex-gap-sm">
          <Trophy size={20} style={{ color: "var(--accent-warning)" }} />
          <h3 style={{ fontFamily: "var(--font-display)" }}>{t.citizenDashboardTitle || "Citizen Dashboard & Hero Hub"}</h3>
        </div>
        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", background: "rgba(10,15,29,0.5)", padding: "4px 8px", borderRadius: "4px" }}>
          {t.trackRecord || "Track Record"}
        </span>
      </div>

      {/* Main Split Grid */}
      <div className="citizen-hub-grid" style={{ display: "grid", gridTemplateColumns: "1.1fr 1.3fr", gap: "20px", flex: 1, minHeight: 0 }}>
        
        {/* Left Column: Profile Card, Badges & Quests */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px", overflowY: "auto", paddingRight: "4px" }}>
          
          {/* User Stats Card */}
          <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "12px", background: "linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(6,182,212,0.05) 100%)" }}>
            <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
              <div style={{ position: "relative" }}>
                <img
                  src={user.avatar}
                  alt={user.name}
                  style={{ width: "56px", height: "56px", borderRadius: "50%", border: "2px solid var(--accent-secondary)", boxShadow: "var(--shadow-glow-cyan)" }}
                />
                <div style={{
                  position: "absolute",
                  bottom: "-4px",
                  right: "-4px",
                  background: "var(--grad-cyan-blue)",
                  borderRadius: "50%",
                  width: "20px",
                  height: "20px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: "0.7rem",
                  fontWeight: "bold",
                  border: "1px solid var(--bg-secondary)"
                }}>
                  {user.level}
                </div>
              </div>

              <div style={{ flex: 1 }}>
                <div className="flex-between">
                  <h4 style={{ fontSize: "1.1rem" }}>{user.name}</h4>
                  <span style={{ fontSize: "0.75rem", color: "var(--accent-secondary)", fontWeight: "600" }}>Rank #{user.rank}</span>
                </div>
                <span style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{t.civicSentinel || "Civic Sentinel"}</span>
                
                {/* XP bar */}
                <div style={{ marginTop: "6px" }}>
                  <div className="flex-between" style={{ fontSize: "0.65rem", marginBottom: "3px", color: "var(--text-muted)" }}>
                    <span>XP: {user.xp} / {user.xpNeeded}</span>
                    <span>{Math.round((user.xp / user.xpNeeded) * 100)}%</span>
                  </div>
                  <div className="progress-bar-container" style={{ height: "4px" }}>
                    <div className="progress-bar-fill" style={{ width: `${(user.xp / user.xpNeeded) * 100}%`, background: "var(--grad-hero)" }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Karma counter & Quests overview */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", borderTop: "1px solid var(--glass-border)", paddingTop: "10px", marginTop: "4px" }}>
              <div className="flex-center" style={{ flexDirection: "column", background: "rgba(10,15,29,0.3)", borderRadius: "var(--radius-sm)", padding: "8px 0" }}>
                <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase" }}>{t.karmaPoints || "Karma Points"}</span>
                <span style={{ fontSize: "1.1rem", fontWeight: "bold", color: "var(--accent-warning)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Star size={14} fill="var(--accent-warning)" /> {user.karma}
                </span>
              </div>

              <div className="flex-center" style={{ flexDirection: "column", background: "rgba(10,15,29,0.3)", borderRadius: "var(--radius-sm)", padding: "8px 0" }}>
                <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", textTransform: "uppercase" }}>{t.badgesUnlocked || "Badges Unlocked"}</span>
                <span style={{ fontSize: "1.1rem", fontWeight: "bold", color: "var(--accent-secondary)", display: "flex", alignItems: "center", gap: "4px" }}>
                  <Award size={14} /> {user.badges.length}
                </span>
              </div>
            </div>
          </div>

          {/* Badges Achievements */}
          <div>
            <h4 style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "4px" }}>
              <Award size={14} style={{ color: "var(--accent-primary)" }} /> {t.badgeAchievements || "Badge Achievements"}
            </h4>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
              {user.badges.map((badge) => (
                <div
                  key={badge.id}
                  className="glass-card flex-center"
                  style={{
                    flexDirection: "column",
                    padding: "8px 4px",
                    textAlign: "center",
                    background: "var(--bg-alpha-40)",
                    border: "1px solid var(--glass-border)",
                    borderRadius: "var(--radius-sm)"
                  }}
                  title={badge.desc}
                >
                  <div className="flex-center" style={{
                    width: "30px",
                    height: "30px",
                    borderRadius: "50%",
                    background: `${badge.color}15`,
                    marginBottom: "6px",
                    border: `1px solid ${badge.color}40`,
                    boxShadow: `0 0 10px ${badge.color}20`
                  }}>
                    {renderBadgeIcon(badge.icon, badge.color)}
                  </div>
                  <span style={{ fontSize: "0.7rem", fontWeight: "bold", whiteSpace: "nowrap" }}>{badge.title}</span>
                  <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", marginTop: "2px", lineHeight: "1" }}>{badge.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Active Quests */}
          <div>
            <h4 style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: "8px", display: "flex", alignItems: "center", gap: "4px" }}>
              <Target size={14} style={{ color: "var(--accent-secondary)" }} /> {t.activeQuests || "Neighborhood Quests"}
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {user.activeQuests.map((quest) => {
                const progressPct = (quest.progress / quest.target) * 100;
                return (
                  <div key={quest.id} className="glass-card" style={{ padding: "10px 12px", background: "var(--bg-alpha-40)" }}>
                    <div className="flex-between" style={{ marginBottom: "4px" }}>
                      <span style={{ fontSize: "0.75rem", fontWeight: "bold" }}>{quest.title}</span>
                      <span style={{ fontSize: "0.7rem", color: "var(--accent-secondary)", fontWeight: "600" }}>+{quest.reward} XP</span>
                    </div>
                    <p style={{ fontSize: "0.65rem", color: "var(--text-secondary)", marginBottom: "6px" }}>{quest.desc}</p>
                    <div className="flex-between" style={{ fontSize: "0.65rem", marginBottom: "2px" }}>
                      <span style={{ color: "var(--text-muted)" }}>Progress</span>
                      <span style={{ color: "var(--text-primary)", fontWeight: "bold" }}>{quest.progress} / {quest.target}</span>
                    </div>
                    <div className="progress-bar-container" style={{ height: "3px" }}>
                      <div className="progress-bar-fill" style={{ width: `${progressPct}%`, background: "var(--grad-cyan-blue)" }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Mini tabs for personal reports, volunteering, and points ledger */}
        <div className="glass-card" style={{ display: "flex", flexDirection: "column", gap: "14px", height: "100%", background: "var(--bg-alpha-20)", overflow: "hidden" }}>
          
          {/* Sub Navigation tabs */}
          <div style={{ display: "flex", gap: "6px", background: "var(--bg-alpha-60)", padding: "4px", borderRadius: "var(--radius-sm)", border: "1px solid var(--glass-border)", flexWrap: "wrap" }}>
            <button
              onClick={() => setHubTab("reports")}
              className="glass-btn"
              style={{
                flex: 1,
                minWidth: "70px",
                fontSize: "0.7rem",
                padding: "6px",
                justifyContent: "center",
                background: hubTab === "reports" ? "var(--accent-primary)" : "transparent",
                borderColor: "transparent",
                color: "white"
              }}
            >
              {t.myReports || "My Reports"} ({myReports.length})
            </button>
            <button
              onClick={() => setHubTab("volunteer")}
              className="glass-btn"
              style={{
                flex: 1,
                minWidth: "70px",
                fontSize: "0.7rem",
                padding: "6px",
                justifyContent: "center",
                background: hubTab === "volunteer" ? "var(--accent-primary)" : "transparent",
                borderColor: "transparent",
                color: "white"
              }}
            >
              {t.volunteer || "Volunteer"} ({myVolunteering.length})
            </button>
            <button
              onClick={() => setHubTab("inbox")}
              className="glass-btn"
              style={{
                flex: 1,
                minWidth: "70px",
                fontSize: "0.7rem",
                padding: "6px",
                justifyContent: "center",
                background: hubTab === "inbox" ? "var(--accent-primary)" : "transparent",
                borderColor: "transparent",
                color: "white"
              }}
            >
              Inbox ({inboxMessages.filter(m => m.unread).length > 0 ? `${inboxMessages.length} (New)` : inboxMessages.length})
            </button>
            <button
              onClick={() => setHubTab("ledger")}
              className="glass-btn"
              style={{
                flex: 1,
                minWidth: "70px",
                fontSize: "0.7rem",
                padding: "6px",
                justifyContent: "center",
                background: hubTab === "ledger" ? "var(--accent-primary)" : "transparent",
                borderColor: "transparent",
                color: "white"
              }}
            >
              {t.ledger || "Ledger"} ({myLedger.length})
            </button>
          </div>

          {/* Sub Tab contents */}
          <div style={{ flex: 1, overflowY: "auto", paddingRight: "4px" }}>
            
            {/* TAB: MY REPORTS */}
            {hubTab === "reports" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {myReports.length === 0 ? (
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontStyle: "italic", textAlign: "center", display: "block", marginTop: "20px" }}>
                    {t.noReportsYet || "You haven't reported any incidents yet."}
                  </span>
                ) : (
                  myReports.map((item) => {
                    let statusBadge = "badge-reported";
                    if (item.status === "Verified") statusBadge = "badge-verified";
                    else if (item.status === "In Progress") statusBadge = "badge-inprogress";
                    else if (item.status === "Resolved") statusBadge = "badge-resolved";

                    return (
                      <div
                        key={item.id}
                        onClick={() => onSelectIssue && onSelectIssue(item)}
                        className="glass-card"
                        style={{
                          display: "flex",
                          gap: "10px",
                          padding: "10px",
                          cursor: onSelectIssue ? "pointer" : "default",
                          background: "var(--bg-alpha-40)"
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.title}
                          style={{ width: "45px", height: "45px", borderRadius: "4px", objectFit: "cover", flexShrink: 0 }}
                        />
                        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                          <div className="flex-between">
                            <span style={{ fontSize: "0.75rem", fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginRight: "6px" }}>
                              {item.title}
                            </span>
                            <span className={`badge ${statusBadge}`} style={{ fontSize: "0.55rem", padding: "1px 4px" }}>{item.status}</span>
                          </div>
                          <span style={{ fontSize: "0.65rem", color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            <MapPin size={10} style={{ marginRight: "2px", display: "inline-block", verticalAlign: "middle" }} />
                            {item.locationName}
                          </span>
                          <div className="flex-between" style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "2px" }}>
                            <span>{formatDate(item.reportedDate)}</span>
                            <span>★ {item.upvotes} verified</span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB: MY VOLUNTEERING */}
            {hubTab === "volunteer" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {myVolunteering.length === 0 ? (
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontStyle: "italic", textAlign: "center", display: "block", marginTop: "20px" }}>
                    {t.noVolunteerCommitments || "No active volunteer commitments. Sign up in issue details!"}
                  </span>
                ) : (
                  myVolunteering.map((item) => {
                    let statusBadge = "badge-reported";
                    if (item.status === "Verified") statusBadge = "badge-verified";
                    else if (item.status === "In Progress") statusBadge = "badge-inprogress";
                    else if (item.status === "Resolved") statusBadge = "badge-resolved";

                    return (
                      <div
                        key={item.id}
                        onClick={() => onSelectIssue && onSelectIssue(item)}
                        className="glass-card"
                        style={{
                          display: "flex",
                          gap: "10px",
                          padding: "10px",
                          cursor: onSelectIssue ? "pointer" : "default",
                          background: "rgba(16, 185, 129, 0.03)",
                          borderColor: "rgba(16, 185, 129, 0.2)"
                        }}
                      >
                        <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", gap: "4px" }}>
                          <div className="flex-between">
                            <span style={{ fontSize: "0.75rem", fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {item.title}
                            </span>
                            <span className={`badge ${statusBadge}`} style={{ fontSize: "0.55rem", padding: "1px 4px" }}>{item.status}</span>
                          </div>
                          <span style={{ fontSize: "0.65rem", color: "var(--text-secondary)" }}>
                            <MapPin size={10} style={{ marginRight: "2px", display: "inline" }} />
                            {item.locationName}
                          </span>
                          <span style={{ fontSize: "0.65rem", color: "var(--accent-success)", fontWeight: "500" }}>
                            {t.fixCrewActive ? t.fixCrewActive.replace("{count}", item.volunteers?.length || 0) : `🛠️ Fix Crew active: ${item.volunteers?.length || 0} volunteers signed up`}
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* TAB: INBOX */}
            {hubTab === "inbox" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {inboxMessages.length === 0 ? (
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontStyle: "italic", textAlign: "center", display: "block", marginTop: "20px" }}>
                    No messages in your inbox.
                  </span>
                ) : (
                  inboxMessages.map((msg) => (
                    <div
                      key={msg.id}
                      onClick={() => onMarkRead && onMarkRead(msg.id)}
                      className="glass-card"
                      style={{
                        background: msg.unread ? "rgba(99, 102, 241, 0.05)" : "var(--bg-alpha-40)",
                        border: msg.unread ? "1px solid var(--accent-primary)" : "1px solid var(--glass-border)",
                        padding: "10px 12px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                        cursor: "pointer"
                      }}
                    >
                      <div className="flex-between">
                        <span style={{ fontSize: "0.75rem", fontWeight: "bold", color: msg.unread ? "var(--text-primary)" : "var(--text-secondary)", display: "flex", alignItems: "center", gap: "6px" }}>
                          {msg.unread && <span style={{ display: "inline-block", width: "6px", height: "6px", background: "var(--accent-primary)", borderRadius: "50%" }} />}
                          {msg.title}
                        </span>
                        <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>{formatDate(msg.date)}</span>
                      </div>
                      <span style={{ fontSize: "0.65rem", color: "var(--accent-secondary)" }}>From: {msg.sender}</span>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-secondary)", lineHeight: "1.3", marginTop: "4px", whiteSpace: "pre-wrap" }}>
                        {msg.body}
                      </p>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB: REWARDS LEDGER */}
            {hubTab === "ledger" && (
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {myLedger.length === 0 ? (
                  <span style={{ fontSize: "0.75rem", color: "var(--text-muted)", fontStyle: "italic", textAlign: "center", display: "block", marginTop: "20px" }}>
                    {t.noPointsRecorded || "No points recorded. Start verifying reports or reporting!"}
                  </span>
                ) : (
                  myLedger.map((log) => {
                    const isReport = log.type === "report";
                    const isVolunteer = log.type === "volunteer";
                    const pointsColor = isReport ? "#ef4444" : isVolunteer ? "#10b981" : "#06b6d4";

                    return (
                      <div
                        key={log.id}
                        className="flex-between"
                        style={{
                          background: "rgba(18, 24, 41, 0.4)",
                          border: "1px solid var(--glass-border)",
                          borderRadius: "var(--radius-sm)",
                          padding: "8px 12px",
                          fontSize: "0.75rem"
                        }}
                      >
                        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                          <span style={{ fontWeight: "600" }}>{log.action}</span>
                          <span style={{ fontSize: "0.65rem", color: "var(--text-muted)" }}>
                            {formatDate(log.date)}
                          </span>
                        </div>
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                          <span style={{ fontWeight: "700", color: "#10b981" }}>+{log.xp} XP</span>
                          <span style={{ fontSize: "0.65rem", color: "var(--accent-warning)", fontWeight: "bold" }}>
                            ★ +{log.karma} Karma
                          </span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

          </div>

        </div>

      </div>

      {/* Responsive layout styling inject */}
      <style>{`
        @media (max-width: 900px) {
          .citizen-hub-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
