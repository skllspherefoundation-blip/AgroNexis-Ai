import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { ProfileWorkspace } from "@/components/profile/profile-workspace";

export const metadata: Metadata = {
  title: "Profile | AgroNexis AI",
  description:
    "Enterprise user profile workspace for AgroNexis AI account identity, contact details, avatar, timezone, bio, and recent activity.",
};

export default function ProfilePage() {
  return (
    <DashboardShell activeLabel="Profile">
      <ProfileWorkspace />
    </DashboardShell>
  );
}
