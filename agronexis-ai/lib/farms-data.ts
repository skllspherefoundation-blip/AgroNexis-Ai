export type FarmStatus = "Operational" | "Monitoring" | "Maintenance";
export type FarmHealth = "Excellent" | "Good" | "Watch" | "Critical";

export type Farm = {
  id: string;
  name: string;
  location: string;
  size: string;
  cropType: string;
  healthStatus: FarmHealth;
  moisture: number;
  temperature: string;
  lastUpdated: string;
  status: FarmStatus;
  gps: string;
  owner: string;
  description: string;
  soilCondition: string;
  weather: string;
  recommendations: string[];
  activities: string[];
};

export const farms: Farm[] = [
  {
    id: "farm-001",
    name: "Farm Alpha",
    location: "Kaduna, Nigeria",
    size: "1,240 acres",
    cropType: "Maize",
    healthStatus: "Excellent",
    moisture: 68,
    temperature: "27°C",
    lastUpdated: "8 min ago",
    status: "Operational",
    gps: "10.5105, 7.4165",
    owner: "Amina Okoro",
    description: "High-output maize estate with automated irrigation and satellite crop monitoring.",
    soilCondition: "Loamy soil with balanced nitrogen and strong water retention.",
    weather: "Cloudy, light wind, 32% rain probability",
    recommendations: [
      "Maintain current irrigation schedule for the next 24 hours.",
      "Scout northern block after humidity increase.",
      "Apply nitrogen only on low-index prescription zones.",
    ],
    activities: ["Irrigation cycle completed", "Drone imagery processed", "Soil probe synced"],
  },
  {
    id: "farm-002",
    name: "North Ranch",
    location: "Kano, Nigeria",
    size: "860 acres",
    cropType: "Sorghum",
    healthStatus: "Good",
    moisture: 57,
    temperature: "30°C",
    lastUpdated: "22 min ago",
    status: "Monitoring",
    gps: "12.0022, 8.5920",
    owner: "Musa Bello",
    description: "Dryland crop operation monitored for heat stress, moisture variance, and yield risk.",
    soilCondition: "Sandy loam trending dry across western plots.",
    weather: "Warm, gusting winds, low rain probability",
    recommendations: [
      "Increase moisture checks on western plots.",
      "Delay spraying until wind speed drops.",
      "Review heat stress risk before fertilizer application.",
    ],
    activities: ["Weather alert acknowledged", "Moisture threshold updated", "Field crew assigned"],
  },
  {
    id: "farm-003",
    name: "Riverbend Estate",
    location: "Benue, Nigeria",
    size: "2,100 acres",
    cropType: "Rice",
    healthStatus: "Watch",
    moisture: 81,
    temperature: "26°C",
    lastUpdated: "41 min ago",
    status: "Operational",
    gps: "7.7322, 8.5391",
    owner: "Grace Adeyemi",
    description: "Irrigated rice farm with pump telemetry, flood-risk monitoring, and yield prediction.",
    soilCondition: "Clay-rich soil with high saturation near canal edges.",
    weather: "Humid, rain developing, flood watch active",
    recommendations: [
      "Inspect canal edge drainage.",
      "Reduce irrigation on blocks C and D.",
      "Prioritize disease scouting after rainfall.",
    ],
    activities: ["Pump station B inspected", "Flood model refreshed", "Disease risk increased"],
  },
  {
    id: "farm-004",
    name: "Greenridge Fields",
    location: "Plateau, Nigeria",
    size: "640 acres",
    cropType: "Soybean",
    healthStatus: "Excellent",
    moisture: 63,
    temperature: "24°C",
    lastUpdated: "1 hr ago",
    status: "Operational",
    gps: "9.2182, 9.5179",
    owner: "Ifeoma Nwosu",
    description: "Soybean production blocks optimized with NDVI scouting and variable-rate prescriptions.",
    soilCondition: "Well-structured loam with stable organic matter.",
    weather: "Clear, mild temperature, favorable spraying window",
    recommendations: [
      "Proceed with planned crop protection window.",
      "Recheck block B canopy density in 48 hours.",
      "Maintain current water allocation.",
    ],
    activities: ["Prescription map exported", "Satellite pass completed", "Crop score improved"],
  },
  {
    id: "farm-005",
    name: "Savanna Ridge",
    location: "Nassarawa, Nigeria",
    size: "1,520 acres",
    cropType: "Cassava",
    healthStatus: "Critical",
    moisture: 34,
    temperature: "32°C",
    lastUpdated: "2 hrs ago",
    status: "Maintenance",
    gps: "8.4998, 8.1997",
    owner: "Daniel Sani",
    description: "Cassava estate currently under moisture recovery and pump reliability review.",
    soilCondition: "Low moisture with compaction detected in central plots.",
    weather: "Hot, dry, high evapotranspiration",
    recommendations: [
      "Reactivate irrigation on central plots.",
      "Dispatch maintenance to pump station A.",
      "Pause fertilizer application until moisture recovers.",
    ],
    activities: ["Pump fault reported", "Moisture alert escalated", "Maintenance ticket opened"],
  },
  {
    id: "farm-006",
    name: "East Valley Farm",
    location: "Ogun, Nigeria",
    size: "780 acres",
    cropType: "Vegetables",
    healthStatus: "Good",
    moisture: 72,
    temperature: "28°C",
    lastUpdated: "3 hrs ago",
    status: "Monitoring",
    gps: "6.9980, 3.4737",
    owner: "Tola Martins",
    description: "Mixed vegetable farm using microclimate sensing and drip irrigation automation.",
    soilCondition: "Moist, nutrient-rich beds with stable pH.",
    weather: "Partly cloudy, moderate humidity",
    recommendations: [
      "Keep drip irrigation active in greenhouse zone.",
      "Inspect leaf wetness after evening humidity rise.",
      "Update harvest labor forecast.",
    ],
    activities: ["Greenhouse sensors synced", "Harvest plan updated", "AI forecast refreshed"],
  },
];

export const cropTypes = ["All", "Maize", "Sorghum", "Rice", "Soybean", "Cassava", "Vegetables"];
export const farmStatuses = ["All", "Operational", "Monitoring", "Maintenance"];
export const healthStatuses = ["All", "Excellent", "Good", "Watch", "Critical"];
