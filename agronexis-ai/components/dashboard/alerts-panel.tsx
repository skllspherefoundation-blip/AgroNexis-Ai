import { AlertTriangle } from "lucide-react";
import { alerts } from "@/lib/dashboard-data";

const severityStyles: Record<string, string> = {
  Critical: "bg-red-400/12 text-red-200",
  Warning: "bg-amber-400/12 text-amber-200",
  Review: "bg-sky-400/12 text-sky-200",
};

export function AlertsPanel() {
  return (
    <div className="space-y-3">
      {alerts.map((alert) => (
        <div key={alert.label} className="flex items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/7 p-3">
          <div className="flex items-center gap-3">
            <AlertTriangle className="h-4 w-4 text-amber-300" />
            <p className="text-sm font-medium text-slate-200">{alert.label}</p>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${severityStyles[alert.severity]}`}>
            {alert.severity}
          </span>
        </div>
      ))}
    </div>
  );
}
