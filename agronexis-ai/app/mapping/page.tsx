import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { GeospatialMapping } from "@/components/mapping/geospatial-mapping";

export const metadata: Metadata = {
  title: "Geospatial Mapping | AgroNexis AI",
  description: "Enterprise GIS workspace for farm boundaries, satellite intelligence, livestock GPS, weather overlays, NDVI, water sources, and geofencing.",
};

export default function MappingPage() {
  return (
    <DashboardShell activeLabel="Mapping">
      <GeospatialMapping />
    </DashboardShell>
  );
}
