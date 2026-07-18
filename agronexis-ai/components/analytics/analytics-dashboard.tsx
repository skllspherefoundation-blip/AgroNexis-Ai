"use client";

import { useState } from "react";
import {
  Activity,
  BarChart3,
  CalendarDays,
  CloudSun,
  Download,
  FileDown,
  Filter,
  HeartPulse,
  Lightbulb,
  Satellite,
  Search,
  ShieldAlert,
  TrendingUp,
  WalletCards,
  Wheat,
} from "lucide-react";
import { AnalyticsBarChart, AnalyticsLineChart, DonutChart, KpiCard, ReportTile } from "@/components/analytics/analytics-charts";
import { ActionButton, PageHeader, SearchControl, SelectControl, StatusPill } from "@/components/dashboard/dashboard-ui";
import { cn } from "@/lib/utils";

const kpis = [
  { label: "Livestock Performance", value: "94.6%", change: "+4.8%", helper: "weighted herd productivity", icon: HeartPulse, tone: "emerald" as const },
  { label: "Milk Production", value: "42.8k L", change: "+8.1%", helper: "monthly output", icon: Activity, tone: "sky" as const },
  { label: "Feed Consumption", value: "186 t", change: "-3.4%", helper: "optimized ration variance", icon: Wheat, tone: "yellow" as const },
  { label: "Revenue Analytics", value: "$284k", change: "+12.6%", helper: "net revenue this quarter", icon: WalletCards, tone: "violet" as const },
  { label: "Disease Prediction", value: "37", change: "-9.2%", helper: "high confidence risk cases", icon: ShieldAlert, tone: "rose" as const },
];

const milkProduction = [
  { label: "Jan", value: 32 },
  { label: "Feb", value: 35 },
  { label: "Mar", value: 37 },
  { label: "Apr", value: 36 },
  { label: "May", value: 40 },
  { label: "Jun", value: 43 },
  { label: "Jul", value: 45 },
];

const feedConsumption = [
  { label: "Cattle", value: 82 },
  { label: "Goat", value: 34 },
  { label: "Sheep", value: 29 },
  { label: "Poultry", value: 41 },
];

const productivity = [
  { label: "Dairy", value: 92 },
  { label: "Poultry", value: 88 },
  { label: "Pasture", value: 79 },
  { label: "Irrigation", value: 84 },
  { label: "Labor", value: 76 },
];

const revenue = [
  { label: "Milk", value: 42, color: "#FACC15" },
  { label: "Livestock", value: 28, color: "#38BDF8" },
  { label: "Eggs", value: 18, color: "#34D399" },
  { label: "Crops", value: 12, color: "#A78BFA" },
];

const expenses = [
  { label: "Feed", value: "$76,200", variance: "-4.1%", owner: "Procurement" },
  { label: "Veterinary", value: "$18,450", variance: "+2.8%", owner: "Animal health" },
  { label: "Labor", value: "$42,800", variance: "+1.1%", owner: "Operations" },
  { label: "Energy", value: "$13,640", variance: "-6.7%", owner: "Facilities" },
];

const predictionRows = [
  { farm: "Greenridge Dairy", disease: "Mastitis", probability: "72%", impact: "High", action: "Inspect 18 animals" },
  { farm: "Savanna Ridge", disease: "Respiratory", probability: "58%", impact: "Medium", action: "Ventilation audit" },
  { farm: "East Poultry Estate", disease: "Heat stress", probability: "66%", impact: "High", action: "Increase cooling" },
  { farm: "Riverbend Farm", disease: "Parasite load", probability: "41%", impact: "Review", action: "Sample pasture B" },
];

const recommendations = [
  "Shift 12% of feed allocation from pen B to high-yield dairy group.",
  "Schedule vaccination outreach before weather risk increases next week.",
  "Prioritize NDVI inspection for Riverbend west blocks with declining canopy density.",
  "Reduce energy expense by moving water pumping to lower tariff hours.",
];

export function AnalyticsDashboard() {
  const [farm, setFarm] = useState("All Farms");
  const [range, setRange] = useState("Last 90 Days");
  const [segment, setSegment] = useState("All Segments");

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Enterprise BI"
        title="Analytics"
        accent="yellow"
        description="Power BI-style operational analytics for livestock performance, production, spend, disease risk, satellite signals, weather impact, and AI decisions."
        actions={
          <>
            <ActionButton icon={FileDown} accent="yellow">Export PDF</ActionButton>
            <ActionButton icon={Download} variant="primary" accent="yellow">Export CSV</ActionButton>
          </>
        }
      />

      <section className="rounded-lg border border-white/10 bg-slate-950/62 p-4 shadow-xl shadow-black/20 backdrop-blur-xl">
        <div className="grid gap-3 lg:grid-cols-[1fr_repeat(3,220px)]">
          <SearchControl icon={Search} placeholder="Search metric, farm, animal group..." />
          <SelectControl icon={Filter} label="Farm" value={farm} onChange={setFarm} options={["All Farms", "Greenridge Dairy", "Riverbend Farm", "Savanna Ridge"]} />
          <SelectControl icon={CalendarDays} label="Date range" value={range} onChange={setRange} options={["Last 30 Days", "Last 90 Days", "This Quarter", "Year to Date"]} />
          <SelectControl icon={BarChart3} label="Segment" value={segment} onChange={setSegment} options={["All Segments", "Dairy", "Poultry", "Pasture", "Revenue"]} />
        </div>
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {kpis.map((kpi, index) => (
          <KpiCard key={kpi.label} {...kpi} index={index} />
        ))}
      </div>

      <div className="grid gap-6 2xl:grid-cols-[1.35fr_0.65fr]">
        <ReportTile title="Milk Production" subtitle="Liters produced by month" action={<StatusPill className="bg-yellow-400/12 text-yellow-100">Actual vs target</StatusPill>}>
          <AnalyticsLineChart data={milkProduction} />
        </ReportTile>
        <ReportTile title="Revenue Analytics" subtitle="Revenue contribution by stream">
          <DonutChart segments={revenue} />
        </ReportTile>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <ReportTile title="Feed Consumption" subtitle="Consumption by livestock category">
          <AnalyticsBarChart data={feedConsumption} color="bg-emerald-400" />
        </ReportTile>
        <ReportTile title="Farm Productivity" subtitle="Composite operating score">
          <AnalyticsBarChart data={productivity} color="bg-sky-400" />
        </ReportTile>
        <ReportTile title="Weather Impact" subtitle="Operational exposure model">
          <WeatherImpact />
        </ReportTile>
      </div>

      <div className="grid gap-6 2xl:grid-cols-[1fr_380px]">
        <ReportTile title="Disease Prediction" subtitle="AI model output by farm and condition" action={<StatusPill className="bg-yellow-400/12 text-yellow-100">Risk table</StatusPill>}>
          <PredictionTable />
        </ReportTile>
        <ReportTile title="AI Recommendations" subtitle="Ranked decision support">
          <div className="space-y-3">
            {recommendations.map((recommendation, index) => (
              <div key={recommendation} className="flex gap-3 rounded-lg border border-white/10 bg-white/6 p-3">
                <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-yellow-400/14 text-yellow-200">
                  <Lightbulb className="h-4 w-4" />
                </span>
                <div>
                  <p className="text-sm leading-6 text-slate-200">{recommendation}</p>
                  <p className="mt-1 text-xs text-slate-500">Priority {index + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </ReportTile>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <ReportTile title="Expenses" subtitle="Spend variance by category">
          <ExpensesTable />
        </ReportTile>
        <ReportTile title="Satellite Insights" subtitle="NDVI, water stress, and canopy signals">
          <SatelliteInsights />
        </ReportTile>
      </div>
    </div>
  );
}

function PredictionTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[760px] text-left text-sm">
        <thead className="border-b border-white/10 text-xs uppercase text-slate-500">
          <tr>
            {["Farm", "Prediction", "Probability", "Impact", "Action"].map((heading) => (
              <th key={heading} className="pb-3 font-semibold">{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {predictionRows.map((row) => (
            <tr key={`${row.farm}-${row.disease}`} className="transition hover:bg-white/5">
              <td className="py-3 font-medium text-white">{row.farm}</td>
              <td className="py-3 text-slate-300">{row.disease}</td>
              <td className="py-3 text-slate-300">{row.probability}</td>
              <td className="py-3">
                <span className={cn("rounded-md px-2 py-1 text-xs font-semibold", row.impact === "High" ? "bg-rose-400/14 text-rose-100" : row.impact === "Medium" ? "bg-yellow-400/14 text-yellow-100" : "bg-sky-400/14 text-sky-100")}>
                  {row.impact}
                </span>
              </td>
              <td className="py-3 text-slate-300">{row.action}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function ExpensesTable() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] text-left text-sm">
        <thead className="border-b border-white/10 text-xs uppercase text-slate-500">
          <tr>
            {["Category", "Expense", "Variance", "Owner"].map((heading) => (
              <th key={heading} className="pb-3 font-semibold">{heading}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-white/10">
          {expenses.map((row) => (
            <tr key={row.label}>
              <td className="py-3 font-medium text-white">{row.label}</td>
              <td className="py-3 text-slate-300">{row.value}</td>
              <td className={cn("py-3 font-semibold", row.variance.startsWith("-") ? "text-emerald-300" : "text-yellow-300")}>{row.variance}</td>
              <td className="py-3 text-slate-400">{row.owner}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function WeatherImpact() {
  const impacts = [
    { label: "Rain delay", value: 64, color: "bg-sky-400" },
    { label: "Heat stress", value: 71, color: "bg-yellow-400" },
    { label: "Wind risk", value: 38, color: "bg-violet-400" },
  ];

  return (
    <div className="space-y-4">
      {impacts.map((impact) => (
        <div key={impact.label}>
          <div className="mb-2 flex justify-between text-sm">
            <span className="text-slate-300">{impact.label}</span>
            <span className="font-semibold text-white">{impact.value}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10">
            <div className={cn("h-2 rounded-full", impact.color)} style={{ width: `${impact.value}%` }} />
          </div>
        </div>
      ))}
      <div className="rounded-lg border border-white/10 bg-white/6 p-3 text-sm leading-6 text-slate-300">
        Weather Impact model suggests adjusting grazing rotation and drone surveys before late-afternoon rainfall.
      </div>
    </div>
  );
}

function SatelliteInsights() {
  const insights = [
    { label: "NDVI vegetation", value: "0.78", helper: "+6.4% vs last month", icon: Satellite },
    { label: "Water stress", value: "Low", helper: "2 zones need review", icon: CloudSun },
    { label: "Canopy variance", value: "12%", helper: "Riverbend west block", icon: TrendingUp },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {insights.map((insight) => (
        <div key={insight.label} className="rounded-lg border border-white/10 bg-white/6 p-4">
          <insight.icon className="h-5 w-5 text-yellow-300" />
          <p className="mt-4 text-xs font-semibold uppercase text-slate-500">{insight.label}</p>
          <p className="mt-2 text-xl font-semibold text-white">{insight.value}</p>
          <p className="mt-1 text-xs text-slate-400">{insight.helper}</p>
        </div>
      ))}
    </div>
  );
}
