import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SettingsWorkspace } from "@/components/settings/settings-workspace";

export const metadata: Metadata = {
  title: "Settings | AgroNexis AI",
  description:
    "Professional AgroNexis AI settings workspace for profile, account, application, notifications, security, and data controls.",
};

export default function SettingsPage() {
  return (
    <DashboardShell activeLabel="Settings">
      <SettingsWorkspace />
    </DashboardShell>
  );
}
