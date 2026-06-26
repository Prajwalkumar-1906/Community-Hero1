import React, { useState, useEffect } from "react";
import {
  Sparkles,
  MapPin,
  TrendingUp,
  Award,
  ShieldAlert,
  ShieldCheck,
  PlusCircle,
  FileText,
  BarChart3,
  Trophy,
  Lock,
  Eye,
  LogOut,
  X,
  Check,
  Bell,
  Sun,
  Moon
} from "lucide-react";
import { INITIAL_ISSUES, MOCK_USER, LEADERBOARD, generateGovtGrievanceId } from "./data/mockData";
import { dbEngine } from "./data/dbEngine";
import { translations } from "./data/translations";
import MapWorkspace from "./components/MapWorkspace";
import ReportForm from "./components/ReportForm";
import IssueDetails from "./components/IssueDetails";
import Dashboard from "./components/Dashboard";
import HeroHub from "./components/HeroHub";
import AdminConsole from "./components/AdminConsole";
import Chatbot from "./components/Chatbot";
import PaymentGateway from "./components/PaymentGateway";
import DigitalCertificate from "./components/DigitalCertificate";
import { playSound } from "./utils/sfx";

// Import Logo Image Asset
import logoImg from "./assets/logo_community_hero.png";

export default function App() {
  // Lang Selection state (en, hi, kn, mr, bn, ta, te, gu)
  const [selectedLang, setSelectedLang] = useState("en");
  const t = translations[selectedLang] || translations.en;

  // Theme selection state (light / dark)
  const [theme, setTheme] = useState(() => localStorage.getItem("ch_theme") || "dark");

  useEffect(() => {
    if (theme === "light") {
      document.body.classList.add("light-theme");
    } else {
      document.body.classList.remove("light-theme");
    }
    localStorage.setItem("ch_theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    playSound.click();
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  };

  // Encrypted state bindings (Loads from encrypted localStorage index, falls back to seeds)
  const [issues, setIssues] = useState(() => {
    const loaded = dbEngine.load("issues", INITIAL_ISSUES);
    if (loaded && loaded.length > 0 && !loaded[0].city) {
      dbEngine.clear("issues");
      dbEngine.clear("user_profile");
      dbEngine.clear("leaderboard");
      return INITIAL_ISSUES;
    }
    return loaded;
  });
  const [currentUser, setCurrentUser] = useState(() => {
    const loadedIssues = dbEngine.load("issues", INITIAL_ISSUES);
    if (loadedIssues && loadedIssues.length > 0 && !loadedIssues[0].city) {
      return MOCK_USER;
    }
    return dbEngine.load("user_profile", MOCK_USER);
  });
  const [leaderboard, setLeaderboard] = useState(() => {
    const loadedIssues = dbEngine.load("issues", INITIAL_ISSUES);
    if (loadedIssues && loadedIssues.length > 0 && !loadedIssues[0].city) {
      return LEADERBOARD;
    }
    return dbEngine.load("leaderboard", LEADERBOARD);
  });
  
  // City Selection state
  const [selectedCity, setSelectedCity] = useState("Mumbai");

  // Navigation & Workspace states
  const [selectedIssueId, setSelectedIssueId] = useState("issue-m1");
  const [newReportCoords, setNewReportCoords] = useState(null);
  const [reporting, setReporting] = useState(false);
  const [activeTab, setActiveTab] = useState("details"); // details, analytics, herohub, security
  const [isAdmin, setIsAdmin] = useState(false); // Admin mode requires auth

  // Login Modal Form State
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // Filter States
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Notifications/XP popups simulation
  const [xpGained, setXpGained] = useState(null);
  const [emailSendingStatus, setEmailSendingStatus] = useState(null); // null, sending, sent

  // Payment checkout overlay target
  const [activePayment, setActivePayment] = useState(null); // { issueId, amount, issueTitle }

  // Notifications and Certificate states
  const [activeCertificate, setActiveCertificate] = useState(null);
  const [showNotificationsPopover, setShowNotificationsPopover] = useState(false);
  const [notifications, setNotifications] = useState(() => {
    return dbEngine.load("notifications", [
      {
        id: "notif-1",
        title: "Incident Verified",
        body: "Your reported pothole on Western Express Highway has been validated by 10+ neighbors.",
        date: new Date(Date.now() - 3600000 * 2).toISOString(),
        unread: true,
        type: "verify",
        targetId: "issue-m1"
      },
      {
        id: "notif-2",
        title: "DPI Dispatch Initialized",
        body: "Municipal inspector routed Western Express Highway ticket to BMC Road Dept.",
        date: new Date(Date.now() - 3600000).toISOString(),
        unread: true,
        type: "dispatch",
        targetId: "issue-m1"
      }
    ]);
  });

  useEffect(() => {
    dbEngine.save("notifications", notifications);
  }, [notifications]);

  const addNotification = (title, body, type = "info", targetId = null) => {
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title,
        body,
        date: new Date().toISOString(),
        unread: true,
        type,
        targetId
      },
      ...prev
    ]);
  };

  // Secure localized inbox simulator
  const [inboxMessages, setInboxMessages] = useState(() => {
    return dbEngine.load("inbox_messages", [
      {
        id: "msg-1",
        title: "Welcome to NagrikHero!",
        body: "Welcome to the hyperlocal resolution network! Verify neighboring issues to unlock your first 'Pothole Patrol' badge. Active quests are waiting in your dashboard.",
        sender: "GovTech Support",
        date: new Date().toISOString(),
        unread: true
      }
    ]);
  });

  useEffect(() => {
    dbEngine.save("inbox_messages", inboxMessages);
  }, [inboxMessages]);

  const addInboxMessage = (title, body, sender = "City Hall / SendGrid Relay") => {
    setInboxMessages((prev) => [
      {
        id: `msg-${Date.now()}`,
        title,
        body,
        sender,
        date: new Date().toISOString(),
        unread: true
      },
      ...prev
    ]);
  };

  const handleMarkRead = (id) => {
    setInboxMessages((prev) =>
      prev.map((msg) => (msg.id === id ? { ...msg, unread: false } : msg))
    );
  };

  // Synchronize state mutations to secure dbEngine instantly
  useEffect(() => {
    dbEngine.save("issues", issues);
  }, [issues]);

  useEffect(() => {
    dbEngine.save("user_profile", currentUser);
  }, [currentUser]);

  useEffect(() => {
    dbEngine.save("leaderboard", leaderboard);
  }, [leaderboard]);

  const triggerXpPopup = (amount, reason) => {
    playSound.chime();
    setXpGained({ amount, reason });
    setTimeout(() => {
      setXpGained(null);
    }, 3500);
  };

  // State Mutators
  const handleMapClick = (coords) => {
    setNewReportCoords(coords);
    setReporting(true);
  };

  const handleSelectIssue = (issue) => {
    setSelectedIssueId(issue.id);
    setReporting(false);
    setActiveTab("details");
  };

  const handleVerify = (issueId) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === issueId) {
          const isCurrentlyVerified = issue.userVerified;
          const updatedUpvotes = isCurrentlyVerified ? issue.upvotes - 1 : issue.upvotes + 1;
          const updatedVerifiedCount = isCurrentlyVerified ? issue.verifiedCount - 1 : issue.verifiedCount + 1;

          if (!isCurrentlyVerified) {
            updateUserStats(50, 10, "verify", `Verified report: ${issue.title}`);
            triggerXpPopup(50, "Verifying community report");
          }

          return {
            ...issue,
            upvotes: updatedUpvotes,
            verifiedCount: updatedVerifiedCount,
            userVerified: !isCurrentlyVerified
          };
        }
        return issue;
      })
    );
  };

  const handleVolunteer = (issueId) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === issueId) {
          const volunteersList = issue.volunteers || [];
          const isAlreadyVolunteering = volunteersList.includes(currentUser.name);
          
          let updatedVolunteers;
          if (isAlreadyVolunteering) {
            updatedVolunteers = volunteersList.filter((name) => name !== currentUser.name);
            addNotification(
              "Left Fix Crew",
              `You left the cleanup crew for "${issue.title}".`,
              "info",
              issueId
            );
          } else {
            updatedVolunteers = [...volunteersList, currentUser.name];
            updateUserStats(150, 30, "volunteer", `Joined Fix Crew for: ${issue.title}`);
            triggerXpPopup(150, "Volunteering for group cleanup");
            
            // Trigger Digital Certificate popup!
            playSound.success();
            setActiveCertificate({
              citizenName: currentUser.name,
              title: issue.title,
              city: issue.city,
              govtRefId: issue.govtRefId || `SBM-${(issue.city || "MUM").toUpperCase().substring(0,3)}-GEN-${Math.floor(100000 + Math.random()*900000)}`,
              amount: 0,
              date: new Date().toISOString(),
              isVolunteer: true
            });

            addNotification(
              "Joined Fix Crew",
              `You joined the crew for "${issue.title}". Contribution certificate generated!`,
              "volunteer",
              issueId
            );
          }

          return {
            ...issue,
            volunteers: updatedVolunteers
          };
        }
        return issue;
      })
    );
  };

  const handleDonate = (issueId, amount) => {
    const issue = issues.find(i => i.id === issueId);
    setActivePayment({
      issueId,
      amount,
      issueTitle: issue?.title || "Community Project"
    });
  };

  const handlePaymentSuccess = (issueId, amount) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === issueId) {
          const updatedFunding = {
            ...issue.crowdFunding,
            current: issue.crowdFunding.current + amount,
            contributors: issue.crowdFunding.contributors + 1
          };
          
          updateUserStats(amount * 10, amount * 2, "pledge", `Pledged ₹${amount} for: ${issue.title}`);
          triggerXpPopup(amount * 10, `Pledging ₹${amount} micro-funding`);

          addInboxMessage(
            `Transaction Confirmed: ₹${amount * 80} INR`,
            `Official receipt for your micro-funding contribution toward "${issue.title}".\n\nTransaction ID: TXN-${Math.floor(100000000000 + Math.random() * 900000000000)}-IN.\n\nThank you for volunteering your resources to rebuild your neighborhood!`,
            "City Hall Accounts Dept"
          );

          // Trigger Digital Certificate popup!
          playSound.success();
          setActiveCertificate({
            citizenName: currentUser.name,
            title: issue.title,
            city: issue.city,
            govtRefId: issue.govtRefId || `SBM-${(issue.city || "MUM").toUpperCase().substring(0,3)}-GEN-${Math.floor(100000 + Math.random()*900000)}`,
            amount: amount,
            date: new Date().toISOString(),
            isVolunteer: false
          });

          addNotification(
            "Contribution Confirmed",
            `Pledged ₹${amount * 80} INR for "${issue.title}". Contribution certificate generated!`,
            "pledge",
            issueId
          );

          return {
            ...issue,
            crowdFunding: updatedFunding
          };
        }
        return issue;
      })
    );
    setActivePayment(null);
  };

  const handleAddComment = (issueId, text) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === issueId) {
          const newComment = {
            id: `c-${Date.now()}`,
            author: currentUser.name,
            role: isAdmin ? "Civil Authority" : "Citizen",
            content: text,
            date: new Date().toISOString()
          };
          updateUserStats(20, 5, "comment", `Added comment on: ${issue.title}`);
          triggerXpPopup(20, "Adding helpful comment");
          return {
            ...issue,
            comments: [...(issue.comments || []), newComment]
          };
        }
        return issue;
      })
    );
  };

  const handleUpdateStatus = (issueId, newStatus, officialNote) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id === issueId) {
          const statusHistory = issue.history || [];
          const newHistoryItem = {
            status: newStatus,
            date: new Date().toISOString(),
            note: officialNote
          };

          return {
            ...issue,
            status: newStatus,
            history: [...statusHistory, newHistoryItem]
          };
        }
        return issue;
      })
    );

    triggerXpPopup(100, `Updating ticket status to ${newStatus}`);

    const targetIssue = issues.find(i => i.id === issueId);
    if (targetIssue) {
      addNotification(
        `Status Updated: ${newStatus}`,
        `"${targetIssue.title}" has been updated to "${newStatus}" by civil authority.`,
        newStatus === "Resolved" ? "success" : "info",
        issueId
      );
    }
  };

  const handleSubmitReport = (newIssueData) => {
    const newId = `issue-${Date.now()}`;
    
    // Trigger SMTP secure confirmation relay animation
    setEmailSendingStatus("sending");
    
    setTimeout(() => {
      setEmailSendingStatus("sent");
      setTimeout(() => {
        setEmailSendingStatus(null);
      }, 2500);
    }, 2000);

    const govtRefId = generateGovtGrievanceId(selectedCity, newIssueData.category);

    const newIssue = {
      id: newId,
      city: selectedCity, // tag dynamically to the selected city context
      ...newIssueData,
      govtRefId,
      status: "Reported",
      reportedBy: currentUser.name,
      reportedDate: new Date().toISOString(),
      upvotes: 1,
      verifiedCount: 0,
      userVerified: false,
      volunteers: [],
      comments: [],
      history: [
        {
          status: "Reported",
          date: new Date().toISOString(),
          note: `Issue submitted. AI confidence match: ${newIssueData.aiConfidence}%`
        },
        {
          status: "Government Dispatch",
          date: new Date().toISOString(),
          note: `Auto-routed to Swachh Bharat Smart City API gateway. Grievance Ref: ${govtRefId}`
        },
        {
          status: "System Notification",
          date: new Date().toISOString(),
          note: "Dispatched secure email confirmation receipt (SMTP 250 OK) to reporter (m.vance@cityhall.in)."
        }
      ]
    };

    setIssues((prev) => [newIssue, ...prev]);
    setNewReportCoords(null);
    setReporting(false);
    setSelectedIssueId(newId);
    setActiveTab("details");
    updateUserStats(200, 40, "report", `Reported new issue: ${newIssueData.title}`);
    triggerXpPopup(200, "Submitting new verified report");

    addNotification(
      "Report Dispatched",
      `"${newIssueData.title}" auto-routed to Swachh Bharat Smart City API gateway. Ref: ${govtRefId}`,
      "report",
      newId
    );

    addInboxMessage(
      `Report Lodged: ${newIssueData.title}`,
      `Your ticket has been recorded in the decentralized local ledger.\n\nCoordinates: ${newIssue.coordinates[0].toFixed(4)}, ${newIssue.coordinates[1].toFixed(4)}\nCity: ${selectedCity}\nAssessed Severity: ${newIssueData.severity}\n\nOur system dispatcher has relayed a verification request to neighboring citizens.`,
      "NPCI Civic Intake Dispatcher"
    );
  };

  const updateUserStats = (xpGainedAmount, karmaGainedAmount, actionType = null, actionText = "") => {
    setCurrentUser((prev) => {
      const newXp = prev.xp + xpGainedAmount;
      const leveledUp = newXp >= prev.xpNeeded;
      
      let nextLevel = prev.level;
      let nextXpNeeded = prev.xpNeeded;
      let leftoverXp = newXp;

      if (leveledUp) {
        nextLevel += 1;
        nextXpNeeded = Math.round(prev.xpNeeded * 1.5);
        leftoverXp = newXp - prev.xpNeeded;
      }

      setLeaderboard((prevLeaders) =>
        prevLeaders.map((hero) => {
          if (hero.name === prev.name) {
            return {
              ...hero,
              xp: hero.xp + xpGainedAmount,
              karma: hero.karma + karmaGainedAmount
            };
          }
          return hero;
        }).sort((a, b) => b.xp - a.xp)
      );

      const newLedgerItem = actionType ? {
        id: `l-${Date.now()}-${Math.random()}`,
        type: actionType,
        xp: xpGainedAmount,
        karma: karmaGainedAmount,
        action: actionText,
        date: new Date().toISOString()
      } : null;

      const updatedLedger = newLedgerItem 
        ? [newLedgerItem, ...(prev.ledger || [])] 
        : (prev.ledger || []);

      return {
        ...prev,
        level: nextLevel,
        xp: leftoverXp,
        xpNeeded: nextXpNeeded,
        karma: prev.karma + karmaGainedAmount,
        ledger: updatedLedger
      };
    });
  };

  // Auth Submit handler
  const handleLoginSubmit = (e) => {
    e.preventDefault();
    if (loginEmail === "admin@cityhall.gov" && loginPassword === "admin2026") {
      setIsAdmin(true);
      setShowLoginModal(false);
      setLoginEmail("");
      setLoginPassword("");
      setLoginError("");
      triggerXpPopup(100, "Authorized as Administrator");
    } else {
      setLoginError("Access Denied: Invalid credentials.");
    }
  };

  // Toggle switcher actions
  const handleAuthToggle = () => {
    if (isAdmin) {
      setIsAdmin(false);
      if (activeTab === "security") {
        setActiveTab("details");
      }
      triggerXpPopup(0, "Logged out of admin profile");
    } else {
      setLoginError("");
      setShowLoginModal(true);
    }
  };

  // Chatbot event triggers redirection
  const handleChatbotAction = (actionType) => {
    setReporting(false);
    if (actionType === "report") {
      setNewReportCoords(null);
      setReporting(true);
    } else if (actionType === "herohub") {
      setActiveTab("herohub");
    } else if (actionType === "analytics") {
      setActiveTab("analytics");
    } else if (actionType === "details") {
      setActiveTab("details");
    } else if (actionType === "login") {
      if (!isAdmin) {
        setShowLoginModal(true);
      }
    }
  };

  // Filter Issues (strictly localized to the active city selection first)
  const filteredIssues = issues.filter((issue) => {
    const matchCity = issue.city === selectedCity;
    const matchCategory = filterCategory === "All" || issue.category === filterCategory;
    const matchStatus = filterStatus === "All" || issue.status === filterStatus;
    return matchCity && matchCategory && matchStatus;
  });

  const selectedIssue = issues.find((i) => i.id === selectedIssueId);

  return (
    <div className="app-container">
      
      {/* Dynamic Gained XP Notification */}
      {xpGained && (
        <div style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          background: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
          boxShadow: "0 0 25px rgba(16, 185, 129, 0.4)",
          padding: "12px 20px",
          borderRadius: "var(--radius-md)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          zIndex: 9999,
          animation: "slideInUp 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards"
        }}>
          <Award size={20} style={{ color: "white" }} />
          <div style={{ color: "white", display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "0.85rem", fontWeight: "bold" }}>+{xpGained.amount} XP Unlocked</span>
            <span style={{ fontSize: "0.7rem", opacity: 0.9 }}>{xpGained.reason}</span>
          </div>
        </div>
      )}

      {/* Dynamic SMTP Email confirmation Dispatch notification */}
      {emailSendingStatus && (
        <div style={{
          position: "fixed",
          top: "85px",
          right: "30px",
          background: emailSendingStatus === "sending" ? "var(--bg-secondary)" : "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
          boxShadow: "var(--shadow-glass)",
          border: "1px solid var(--glass-border)",
          padding: "12px 18px",
          borderRadius: "var(--radius-md)",
          display: "flex",
          alignItems: "center",
          gap: "12px",
          zIndex: 9999,
          animation: "slideInUp 0.3s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards"
        }}>
          <div className="flex-center" style={{ width: "20px", height: "20px" }}>
            {emailSendingStatus === "sending" ? (
              <div className="loader-spin" style={{
                width: "14px",
                height: "14px",
                border: "2px solid var(--accent-secondary)",
                borderTopColor: "transparent",
                borderRadius: "50%",
                animation: "spin-kf 0.8s linear infinite"
              }} />
            ) : (
              <Check size={16} style={{ color: "white" }} />
            )}
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: "0.8rem", color: "white", fontWeight: "bold" }}>
              {emailSendingStatus === "sending" ? t.emailToastSending : t.emailToastSent}
            </span>
            <span style={{ fontSize: "0.65rem", color: "var(--text-secondary)" }}>Relay: m.vance@cityhall.in</span>
          </div>
        </div>
      )}

      {/* ADMIN SECURE LOGIN MODAL */}
      {showLoginModal && (
        <div className="auth-overlay">
          <form onSubmit={handleLoginSubmit} className="auth-modal">
            <div className="flex-between" style={{ borderBottom: "1px solid var(--glass-border)", paddingBottom: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <Lock size={16} style={{ color: "var(--accent-warning)" }} />
                <h3 style={{ fontSize: "1rem" }}>Authority Sign-In</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowLoginModal(false)}
                style={{ background: "transparent", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
              >
                <X size={16} />
              </button>
            </div>

            {loginError && (
              <div style={{ fontSize: "0.75rem", color: "var(--accent-danger)", background: "rgba(239,68,68,0.1)", padding: "8px", borderRadius: "4px", border: "1px solid rgba(239,68,68,0.2)" }}>
                {loginError}
              </div>
            )}

            <div>
              <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
                Official Email
              </label>
              <input
                type="email"
                className="glass-input"
                placeholder="admin@cityhall.gov"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)", marginBottom: "4px", display: "block" }}>
                Security Passkey
              </label>
              <input
                type="password"
                className="glass-input"
                placeholder="••••••••"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
              />
              <span style={{ fontSize: "0.65rem", color: "var(--text-muted)", marginTop: "4px", display: "block" }}>
                Demo Credentials: <code>admin@cityhall.gov</code> / <code>admin2026</code>
              </span>
            </div>

            <button type="submit" className="glass-btn glass-btn-primary" style={{ justifyContent: "center", marginTop: "4px" }}>
              Authorize Console
            </button>
          </form>
        </div>
      )}

      {/* App Header */}
      <header className="app-header">
        {/* Brand */}
        <div className="brand-section">
          {/* Visual Logo Asset */}
          <img
            src={logoImg}
            alt="Community Hero Logo"
            style={{ width: "36px", height: "36px", borderRadius: "var(--radius-sm)", border: "1px solid var(--glass-border)", boxShadow: "0 0 10px rgba(99,102,241,0.2)" }}
          />
          <div>
            <h1 className="brand-title">{t.brandTitle || "Community Hero"}</h1>
            <p style={{ fontSize: "0.7rem", color: "var(--text-muted)", marginTop: "-2px" }}>{t.subTitle || "Hyperlocal Platform"}</p>
          </div>
        </div>

        {/* Action Widgets & User Profile Summary */}
        <div className="flex-gap-md" style={{ flexWrap: "wrap" }}>

          {/* Light / Dark Mode Toggle switcher */}
          <button
            onClick={toggleTheme}
            className="glass-btn"
            style={{
              padding: "4px 10px",
              borderRadius: "var(--radius-sm)",
              border: "1px solid var(--glass-border)",
              background: "var(--bg-secondary)",
              color: "var(--text-primary)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "6px",
              fontSize: "0.75rem",
              fontWeight: "600",
              height: "32px"
            }}
            title={theme === "dark" ? t.themeLight || "Light Mode" : t.themeDark || "Dark Mode"}
          >
            {theme === "dark" ? <Sun size={14} style={{ color: "var(--accent-warning)" }} /> : <Moon size={14} style={{ color: "var(--accent-primary)" }} />}
            <span style={{ display: "inline" }}>{theme === "dark" ? t.themeLight || "Light Mode" : t.themeDark || "Dark Mode"}</span>
          </button>
          
          {/* Language Selector Dropdown */}
          <div className="flex-gap-sm" style={{ background: "var(--bg-secondary)", padding: "4px 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--glass-border)" }}>
            <select
              value={selectedLang}
              onChange={(e) => setSelectedLang(e.target.value)}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-primary)",
                fontSize: "0.75rem",
                fontWeight: "600",
                cursor: "pointer",
                outline: "none"
              }}
            >
              <option value="en" style={{ background: "var(--bg-secondary)" }}>English</option>
              <option value="hi" style={{ background: "var(--bg-secondary)" }}>हिंदी (Hindi)</option>
              <option value="kn" style={{ background: "var(--bg-secondary)" }}>ಕನ್ನಡ (Kannada)</option>
              <option value="mr" style={{ background: "var(--bg-secondary)" }}>मराठी (Marathi)</option>
              <option value="bn" style={{ background: "var(--bg-secondary)" }}>বাংলা (Bengali)</option>
              <option value="ta" style={{ background: "var(--bg-secondary)" }}>தமிழ் (Tamil)</option>
              <option value="te" style={{ background: "var(--bg-secondary)" }}>తెలుగు (Telugu)</option>
              <option value="gu" style={{ background: "var(--bg-secondary)" }}>ગુજરાતી (Gujarati)</option>
            </select>
          </div>

          {/* City Selection Dropdown */}
          <div className="flex-gap-sm" style={{ background: "var(--bg-secondary)", padding: "4px 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--glass-border)" }}>
            <MapPin size={14} style={{ color: "var(--accent-secondary)" }} />
            <select
              value={selectedCity}
              onChange={(e) => {
                const newCity = e.target.value;
                setSelectedCity(newCity);
                
                const firstCityIssue = issues.find(i => i.city === newCity);
                if (firstCityIssue) {
                  setSelectedIssueId(firstCityIssue.id);
                } else {
                  setSelectedIssueId(null);
                }
              }}
              style={{
                background: "transparent",
                border: "none",
                color: "var(--text-primary)",
                fontSize: "0.75rem",
                fontWeight: "600",
                cursor: "pointer",
                outline: "none"
              }}
            >
              <option value="Mumbai" style={{ background: "var(--bg-secondary)" }}>Mumbai</option>
              <option value="Bengaluru" style={{ background: "var(--bg-secondary)" }}>Bengaluru</option>
              <option value="New Delhi" style={{ background: "var(--bg-secondary)" }}>New Delhi</option>
              <option value="Pune" style={{ background: "var(--bg-secondary)" }}>Pune</option>
              <option value="Hyderabad" style={{ background: "var(--bg-secondary)" }}>Hyderabad</option>
              <option value="Chennai" style={{ background: "var(--bg-secondary)" }}>Chennai</option>
              <option value="Kolkata" style={{ background: "var(--bg-secondary)" }}>Kolkata</option>
              <option value="Ahmedabad" style={{ background: "var(--bg-secondary)" }}>Ahmedabad</option>
              <option value="Jaipur" style={{ background: "var(--bg-secondary)" }}>Jaipur</option>
              <option value="Lucknow" style={{ background: "var(--bg-secondary)" }}>Lucknow</option>
              <option value="Patna" style={{ background: "var(--bg-secondary)" }}>Patna</option>
              <option value="Bhopal" style={{ background: "var(--bg-secondary)" }}>Bhopal</option>
            </select>
          </div>

          {/* Admin Switcher */}
          <div className="flex-gap-sm" style={{ background: "var(--bg-secondary)", padding: "4px 10px", borderRadius: "var(--radius-sm)", border: "1px solid var(--glass-border)" }}>
            {isAdmin ? <ShieldAlert size={14} style={{ color: "var(--accent-warning)" }} /> : <ShieldCheck size={14} style={{ color: "var(--accent-secondary)" }} />}
            <span style={{ fontSize: "0.75rem", fontWeight: "600" }}>{isAdmin ? t.authorityMode : t.citizenMode}</span>
            <button
              onClick={handleAuthToggle}
              className="glass-btn"
              style={{
                padding: "2px 8px",
                fontSize: "0.7rem",
                background: isAdmin ? "rgba(239,68,68,0.1)" : "var(--bg-tertiary)",
                borderColor: isAdmin ? "rgba(239,68,68,0.3)" : "var(--glass-border)",
                color: isAdmin ? "var(--accent-danger)" : "var(--text-primary)"
              }}
            >
              {isAdmin ? t.signOut : t.logIn}
            </button>
          </div>

          {/* Notification Bell Widget */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setShowNotificationsPopover(!showNotificationsPopover)}
              className="glass-btn"
              style={{
                padding: "6px 10px",
                position: "relative",
                background: showNotificationsPopover ? "var(--accent-primary-glow)" : "var(--bg-secondary)",
                borderColor: showNotificationsPopover ? "var(--accent-primary)" : "var(--glass-border)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center"
              }}
              title="Civic Activity Notifications"
            >
              <Bell size={14} style={{ color: showNotificationsPopover ? "white" : "var(--text-secondary)" }} />
              {notifications.filter((n) => n.unread).length > 0 && (
                <span
                  className="pulse-target"
                  style={{
                    position: "absolute",
                    top: "-2px",
                    right: "-2px",
                    background: "var(--accent-danger)",
                    borderRadius: "50%",
                    width: "8px",
                    height: "8px",
                    display: "block",
                    boxShadow: "0 0 10px var(--accent-danger)"
                  }}
                />
              )}
            </button>

            {/* Notifications Popover Dropdown */}
            {showNotificationsPopover && (
              <div
                className="glass-panel"
                style={{
                  position: "absolute",
                  top: "42px",
                  right: 0,
                  width: "300px",
                  maxHeight: "360px",
                  padding: "0",
                  zIndex: 9999,
                  display: "flex",
                  flexDirection: "column",
                  borderRadius: "var(--radius-md)",
                  border: "1px solid var(--glass-border)",
                  boxShadow: "var(--shadow-glass)",
                  overflow: "hidden",
                  animation: "modalEnter 0.25s cubic-bezier(0.18, 0.89, 0.32, 1.28) forwards"
                }}
              >
                {/* Popover Header */}
                <div className="flex-between" style={{ padding: "12px 14px", borderBottom: "1px solid var(--glass-border)", background: "rgba(10, 15, 29, 0.9)" }}>
                  <span style={{ fontSize: "0.8rem", fontWeight: "bold" }}>Civic Notifications</span>
                  <button
                    onClick={() => {
                      setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
                    }}
                    style={{ background: "transparent", border: "none", color: "var(--accent-secondary)", fontSize: "0.7rem", fontWeight: "600", cursor: "pointer" }}
                  >
                    Mark all read
                  </button>
                </div>

                {/* Notifications List */}
                <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", background: "var(--bg-secondary)" }}>
                  {notifications.length === 0 ? (
                    <div style={{ padding: "30px 10px", textAlign: "center", color: "var(--text-muted)", fontSize: "0.75rem", fontStyle: "italic" }}>
                      No notifications yet
                    </div>
                  ) : (
                    notifications.map((n) => (
                      <div
                        key={n.id}
                        onClick={() => {
                          // Mark as read
                          setNotifications((prev) => prev.map((item) => item.id === n.id ? { ...item, unread: false } : item));
                          setShowNotificationsPopover(false);
                          
                          // Focus on the issue if applicable
                          if (n.targetId) {
                            const issue = issues.find((i) => i.id === n.targetId);
                            if (issue) {
                              handleSelectIssue(issue);
                            }
                          }
                        }}
                        style={{
                          padding: "10px 14px",
                          borderBottom: "1px solid var(--glass-border)",
                          background: n.unread ? "rgba(99, 102, 241, 0.05)" : "transparent",
                          cursor: "pointer",
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                          transition: "background 0.2s ease"
                        }}
                        className="notif-item-hover"
                      >
                        <div className="flex-between" style={{ alignItems: "flex-start", gap: "8px" }}>
                          <span style={{ fontSize: "0.75rem", fontWeight: "bold", color: n.unread ? "var(--text-primary)" : "var(--text-secondary)" }}>
                            {n.title}
                          </span>
                          <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", flexShrink: 0 }}>
                            {new Date(n.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </span>
                        </div>
                        <p style={{ fontSize: "0.7rem", color: "var(--text-secondary)", lineHeight: "1.3" }}>
                          {n.body}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Quick Stats Panel */}
          <div className="flex-gap-sm" style={{ display: "flex", paddingRight: "10px", borderRight: "1px solid var(--glass-border)" }}>
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              style={{ width: "32px", height: "32px", borderRadius: "50%", border: "1.5px solid var(--accent-primary)" }}
            />
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span style={{ fontSize: "0.75rem", fontWeight: "bold" }}>{currentUser.name}</span>
              <span style={{ fontSize: "0.65rem", color: "var(--text-secondary)" }}>
                Lvl {currentUser.level} • {currentUser.karma} Karma
              </span>
            </div>
          </div>

          {/* Core CTA */}
          <button
            onClick={() => {
              setNewReportCoords(null);
              setReporting(true);
            }}
            className="glass-btn glass-btn-primary"
            style={{ padding: "8px 16px", fontSize: "0.85rem" }}
          >
            <PlusCircle size={16} />
            <span>{t.reportIssue || "Report Issue"}</span>
          </button>
        </div>
      </header>

      {/* Live Action Ticker Bar */}
      <div style={{
        background: "rgba(6, 182, 212, 0.04)",
        borderBottom: "1px solid var(--glass-border)",
        padding: "6px 20px",
        display: "flex",
        alignItems: "center",
        gap: "10px",
        overflow: "hidden",
        whiteSpace: "nowrap"
      }}>
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          color: "var(--accent-secondary)",
          fontSize: "0.65rem",
          fontWeight: "bold",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          background: "rgba(6, 182, 212, 0.1)",
          padding: "2px 8px",
          borderRadius: "4px",
          border: "1px solid rgba(6, 182, 212, 0.2)"
        }}>
          <span className="live-dot" /> LIVE NETWORK
        </div>
        <div style={{ overflow: "hidden", flex: 1 }}>
          <div className="ticker-scroll" style={{ display: "inline-block", fontSize: "0.7rem", color: "var(--text-secondary)", animation: "ticker-kf 35s linear infinite" }}>
            <span style={{ marginRight: "40px" }}>🚨 <strong>Mumbai:</strong> WEH Pothole Report verified by BMC Inspector (1m ago)</span>
            <span style={{ marginRight: "40px" }}>🌱 <strong>Bengaluru:</strong> Preeti R. pledged ₹1,600 to Indiranagar path cleanup (3m ago)</span>
            <span style={{ marginRight: "40px" }}>💡 <strong>Pune:</strong> Streetlight in Lane 5 Koregaon Park fixed successfully (6m ago)</span>
            <span style={{ marginRight: "40px" }}>🗑️ <strong>New Delhi:</strong> Karol Bagh debris cleaned by civic volunteer crew (10m ago)</span>
            <span style={{ marginRight: "40px" }}>★ <strong>Mumbai:</strong> Rohan S. unlocked "Pothole Patrol" badge (14m ago)</span>
            
            {/* Duplicated for seamless loop */}
            <span style={{ marginRight: "40px" }}>🚨 <strong>Mumbai:</strong> WEH Pothole Report verified by BMC Inspector (1m ago)</span>
            <span style={{ marginRight: "40px" }}>🌱 <strong>Bengaluru:</strong> Preeti R. pledged ₹1,600 to Indiranagar path cleanup (3m ago)</span>
            <span style={{ marginRight: "40px" }}>💡 <strong>Pune:</strong> Streetlight in Lane 5 Koregaon Park fixed successfully (6m ago)</span>
            <span style={{ marginRight: "40px" }}>🗑️ <strong>New Delhi:</strong> Karol Bagh debris cleaned by civic volunteer crew (10m ago)</span>
            <span style={{ marginRight: "40px" }}>★ <strong>Mumbai:</strong> Rohan S. unlocked "Pothole Patrol" badge (14m ago)</span>
          </div>
        </div>
      </div>

      {/* Main Workspace Layout */}
      <main className="main-layout">
        
        {/* Left Side: Map & Feed List */}
        <section className="main-section-left">
          {/* Leaflet Map Workspace */}
          <div style={{ height: "450px", display: "flex", flexDirection: "column", flexShrink: 0 }}>
            <MapWorkspace
              issues={filteredIssues}
              selectedIssueId={selectedIssueId}
              onSelectIssue={handleSelectIssue}
              onMapClick={handleMapClick}
              newReportCoords={newReportCoords}
              filterCategory={filterCategory}
              setFilterCategory={setFilterCategory}
              filterStatus={filterStatus}
              setFilterStatus={setFilterStatus}
              selectedCity={selectedCity}
              theme={theme}
              t={t}
            />
          </div>

          {/* Interactive Issue Feed Tray */}
          <div className="glass-panel" style={{ height: "auto", minHeight: "350px", display: "flex", flexDirection: "column", gap: "16px", overflow: "visible" }}>
            <div className="flex-between">
              <span style={{ fontSize: "0.95rem", fontWeight: "700", color: "var(--text-primary)", fontFamily: "var(--font-display)" }}>
                {t.activeIncidents || "Active Incidents in"} {selectedCity} ({filteredIssues.length})
              </span>
              <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{t.sortedDate || "Sorted by date"}</span>
            </div>

            {/* Spacious grid/flex layout of incidents - no internal clipping */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px", height: "auto", overflow: "visible" }}>
              {filteredIssues.map((item) => {
                const isSelected = item.id === selectedIssueId;
                let severityColor = "var(--accent-secondary)";
                if (item.severity === "Critical") severityColor = "var(--accent-danger)";
                else if (item.severity === "Major") severityColor = "var(--accent-warning)";

                let statusBadge = "badge-reported";
                if (item.status === "Verified") statusBadge = "badge-verified";
                else if (item.status === "In Progress") statusBadge = "badge-inprogress";
                else if (item.status === "Resolved") statusBadge = "badge-resolved";

                return (
                  <div
                    key={item.id}
                    onClick={() => handleSelectIssue(item)}
                    className="glass-card"
                    style={{
                      cursor: "pointer",
                      borderColor: isSelected ? "var(--accent-primary)" : "var(--glass-border)",
                      background: isSelected ? "rgba(99, 102, 241, 0.08)" : "var(--grad-dark-card)",
                      display: "flex",
                      gap: "18px",
                      padding: "16px",
                      transition: "all 0.2s ease"
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      style={{ width: "64px", height: "64px", borderRadius: "var(--radius-sm)", objectFit: "cover", flexShrink: 0, border: "1px solid var(--glass-border)" }}
                    />
                    <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
                      <div className="flex-between" style={{ alignItems: "flex-start", gap: "8px" }}>
                        <span style={{ fontSize: "0.95rem", fontWeight: "bold", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", color: "var(--text-primary)" }}>
                          {item.title}
                        </span>
                        <span className={`badge ${statusBadge}`} style={{ fontSize: "0.6rem", padding: "2px 6px", flexShrink: 0 }}>{item.status}</span>
                      </div>
                      
                      <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", marginTop: "2px" }}>
                        {item.locationName}
                      </span>
                      
                      <div className="flex-between" style={{ marginTop: "6px" }}>
                        <span style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
                          Severity: <strong style={{ color: severityColor }}>{item.severity}</strong>
                        </span>
                        <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "3px" }}>
                          ★ <strong style={{ color: "var(--text-primary)" }}>{item.upvotes}</strong> verified
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}

              {filteredIssues.length === 0 && (
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", color: "var(--text-muted)", fontSize: "0.8rem", fontStyle: "italic", padding: "20px 0" }}>
                  No issues found matching selected filter criteria.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Right Side: Tab panel workspace */}
        <section className="main-section-right">
          {reporting ? (
            <ReportForm
              coordinates={newReportCoords}
              onSubmit={handleSubmitReport}
              onCancel={() => {
                setReporting(false);
                setNewReportCoords(null);
              }}
              activeCity={selectedCity}
              t={t}
            />
          ) : (
            <div className="tab-panel-wrapper">
              {/* Tab Navigation header */}
              <div className="glass-panel" style={{ padding: "8px", display: "flex", gap: "4px", flexWrap: "wrap" }}>
                <button
                  onClick={() => { playSound.click(); setActiveTab("details"); }}
                  className="glass-btn"
                  style={{
                    flex: 1,
                    fontSize: "0.75rem",
                    padding: "6px 8px",
                    background: activeTab === "details" ? "var(--accent-primary)" : "transparent",
                    borderColor: activeTab === "details" ? "var(--accent-primary)" : "transparent",
                    color: "white",
                    justifyContent: "center"
                  }}
                >
                  <FileText size={12} /> {t.details || "Details"}
                </button>
                <button
                  onClick={() => { playSound.click(); setActiveTab("analytics"); }}
                  className="glass-btn"
                  style={{
                    flex: 1.1,
                    fontSize: "0.75rem",
                    padding: "6px 8px",
                    background: activeTab === "analytics" ? "var(--accent-primary)" : "transparent",
                    borderColor: activeTab === "analytics" ? "var(--accent-primary)" : "transparent",
                    color: "white",
                    justifyContent: "center"
                  }}
                >
                  <BarChart3 size={12} /> {t.analytics || "Analytics"}
                </button>
                <button
                  onClick={() => { playSound.click(); setActiveTab("herohub"); }}
                  className="glass-btn"
                  style={{
                    flex: 1,
                    fontSize: "0.75rem",
                    padding: "6px 8px",
                    background: activeTab === "herohub" ? "var(--accent-primary)" : "transparent",
                    borderColor: activeTab === "herohub" ? "var(--accent-primary)" : "transparent",
                    color: "white",
                    justifyContent: "center"
                  }}
                >
                  <Trophy size={12} /> {t.herohub || "Hero Hub"}
                </button>

                {/* Secure Cryptographic Ledger for Admin mode */}
                {isAdmin && (
                  <button
                    onClick={() => { playSound.click(); setActiveTab("security"); }}
                    className="glass-btn"
                    style={{
                      flex: 1.3,
                      fontSize: "0.75rem",
                      padding: "6px 8px",
                      background: activeTab === "security" ? "var(--accent-warning)" : "transparent",
                      borderColor: activeTab === "security" ? "var(--accent-warning)" : "transparent",
                      color: "white",
                      justifyContent: "center"
                    }}
                  >
                    <Lock size={12} /> {t.securityLedger || "Security Ledger"}
                  </button>
                )}
              </div>

              {/* Tab content workspace */}
              <div className="tab-content-container">
                {activeTab === "details" && (
                  <IssueDetails
                    issue={selectedIssue}
                    currentUser={currentUser}
                    isAdmin={isAdmin}
                    onVerify={handleVerify}
                    onVolunteer={handleVolunteer}
                    onDonate={handleDonate}
                    onAddComment={handleAddComment}
                    onUpdateStatus={handleUpdateStatus}
                  />
                )}
                 {activeTab === "analytics" && <Dashboard issues={issues} />}
                  {activeTab === "herohub" && (
                    <HeroHub 
                      user={currentUser} 
                      leaderboard={leaderboard} 
                      issues={issues} 
                      onSelectIssue={handleSelectIssue} 
                      inboxMessages={inboxMessages}
                      onMarkRead={handleMarkRead}
                      t={t} 
                    />
                  )}
                 {activeTab === "security" && isAdmin && <AdminConsole issues={issues} />}
              </div>
            </div>
          )}
        </section>

      </main>

      {/* Floating Chatbot Widget with voice controls */}
      <Chatbot onActionTrigger={handleChatbotAction} t={t} />

      {/* UPI Checkout Gateway Modal */}
      {activePayment && (
        <PaymentGateway
          activePayment={activePayment}
          onSuccess={handlePaymentSuccess}
          onCancel={() => setActivePayment(null)}
        />
      )}

      {/* DPI Contribution Certificate Modal */}
      {activeCertificate && (
        <DigitalCertificate
          certificateData={activeCertificate}
          onClose={() => setActiveCertificate(null)}
        />
      )}

      {/* Global CSS Inject for slideInUp */}
      <style>{`
        @keyframes slideInUp {
          from {
            transform: translateY(100%);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .loader-spin {
          border-radius: 50%;
          border: 2px solid var(--accent-secondary);
          border-top-color: transparent;
          animation: spin-kf 0.8s linear infinite;
        }
        @keyframes spin-kf {
          100% { transform: rotate(360deg); }
        }
        @keyframes ticker-kf {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .ticker-scroll {
          display: inline-block;
          animation: ticker-kf 35s linear infinite;
        }
        .live-dot {
          width: 6px;
          height: 6px;
          background-color: var(--accent-danger);
          border-radius: 50%;
          display: inline-block;
          animation: blink 1.2s infinite;
        }
        @keyframes blink {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* Footer copyright */}
      <footer style={{
        textAlign: "center",
        padding: "20px",
        borderTop: "1px solid var(--glass-border)",
        background: "var(--bg-alpha-40)",
        marginTop: "auto",
        fontSize: "0.8rem",
        color: "var(--text-secondary)",
        zIndex: 5
      }}>
        <div className="flex-between" style={{ maxWidth: "1200px", margin: "0 auto", flexWrap: "wrap", gap: "10px", padding: "0 10px" }}>
          <span>© {new Date().getFullYear()} NagrikHero. All Rights Reserved.</span>
          <span>Built for Google Smart City Hackathon. Empowering Hyperlocal Communities.</span>
        </div>
      </footer>
    </div>
  );
}
