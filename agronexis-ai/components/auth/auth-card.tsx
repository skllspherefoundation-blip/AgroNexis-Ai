import { cn } from "@/lib/utils";

type AuthCardProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: React.ReactNode;
  className?: string;
};

export function AuthCard({
  eyebrow,
  title,
  description,
  children,
  className,
}: AuthCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-white/12 bg-slate-950/58 p-6 shadow-2xl shadow-black/35 backdrop-blur-2xl sm:p-8",
        className,
      )}
    >
      <p className="text-xs font-semibold uppercase text-emerald-300">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-semibold text-white">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-400">{description}</p>
      {children}
    </div>
  );
}
