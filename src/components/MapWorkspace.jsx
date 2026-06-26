import React, { useEffect, useRef, useState } from "react";
import { Filter, MapPin, Eye, Info } from "lucide-react";
import { playSound } from "../utils/sfx";

export default function MapWorkspace({
  issues,
  selectedIssueId,
  onSelectIssue,
  onMapClick,
  newReportCoords,
  filterCategory,
  setFilterCategory,
  filterStatus,
  setFilterStatus,
  selectedCity = "Mumbai",
  theme = "dark",
  t = {} // Translated string dictionary
}) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef({});
  const tempMarkerRef = useRef(null);
  const tileLayerRef = useRef(null);

  // Map Mode: vector or satellite
  const [mapMode, setMapMode] = useState("vector");

  const [searchQuery, setSearchQuery] = useState("");

  const handleLocationSearch = async () => {
    if (!searchQuery.trim()) return;
    try {
      playSound.click();
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&countrycodes=in&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) {
        const { lat, lon } = data[0];
        const newCoords = [parseFloat(lat), parseFloat(lon)];
        
        // Update map view
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setView(newCoords, 14);
        }
        
        // Pin new coordinates
        onMapClick({ lat: newCoords[0], lng: newCoords[1] });
      } else {
        alert("Location not found in India. Please try another search term.");
      }
    } catch (err) {
      console.error("Geocoding failed:", err);
    }
  };

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Default to Mumbai center on load
    const center = [19.0760, 72.8777];

    // Create Map
    const map = window.L.map(mapContainerRef.current, {
      center: center,
      zoom: 13,
      zoomControl: false,
    });

    // Add Zoom Control at bottom right
    window.L.control.zoom({ position: "bottomright" }).addTo(map);

    // Initial CartoDB Dark Matter tile layer
    const baseLayer = window.L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
      attribution: '&copy; OpenStreetMap &copy; CARTO',
      subdomains: "abcd",
      maxZoom: 20,
    }).addTo(map);

    tileLayerRef.current = baseLayer;
    mapInstanceRef.current = map;

    // Handle map clicks for reporting
    map.on("click", (e) => {
      const { lat, lng } = e.latlng;
      onMapClick({ lat: parseFloat(lat.toFixed(6)), lng: parseFloat(lng.toFixed(6)) });
    });

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle reactive map mode switches (Vector vs Satellite view)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !tileLayerRef.current) return;

    // Clear active labels overlay if exists
    if (tileLayerRef.current.labelOverlay) {
      map.removeLayer(tileLayerRef.current.labelOverlay);
      tileLayerRef.current.labelOverlay = null;
    }

    // Clear active tiles layer
    map.removeLayer(tileLayerRef.current);

    if (mapMode === "satellite") {
      // Esri World Imagery (Satellite)
      const baseLayer = window.L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}", {
        attribution: 'Tiles &copy; Esri &mdash; Source: Esri, USDA, USGS, GeoEye, and the GIS User Community',
        maxZoom: 19,
      }).addTo(map);

      // Labeled hybrid reference boundaries & places overlay
      const labelLayer = window.L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}", {
        attribution: 'Labels &copy; Esri',
        maxZoom: 19,
      }).addTo(map);

      tileLayerRef.current = baseLayer;
      tileLayerRef.current.labelOverlay = labelLayer;
    } else {
      // Vector Map mode (reacts to dark / light themes)
      if (theme === "light") {
        tileLayerRef.current = window.L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
          attribution: '&copy; OpenStreetMap &copy; CARTO',
          subdomains: "abcd",
          maxZoom: 20,
        }).addTo(map);
      } else {
        tileLayerRef.current = window.L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
          attribution: '&copy; OpenStreetMap &copy; CARTO',
          subdomains: "abcd",
          maxZoom: 20,
        }).addTo(map);
      }
    }
  }, [mapMode, theme]);

  // Handle reactive city panning when dropdown changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    const cityCenters = {
      Mumbai: [19.0760, 72.8777],
      Bengaluru: [12.9716, 77.5946],
      "New Delhi": [28.6139, 77.2090],
      Pune: [18.5204, 73.8567],
      Hyderabad: [17.3850, 78.4867],
      Chennai: [13.0827, 80.2707],
      Kolkata: [22.5726, 88.3639],
      Ahmedabad: [23.0225, 72.5714],
      Jaipur: [26.9124, 75.7873],
      Lucknow: [26.8467, 80.9462],
      Patna: [25.5941, 85.1376],
      Bhopal: [23.2599, 77.4126]
    };

    const targetCoords = cityCenters[selectedCity];
    if (targetCoords) {
      map.setView(targetCoords, 13);
    }
  }, [selectedCity]);

  // Update Markers based on issues
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    // Remove old markers that aren't in current list
    Object.keys(markersRef.current).forEach((id) => {
      map.removeLayer(markersRef.current[id]);
      delete markersRef.current[id];
    });

    // Add active markers
    issues.forEach((issue) => {
      const { id, coordinates, category, severity, status, title } = issue;
      if (!coordinates || coordinates.length < 2) return;

      // Color coding for status & severity
      let markerColor = "#94a3b8"; // Default Grey
      if (status === "Resolved") markerColor = "#10b981"; // Green
      else if (status === "In Progress") markerColor = "#f59e0b"; // Yellow/Amber
      else if (severity === "Critical") markerColor = "#ef4444"; // Red
      else if (severity === "Major") markerColor = "#6366f1"; // Indigo
      else markerColor = "#06b6d4"; // Cyan for minor

      const isSelected = selectedIssueId === id;

      // Custom marker icon using simple HTML styling
      const customIcon = window.L.divIcon({
        className: "custom-leaflet-marker",
        html: `
          <div class="custom-map-marker" style="
            background: ${markerColor}; 
            width: ${isSelected ? "34px" : "26px"}; 
            height: ${isSelected ? "34px" : "26px"};
            box-shadow: 0 0 ${isSelected ? "20px" : "8px"} ${markerColor};
            border: 2px solid #ffffff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <span style="font-size: 8px; font-weight: bold; color: white;">
              ${category.substring(0, 1)}
            </span>
          </div>
        `,
        iconSize: isSelected ? [34, 34] : [26, 26],
        iconAnchor: isSelected ? [17, 17] : [13, 13],
      });

      const marker = window.L.marker(coordinates, { icon: customIcon })
        .addTo(map)
        .on("click", () => {
          onSelectIssue(issue);
        });

      // Bind simple popup
      marker.bindTooltip(`
        <div style="font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500;">
          <strong>${title}</strong><br/>
          <span style="color: ${markerColor}">${category} - ${status}</span>
        </div>
      `, { direction: "top", offset: [0, -10] });

      markersRef.current[id] = marker;

      // Pan to selected marker
      if (isSelected) {
        map.panTo(coordinates);
      }
    });
  }, [issues, selectedIssueId]);

  // Update temporary selection marker (for new reporting)
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tempMarkerRef.current) {
      map.removeLayer(tempMarkerRef.current);
      tempMarkerRef.current = null;
    }

    if (newReportCoords) {
      const tempIcon = window.L.divIcon({
        className: "temp-map-marker",
        html: `
          <div class="custom-map-marker pulse-target" style="
            background: #a855f7; 
            width: 32px; 
            height: 32px;
            box-shadow: 0 0 15px #a855f7;
            border: 2px dashed #ffffff;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
          ">
            <span style="font-size: 14px; font-weight: bold; color: white;">+</span>
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16],
      });

      tempMarkerRef.current = window.L.marker(
        [newReportCoords.lat, newReportCoords.lng],
        { icon: tempIcon }
      ).addTo(map);

      map.panTo([newReportCoords.lat, newReportCoords.lng]);
    }
  }, [newReportCoords]);

  return (
    <div className="glass-panel" style={{ display: "flex", flexDirection: "column", height: "100%", gap: "16px", minHeight: "420px", position: "relative" }}>
      {/* Map Header with Filters */}
      <div className="flex-between" style={{ flexWrap: "wrap", gap: "12px" }}>
        <div className="flex-gap-sm">
          <MapPin size={20} className="text-secondary" style={{ color: "var(--accent-secondary)" }} />
          <h3>{t.mapTitle || "Interactive Map Workspace"}</h3>
        </div>

        {/* Filter Toolbar */}
        <div className="flex-gap-sm" style={{ flexWrap: "wrap" }}>
          {/* Dynamic Geocoding Search Input */}
          <div className="flex-gap-sm" style={{ background: "var(--bg-secondary)", padding: "4px 8px", borderRadius: "var(--radius-sm)", border: "1px solid var(--glass-border)" }}>
            <input
              type="text"
              placeholder="Search any place in India..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleLocationSearch();
                }
              }}
              style={{ background: "transparent", border: "none", color: "var(--text-primary)", fontSize: "0.85rem", outline: "none", width: "160px" }}
            />
            <button
              onClick={handleLocationSearch}
              style={{ background: "var(--accent-secondary)", border: "none", borderRadius: "4px", color: "white", padding: "2px 8px", fontSize: "0.75rem", cursor: "pointer" }}
            >
              Search
            </button>
          </div>

          <div className="flex-gap-sm" style={{ background: "var(--bg-secondary)", padding: "4px 8px", borderRadius: "var(--radius-sm)", border: "1px solid var(--glass-border)" }}>
            <Filter size={14} className="text-muted" />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              style={{ background: "transparent", border: "none", color: "var(--text-primary)", fontSize: "0.85rem", cursor: "pointer", outline: "none" }}
            >
              <option value="All" style={{ background: "var(--bg-secondary)" }}>All Categories</option>
              <option value="Roads & Mobility" style={{ background: "var(--bg-secondary)" }}>Roads</option>
              <option value="Streetlights & Safety" style={{ background: "var(--bg-secondary)" }}>Streetlights</option>
              <option value="Water & Sanitation" style={{ background: "var(--bg-secondary)" }}>Water & Sanitation</option>
              <option value="Waste Management" style={{ background: "var(--bg-secondary)" }}>Waste Management</option>
              <option value="Public Facilities" style={{ background: "var(--bg-secondary)" }}>Public Facilities</option>
            </select>
          </div>

          <div className="flex-gap-sm" style={{ background: "var(--bg-secondary)", padding: "4px 8px", borderRadius: "var(--radius-sm)", border: "1px solid var(--glass-border)" }}>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              style={{ background: "transparent", border: "none", color: "var(--text-primary)", fontSize: "0.85rem", cursor: "pointer", outline: "none" }}
            >
              <option value="All" style={{ background: "var(--bg-secondary)" }}>All Statuses</option>
              <option value="Reported" style={{ background: "var(--bg-secondary)" }}>Reported</option>
              <option value="Verified" style={{ background: "var(--bg-secondary)" }}>Verified</option>
              <option value="In Progress" style={{ background: "var(--bg-secondary)" }}>In Progress</option>
              <option value="Resolved" style={{ background: "var(--bg-secondary)" }}>Resolved</option>
            </select>
          </div>
        </div>
      </div>

      {/* Map Container */}
      <div style={{ flex: 1, position: "relative", minHeight: "360px", borderRadius: "var(--radius-md)", overflow: "hidden" }}>
        <div ref={mapContainerRef} style={{ width: "100%", height: "100%" }} />
        
        {/* Dynamic Satellite Map mode toggle */}
        <button
          onClick={() => { playSound.click(); setMapMode(mapMode === "vector" ? "satellite" : "vector"); }}
          className="glass-btn"
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            zIndex: 1000,
            padding: "6px 12px",
            fontSize: "0.75rem",
            background: "var(--bg-alpha-85)",
            borderColor: "var(--glass-border)",
            color: "var(--text-primary)"
          }}
        >
          🗺️ {mapMode === "vector" ? "Satellite" : "Vector Map"}
        </button>

        {/* Help Bubble overlay */}
        <div style={{
          position: "absolute",
          top: "12px",
          left: "12px",
          background: "var(--bg-alpha-80)",
          backdropFilter: "blur(6px)",
          padding: "8px 12px",
          borderRadius: "var(--radius-sm)",
          border: "1px solid var(--glass-border)",
          fontSize: "0.75rem",
          display: "flex",
          alignItems: "center",
          gap: "6px",
          color: "var(--text-secondary)",
          zIndex: 1000,
          pointerEvents: "none"
        }}>
          <Info size={12} style={{ color: "var(--accent-secondary)" }} />
          <span>{t.mapHelp || "Click anywhere on the map to pin a new issue"}</span>
        </div>
      </div>
    </div>
  );
}
