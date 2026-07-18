import { CheckCircle2, CircleAlert } from "lucide-react";
import { cn } from "@/lib/utils";

type AuthMessageProps = {
  children: React.ReactNode;
  tone: "success" | "error";
};

export function AuthMessage({ children, tone }: AuthMessageProps) {
  const Icon = tone === "success" ? CheckCircle2 : CircleAlert;

  return (
    <div
      role={tone === "error" ? "alert" : "status"}
      className={cn(
        "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium",
        tone === "success"
          ? "border-emerald-300/25 bg-emerald-400/10 text-emerald-200"
          : "border-red-300/25 bg-red-400/10 text-red-200",
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{children}</span>
    </div>
  );
}
