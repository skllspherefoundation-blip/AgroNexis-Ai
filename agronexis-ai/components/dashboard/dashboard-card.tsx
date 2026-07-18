import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

type DashboardCardProps = {
  title: string;
  value: string;
  change: string;
  helper: string;
  icon: LucideIcon;
  tone: string;
};

const toneStyles: Record<string, string> = {
  emerald: "bg-emerald-400/12 text-emerald-200 ring-emerald-300/20",
  sky: "bg-sky-400/12 text-sky-200 ring-sky-300/20",
  violet: "bg-violet-400/12 text-violet-200 ring-violet-300/20",
};

export function DashboardCard({
  title,
  value,
  change,
  helper,
  icon: Icon,
  tone,
}: DashboardCardProps) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/55 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-400">{title}</p>
          <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
        </div>
        <span className={cn("grid h-11 w-11 place-items-center rounded-lg ring-1", toneStyles[tone])}>
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="inline-flex items-center gap-1 rounded-full bg-white/8 px-2.5 py-1 text-xs font-semibold text-emerald-200">
          <ArrowUpRight className="h-3.5 w-3.5" />
          {change}
        </span>
        <p className="text-right text-xs text-slate-500">{helper}</p>
      </div>
    </div>
  );
}
