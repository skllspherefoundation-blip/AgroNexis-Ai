"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  CalendarDays,
  CloudRain,
  CloudSun,
  Droplets,
  Gauge,
  Leaf,
  MapPin,
  RefreshCcw,
  Search,
  Sunrise,
  Sunset,
  Sun,
  Thermometer,
  Umbrella,
  Wind,
} from "lucide-react";
import { ActionButton, PageHeader, SelectControl } from "@/components/dashboard/dashboard-ui";
import { cn } from "@/lib/utils";

const weatherMetrics = [
  { label: "Temperature", value: "27 C", helper: "Feels like 30 C", icon: Thermometer, tone: "sky" },
  { label: "Humidity", value: "78%", helper: "High moisture load", icon: Droplets, tone: "cyan" },
  { label: "Rainfall", value: "12.4 mm", helper: "Last 24 hours", icon: CloudRain, tone: "blue" },
  { label: "Wind Speed", value: "18 km/h", helper: "SW direction", icon: Wind, tone: "slate" },
  { label: "Pressure", value: "1011 hPa", helper: "Stable trend", icon: Gauge, tone: "violet" },
  { label: "UV Index", value: "7.2", helper: "High exposure", icon: Sun, tone: "amber" },
  { label: "Sunrise", value: "06:28", helper: "Civil dawn 06:06", icon: Sunrise, tone: "orange" },
  { label: "Sunset", value: "18:57", helper: "Last light 19:18", icon: Sunset, tone: "rose" },
  { label: "Air Quality", value: "42 AQI", helper: "Good for field work", icon: Leaf, tone: "emerald" },
];

const forecast = [
  { day: "Today", condition: "Cloudy", high: "29 C", low: "23 C", rain: 32, wind: "18 km/h" },
  { day: "Sun", condition: "Humid", high: "30 C", low: "24 C", rain: 44, wind: "16 km/h" },
  { day: "Mon", condition: "Rain", high: "26 C", low: "22 C", rain: 71, wind: "21 km/h" },
  { day: "Tue", condition: "Clear", high: "28 C", low: "21 C", rain: 12, wind: "12 km/h" },
  { day: "Wed", condition: "Storm Risk", high: "27 C", low: "22 C", rain: 63, wind: "25 km/h" },
  { day: "Thu", condition: "Partly Sunny", high: "31 C", low: "24 C", rain: 24, wind: "14 km/h" },
  { day: "Fri", condition: "Rain", high: "25 C", low: "21 C", rain: 78, wind: "19 km/h" },
];

const alerts = [
  { title: "Heavy rainfall watch", detail: "Northern paddocks may exceed drainage capacity after 18:00.", level: "High" },
  { title: "Heat stress window", detail: "Poultry houses require ventilation checks from 13:00 to 16:00.", level: "Medium" },
  { title: "Low-lying access road", detail: "Soil saturation near Riverbend route C is rising.", level: "Review" },
];

const climateRisks = [
  { label: "Flooding", value: 68, tone: "bg-sky-400" },
  { label: "Heat Stress", value: 74, tone: "bg-amber-400" },
  { label: "Disease Pressure", value: 57, tone: "bg-rose-400" },
  { label: "Drought", value: 18, tone: "bg-emerald-400" },
];

const historicalWeather = [
  { month: "Jan", temp: 26, rainfall: 48 },
  { month: "Feb", temp: 28, rainfall: 54 },
  { month: "Mar", temp: 30, rainfall: 91 },
  { month: "Apr", temp: 29, rainfall: 122 },
  { month: "May", temp: 27, rainfall: 164 },
  { month: "Jun", temp: 26, rainfall: 198 },
  { month: "Jul", temp: 25, rainfall: 226 },
  { month: "Aug", temp: 25, rainfall: 214 },
];

const rainPrediction = [
  { time: "09:00", chance: 18 },
  { time: "12:00", chance: 27 },
  { time: "15:00", chance: 49 },
  { time: "18:00", chance: 76 },
  { time: "21:00", chance: 64 },
  { time: "00:00", chance: 38 },
];

const farms = ["Greenridge Dairy", "Riverbend Farm", "East Poultry Estate", "Savanna Ridge"];

export function WeatherIntelligence() {
  const [selectedFarm, setSelectedFarm] = useState(farms[0]);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Climate Operations"
        title="Weather Intelligence"
        accent="sky"
        description="Monitor current weather, 7-day forecasts, rainfall probability, climate risk, alerts, air quality, and historical patterns across farm operations."
        actions={
          <>
            <SelectControl icon={Search} label="Farm" value={selectedFarm} onChange={setSelectedFarm} options={farms} className="min-w-64" />
            <ActionButton icon={RefreshCcw} variant="primary" accent="sky">Refresh Weather</ActionButton>
          </>
        }
      />

      <section className="grid gap-5 xl:grid-cols-[1.35fr_0.65fr]">
        <CurrentWeather selectedFarm={selectedFarm} />
        <WeatherAlerts />
      </section>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-9">
        {weatherMetrics.map((metric, index) => (
          <WeatherMetric key={metric.label} metric={metric} index={index} />
        ))}
      </div>

      <section className="rounded-lg border border-white/10 bg-slate-950/60 shadow-xl shadow-black/20 backdrop-blur-xl">
        <div className="flex flex-col gap-2 border-b border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase text-slate-200">7-Day Forecast</h2>
            <p className="mt-1 text-xs text-slate-500">Interactive weather cards for field planning</p>
          </div>
          <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-white/10 bg-white/8 px-3 py-2 text-xs font-semibold text-slate-300">
            <CalendarDays className="h-4 w-4 text-sky-300" />
            Next 168 hours
          </span>
        </div>
        <div className="grid gap-3 p-5 sm:grid-cols-2 xl:grid-cols-4 2xl:grid-cols-7">
          {forecast.map((day, index) => (
            <motion.button
              key={day.day}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.04 }}
              className="group rounded-lg border border-white/10 bg-white/6 p-4 text-left transition hover:-translate-y-1 hover:border-sky-300/40 hover:bg-sky-400/10"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-semibold text-white">{day.day}</p>
                  <p className="mt-1 text-xs text-slate-400">{day.condition}</p>
                </div>
                <CloudSun className="h-5 w-5 text-sky-300 transition group-hover:scale-110" />
              </div>
              <div className="mt-5 text-2xl font-semibold text-white">{day.high}</div>
              <p className="mt-1 text-xs text-slate-500">Low {day.low}</p>
              <div className="mt-4">
                <div className="mb-2 flex justify-between text-xs text-slate-400">
                  <span>Rain</span>
                  <span>{day.rain}%</span>
                </div>
                <div className="h-2 rounded-full bg-white/10">
                  <div className="h-2 rounded-full bg-sky-400" style={{ width: `${day.rain}%` }} />
                </div>
              </div>
              <p className="mt-3 text-xs text-slate-500">Wind {day.wind}</p>
            </motion.button>
          ))}
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <ClimateRiskAnalysis />
        <RainPrediction />
        <HistoricalWeather />
      </div>
    </div>
  );
}

function CurrentWeather({ selectedFarm }: { selectedFarm: string }) {
  return (
    <section className="relative overflow-hidden rounded-lg border border-white/10 bg-slate-950/60 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(56,189,248,0.24),transparent_28%),radial-gradient(circle_at_80%_30%,rgba(34,197,94,0.15),transparent_24%)]" />
      <div className="relative grid gap-6 lg:grid-cols-[1fr_280px] lg:items-end">
        <div>
          <div className="flex items-center gap-2 text-sm font-semibold uppercase text-sky-300">
            <MapPin className="h-4 w-4" />
            {selectedFarm}
          </div>
          <h2 className="mt-4 text-5xl font-semibold text-white sm:text-6xl">27 C</h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
            Current Weather: Cloudy with rising humidity and a moderate south-west wind. Rain probability increases toward evening field operations.
          </p>
          <div className="mt-5 grid gap-3 sm:grid-cols-3">
            <MiniStat label="Humidity" value="78%" />
            <MiniStat label="Rainfall" value="12.4 mm" />
            <MiniStat label="Air Quality" value="42 AQI" />
          </div>
        </div>
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="rounded-lg border border-white/10 bg-white/8 p-5"
        >
          <CloudSun className="h-14 w-14 text-sky-300" />
          <p className="mt-5 text-sm font-semibold uppercase text-slate-400">Operations Window</p>
          <p className="mt-2 text-2xl font-semibold text-white">Good until 15:00</p>
          <p className="mt-2 text-sm leading-6 text-slate-400">Schedule drone survey before rainfall intensity rises.</p>
        </motion.div>
      </div>
    </section>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/45 p-3">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-lg font-semibold text-white">{value}</p>
    </div>
  );
}

function WeatherAlerts() {
  return (
    <section className="rounded-lg border border-white/10 bg-slate-950/60 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-sm font-semibold uppercase text-slate-200">Weather Alerts</h2>
          <p className="mt-1 text-xs text-slate-500">Priority farm advisories</p>
        </div>
        <AlertTriangle className="h-5 w-5 text-amber-300" />
      </div>
      <div className="mt-4 space-y-3">
        {alerts.map((alert) => (
          <div key={alert.title} className="rounded-lg border border-white/10 bg-white/6 p-3">
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-semibold text-white">{alert.title}</p>
              <span className={cn("rounded-md px-2 py-1 text-xs font-semibold", alert.level === "High" ? "bg-rose-400/14 text-rose-100" : alert.level === "Medium" ? "bg-amber-400/14 text-amber-100" : "bg-sky-400/14 text-sky-100")}>
                {alert.level}
              </span>
            </div>
            <p className="mt-2 text-xs leading-5 text-slate-400">{alert.detail}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function WeatherMetric({ metric, index }: { metric: { label: string; value: string; helper: string; icon: LucideIcon; tone: string }; index: number }) {
  const toneClass: Record<string, string> = {
    sky: "bg-sky-400/12 text-sky-200",
    cyan: "bg-cyan-400/12 text-cyan-200",
    blue: "bg-blue-400/12 text-blue-200",
    slate: "bg-slate-400/12 text-slate-200",
    violet: "bg-violet-400/12 text-violet-200",
    amber: "bg-amber-400/12 text-amber-200",
    orange: "bg-orange-400/12 text-orange-200",
    rose: "bg-rose-400/12 text-rose-200",
    emerald: "bg-emerald-400/12 text-emerald-200",
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32, delay: index * 0.035 }}
      className="rounded-lg border border-white/10 bg-slate-950/55 p-4 shadow-xl shadow-black/20 backdrop-blur-xl"
    >
      <div className={cn("grid h-10 w-10 place-items-center rounded-lg", toneClass[metric.tone])}>
        <metric.icon className="h-5 w-5" />
      </div>
      <p className="mt-4 text-xs font-semibold uppercase text-slate-400">{metric.label}</p>
      <p className="mt-2 text-xl font-semibold text-white">{metric.value}</p>
      <p className="mt-1 text-xs text-slate-500">{metric.helper}</p>
    </motion.section>
  );
}

function ClimateRiskAnalysis() {
  return (
    <DashboardPanel title="Climate Risk Analysis" icon={Activity}>
      <div className="space-y-4">
        {climateRisks.map((risk) => (
          <div key={risk.label}>
            <div className="mb-2 flex justify-between text-sm">
              <span className="font-medium text-slate-300">{risk.label}</span>
              <span className="font-semibold text-white">{risk.value}%</span>
            </div>
            <div className="h-2 rounded-full bg-white/10">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${risk.value}%` }}
                transition={{ duration: 0.7 }}
                className={cn("h-2 rounded-full", risk.tone)}
              />
            </div>
          </div>
        ))}
      </div>
    </DashboardPanel>
  );
}

function RainPrediction() {
  return (
    <DashboardPanel title="Rain Prediction" icon={Umbrella}>
      <div className="flex h-52 items-end gap-3">
        {rainPrediction.map((item, index) => (
          <div key={item.time} className="flex flex-1 flex-col items-center gap-2">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${item.chance}%` }}
              transition={{ duration: 0.55, delay: index * 0.05 }}
              className="w-full rounded-t-md bg-sky-400/80"
            />
            <span className="text-[11px] text-slate-500">{item.time}</span>
          </div>
        ))}
      </div>
    </DashboardPanel>
  );
}

function HistoricalWeather() {
  return (
    <DashboardPanel title="Historical Weather" icon={BarChart3}>
      <div className="space-y-3">
        {historicalWeather.map((item) => (
          <div key={item.month} className="grid grid-cols-[42px_1fr_48px] items-center gap-3 text-sm">
            <span className="text-slate-400">{item.month}</span>
            <div className="h-2 overflow-hidden rounded-full bg-white/10">
              <div className="h-full rounded-full bg-emerald-400" style={{ width: `${Math.min(100, item.rainfall / 2.4)}%` }} />
            </div>
            <span className="text-right text-xs text-slate-400">{item.rainfall} mm</span>
          </div>
        ))}
        <div className="mt-4 grid grid-cols-2 gap-3">
          <MiniStat label="Avg Temp" value="27.0 C" />
          <MiniStat label="Rain Trend" value="+14%" />
        </div>
      </div>
    </DashboardPanel>
  );
}

function DashboardPanel({ title, icon: Icon, children }: { title: string; icon: LucideIcon; children: React.ReactNode }) {
  return (
    <section className="rounded-lg border border-white/10 bg-slate-950/60 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold uppercase text-slate-200">{title}</h2>
        <Icon className="h-5 w-5 text-sky-300" />
      </div>
      {children}
    </section>
  );
}
