import type { Metadata } from "next";
import { Download, RefreshCcw } from "lucide-react";
import { ActivityList } from "@/components/dashboard/activity-list";
import { AlertsPanel } from "@/components/dashboard/alerts-panel";
import { BarChart } from "@/components/dashboard/bar-chart";
import { DashboardCard } from "@/components/dashboard/dashboard-card";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { InteractiveMap } from "@/components/dashboard/interactive-map";
import { LineChart } from "@/components/dashboard/line-chart";
import { Panel } from "@/components/dashboard/panel";
import { QuickActions } from "@/components/dashboard/quick-actions";
import { Recommendations } from "@/components/dashboard/recommendations";
import { WeatherWidget } from "@/components/dashboard/weather-widget";
import {
  areaChartLabels,
  chartLabels,
  diseasePrediction,
  feedConsumption,
  healthTrend,
  metricCards,
  weatherTrend,
} from "@/lib/dashboard-data";

export const metadata: Metadata = {
  title: "Dashboard | AgroNexis AI",
  description: "Enterprise precision agriculture dashboard for livestock, farms, weather, mapping, and AI recommendations.",
};

export default function DashboardPage() {
  return (
    <DashboardShell>
      <div className="mb-6 flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase text-emerald-300">Enterprise Command Center</p>
          <h1 className="mt-2 text-3xl font-semibold text-white sm:text-4xl">
            AgroNexis AI Dashboard
          </h1>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-400">
            Monitor livestock health, active farms, weather intelligence, satellite mapping, and AI risk signals from one operational workspace.
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/8 px-4 text-sm font-semibold text-slate-100 transition hover:bg-white/12">
            <RefreshCcw className="h-4 w-4" />
            Refresh Data
          </button>
          <button className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-emerald-500 px-4 text-sm font-semibold text-slate-950 shadow-[0_0_28px_rgba(34,197,94,0.26)] transition hover:bg-emerald-400">
            <Download className="h-4 w-4" />
            Export Reports
          </button>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {metricCards.map((card) => (
          <DashboardCard key={card.title} {...card} />
        ))}
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel title="Livestock Health Trend" className="xl:col-span-2" action={<span className="text-xs text-slate-500">Last 12 months</span>}>
          <LineChart data={healthTrend} labels={areaChartLabels} color="#22C55E" />
        </Panel>
        <Panel title="Weather Trend" action={<span className="text-xs text-slate-500">Temperature</span>}>
          <LineChart data={weatherTrend} labels={areaChartLabels} color="#0EA5E9" />
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <Panel title="Feed Consumption">
          <BarChart data={feedConsumption} labels={chartLabels} color="bg-emerald-400" />
        </Panel>
        <Panel title="Disease Prediction">
          <BarChart data={diseasePrediction} labels={chartLabels} color="bg-violet-400" />
        </Panel>
        <Panel title="Weather Forecast Widget">
          <WeatherWidget />
        </Panel>
      </div>

      <div className="mt-6 grid gap-6 2xl:grid-cols-[1.25fr_0.75fr]">
        <Panel title="Interactive Map">
          <InteractiveMap />
        </Panel>
        <div className="grid gap-6">
          <Panel title="Alerts Panel">
            <AlertsPanel />
          </Panel>
          <Panel title="Quick Actions">
            <QuickActions />
          </Panel>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <Panel title="Recent Activities">
          <ActivityList />
        </Panel>
        <Panel title="Latest AI Recommendations">
          <Recommendations />
        </Panel>
      </div>
    </DashboardShell>
  );
}
