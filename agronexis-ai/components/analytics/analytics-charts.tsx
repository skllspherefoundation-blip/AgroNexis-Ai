"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type ChartPoint = {
  label: string;
  value: number;
};

type ReportTileProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function ReportTile({ title, subtitle, action, children, className }: ReportTileProps) {
  return (
    <section className={cn("rounded-lg border border-white/10 bg-slate-950/62 shadow-xl shadow-black/20 backdrop-blur-xl", className)}>
      <div className="flex min-h-16 items-center justify-between gap-3 border-b border-white/10 px-5 py-4">
        <div>
          <h2 className="text-sm font-semibold uppercase text-slate-100">{title}</h2>
          {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
        </div>
        {action}
      </div>
      <div className="p-5">{children}</div>
    </section>
  );
}

export function KpiCard({
  label,
  value,
  change,
  helper,
  icon: Icon,
  tone = "yellow",
  index,
}: {
  label: string;
  value: string;
  change: string;
  helper: string;
  icon: LucideIcon;
  tone?: "yellow" | "emerald" | "sky" | "rose" | "violet";
  index: number;
}) {
  const tones = {
    yellow: "bg-yellow-400/14 text-yellow-200",
    emerald: "bg-emerald-400/14 text-emerald-200",
    sky: "bg-sky-400/14 text-sky-200",
    rose: "bg-rose-400/14 text-rose-200",
    violet: "bg-violet-400/14 text-violet-200",
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.035 }}
      className="rounded-lg border border-white/10 bg-slate-950/62 p-4 shadow-xl shadow-black/20 backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-3">
        <span className={cn("grid h-10 w-10 place-items-center rounded-lg", tones[tone])}>
          <Icon className="h-5 w-5" />
        </span>
        <span className={cn("rounded-md px-2 py-1 text-xs font-semibold", change.startsWith("-") ? "bg-rose-400/12 text-rose-100" : "bg-emerald-400/12 text-emerald-100")}>
          {change}
        </span>
      </div>
      <p className="mt-4 text-xs font-semibold uppercase text-slate-400">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs text-slate-500">{helper}</p>
    </motion.section>
  );
}

export function AnalyticsBarChart({ data, color = "bg-yellow-400" }: { data: ChartPoint[]; color?: string }) {
  const max = Math.max(...data.map((point) => point.value));

  return (
    <div className="flex h-64 items-end gap-3">
      {data.map((point, index) => (
        <div key={point.label} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-52 w-full items-end rounded-md bg-white/5 p-1">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(point.value / max) * 100}%` }}
              transition={{ duration: 0.55, delay: index * 0.05 }}
              className={cn("w-full rounded", color)}
            />
          </div>
          <span className="text-xs text-slate-500">{point.label}</span>
        </div>
      ))}
    </div>
  );
}

export function AnalyticsLineChart({ data, color = "#FACC15" }: { data: ChartPoint[]; color?: string }) {
  const width = 520;
  const height = 220;
  const max = Math.max(...data.map((point) => point.value));
  const min = Math.min(...data.map((point) => point.value));
  const range = Math.max(1, max - min);
  const points = data.map((point, index) => {
    const x = (index / Math.max(1, data.length - 1)) * width;
    const y = height - ((point.value - min) / range) * (height - 24) - 12;
    return { ...point, x, y };
  });
  const d = points.map((point, index) => `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`).join(" ");

  return (
    <div className="h-64 w-full">
      <svg viewBox={`0 0 ${width} ${height + 34}`} className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id="analytics-line-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.24" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((line) => (
          <line key={line} x1="0" x2={width} y1={(height / 4) * line + 8} y2={(height / 4) * line + 8} stroke="rgba(148,163,184,0.13)" />
        ))}
        <motion.path
          d={`${d} L ${width} ${height} L 0 ${height} Z`}
          fill="url(#analytics-line-fill)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        />
        <motion.path
          d={d}
          fill="none"
          stroke={color}
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
        />
        {points.map((point) => (
          <g key={point.label}>
            <circle cx={point.x} cy={point.y} r="4" fill={color} />
            <text x={point.x} y={height + 24} textAnchor="middle" className="fill-slate-500 text-[11px]">
              {point.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

export function DonutChart({ segments }: { segments: { label: string; value: number; color: string }[] }) {
  const total = segments.reduce((sum, segment) => sum + segment.value, 0);
  const chartSegments = segments.map((segment, index) => {
    const previousTotal = segments.slice(0, index).reduce((sum, item) => sum + item.value, 0);
    const dash = (segment.value / total) * 100;
    const offset = 25 - (previousTotal / total) * 100;

    return { ...segment, dash, offset };
  });

  return (
    <div className="grid gap-5 sm:grid-cols-[190px_1fr] sm:items-center">
      <svg viewBox="0 0 42 42" className="mx-auto h-48 w-48 rotate-[-90deg]">
        <circle cx="21" cy="21" r="15.915" fill="transparent" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
        {chartSegments.map((segment) => (
          <motion.circle
            key={segment.label}
            cx="21"
            cy="21"
            r="15.915"
            fill="transparent"
            stroke={segment.color}
            strokeWidth="5"
            strokeDasharray={`${segment.dash} ${100 - segment.dash}`}
            strokeDashoffset={segment.offset}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          />
        ))}
      </svg>
      <div className="space-y-3">
        {segments.map((segment) => (
          <div key={segment.label} className="flex items-center justify-between gap-3 text-sm">
            <span className="flex items-center gap-2 text-slate-300">
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: segment.color }} />
              {segment.label}
            </span>
            <span className="font-semibold text-white">{segment.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
