import { MapPin, RadioTower } from "lucide-react";
import { mapZones, systemStatus } from "@/lib/dashboard-data";

export function InteractiveMap() {
  return (
    <div className="relative min-h-[360px] overflow-hidden rounded-lg border border-white/10 bg-[#0F172A]">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(34,197,94,0.13)_1px,transparent_1px),linear-gradient(90deg,rgba(14,165,233,0.12)_1px,transparent_1px)] bg-[size:44px_44px]" />
      <div className="absolute inset-6 rounded-lg border border-emerald-300/20 bg-[radial-gradient(circle_at_30%_40%,rgba(34,197,94,0.2),transparent_28%),radial-gradient(circle_at_70%_65%,rgba(14,165,233,0.16),transparent_24%)]" />
      <div className="absolute left-5 top-5 rounded-lg border border-white/10 bg-slate-950/72 p-3 backdrop-blur">
        <div className="flex items-center gap-2 text-sm font-semibold text-white">
          <RadioTower className="h-4 w-4 text-emerald-300" />
          Live geospatial layer
        </div>
        <div className="mt-3 space-y-2">
          {systemStatus.map((item) => (
            <div key={item.label} className="flex justify-between gap-8 text-xs">
              <span className="text-slate-500">{item.label}</span>
              <span className="font-medium text-slate-200">{item.value}</span>
            </div>
          ))}
        </div>
      </div>
      {mapZones.map((zone) => (
        <div
          key={zone.name}
          style={{ left: zone.x, top: zone.y }}
          className="absolute -translate-x-1/2 -translate-y-1/2"
        >
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-emerald-400/30 blur-md" />
            <span className="relative grid h-9 w-9 place-items-center rounded-full border border-emerald-200/40 bg-emerald-400/20 text-emerald-100 backdrop-blur">
              <MapPin className="h-4 w-4" />
            </span>
          </div>
          <div className="mt-2 whitespace-nowrap rounded-md border border-white/10 bg-slate-950/75 px-2 py-1 text-xs backdrop-blur">
            <p className="font-semibold text-white">{zone.name}</p>
            <p className="text-slate-400">{zone.status}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
