import type { InputHTMLAttributes, SelectHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type AuthInputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  icon: LucideIcon;
  error?: string;
  isValid?: boolean;
  shake?: boolean;
  action?: React.ReactNode;
};

export function AuthInput({
  label,
  icon: Icon,
  className,
  id,
  error,
  isValid,
  shake,
  action,
  ...props
}: AuthInputProps) {
  const inputId = id ?? label.toLowerCase().replaceAll(" ", "-");
  const helperId = `${inputId}-helper`;

  return (
    <div className={cn("block", shake && "animate-auth-shake")}>
      <label htmlFor={inputId} className="text-sm font-medium text-slate-200">
        {label}
      </label>
      <span
        className={cn(
          "mt-2 flex h-12 items-center gap-3 rounded-lg border bg-white/8 px-3 text-slate-300 transition focus-within:border-emerald-300/60 focus-within:bg-white/10",
          error ? "border-red-400/70" : "border-white/10",
          isValid && !error && "border-emerald-300/55",
        )}
      >
        <Icon className="h-4 w-4 text-slate-400" />
        <input
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? helperId : undefined}
          className={cn(
            "h-full w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500",
            className,
          )}
          {...props}
        />
        {action}
      </span>
      {error && (
        <p id={helperId} className="mt-1.5 text-xs font-medium text-red-200" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

type AuthSelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  icon: LucideIcon;
  options: string[];
};

export function AuthSelect({
  label,
  icon: Icon,
  options,
  className,
  id,
  ...props
}: AuthSelectProps) {
  const selectId = id ?? label.toLowerCase().replaceAll(" ", "-");

  return (
    <label htmlFor={selectId} className="block">
      <span className="text-sm font-medium text-slate-200">{label}</span>
      <span className="mt-2 flex h-12 items-center gap-3 rounded-lg border border-white/10 bg-white/8 px-3 text-slate-300 transition focus-within:border-emerald-300/60 focus-within:bg-white/10">
        <Icon className="h-4 w-4 text-slate-400" />
        <select
          id={selectId}
          className={cn("h-full w-full bg-transparent text-sm text-white outline-none", className)}
          {...props}
        >
          {options.map((option) => (
            <option key={option} value={option} className="bg-slate-950 text-white">
              {option}
            </option>
          ))}
        </select>
      </span>
    </label>
  );
}
