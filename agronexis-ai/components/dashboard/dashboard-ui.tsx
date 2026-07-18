"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Accent = "emerald" | "sky" | "yellow" | "violet" | "rose" | "amber" | "slate";

const accentText: Record<Accent, string> = {
  emerald: "text-emerald-300",
  sky: "text-sky-300",
  yellow: "text-yellow-300",
  violet: "text-violet-300",
  rose: "text-rose-300",
  amber: "text-amber-300",
  slate: "text-slate-300",
};

const solidButton: Record<Accent, string> = {
  emerald: "bg-emerald-500 text-slate-950 shadow-[0_0_28px_rgba(34,197,94,0.26)] hover:bg-emerald-400",
  sky: "bg-sky-400 text-slate-950 shadow-[0_0_28px_rgba(56,189,248,0.24)] hover:bg-sky-300",
  yellow: "bg-yellow-400 text-slate-950 shadow-[0_0_28px_rgba(250,204,21,0.22)] hover:bg-yellow-300",
  violet: "bg-violet-400 text-slate-950 shadow-[0_0_28px_rgba(167,139,250,0.22)] hover:bg-violet-300",
  rose: "bg-rose-400 text-slate-950 shadow-[0_0_28px_rgba(251,113,133,0.2)] hover:bg-rose-300",
  amber: "bg-amber-400 text-slate-950 shadow-[0_0_28px_rgba(251,191,36,0.22)] hover:bg-amber-300",
  slate: "bg-slate-200 text-slate-950 shadow-[0_0_28px_rgba(226,232,240,0.14)] hover:bg-white",
};

const iconTone: Record<Accent, string> = {
  emerald: "bg-emerald-400/12 text-emerald-200 ring-emerald-300/20",
  sky: "bg-sky-400/12 text-sky-200 ring-sky-300/20",
  yellow: "bg-yellow-400/12 text-yellow-200 ring-yellow-300/20",
  violet: "bg-violet-400/12 text-violet-200 ring-violet-300/20",
  rose: "bg-rose-400/12 text-rose-200 ring-rose-300/20",
  amber: "bg-amber-400/12 text-amber-200 ring-amber-300/20",
  slate: "bg-slate-400/12 text-slate-200 ring-slate-300/20",
};

type PageHeaderProps = {
  eyebrow: string;
  title: string;
  description: string;
  accent?: Accent;
  actions?: React.ReactNode;
};

export function PageHeader({ eyebrow, title, description, accent = "emerald", actions }: PageHeaderProps) {
  return (
    <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
      <div>
        <p className={cn("text-sm font-semibold uppercase", accentText[accent])}>{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-normal text-white sm:text-4xl">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">{description}</p>
      </div>
      {actions && <div className="flex flex-col gap-3 sm:flex-row">{actions}</div>}
    </div>
  );
}

type ActionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: LucideIcon;
  variant?: "primary" | "secondary";
  accent?: Accent;
};

export function ActionButton({ icon: Icon, variant = "secondary", accent = "emerald", className, children, ...props }: ActionButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-11 items-center justify-center gap-2 rounded-lg px-4 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[#071A2F] disabled:cursor-not-allowed disabled:opacity-40",
        variant === "primary"
          ? solidButton[accent]
          : "border border-white/10 bg-white/8 text-slate-100 hover:bg-white/12",
        variant === "secondary" && accent === "emerald" && "focus:ring-emerald-400",
        variant === "secondary" && accent === "sky" && "focus:ring-sky-400",
        variant === "secondary" && accent === "yellow" && "focus:ring-yellow-400",
        className,
      )}
      {...props}
    >
      {Icon && <Icon className={cn("h-4 w-4", variant === "secondary" && accentText[accent])} />}
      {children}
    </button>
  );
}

type PanelCardProps = {
  title?: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
  bodyClassName?: string;
};

export function PanelCard({ title, subtitle, action, children, className, bodyClassName }: PanelCardProps) {
  return (
    <section className={cn("rounded-lg border border-white/10 bg-slate-950/60 shadow-xl shadow-black/20 backdrop-blur-xl", className)}>
      {(title || subtitle || action) && (
        <div className="flex min-h-16 items-center justify-between gap-4 border-b border-white/10 px-5 py-4">
          <div>
            {title && <h2 className="text-sm font-semibold uppercase text-slate-200">{title}</h2>}
            {subtitle && <p className="mt-1 text-xs text-slate-500">{subtitle}</p>}
          </div>
          {action}
        </div>
      )}
      <div className={cn("p-5", bodyClassName)}>{children}</div>
    </section>
  );
}

export function MetricTile({
  label,
  value,
  helper,
  icon: Icon,
  accent = "emerald",
  index = 0,
}: {
  label: string;
  value: string;
  helper: string;
  icon?: LucideIcon;
  accent?: Accent;
  index?: number;
}) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      transition={{ duration: 0.32, delay: index * 0.035 }}
      className="rounded-lg border border-white/10 bg-slate-950/55 p-5 shadow-xl shadow-black/20 backdrop-blur-xl transition-colors hover:border-emerald-300/25 hover:bg-slate-950/70"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-400">{label}</p>
          <p className="mt-3 text-2xl font-semibold text-white">{value}</p>
          <p className="mt-1 text-sm text-slate-400">{helper}</p>
        </div>
        {Icon && (
          <span className={cn("grid h-10 w-10 shrink-0 place-items-center rounded-lg ring-1", iconTone[accent])}>
            <Icon className="h-5 w-5" />
          </span>
        )}
      </div>
    </motion.section>
  );
}

export function SearchControl({
  icon: Icon,
  placeholder,
  value,
  onChange,
  className,
}: {
  icon: LucideIcon;
  placeholder: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}) {
  return (
    <label className={cn("flex h-11 items-center gap-3 rounded-lg border border-white/10 bg-white/8 px-3 text-slate-400", className)}>
      <Icon className="h-4 w-4" />
      <input
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
        placeholder={placeholder}
      />
    </label>
  );
}

export function SelectControl({
  icon: Icon,
  label,
  value,
  options,
  onChange,
  className,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
  className?: string;
}) {
  return (
    <label className={cn("flex h-11 items-center gap-3 rounded-lg border border-white/10 bg-white/8 px-3 text-slate-400", className)}>
      <Icon className="h-4 w-4" />
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="w-full bg-transparent text-sm font-medium text-white outline-none [&_option]:bg-slate-950"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

export function StatusPill({ children, className }: { children: React.ReactNode; className?: string }) {
  return <span className={cn("inline-flex rounded-md px-2.5 py-1 text-xs font-semibold", className)}>{children}</span>;
}

export function ProgressBar({ value, className }: { value: number | string; className?: string }) {
  const width = typeof value === "number" ? `${value}%` : value;

  return (
    <div className="h-2 overflow-hidden rounded-full bg-white/10">
      <div className={cn("h-full rounded-full bg-emerald-400", className)} style={{ width }} />
    </div>
  );
}
