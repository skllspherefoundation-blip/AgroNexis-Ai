import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { FarmsDashboard } from "@/components/farms/farms-dashboard";

export const metadata: Metadata = {
  title: "Farms | AgroNexis AI",
  description:
    "Professional farm management dashboard for farm records, crop health, soil moisture, weather, satellite monitoring, and AI recommendations.",
};

export default function FarmsPage() {
  return (
    <DashboardShell activeLabel="Farms">
      <FarmsDashboard />
    </DashboardShell>
  );
}
