import type { Metadata } from "next";
import { AlertsMonitoringCenter } from "@/components/alerts/alerts-monitoring-center";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = {
  title: "Alerts | AgroNexis AI",
  description:
    "Real-time farm alerts monitoring center for critical risks, warnings, unread notifications, AI recommendations, and response workflows.",
};

export default function AlertsPage() {
  return (
    <DashboardShell activeLabel="Alerts">
      <AlertsMonitoringCenter />
    </DashboardShell>
  );
}
