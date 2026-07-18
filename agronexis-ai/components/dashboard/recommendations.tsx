import { BrainCircuit } from "lucide-react";
import { recommendations } from "@/lib/dashboard-data";

export function Recommendations() {
  return (
    <div className="space-y-3">
      {recommendations.map((item) => (
        <div key={item.title} className="rounded-lg border border-white/10 bg-white/7 p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex gap-3">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-emerald-400/12 text-emerald-200">
                <BrainCircuit className="h-4 w-4" />
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">{item.detail}</p>
              </div>
            </div>
            <span className="rounded-full bg-violet-400/12 px-2.5 py-1 text-xs font-semibold text-violet-200">
              {item.impact}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
