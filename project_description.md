# NagrikHero: Smart City Civic Resolution Platform

**Bridging the Gap Between Citizens and Municipal Governments via Digital Public Infrastructure (DPI)**

*   **Live Web URL**: [https://community-hero-5acbe.web.app](https://community-hero-5acbe.web.app)
*   **GitHub Code Repository**: [https://github.com/Prajwalkumar-1906/Community-Hero1.git](https://github.com/Prajwalkumar-1906/Community-Hero1.git)

---

## 1. Executive Summary
**NagrikHero** is an interactive, map-centric civic problem-solving dashboard designed for next-generation Indian smart cities. It bridges the transparency gap between citizens and local urban development authorities. The platform enables citizens to report local infrastructure issues (potholes, garbage piles, electrical faults), volunteer for repair crews, pledge funds for neighborhood projects, and earn official DPI-aligned cryptographic credentials—all while local municipalities dispatch, track, and update resolution timelines in real-time.

NagrikHero features a high-fidelity **dark-cyber glassmorphic user interface** optimized for desktop monitors, complete with responsive vector cartography, native audio feedback, real-time notification routing, and localized speech controls.

---

## 2. The Problem Statement
Indian metro hubs (Mumbai, Bengaluru, New Delhi, Pune) face immense challenges in maintaining local infrastructure due to:
1.  **Resolution Delays & Friction**: Traditional grievance portals are complex, slow, and lack transparency, leading to citizen disillusionment.
2.  **No Incentive to Participate**: Citizens have no structural reward or recognition for volunteering or crowdfunding local municipal repairs.
3.  **Manual Triage Bottlenecks**: Municipal staff are overwhelmed by incoming complaints, lacking automated tools to predict severity, parse locations, or categorize anomalies.
4.  **Security & Verifiability**: A lack of tamper-proof, cryptographic verification for public contributions (financial and physical volunteering) creates trust gaps.

---

## 3. The NagrikHero Solution
NagrikHero resolves these bottlenecks by combining gamification, automation, and geographic intelligence into a single unified workspace:

*   **Gamification (The Hero Hub)**: Incentivizes citizens to become "Civic Heroes" by awarding Experience Points (XP) and leveling them up for verifying issues, joining cleanup crews, or contributing micro-funds.
*   **Automated AI Classification**: Simulates a Convolutional Neural Network (CNN) scanner that processes uploaded photos, predicts severity, displays a Softmax probability bar chart, and tags the issue automatically.
*   **DPI Cryptographic Integration**: Automatically generates official, print-ready contribution certificates modeled on National Payment Systems (NPCI) and Swachh Bharat Smart City templates, signed by the Municipal Commissioner with a verifiable SHA-256 hash.
*   **Geospatial Command Map**: Renders an interactive Leaflet workspace displaying color-coded markers that dynamically represent severity and resolution states across India's largest tech corridors.

---

## 4. Key Platform Features

### A. Dynamic Cartography & Geocoding Workspace
*   **Dual Base-Layer Selection**: Smoothly toggles between vector cartography (CARTO Voyager light mode/CARTO Dark Matter dark mode) and high-resolution Esri Satellite imagery.
*   **Target Hub Panning**: Instantly pans and zooms to active nodes in Mumbai, Bengaluru, New Delhi, and Pune.
*   **Geocoding API**: Integrates Nominatim API search to fetch global GPS coordinates dynamically from text queries.

### B. AI-Assisted Intake Form Wizard
*   **Simulated AI Scanning Line**: Re-creates a neon scanner overlay assessing uploaded road/sanitation photos.
*   **Softmax Probability Output**: Displays a CSS-rendered three-bar chart contrasting category classifications against background environmental noise.

### C. Multi-Channel Notification Center
*   **Milestone & Dispatch Tickers**: Interactive bell widget triggers alert sounds (synthesized via Web Audio API) on neighborhood quest completions.
*   **Contextual Routing**: Clicking any notification automatically shifts the dashboard context, selects the target issue, and centers the map workspace on it.

### D. NPCI Cryptographic Credentials
*   **Swachh Bharat Seal of Honor**: Successfully pledging money or joining a crew awards a digital certificate.
*   **Verification Ledger**: Houses official signatures, Ashoka Chakra symbols, and transaction hashes, logged locally via salt-hex ciphers (simulating public ledger updates).

### E. Civil Authority Console
*   **Municipal Routing Panel**: Access secure portals (via `admin@cityhall.gov`) to review incoming reports, override AI classifications, dispatch workers, and log progress timestamps.

---

## 5. Technology Stack
*   **Frontend**: React 18, Vite (Root-relative paths for global cloud asset delivery).
*   **Cartography**: Leaflet.js, OpenStreetMap, CartoDB, Esri World Imagery.
*   **Styling & FX**: Vanilla CSS (Cyberpunk dark/light theme systems with variable HSL glassmorphic values).
*   **Audio Synthesis**: Web Audio API (Synthesized oscillators for game-like sound effects).
*   **Voice Recognition**: Web Speech API (Speech-to-text input parsing and Text-to-speech feedback).
*   **Storage & Cryptography**: LocalStorage, salt-encrypted hex conversion, XOR Shift.

---

## 6. Local Municipal Agency Routing
To match real-life smart city guidelines, NagrikHero automatically routes tickets to the appropriate municipal body:
*   **Mumbai**: Brihanmumbai Municipal Corporation (BMC) & BEST.
*   **Bengaluru**: Bruhat Bengaluru Mahanagara Palike (BBMP), BBMP Road Dept, & BESCOM.
*   **New Delhi**: New Delhi Municipal Council (NDMC), Municipal Corporation of Delhi (MCD), & Delhi Jal Board.
*   **Pune**: Pune Municipal Corporation (PMC) & Mahadiscom.

---

## 7. Cloud Deployment (Google Cloud Platform)
The application has been optimized, compiled, and deployed using:
*   **Host**: Google Firebase Hosting (GCP)
*   **Live App link**: [https://community-hero-5acbe.web.app](https://community-hero-5acbe.web.app)
*   **Sync**: Automatic builds synchronized via Vite.
