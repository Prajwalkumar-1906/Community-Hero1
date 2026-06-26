// Mock database localized to India Metro Cities
// Supported cities: Mumbai, Bengaluru, New Delhi, Pune

export const CITY_CENTERS = {
  Mumbai: [19.0760, 72.8777],
  Bengaluru: [12.9716, 77.5946],
  "New Delhi": [28.6139, 77.2090],
  Pune: [18.5204, 73.8567]
};

export const INITIAL_ISSUES = [
  // --- MUMBAI ISSUES ---
  {
    id: "issue-m1",
    title: "Major Pothole on Western Express Highway",
    city: "Mumbai",
    category: "Roads & Mobility",
    status: "Verified",
    severity: "Critical",
    description: "Deep pothole in the middle lane of WEH near Bandra flyover exit. Causing traffic jams and severe safety issues during rains.",
    locationName: "WEH, Bandra West, Mumbai",
    coordinates: [19.0596, 72.8436],
    reportedBy: "Rohan Sharma",
    reportedDate: "2026-06-23T10:30:00Z",
    upvotes: 89,
    verifiedCount: 42,
    userVerified: false,
    volunteers: ["Aditi Nair", "Rahul Mehta"],
    crowdFunding: { enabled: false, target: 0, current: 0, contributors: 0 },
    image: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80",
    comments: [
      { id: "cm1", author: "Aditi Nair", role: "Citizen", content: "Nearly lost balance on my scooter here yesterday! Very dangerous.", date: "2026-06-23T11:15:00Z" },
      { id: "cm2", author: "BMC Road Dept", role: "City Inspector", content: "Inspection completed. Scheduled for repair crew dispatch.", date: "2026-06-23T14:40:00Z" }
    ],
    history: [
      { status: "Reported", date: "2026-06-23T10:30:00Z", note: "Issue logged by citizen." },
      { status: "Verified", date: "2026-06-23T14:40:00Z", note: "Verified by community and BMC inspector." }
    ]
  },
  {
    id: "issue-m2",
    title: "Water Main Leakage near Colaba Causeway",
    city: "Mumbai",
    category: "Water & Sanitation",
    status: "Reported",
    severity: "Major",
    description: "Clean water bubbling up from sidewalk joint next to Colaba Market, creating minor flooding in the alleyway.",
    locationName: "Colaba Causeway, Mumbai",
    coordinates: [18.9166, 72.8286],
    reportedBy: "Marcus Vance", // Seeded reported issue for Marcus Vance
    reportedDate: "2026-06-24T08:15:00Z",
    upvotes: 15,
    verifiedCount: 4,
    userVerified: false,
    volunteers: [],
    crowdFunding: { enabled: false, target: 0, current: 0, contributors: 0 },
    image: "https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&w=600&q=80",
    comments: [],
    history: [
      { status: "Reported", date: "2026-06-24T08:15:00Z", note: "Issue logged by citizen." }
    ]
  },

  // --- BENGALURU ISSUES ---
  {
    id: "issue-b1",
    title: "Garbage Dump Blockage on Indiranagar 100ft Rd",
    city: "Bengaluru",
    category: "Waste Management",
    status: "Verified",
    severity: "Major",
    description: "Large heap of construction debris and plastic garbage dumped on the footpath, forcing pedestrians to walk on the busy road.",
    locationName: "100 Feet Rd, Indiranagar, Bengaluru",
    coordinates: [12.9718, 77.6412],
    reportedBy: "Preeti Rao",
    reportedDate: "2026-06-23T14:10:00Z",
    upvotes: 62,
    verifiedCount: 24,
    userVerified: false,
    volunteers: ["Preeti Rao", "Vijay Kumar", "Marcus Vance"], // Marcus Vance volunteers here
    crowdFunding: { enabled: true, target: 5000, current: 3800, contributors: 12 },
    image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80",
    comments: [
      { id: "cb1", author: "Vijay Kumar", role: "Citizen", content: "Organizing a weekend cleanup drive. Pledged funds for renting a truck.", date: "2026-06-23T16:00:00Z" }
    ],
    history: [
      { status: "Reported", date: "2026-06-23T14:10:00Z", note: "Issue logged by citizen." },
      { status: "Verified", date: "2026-06-23T18:00:00Z", note: "Verified by 20+ neighborhood residents." }
    ]
  },
  {
    id: "issue-b2",
    title: "Broken Streetlight outside Koramangala Club",
    city: "Bengaluru",
    category: "Streetlights & Safety",
    status: "In Progress",
    severity: "Minor",
    description: "Footpath is completely pitch dark due to two broken streetlights. Feels unsafe for evening walkers.",
    locationName: "80 Feet Rd, Koramangala, Bengaluru",
    coordinates: [12.9348, 77.6189],
    reportedBy: "Vikram Das",
    reportedDate: "2026-06-22T09:00:00Z",
    upvotes: 21,
    verifiedCount: 8,
    userVerified: true,
    volunteers: [],
    crowdFunding: { enabled: false, target: 0, current: 0, contributors: 0 },
    image: "https://images.unsplash.com/photo-1509024644558-2f56ce76c490?auto=format&fit=crop&w=600&q=80",
    comments: [
      { id: "cb2", author: "BESCOM Crew", role: "Civil Authority", content: "Replacement light bulb and wire joints dispatched.", date: "2026-06-23T10:00:00Z" }
    ],
    history: [
      { status: "Reported", date: "2026-06-22T09:00:00Z", note: "Issue logged." },
      { status: "Verified", date: "2026-06-22T14:00:00Z", note: "Community verification matched." },
      { status: "In Progress", date: "2026-06-23T10:00:00Z", note: "BESCOM maintenance crew assigned." }
    ]
  },

  // --- NEW DELHI ISSUES ---
  {
    id: "issue-d1",
    title: "Broken Footpath & Open Drain near Connaught Place",
    city: "New Delhi",
    category: "Public Facilities",
    status: "Verified",
    severity: "Critical",
    description: "Slabs of the drainage system have broken off, leaving a deep open pit on the pedestrian walkway in Connaught Circus inner circle.",
    locationName: "Connaught Circus, New Delhi",
    coordinates: [28.6304, 77.2177],
    reportedBy: "Amitabh Kumar",
    reportedDate: "2026-06-22T15:45:00Z",
    upvotes: 110,
    verifiedCount: 54,
    userVerified: false,
    volunteers: ["Amitabh Kumar", "Sanjay Gupta"],
    crowdFunding: { enabled: false, target: 0, current: 0, contributors: 0 },
    image: "https://images.unsplash.com/photo-1515162305285-0293e4767cc2?auto=format&fit=crop&w=600&q=80",
    comments: [
      { id: "cd1", author: "Sanjay Gupta", role: "Citizen", content: "Very high footfall area, someone could fall in. Needs barrier immediately.", date: "2026-06-22T17:00:00Z" }
    ],
    history: [
      { status: "Reported", date: "2026-06-22T15:45:00Z", note: "Issue logged." },
      { status: "Verified", date: "2026-06-22T19:00:00Z", note: "NDMC verified and placed temporary hazard cones." }
    ]
  },
  {
    id: "issue-d2",
    title: "Vandalism at Lodhi Gardens Children's Play Area",
    city: "New Delhi",
    category: "Public Facilities",
    status: "Resolved",
    severity: "Minor",
    description: "Graffiti painted over swings and slides in children's park area. Needs cleanup.",
    locationName: "Lodhi Road, New Delhi",
    coordinates: [28.5929, 77.2198],
    reportedBy: "Neha Sen",
    reportedDate: "2026-06-20T09:00:00Z",
    upvotes: 45,
    verifiedCount: 15,
    userVerified: false,
    volunteers: ["Neha Sen", "Priya Das"],
    crowdFunding: { enabled: true, target: 1500, current: 1500, contributors: 4 },
    image: "https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&w=600&q=80",
    comments: [
      { id: "cd2", author: "Neha Sen", role: "Citizen", content: "Pledged paint and tools. Completed repainting slide with children's murals!", date: "2026-06-21T18:00:00Z" }
    ],
    history: [
      { status: "Reported", date: "2026-06-20T09:00:00Z", note: "Issue logged." },
      { status: "Verified", date: "2026-06-20T12:00:00Z", note: "Verified." },
      { status: "Resolved", date: "2026-06-21T18:00:00Z", note: "Citizen cleanup completed." }
    ]
  },

  // --- PUNE ISSUES ---
  {
    id: "issue-p1",
    title: "Garbage Pile Overflow on FC Road",
    city: "Pune",
    category: "Waste Management",
    status: "Verified",
    severity: "Major",
    description: "Public garbage bins are overflowing near FC Road restaurants, attracting pests and causing foul smell.",
    locationName: "FC Road, Shivajinagar, Pune",
    coordinates: [18.5244, 73.8412],
    reportedBy: "Tanmay Bapat",
    reportedDate: "2026-06-23T11:00:00Z",
    upvotes: 52,
    verifiedCount: 19,
    userVerified: false,
    volunteers: ["Tanmay Bapat", "Shreya Joshi"],
    crowdFunding: { enabled: true, target: 2000, current: 1800, contributors: 6 },
    image: "https://images.unsplash.com/photo-1611284446314-60a58ac0deb9?auto=format&fit=crop&w=600&q=80",
    comments: [
      { id: "cp1", author: "Shreya Joshi", role: "Citizen", content: "PMC municipal truck hasn't visited this corner since Monday.", date: "2026-06-23T14:00:00Z" }
    ],
    history: [
      { status: "Reported", date: "2026-06-23T11:00:00Z", note: "Logged by resident." },
      { status: "Verified", date: "2026-06-23T16:00:00Z", note: "Verified by community." }
    ]
  },
  {
    id: "issue-p2",
    title: "Blinking/Flickering Streetlight in Koregaon Park",
    city: "Pune",
    category: "Streetlights & Safety",
    status: "Reported",
    severity: "Minor",
    description: "Streetlight in Lane 5 has been blinking rapidly, creating strobe effect and making the dark sidewalk unsafe.",
    locationName: "Lane 5, Koregaon Park, Pune",
    coordinates: [18.5362, 73.8932],
    reportedBy: "Nikhil Deshmukh",
    reportedDate: "2026-06-24T09:30:00Z",
    upvotes: 12,
    verifiedCount: 3,
    userVerified: false,
    volunteers: [],
    crowdFunding: { enabled: false, target: 0, current: 0, contributors: 0 },
    image: "https://images.unsplash.com/photo-1509024644558-2f56ce76c490?auto=format&fit=crop&w=600&q=80",
    comments: [],
    history: [
      { status: "Reported", date: "2026-06-24T09:30:00Z", note: "Logged." }
    ]
  }
];

export const MOCK_USER = {
  name: "Marcus Vance",
  avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
  level: 4,
  xp: 1450,
  xpNeeded: 2500,
  karma: 340,
  rank: 12,
  badges: [
    { id: "b1", title: "Pothole Patrol", icon: "Milestone", desc: "Reported 3 road issues", color: "#6366f1" },
    { id: "b2", title: "Eco-Warrior", icon: "Trash2", desc: "Participated in 2 waste cleanups", color: "#10b981" },
    { id: "b3", title: "First Responder", icon: "ShieldCheck", desc: "Validated an issue within 10 mins", color: "#f59e0b" }
  ],
  activeQuests: [
    { id: "q1", title: "Verify Local Issues", desc: "Verify 2 other reports in your neighborhood", progress: 1, target: 2, reward: 200 },
    { id: "q2", title: "Green Clean Up", desc: "Volunteer or donate to a waste management project", progress: 0, target: 1, reward: 500 }
  ],
  // Historical rewards transaction logs ledger
  ledger: [
    { id: "l1", type: "report", xp: 200, karma: 40, action: "Reported Water Leakage on Colaba Causeway", date: "2026-06-24T08:15:00Z" },
    { id: "l2", type: "volunteer", xp: 150, karma: 30, action: "Volunteered for Indiranagar path cleanup crew", date: "2026-06-23T14:10:00Z" },
    { id: "l3", type: "verify", xp: 50, karma: 10, action: "Verified Broken Streetlight on Koramangala Rd", date: "2026-06-22T09:00:00Z" }
  ]
};

export const LEADERBOARD = [
  { name: "Sarah Jenkins", xp: 4200, karma: 890, badges: 8, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80" },
  { name: "Sophia Patel", xp: 3850, karma: 720, badges: 6, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=150&q=80" },
  { name: "Alex Chen", xp: 3200, karma: 540, badges: 5, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" },
  { name: "Elena Rostova", xp: 2150, karma: 410, badges: 4, avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=150&q=80" },
  { name: "Marcus Vance", xp: 1450, karma: 340, badges: 3, avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80" }
];

export const PREDICTIVE_INSIGHTS = [
  { id: "p1", title: "Water Pipeline Crack Risk", zone: "Colaba / Fort Ward, Mumbai", probability: "84%", description: "Patterns of low water pressure in historical citizen complaints hint at major corroded joints. Pipes are 55+ years old.", severity: "High" },
  { id: "p2", title: "Transformer Overload Risk", zone: "Koramangala 3rd Block, Bengaluru", probability: "69%", description: "Localized transformer flickering logs exceed safe bounds. Preventive maintenance scheduled by BESCOM.", severity: "Medium" },
  { id: "p3", title: "Asphalt Micro-cracks detected", zone: "Connaught Circus Outer Ring, Delhi", probability: "58%", description: "Heavy bus traffic loads have created surface micro-cracks. High hazard chance during monsoon storm drains.", severity: "Low" }
];

// Simulated AI Image Analysis Engine (returns localized suggestions matching Indian city context)
export const simulateAIAnalysis = (categoryHint, city = "Mumbai") => {
  const analysisLibrary = {
    roads: {
      category: "Roads & Mobility",
      severity: "Major",
      tags: ["Pothole", "Asphalt Damage", "Traffic Hazard"],
      suggestedTitle: "Severe Pothole on Lane road",
      confidence: 94.2
    },
    water: {
      category: "Water & Sanitation",
      severity: "Critical",
      tags: ["Water Leak", "Sidewalk Flow", "Infrastructure Fault"],
      suggestedTitle: "Gushing Water Pipe Joint Leakage",
      confidence: 98.7
    },
    lights: {
      category: "Streetlights & Safety",
      severity: "Minor",
      tags: ["Dark Spot", "Flickering Light", "Public Safety"],
      suggestedTitle: "Non-functioning Streetlight Spot",
      confidence: 91.5
    },
    waste: {
      category: "Waste Management",
      severity: "Major",
      tags: ["Trash Dumping", "Sanitation Hazard", "Blockage"],
      suggestedTitle: "Overflowing Garbage Dump Pile",
      confidence: 96.8
    },
    facilities: {
      category: "Public Facilities",
      severity: "Minor",
      tags: ["Graffiti", "Playground Damage", "Vandalism"],
      suggestedTitle: "Defaced Public Equipment Vandalism",
      confidence: 89.4
    },
    default: {
      category: "Roads & Mobility",
      severity: "Minor",
      tags: ["General Maintenance", "Civic Report"],
      suggestedTitle: "Civic Infrastructure Maintenance Required",
      confidence: 76.5
    }
  };

  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(analysisLibrary[categoryHint] || analysisLibrary.default);
    }, 2500);
  });
};

export const getAssignedAgency = (city, category) => {
  const agencyMap = {
    Mumbai: {
      "Roads & Mobility": "BMC (Brihanmumbai Municipal Corporation) Road Dept",
      "Water & Sanitation": "BMC Hydraulic Engineer Department",
      "Waste Management": "BMC Solid Waste Management (SWM) Dept",
      "Streetlights & Safety": "BEST Undertaking Electricity Div",
      "Public Facilities": "BMC Ward Inspectorate"
    },
    Bengaluru: {
      "Roads & Mobility": "BBMP (Bruhat Bengaluru Mahanagara Palike) Road Dept",
      "Water & Sanitation": "BWSSB Water Supply & Sewerage Board",
      "Waste Management": "BBMP Waste Management Division",
      "Streetlights & Safety": "BESCOM Electricity Supply Div",
      "Public Facilities": "BBMP Parks & Horticulture Division"
    },
    "New Delhi": {
      "Roads & Mobility": "NDMC (New Delhi Municipal Council) Civil Dept",
      "Water & Sanitation": "Delhi Jal Board (DJB)",
      "Waste Management": "MCD (Municipal Corporation of Delhi) SWM",
      "Streetlights & Safety": "BSES Rajdhani Power Supply",
      "Public Facilities": "DDA (Delhi Development Authority) Inspector"
    },
    Pune: {
      "Roads & Mobility": "PMC (Pune Municipal Corporation) Road Infra",
      "Water & Sanitation": "PMC Water Supply Dept",
      "Waste Management": "PMC Waste Management (SWM) Dept",
      "Streetlights & Safety": "MSEDCL (Mahadiscom) Power Supply",
      "Public Facilities": "PMC Ward Development Division"
    }
  };

  const cityMap = agencyMap[city] || agencyMap.Mumbai;
  return cityMap[category] || "Municipal Corporation General Division";
};

export const generateGovtGrievanceId = (city, category) => {
  const cityCode = {
    Mumbai: "BMC",
    Bengaluru: "BBMP",
    "New Delhi": "NDMC",
    Pune: "PMC"
  }[city] || "MUNICIPAL";

  const catCode = {
    "Roads & Mobility": "RD",
    "Water & Sanitation": "WT",
    "Waste Management": "WS",
    "Streetlights & Safety": "LT",
    "Public Facilities": "PF"
  }[category] || "GEN";

  return `SBM-${cityCode}-${catCode}-${Math.floor(100000 + Math.random() * 900000)}`;
};

