import type { Metadata } from "next";
import { Suspense } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { SearchResults } from "@/components/dashboard/search-results";

export const metadata: Metadata = {
  title: "Search | AgroNexis AI",
  description: "Search AgroNexis AI farms, livestock, weather, reports, and analytics.",
};

export default function SearchPage() {
  return (
    <DashboardShell activeLabel="Dashboard">
      <Suspense fallback={null}>
        <SearchResults />
      </Suspense>
    </DashboardShell>
  );
}
