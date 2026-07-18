import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  CloudSun,
  CircleHelp,
  Crosshair,
  Download,
  FileText,
  HeartPulse,
  Languages,
  LayoutDashboard,
  RadioTower,
  ScanLine,
  Search,
  Settings,
  ShieldCheck,
  Tractor,
  UsersRound,
  Wheat,
} from "lucide-react";

export const dashboardNav = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Farms", icon: Tractor, href: "/farms" },
  { label: "Livestock", icon: HeartPulse, href: "/livestock" },
  { label: "Alerts", icon: Bell, href: "/alerts" },
  { label: "Analytics", icon: BarChart3, href: "/analytics" },
  { label: "Reports", icon: FileText, href: "/analytics" },
  { label: "Settings", icon: Settings, href: "/settings" },
  { label: "Support", icon: CircleHelp, href: "/dashboard" },
];

export const metricCards = [
  {
    title: "Total Livestock",
    value: "18,420",
    change: "+6.2%",
    helper: "across 12 active farms",
    icon: UsersRound,
    tone: "emerald",
  },
  {
    title: "Healthy Animals",
    value: "17,384",
    change: "94.3%",
    helper: "normal biomarker range",
    icon: ShieldCheck,
    tone: "sky",
  },
  {
    title: "Diseased Animals",
    value: "312",
    change: "-2.8%",
    helper: "under active treatment",
    icon: AlertTriangle,
    tone: "violet",
  },
  {
    title: "Today's Weather",
    value: "27°C",
    change: "Rain 32%",
    helper: "moderate wind conditions",
    icon: CloudSun,
    tone: "sky",
  },
  {
    title: "Active Farms",
    value: "12",
    change: "+2 sites",
    helper: "4 regions connected",
    icon: Tractor,
    tone: "emerald",
  },
  {
    title: "Satellite Status",
    value: "Online",
    change: "98.7%",
    helper: "last pass 12 min ago",
    icon: RadioTower,
    tone: "violet",
  },
];

export const healthTrend = [38, 46, 42, 58, 63, 61, 72, 78, 74, 83, 88, 91];
export const weatherTrend = [22, 24, 26, 29, 28, 27, 25, 24, 26, 30, 31, 29];
export const feedConsumption = [62, 68, 64, 71, 76, 73, 81];
export const diseasePrediction = [12, 16, 11, 18, 24, 21, 17];

export const activities = [
  {
    title: "North dairy cluster synced new collar data",
    time: "4 min ago",
    detail: "842 animal records updated with heart rate and movement signals.",
  },
  {
    title: "Satellite imagery processed for Riverbend Farm",
    time: "18 min ago",
    detail: "NDVI variance detected in soybean blocks B4 and B6.",
  },
  {
    title: "Feed inventory threshold reached",
    time: "35 min ago",
    detail: "Layer feed stock is projected to last 4.2 days at current usage.",
  },
  {
    title: "Weather station firmware check completed",
    time: "1 hr ago",
    detail: "All 19 weather nodes are reporting clean telemetry.",
  },
];

export const recommendations = [
  {
    title: "Isolate pen group L-14 for inspection",
    impact: "High",
    detail: "Cough frequency and lower activity suggest early respiratory risk.",
  },
  {
    title: "Delay pesticide spraying by 9 hours",
    impact: "Medium",
    detail: "Wind gusts exceed drift limits until after sunset.",
  },
  {
    title: "Increase irrigation on western pivot",
    impact: "Medium",
    detail: "Soil moisture has fallen below the crop-stage target range.",
  },
];

export const alerts = [
  { label: "Disease risk rising in Goat Unit 3", severity: "Critical" },
  { label: "Satellite pass delayed by cloud cover", severity: "Warning" },
  { label: "Pump station B pressure below baseline", severity: "Review" },
];

export const forecast = [
  { day: "Today", temp: "27°C", condition: "Cloudy", rain: "32%" },
  { day: "Sun", temp: "29°C", condition: "Humid", rain: "44%" },
  { day: "Mon", temp: "26°C", condition: "Rain", rain: "71%" },
  { day: "Tue", temp: "28°C", condition: "Clear", rain: "12%" },
];

export const quickActions = [
  { label: "Export Reports", icon: Download },
  { label: "Scan Livestock", icon: ScanLine },
  { label: "Create Field Task", icon: Crosshair },
  { label: "Language Center", icon: Languages },
  { label: "Search Records", icon: Search },
  { label: "Feed Planning", icon: Wheat },
];

export const mapZones = [
  { name: "Dairy North", status: "Healthy", x: "18%", y: "30%" },
  { name: "Soy Block B", status: "Moisture low", x: "56%", y: "42%" },
  { name: "Poultry East", status: "Alert", x: "72%", y: "68%" },
  { name: "Weather Node 7", status: "Online", x: "34%", y: "74%" },
];

export const topSearches = ["livestock health", "farm weather", "satellite map", "feed report"];

export const searchSuggestions = [
  { label: "Farm Alpha", href: "/farms" },
  { label: "North Ranch", href: "/mapping" },
  { label: "Livestock Reports", href: "/livestock" },
  { label: "Weather Forecast", href: "/weather" },
  { label: "Disease Alerts", href: "/alerts" },
  { label: "Recent Analytics", href: "/analytics" },
  { label: "Profile Settings", href: "/profile" },
];

export const notifications = [
  "Weather alert",
  "New farm report",
  "Low soil moisture",
  "System update",
  "Unread messages",
];

export const systemStatus = [
  { label: "AI models", value: "Active" },
  { label: "Weather mesh", value: "19 nodes" },
  { label: "Map layers", value: "8 synced" },
];

export const chartLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const areaChartLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export const activityIcon = Activity;
