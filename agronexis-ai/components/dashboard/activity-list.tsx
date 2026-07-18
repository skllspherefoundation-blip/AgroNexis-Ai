import { Activity } from "lucide-react";
import { activities } from "@/lib/dashboard-data";

export function ActivityList() {
  return (
    <div className="space-y-4">
      {activities.map((activity) => (
        <div key={activity.title} className="flex gap-3">
          <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-sky-400/12 text-sky-200 ring-1 ring-sky-300/20">
            <Activity className="h-4 w-4" />
          </span>
          <div>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <p className="text-sm font-semibold text-white">{activity.title}</p>
              <span className="text-xs text-slate-500">{activity.time}</span>
            </div>
            <p className="mt-1 text-sm leading-6 text-slate-400">{activity.detail}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
