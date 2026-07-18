import { cn } from "@/lib/utils";
import { PanelCard } from "@/components/dashboard/dashboard-ui";

type PanelProps = {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
};

export function Panel({ title, action, children, className }: PanelProps) {
  return (
    <PanelCard title={title} action={action} className={cn("bg-slate-950/55", className)}>
      {children}
    </PanelCard>
  );
}
