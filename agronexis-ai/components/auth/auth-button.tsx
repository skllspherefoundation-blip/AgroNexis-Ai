import type { ButtonHTMLAttributes } from "react";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type AuthSubmitButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: React.ReactNode;
};

export function AuthSubmitButton({
  children,
  className,
  ...props
}: AuthSubmitButtonProps) {
  return (
    <button
      className={cn(
        "flex h-12 w-full items-center justify-center rounded-lg bg-emerald-500 text-sm font-semibold text-slate-950 shadow-[0_0_36px_rgba(34,197,94,0.28)] transition hover:bg-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-300 focus:ring-offset-2 focus:ring-offset-slate-950",
        "disabled:cursor-not-allowed disabled:bg-slate-500 disabled:text-slate-300 disabled:shadow-none disabled:hover:bg-slate-500",
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

type SocialButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: LucideIcon;
  children: React.ReactNode;
};

export function SocialButton({ icon: Icon, children, className, ...props }: SocialButtonProps) {
  return (
    <button
      className={cn(
        "flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/8 text-sm font-semibold text-slate-100 transition hover:border-sky-300/45 hover:bg-white/12 focus:outline-none focus:ring-2 focus:ring-sky-300 focus:ring-offset-2 focus:ring-offset-slate-950",
        className,
      )}
      {...props}
    >
      <Icon className="h-4 w-4" />
      {children}
    </button>
  );
}
