import type { Metadata } from "next";
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export const metadata: Metadata = {
  title: "Analytics | AgroNexis AI",
  description: "Enterprise analytics dashboard for livestock, production, revenue, expenses, weather impact, satellite insights, and AI recommendations.",
};

export default function AnalyticsPage() {
  return (
    <DashboardShell activeLabel="Analytics">
      <AnalyticsDashboard />
    </DashboardShell>
  );
}
