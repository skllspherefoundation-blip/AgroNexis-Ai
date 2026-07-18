import { cn } from "@/lib/utils";

type CardProps = {
  children: React.ReactNode;
  className?: string;
};

export function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border border-white/10 bg-slate-950/55 shadow-2xl shadow-slate-950/30 backdrop-blur-xl",
        className,
      )}
    >
      {children}
    </div>
  );
}
