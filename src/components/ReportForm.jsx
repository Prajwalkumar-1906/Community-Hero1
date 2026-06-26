import React, { useState } from "react";
import { Upload, Cpu, Check, AlertTriangle, ArrowRight, Sparkles, MapPin } from "lucide-react";
import { simulateAIAnalysis } from "../data/mockData";

export default function ReportForm({ coordinates, onSubmit, onCancel, activeCity = "Mumbai", t = {} }) {
  const [step, setStep] = useState(1); // 1: Upload, 2: AI Scanning, 3: Details & Confirmation
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [aiAnalysisResult, setAiAnalysisResult] = useState(null);
  const [categoryHint, setCategoryHint] = useState("roads");

  // Form Fields
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Roads & Mobility");
  const [severity, setSeverity] = useState("Minor");
  const [locationName, setLocationName] = useState("");
  const [tags, setTags] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  // Sample images dictionary
  const sampleImages = {
    roads: {
      url: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80",
      name: "pothole_cracks.jpg"
    },
    water: {
      url: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80",
      name: "water_leak.jpg"
    },
    lights: {
      url: "https://images.unsplash.com/photo-1509024644558-2f56ce76c490?auto=format&fit=crop&w=600&q=80",
      name: "streetlamp_out.jpg"
    },
    waste: {
      url: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80",
      name: "garbage_bags.jpg"
    },
    facilities: {
      url: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=600&q=80",
      name: "playground_graffiti.jpg"
    }
  };

  // Run AI Scan
  const triggerAIScan = () => {
    setStep(2);
    const selectedImage = sampleImages[categoryHint];
    setImagePreview(selectedImage.url);
    setImageFile(selectedImage.name);

    simulateAIAnalysis(categoryHint).then((result) => {
      setAiAnalysisResult(result);
      setTitle(result.suggestedTitle);
      setCategory(result.category);
      setSeverity(result.severity);
      setTags(result.tags);
      
      // Smart location suggestion localized to selected Indian city
      if (activeCity === "Mumbai") {
        if (categoryHint === "roads") setLocationName("WEH near Bandra Reclamation, Mumbai");
        else if (categoryHint === "water") setLocationName("Colaba Market Arcade, Colaba, Mumbai");
        else if (categoryHint === "lights") setLocationName("Carter Road Promenade, Bandra, Mumbai");
        else if (categoryHint === "waste") setLocationName("Dharavi Link Road Side, Mumbai");
        else setLocationName("Gateway of India Plaza, Colaba, Mumbai");
      } else if (activeCity === "Bengaluru") {
        if (categoryHint === "roads") setLocationName("Outer Ring Rd near Silk Board Flyover, Bengaluru");
        else if (categoryHint === "water") setLocationName("Indiranagar Double Rd Main Line, Bengaluru");
        else if (categoryHint === "lights") setLocationName("80 Feet Rd, Koramangala, Bengaluru");
        else if (categoryHint === "waste") setLocationName("Footpath Pile, Koramangala 8th Block, Bengaluru");
        else setLocationName("Cubbon Park Pathways, Bengaluru");
      } else if (activeCity === "New Delhi") {
        if (categoryHint === "roads") setLocationName("Connaught Circus Inner Ring, New Delhi");
        else if (categoryHint === "water") setLocationName("Rajpath Drainage Line near Janpath, New Delhi");
        else if (categoryHint === "lights") setLocationName("Lodhi Gardens Pathway Gate, New Delhi");
        else if (categoryHint === "waste") setLocationName("Karol Bagh Market Side Alley, New Delhi");
        else setLocationName("India Gate Children Playground Area, New Delhi");
      } else { // Pune
        if (categoryHint === "roads") setLocationName("Senapati Bapat Road, Pune");
        else if (categoryHint === "water") setLocationName("Deccan Gymkhana Main Line near FC Rd, Pune");
        else if (categoryHint === "lights") setLocationName("Lane 5, Koregaon Park, Pune");
        else if (categoryHint === "waste") setLocationName("Kothrud Depot Dumping Corner, Pune");
        else setLocationName("Saras Baug Park Pathway, Pune");
      }

      setStep(3);
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || !locationName) {
      alert("Please fill in all required fields.");
      return;
    }

    const cityDefaultCoords = {
      Mumbai: [19.0760, 72.8777],
      Bengaluru: [12.9716, 77.5946],
      "New Delhi": [28.6139, 77.2090],
      Pune: [18.5204, 73.8567]
    };

    setSubmitting(true);
    setTimeout(() => {
      const newIssue = {
        title,
        category,
        severity,
        description,
        locationName,
        coordinates: coordinates ? [coordinates.lat, coordinates.lng] : (cityDefaultCoords[activeCity] || [19.0760, 72.8777]),
        image: imagePreview || "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=600&q=80",
        tags,
        aiConfidence: aiAnalysisResult ? aiAnalysisResult.confidence : 78.5
      };
      onSubmit(newIssue);
      setSubmitting(false);
    }, 1000);
  };

  return (
    <div className="glass-panel scrollable-panel">
      {/* Header */}
      <div className="flex-between" style={{ borderBottom: "1px solid var(--glass-border)", paddingBottom: "12px", marginBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div className="flex-center" style={{ width: "32px", height: "32px", background: "var(--accent-secondary-glow)", color: "var(--accent-secondary)", borderRadius: "50%" }}>
            <Sparkles size={16} />
          </div>
          <div>
            <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1rem" }}>{t.reportIssue || "Report Local Issue"}</h3>
            <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>
              Intelligent Intake AI Engine ({activeCity})
            </p>
          </div>
        </div>
        <button className="glass-btn" onClick={onCancel} style={{ padding: "4px 8px", fontSize: "0.8rem" }}>
          {t.cancel || "Cancel"}
        </button>
      </div>

      {/* Coordinate warning if not clicked map */}
      {!coordinates && step === 1 && (
        <div style={{
          background: "rgba(245, 158, 11, 0.1)",
          border: "1px solid rgba(245, 158, 11, 0.2)",
          padding: "10px",
          borderRadius: "var(--radius-sm)",
          marginBottom: "16px",
          display: "flex",
          gap: "8px",
          fontSize: "0.8rem",
          alignItems: "flex-start",
          color: "#fccd5c"
        }}>
          <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: "2px" }} />
          <span>{t.coordinateWarning || "You haven't pinned a location on the map yet. We will default to center."} ({activeCity})</span>
        </div>
      )}

      {coordinates && step === 1 && (
        <div style={{
          background: "rgba(99, 102, 241, 0.1)",
          border: "1px solid rgba(99, 102, 241, 0.2)",
          padding: "8px 12px",
          borderRadius: "var(--radius-sm)",
          marginBottom: "16px",
          display: "flex",
          alignItems: "center",
          gap: "8px",
          fontSize: "0.8rem",
          color: "#c7d2fe"
        }}>
          <MapPin size={14} style={{ color: "var(--accent-primary)" }} />
          <span>{t.lockedCoordinates || "Locked Coordinates"}: <strong>{coordinates.lat}, {coordinates.lng}</strong></span>
        </div>
      )}

      {/* STEP 1: UPLOAD SIMULATOR */}
      {step === 1 && (
        <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: "16px" }}>
          <label style={{ fontSize: "0.85rem", color: "var(--text-secondary)", fontWeight: "500" }}>
            {t.selectImage || "Select Sample Image to Simulate Report Upload:"}
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
            {Object.keys(sampleImages).map((key) => (
              <button
                key={key}
                onClick={() => setCategoryHint(key)}
                className={`glass-panel-interactive`}
                style={{
                  background: categoryHint === key ? "var(--bg-tertiary)" : "rgba(18,24,41,0.4)",
                  border: categoryHint === key ? "1px solid var(--accent-secondary)" : "1px solid var(--glass-border)",
                  borderRadius: "var(--radius-sm)",
                  padding: "8px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: "6px",
                  outline: "none"
                }}
              >
                <img
                  src={sampleImages[key].url}
                  alt={key}
                  style={{ width: "100%", height: "45px", objectFit: "cover", borderRadius: "4px" }}
                />
                <span style={{ fontSize: "0.75rem", textTransform: "capitalize", color: categoryHint === key ? "var(--text-primary)" : "var(--text-secondary)" }}>
                  {key}
                </span>
              </button>
            ))}
          </div>

          <div
            onClick={triggerAIScan}
            className="glass-panel-interactive"
            style={{
              flex: 1,
              border: "2px dashed var(--glass-border)",
              borderRadius: "var(--radius-md)",
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              padding: "40px 20px",
              textAlign: "center",
              background: "var(--bg-alpha-40)"
            }}
          >
            <Upload size={36} style={{ color: "var(--text-secondary)", marginBottom: "12px" }} />
            <h4 style={{ marginBottom: "6px" }}>Analyze Photo of the Issue</h4>
            <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", maxWidth: "250px", marginBottom: "16px" }}>
              Click here to trigger AI Scanning on your selected sample image
            </p>
            <button className="glass-btn glass-btn-secondary" style={{ pointerEvents: "none" }}>
              <Cpu size={14} /> Scan Image
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: AI SCANNING ANIMATION */}
      {step === 2 && (
        <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "center", alignItems: "center", position: "relative", minHeight: "300px" }}>
          {/* Scanning Box */}
          <div style={{
            position: "relative",
            width: "100%",
            maxWidth: "320px",
            height: "200px",
            borderRadius: "var(--radius-md)",
            overflow: "hidden",
            border: "1px solid var(--accent-secondary)",
            boxShadow: "0 0 20px rgba(6, 182, 212, 0.15)",
            marginBottom: "24px"
          }}>
            <img
              src={imagePreview}
              alt="Scanning preview"
              style={{ width: "100%", height: "100%", objectFit: "cover", filter: "blur(2px) brightness(0.6)" }}
            />
            {/* Animated Laser line */}
            <div className="scanning-line" />
            <div style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "8px",
              zIndex: 11
            }}>
              <Cpu className="float-anim" size={32} style={{ color: "var(--accent-secondary)" }} />
              <span style={{ fontSize: "0.85rem", fontWeight: "600", letterSpacing: "0.1em", textTransform: "uppercase", textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>
                AI Categorizing...
              </span>
            </div>
          </div>

          <div style={{ width: "100%", maxWidth: "320px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", marginBottom: "6px", color: "var(--text-secondary)" }}>
              <span>Convolutional Network Analysis</span>
              <span>Running...</span>
            </div>
            <div className="progress-bar-container" style={{ height: "6px" }}>
              <div className="progress-bar-fill" style={{
                width: "100%",
                background: "var(--grad-cyan-blue)",
                animation: "fillProgress 2.4s linear forwards"
              }} />
            </div>
            <style>{`
              @keyframes fillProgress {
                0% { width: 0%; }
                100% { width: 100%; }
              }
            `}</style>
          </div>
        </div>
      )}

      {/* STEP 3: DETAILS & CONFIRMATION */}
      {step === 3 && (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", flex: 1, gap: "16px" }}>
          {/* AI Banner */}
          <div style={{
            background: "rgba(16, 185, 129, 0.08)",
            border: "1px solid rgba(16, 185, 129, 0.2)",
            borderRadius: "var(--radius-sm)",
            padding: "10px 14px",
            display: "flex",
            flexDirection: "column",
            gap: "8px"
          }}>
            <div className="flex-between">
              <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "0.8rem" }}>
                <div style={{ background: "var(--accent-success)", color: "white", borderRadius: "50%", padding: "2px" }}>
                  <Check size={12} />
                </div>
                <div>
                  <span style={{ color: "var(--text-primary)", fontWeight: "600" }}>{t.aiScanComplete || "AI Assessment Complete"}</span>
                  <div style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>
                    Tags: {tags.map(t => `#${t}`).join(", ")}
                  </div>
                </div>
              </div>
              <span style={{ fontSize: "0.8rem", color: "var(--accent-success)", fontWeight: "700" }}>
                {aiAnalysisResult?.confidence}% {t.matchScore || "Match"}
              </span>
            </div>

            {/* Neural Classifier Probability Breakdown */}
            <div style={{
              background: "var(--bg-alpha-60)",
              border: "1px solid var(--glass-border)",
              borderRadius: "var(--radius-sm)",
              padding: "12px 14px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              marginTop: "8px",
              boxShadow: "inset 0 0 10px rgba(0,0,0,0.5)"
            }}>
              <span style={{ fontSize: "0.7rem", color: "var(--text-secondary)", textTransform: "uppercase", letterSpacing: "0.08em", fontWeight: "700" }}>
                🧠 Neural Softmax Distribution Outputs
              </span>
              
              {/* Primary Bar */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div className="flex-between" style={{ fontSize: "0.75rem" }}>
                  <span style={{ color: "var(--text-primary)", fontWeight: "600", display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent-secondary)" }} />
                    {category} (Identified)
                  </span>
                  <span style={{ fontWeight: "bold", color: "var(--accent-secondary)" }}>{aiAnalysisResult?.confidence}%</span>
                </div>
                <div className="progress-bar-container" style={{ height: "6px", background: "rgba(255,255,255,0.02)", borderRadius: "3px" }}>
                  <div className="progress-bar-fill" style={{ width: `${aiAnalysisResult?.confidence}%`, background: "var(--grad-cyan-blue)", boxShadow: "0 0 8px rgba(6, 182, 212, 0.4)", borderRadius: "3px" }} />
                </div>
              </div>
              
              {/* Secondary Bar */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div className="flex-between" style={{ fontSize: "0.75rem" }}>
                  <span style={{ color: "var(--text-secondary)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--accent-primary)" }} />
                    Alternative Civic Category
                  </span>
                  <span style={{ fontWeight: "bold", color: "var(--accent-primary)" }}>{Math.round((100 - (aiAnalysisResult?.confidence || 90)) * 0.7)}%</span>
                </div>
                <div className="progress-bar-container" style={{ height: "6px", background: "rgba(255,255,255,0.02)", borderRadius: "3px" }}>
                  <div className="progress-bar-fill" style={{ width: `${Math.round((100 - (aiAnalysisResult?.confidence || 90)) * 0.7)}%`, background: "var(--accent-primary)", borderRadius: "3px" }} />
                </div>
              </div>

              {/* Tertiary Bar */}
              <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                <div className="flex-between" style={{ fontSize: "0.75rem" }}>
                  <span style={{ color: "var(--text-muted)", display: "flex", alignItems: "center", gap: "4px" }}>
                    <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "var(--text-muted)" }} />
                    Background Environmental Noise
                  </span>
                  <span style={{ fontWeight: "bold", color: "var(--text-muted)" }}>{Math.round((100 - (aiAnalysisResult?.confidence || 90)) * 0.3)}%</span>
                </div>
                <div className="progress-bar-container" style={{ height: "6px", background: "rgba(255,255,255,0.02)", borderRadius: "3px" }}>
                  <div className="progress-bar-fill" style={{ width: `${Math.round((100 - (aiAnalysisResult?.confidence || 90)) * 0.3)}%`, background: "var(--text-muted)", borderRadius: "3px" }} />
                </div>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <img
              src={imagePreview}
              alt="Report thumbnail"
              style={{ width: "60px", height: "60px", borderRadius: "var(--radius-sm)", objectFit: "cover", border: "1px solid var(--glass-border)" }}
            />
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{t.suggestedTitle || "Suggested Report Title"}</label>
              <input
                type="text"
                className="glass-input"
                style={{ padding: "8px 12px" }}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
            <div>
              <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{t.categoryLabel || "Category"}</label>
              <select
                className="glass-input"
                style={{ padding: "8px 12px", cursor: "pointer" }}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Roads & Mobility">Roads & Mobility</option>
                <option value="Streetlights & Safety">Streetlights & Safety</option>
                <option value="Water & Sanitation">Water & Sanitation</option>
                <option value="Waste Management">Waste Management</option>
                <option value="Public Facilities">Public Facilities</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{t.severityLabel || "Assessed Severity"}</label>
              <select
                className="glass-input"
                style={{ padding: "8px 12px", cursor: "pointer" }}
                value={severity}
                onChange={(e) => setSeverity(e.target.value)}
              >
                <option value="Critical">Critical</option>
                <option value="Major">Major</option>
                <option value="Minor">Minor</option>
              </select>
            </div>
          </div>

          <div>
            <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{t.addressPlaceholder || "Address / Location Name"}</label>
            <input
              type="text"
              className="glass-input"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="e.g. Bandra Reclamation, Mumbai"
              required
            />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ fontSize: "0.75rem", color: "var(--text-secondary)" }}>{t.contextPlaceholder || "Additional Context / Description"}</label>
            <textarea
              className="glass-input"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Provide any details that can help utility workers or community volunteers understand the issue..."
              rows={4}
              style={{ resize: "none", height: "80px" }}
              required
            />
          </div>

          {/* Action buttons */}
          <div style={{ display: "flex", gap: "10px", marginTop: "auto" }}>
            <button
              type="button"
              className="glass-btn"
              onClick={() => setStep(1)}
              style={{ flex: 1 }}
              disabled={submitting}
            >
              Re-Scan
            </button>
            <button
              type="submit"
              className="glass-btn glass-btn-primary"
              style={{ flex: 2, justifyContent: "center" }}
              disabled={submitting}
            >
              {submitting ? (t.publishing || "Publishing...") : (t.submitReport || "Submit Report")}
              {!submitting && <ArrowRight size={14} />}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
