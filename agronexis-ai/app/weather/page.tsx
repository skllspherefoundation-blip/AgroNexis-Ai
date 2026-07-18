import type { Metadata } from "next";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { WeatherIntelligence } from "@/components/weather/weather-intelligence";

export const metadata: Metadata = {
  title: "Weather Intelligence | AgroNexis AI",
  description: "Weather intelligence dashboard for current weather, forecasts, alerts, climate risk, rainfall prediction, and historical farm weather.",
};

export default function WeatherPage() {
  return (
    <DashboardShell activeLabel="Weather">
      <WeatherIntelligence />
    </DashboardShell>
  );
}
