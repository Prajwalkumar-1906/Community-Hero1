import React, { useState, useRef, useEffect } from "react";
import { MessageSquare, X, Send, Cpu, Award, PlusCircle, Mic, MicOff, Volume2, VolumeX } from "lucide-react";
import { playSound } from "../utils/sfx";

export default function Chatbot({ onActionTrigger, t = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  // Voice Controls states
  const [isListening, setIsListening] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);

  const messagesEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Initialize initial chatbot message based on t when translation loads
  useEffect(() => {
    setMessages([
      {
        id: 1,
        sender: "bot",
        text: t.chatbotGreeting || "Hello! I am HeroBot, your hyperlocal civic assistant. How can I help you improve the community today?",
        time: new Date()
      }
    ]);
  }, [t]);

  // Speech Recognition API setup (Speech-to-Text)
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = "en-IN"; // Sets localized Indian accent matching standard FAQ inquiries

      rec.onstart = () => setIsListening(true);
      rec.onend = () => setIsListening(false);
      rec.onresult = (e) => {
        const transcript = e.results[0][0].transcript;
        setInputText(transcript);
      };

      recognitionRef.current = rec;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Microphone recognition API is not supported or permitted in this browser.");
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setInputText("");
      recognitionRef.current.start();
    }
  };

  // Speech Synthesis setup (Text-to-Speech read-aloud)
  const speakText = (text) => {
    if (!window.speechSynthesis || !speechEnabled) return;
    window.speechSynthesis.cancel(); // Mute active sounds
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Attempt standard regional voice allocations
    utterance.lang = "en-IN"; 
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSendMessage = (textToSend) => {
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: textToSend,
      time: new Date()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText("");
    setIsTyping(true);

    // Simulate bot thinking
    setTimeout(() => {
      let botResponse = "";
      let actionType = null;
      let actionText = "";

      const query = textToSend.toLowerCase();

      // Simple rule-based NLP parser
      if (query.includes("report") || query.includes("pothole") || query.includes("leak") || query.includes("broken") || query.includes("trash")) {
        botResponse = "I can help you report that! You can click anywhere on the map to pin the coordinates, or launch the Intake Form wizard right here to upload an image for AI assessment.";
        actionType = "report";
        actionText = "Launch Report Form";
      } else if (query.includes("karma") || query.includes("points") || query.includes("xp") || query.includes("badge") || query.includes("level")) {
        botResponse = "Earn Karma and XP by participating in community actions! Submitting a report earns 200 XP, verifying/upvoting a neighbor's report earns 50 XP, and volunteering for cleanups earns 150 XP. Check your level progress in the 'Hero Hub' tab!";
        actionType = "herohub";
        actionText = "View Hero Hub";
      } else if (query.includes("predict") || query.includes("alert") || query.includes("analytics") || query.includes("map") || query.includes("chart")) {
        botResponse = "Our system uses historical datasets and AI prediction models to monitor utility lines and street safety. To see predictive maintenance risks (like North Beach water mains), check out the 'Analytics' panel.";
        actionType = "analytics";
        actionText = "Open Analytics Console";
      } else if (query.includes("volunteer") || query.includes("fix") || query.includes("cleanup")) {
        botResponse = "Collaborative fixes are what make our community strong! Open any active report details and click the 'Join Fix Crew' button to sign up. You can also fund micro-projects!";
        actionType = "details";
        actionText = "Browse Active Reports";
      } else if (query.includes("admin") || query.includes("login") || query.includes("authority")) {
        botResponse = "Civil authorities can log in by clicking 'Toggle' next to Citizen Mode in the header. Use official credentials (admin@cityhall.gov / admin2026) to manage schedules and dispatch repair crews.";
        actionType = "login";
        actionText = "Open Authority Panel";
      } else {
        botResponse = "I want to make sure I understand. You can check local active tickets on the map, file a new report, pledge funds for local cleanups, or earn badges. Let me know what you'd like to do!";
      }

      const botMsg = {
        id: Date.now() + 1,
        sender: "bot",
        text: botResponse,
        time: new Date(),
        action: actionType ? { type: actionType, label: actionText } : null
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      
      // Read aloud the reply
      speakText(botResponse);
    }, 1500);
  };

  const handleActionClick = (action) => {
    onActionTrigger(action.type);
    setIsOpen(false);
  };

  const quickChips = [
    { label: "🚨 Report problem", text: "I want to report an issue" },
    { label: "⭐ Karma levels", text: "How do I earn Karma points and badges?" },
    { label: "🔮 AI Predictions", text: "Show me predictive maintenance alerts" },
    { label: "🛠️ Group fixes", text: "How do I join volunteer fix crews?" }
  ];

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => { playSound.click(); setIsOpen(!isOpen); }}
        className="pulse-target"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          background: "var(--grad-cyan-blue)",
          border: "none",
          color: "white",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 15px rgba(6, 182, 212, 0.4)",
          zIndex: 999
        }}
      >
        {isOpen ? <X size={20} /> : <MessageSquare size={20} />}
      </button>

      {/* Chat Dialog Drawer */}
      {isOpen && (
        <div
          className="glass-panel"
          style={{
            position: "fixed",
            bottom: "80px",
            right: "20px",
            width: "350px",
            height: "450px",
            zIndex: 999,
            display: "flex",
            flexDirection: "column",
            padding: "0",
            overflow: "hidden",
            animation: "slideInUp 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
          }}
        >
          {/* Header */}
          <div
            style={{
              background: "var(--bg-alpha-90)",
              padding: "14px 16px",
              borderBottom: "1px solid var(--glass-border)",
              display: "flex",
              alignItems: "center",
              justifyContent: "between",
              width: "100%"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px", flex: 1 }}>
              <div style={{ width: "28px", height: "28px", background: "var(--accent-secondary-glow)", color: "var(--accent-secondary)", borderRadius: "50%", display: "flex", alignItems: "center", justify: "center" }}>
                <Cpu size={14} style={{ marginLeft: "7px" }} />
              </div>
              <div>
                <h4 style={{ fontSize: "0.85rem", fontWeight: "bold" }}>{t.chatbotTitle || "HeroBot"}</h4>
                <div style={{ display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ width: "6px", height: "6px", background: "#10b981", borderRadius: "50%" }}></span>
                  <span style={{ fontSize: "0.65rem", color: "#10b981" }}>{t.chatbotSubtitle || "Civic AI Assistant"}</span>
                </div>
              </div>
            </div>
            
            {/* TTS Mute Control & Close Button */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <button
                onClick={() => setSpeechEnabled(!speechEnabled)}
                style={{ background: "transparent", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
                title={speechEnabled ? "Mute Voice Readout" : "Enable Voice Readout"}
              >
                {speechEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
              </button>
              <button
                onClick={() => setIsOpen(false)}
                style={{ background: "transparent", border: "none", color: "var(--text-secondary)", cursor: "pointer" }}
              >
                <X size={16} />
              </button>
            </div>
          </div>

          {/* Conversation Messages */}
          <div
            style={{
              flex: 1,
              padding: "16px",
              overflowY: "auto",
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              background: "var(--bg-alpha-30)"
            }}
          >
            {messages.map((msg) => (
              <div
                key={msg.id}
                style={{
                  alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: msg.sender === "user" ? "flex-end" : "flex-start"
                }}
              >
                <div
                  style={{
                    background: msg.sender === "user" ? "var(--accent-primary)" : "var(--bg-tertiary)",
                    color: "var(--text-primary)",
                    padding: "8px 12px",
                    borderRadius: msg.sender === "user" ? "12px 12px 2px 12px" : "12px 12px 12px 2px",
                    fontSize: "0.8rem",
                    lineHeight: "1.4",
                    border: msg.sender === "user" ? "none" : "1px solid var(--glass-border)"
                  }}
                >
                  {msg.text}
                </div>

                {/* Inline Action Button */}
                {msg.action && (
                  <button
                    onClick={() => handleActionClick(msg.action)}
                    className="glass-btn glass-btn-secondary"
                    style={{
                      marginTop: "6px",
                      padding: "4px 8px",
                      fontSize: "0.7rem",
                      borderRadius: "4px",
                      gap: "4px"
                    }}
                  >
                    {msg.action.type === "report" && <PlusCircle size={10} />}
                    {msg.action.type === "herohub" && <Award size={10} />}
                    {msg.action.type === "analytics" && <Cpu size={10} />}
                    <span>{msg.action.label}</span>
                  </button>
                )}

                <span style={{ fontSize: "0.6rem", color: "var(--text-muted)", marginTop: "2px" }}>
                  {new Date(msg.time).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}

            {isTyping && (
              <div style={{ alignSelf: "flex-start", background: "var(--bg-tertiary)", padding: "8px 12px", borderRadius: "12px 12px 12px 2px", border: "1px solid var(--glass-border)" }}>
                <span className="typing-indicator" style={{ display: "inline-flex", gap: "2px" }}>
                  <span>.</span><span>.</span><span>.</span>
                </span>
                <style>{`
                  .typing-indicator span {
                    animation: blink 1.4s infinite both;
                  }
                  .typing-indicator span:nth-child(2) { animation-delay: .2s; }
                  .typing-indicator span:nth-child(3) { animation-delay: .4s; }
                  @keyframes blink {
                    0% { opacity: .2; }
                    20% { opacity: 1; }
                    100% { opacity: .2; }
                  }
                `}</style>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick chips selector */}
          <div
            style={{
              padding: "8px 12px",
              background: "var(--bg-alpha-50)",
              borderTop: "1px solid var(--glass-border)",
              display: "flex",
              gap: "6px",
              overflowX: "auto",
              whiteSpace: "nowrap",
              scrollbarWidth: "none"
            }}
          >
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => { playSound.click(); handleSendMessage(chip.text); }}
                style={{
                  background: "var(--bg-tertiary)",
                  border: "1px solid var(--glass-border)",
                  borderRadius: "14px",
                  color: "var(--text-secondary)",
                  padding: "4px 10px",
                  fontSize: "0.7rem",
                  cursor: "pointer",
                  flexShrink: 0
                }}
              >
                {chip.label}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            style={{
              padding: "10px 12px",
              borderTop: "1px solid var(--glass-border)",
              background: "var(--bg-alpha-90)",
              display: "flex",
              gap: "8px",
              alignItems: "center"
            }}
          >
            {/* Mic trigger button */}
            <button
              type="button"
              onClick={toggleListening}
              style={{
                background: isListening ? "rgba(239,68,68,0.2)" : "var(--bg-tertiary)",
                border: "1px solid var(--glass-border)",
                borderRadius: "50%",
                width: "34px",
                height: "34px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: isListening ? "var(--accent-danger)" : "var(--text-secondary)",
                cursor: "pointer",
                flexShrink: 0
              }}
              title="Voice Speech Input"
            >
              {isListening ? <MicOff size={14} className="pulse-target" /> : <Mic size={14} />}
            </button>

            <input
              type="text"
              className="glass-input"
              style={{ padding: "8px 12px", fontSize: "0.8rem", borderRadius: "14px" }}
              placeholder={t.chatbotPlaceholder || "Ask HeroBot a question..."}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
            />
            <button
              type="submit"
              className="glass-btn"
              style={{ padding: "8px 12px", borderRadius: "50%", width: "34px", height: "34px", flexShrink: 0, justifyContent: "center" }}
            >
              <Send size={12} />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
