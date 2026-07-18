export type AlertType = "Critical" | "Warning" | "Information";
export type AlertStatus = "Unread" | "Read" | "Resolved";
export type AlertPriority = "High" | "Medium" | "Low";

export type FarmAlert = {
  id: string;
  type: AlertType;
  farm: string;
  priority: AlertPriority;
  message: string;
  time: string;
  detectedAt: string;
  status: AlertStatus;
  description: string;
  recommendation: string;
  suggestedActions: string[];
};

export const alertFilterOptions = ["All", "Critical", "Warning", "Information", "Resolved", "Unread"];

export const farmAlerts: FarmAlert[] = [
  {
    id: "alert-001",
    type: "Critical",
    farm: "Savanna Ridge",
    priority: "High",
    message: "Soil moisture has fallen below safe crop threshold.",
    time: "6 min ago",
    detectedAt: "Today, 09:42",
    status: "Unread",
    description:
      "Central cassava blocks are reporting sustained low moisture with pump pressure variance. Crop stress risk is elevated if the irrigation cycle does not recover within the next hour.",
    recommendation:
      "Reactivate irrigation on central plots and dispatch maintenance to inspect pump station A before the next automated cycle.",
    suggestedActions: ["Start emergency irrigation cycle", "Assign pump technician", "Review moisture trend after 45 minutes"],
  },
  {
    id: "alert-002",
    type: "Warning",
    farm: "North Ranch",
    priority: "Medium",
    message: "Wind speed exceeds safe spraying window.",
    time: "18 min ago",
    detectedAt: "Today, 09:30",
    status: "Unread",
    description:
      "Weather telemetry indicates gusting winds across the western sorghum plots. Spray drift risk is above the recommended operating range.",
    recommendation:
      "Delay crop protection activity until wind speed drops below the farm threshold and recheck the forecast before crew dispatch.",
    suggestedActions: ["Pause spraying schedule", "Notify field supervisor", "Recalculate treatment window"],
  },
  {
    id: "alert-003",
    type: "Information",
    farm: "Farm Alpha",
    priority: "Low",
    message: "Satellite pass completed with updated NDVI layer.",
    time: "34 min ago",
    detectedAt: "Today, 09:14",
    status: "Read",
    description:
      "The latest satellite pass has been processed successfully. No major canopy anomalies were found outside previously monitored sections.",
    recommendation:
      "Keep the current scouting route and compare the next pass against the northern block baseline.",
    suggestedActions: ["Review NDVI overlay", "Archive imagery report", "Keep scouting schedule unchanged"],
  },
  {
    id: "alert-004",
    type: "Critical",
    farm: "Riverbend Estate",
    priority: "High",
    message: "Flood risk model crossed intervention threshold.",
    time: "1 hr ago",
    detectedAt: "Today, 08:48",
    status: "Unread",
    description:
      "Rainfall probability and canal-edge saturation indicate rising flood exposure around blocks C and D.",
    recommendation:
      "Reduce irrigation immediately and inspect drainage gates near the canal edge.",
    suggestedActions: ["Stop irrigation on blocks C and D", "Inspect canal drainage", "Move equipment from low zones"],
  },
  {
    id: "alert-005",
    type: "Warning",
    farm: "East Valley Farm",
    priority: "Medium",
    message: "Greenhouse humidity is trending above disease threshold.",
    time: "2 hrs ago",
    detectedAt: "Today, 07:36",
    status: "Resolved",
    description:
      "Microclimate sensors reported elevated humidity in the vegetable greenhouse, increasing fungal disease pressure.",
    recommendation:
      "Keep ventilation active and schedule a leaf wetness inspection before the evening humidity rise.",
    suggestedActions: ["Verify ventilation settings", "Inspect greenhouse leaves", "Keep resolved watch for 24 hours"],
  },
  {
    id: "alert-006",
    type: "Information",
    farm: "Greenridge Fields",
    priority: "Low",
    message: "Prescription map export completed.",
    time: "3 hrs ago",
    detectedAt: "Today, 06:55",
    status: "Read",
    description:
      "Variable-rate prescription data is ready for soybean blocks with stable canopy density readings.",
    recommendation:
      "Proceed with planned crop protection window while soil and weather conditions remain favorable.",
    suggestedActions: ["Send map to field device", "Confirm applicator sync", "Log export in report archive"],
  },
];
