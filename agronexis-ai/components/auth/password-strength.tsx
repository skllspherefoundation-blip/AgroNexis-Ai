import { cn } from "@/lib/utils";

type PasswordStrengthProps = {
  value: "Weak" | "Fair" | "Strong" | "Excellent";
};

const strengthStyles = {
  Weak: "w-1/4 bg-red-400 text-red-200",
  Fair: "w-2/4 bg-amber-300 text-amber-200",
  Strong: "w-3/4 bg-sky-300 text-sky-200",
  Excellent: "w-full bg-emerald-400 text-emerald-200",
};

export function PasswordStrength({ value }: PasswordStrengthProps) {
  return (
    <div className="mt-2" aria-live="polite">
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div className={cn("h-full rounded-full transition-all duration-300", strengthStyles[value])} />
      </div>
      <p className={cn("mt-1 text-xs font-medium", strengthStyles[value].split(" ").at(-1))}>
        Password strength: {value}
      </p>
    </div>
  );
}
