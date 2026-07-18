import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { LivestockManagement } from "@/components/livestock/livestock-management";

export const metadata: Metadata = {
  title: "Livestock Management | AgroNexis AI",
  description: "Enterprise livestock management workspace for animal records, health monitoring, vaccination, GPS, breeding, feeding, and AI scoring.",
};

export default function LivestockPage() {
  return (
    <DashboardShell activeLabel="Livestock">
      <LivestockManagement />
    </DashboardShell>
  );
}
