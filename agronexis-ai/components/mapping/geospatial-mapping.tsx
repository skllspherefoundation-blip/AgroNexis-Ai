"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Activity,
  AlertTriangle,
  CloudSun,
  Compass,
  Crosshair,
  Droplets,
  Layers,
  LocateFixed,
  Map,
  MapPin,
  Navigation,
  Plane,
  RadioTower,
  Ruler,
  Satellite,
  Search,
  Sprout,
  ThermometerSun,
  Waves,
} from "lucide-react";
import { ActionButton, PageHeader, SearchControl } from "@/components/dashboard/dashboard-ui";
import { cn } from "@/lib/utils";

type MapView = "Satellite" | "Street" | "Terrain";
type LayerKey =
  | "Farm Boundaries"
  | "Livestock GPS Tracking"
  | "Geo-Fencing"
  | "Drone Monitoring"
  | "Weather Overlay"
  | "Heat Maps"
  | "NDVI Vegetation"
  | "Water Sources"
  | "Farm Zones";

const views: { label: MapView; icon: typeof Satellite }[] = [
  { label: "Satellite", icon: Satellite },
  { label: "Street", icon: Map },
  { label: "Terrain", icon: Compass },
];

const layers: { label: LayerKey; icon: typeof Layers; tone: string }[] = [
  { label: "Farm Boundaries", icon: MapPin, tone: "emerald" },
  { label: "Livestock GPS Tracking", icon: RadioTower, tone: "sky" },
  { label: "Geo-Fencing", icon: Crosshair, tone: "rose" },
  { label: "Drone Monitoring", icon: Plane, tone: "violet" },
  { label: "Weather Overlay", icon: CloudSun, tone: "cyan" },
  { label: "Heat Maps", icon: ThermometerSun, tone: "amber" },
  { label: "NDVI Vegetation", icon: Sprout, tone: "green" },
  { label: "Water Sources", icon: Droplets, tone: "blue" },
  { label: "Farm Zones", icon: Layers, tone: "slate" },
];

const farms = [
  {
    name: "Greenridge Dairy",
    coordinates: "6.5244, 3.3792",
    area: "842 ha",
    weather: "27 C, cloudy",
    livestockCount: "4,820",
    vegetationHealth: "88%",
    riskLevel: "Moderate",
    x: "40%",
    y: "44%",
  },
  {
    name: "Riverbend Farm",
    coordinates: "8.4966, 4.5421",
    area: "1,156 ha",
    weather: "25 C, rain nearby",
    livestockCount: "2,190",
    vegetationHealth: "93%",
    riskLevel: "Low",
    x: "62%",
    y: "36%",
  },
  {
    name: "East Poultry Estate",
    coordinates: "6.6018, 3.3515",
    area: "318 ha",
    weather: "29 C, humid",
    livestockCount: "9,740",
    vegetationHealth: "71%",
    riskLevel: "High",
    x: "67%",
    y: "66%",
  },
];

const recentEvents = [
  { title: "Drone survey completed", detail: "North pasture imagery stitched", time: "5 min ago", severity: "Normal" },
  { title: "Geo-fence breach", detail: "Collar AGX-C-1192 crossed zone B", time: "14 min ago", severity: "High" },
  { title: "NDVI drop detected", detail: "Irrigation block W-3 fell by 8%", time: "28 min ago", severity: "Review" },
  { title: "Weather cell moving east", detail: "Rain overlay updated at 10 m resolution", time: "43 min ago", severity: "Normal" },
];

const legendItems = [
  { label: "Healthy vegetation", color: "bg-emerald-400" },
  { label: "Heat stress", color: "bg-amber-400" },
  { label: "Water body", color: "bg-sky-400" },
  { label: "Restricted zone", color: "bg-rose-400" },
  { label: "Tracked livestock", color: "bg-violet-400" },
];

export function GeospatialMapping() {
  const [view, setView] = useState<MapView>("Satellite");
  const [selectedFarm, setSelectedFarm] = useState(farms[0]);
  const [enabledLayers, setEnabledLayers] = useState<Record<LayerKey, boolean>>({
    "Farm Boundaries": true,
    "Livestock GPS Tracking": true,
    "Geo-Fencing": true,
    "Drone Monitoring": false,
    "Weather Overlay": true,
    "Heat Maps": true,
    "NDVI Vegetation": true,
    "Water Sources": true,
    "Farm Zones": true,
  });

  const activeLayerCount = useMemo(
    () => Object.values(enabledLayers).filter(Boolean).length,
    [enabledLayers],
  );

  function toggleLayer(layer: LayerKey) {
    setEnabledLayers((current) => ({ ...current, [layer]: !current[layer] }));
  }

  return (
    <div className="space-y-5">
      <PageHeader
        eyebrow="Geospatial Intelligence"
        title="Geospatial Mapping"
        accent="sky"
        description="A GIS-grade workspace for satellite inspection, livestock GPS, farm zoning, weather overlays, NDVI health, water resources, and field measurements."
        actions={
          <>
            <ActionButton icon={Ruler} accent="sky">Measurement Tools</ActionButton>
            <ActionButton icon={LocateFixed} variant="primary" accent="sky">Current Location</ActionButton>
          </>
        }
      />

      <div className="grid gap-5 2xl:grid-cols-[1fr_360px]">
        <section className="overflow-hidden rounded-lg border border-white/10 bg-slate-950/70 shadow-xl shadow-black/20 backdrop-blur-xl">
          <div className="grid gap-3 border-b border-white/10 p-4 xl:grid-cols-[1fr_auto] xl:items-center">
            <div className="grid gap-3 md:grid-cols-2">
              <SearchControl icon={Search} placeholder="Search farm" />
              <SearchControl icon={Navigation} placeholder="Search coordinates" />
            </div>
            <div className="grid grid-cols-3 rounded-lg border border-white/10 bg-white/8 p-1">
              {views.map((item) => (
                <button
                  key={item.label}
                  onClick={() => setView(item.label)}
                  className={cn(
                    "inline-flex h-10 items-center justify-center gap-2 rounded-md px-3 text-sm font-semibold text-slate-300 transition",
                    view === item.label && "bg-white text-slate-950 shadow-lg shadow-black/20",
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{item.label} View</span>
                </button>
              ))}
            </div>
          </div>

          <div className="grid min-h-[720px] lg:grid-cols-[270px_1fr]">
            <aside className="border-b border-white/10 bg-slate-950/50 p-4 lg:border-b-0 lg:border-r">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <h2 className="text-sm font-semibold uppercase text-slate-200">Layer Controls</h2>
                  <p className="mt-1 text-xs text-slate-500">{activeLayerCount} layers active</p>
                </div>
                <Layers className="h-5 w-5 text-sky-300" />
              </div>

              <div className="mt-4 space-y-2">
                {layers.map((layer) => (
                  <button
                    key={layer.label}
                    onClick={() => toggleLayer(layer.label)}
                    className="flex min-h-11 w-full items-center justify-between gap-3 rounded-lg border border-white/10 bg-white/6 px-3 text-left transition hover:bg-white/10"
                  >
                    <span className="flex items-center gap-2 text-sm font-medium text-slate-200">
                      <layer.icon className="h-4 w-4 text-sky-300" />
                      {layer.label}
                    </span>
                    <span className={cn("h-5 w-9 rounded-full p-0.5 transition", enabledLayers[layer.label] ? "bg-sky-400" : "bg-white/15")}>
                      <span className={cn("block h-4 w-4 rounded-full bg-white transition", enabledLayers[layer.label] && "translate-x-4")} />
                    </span>
                  </button>
                ))}
              </div>

              <div className="mt-5 rounded-lg border border-white/10 bg-white/6 p-3">
                <h3 className="text-xs font-semibold uppercase text-slate-400">Map Legend</h3>
                <div className="mt-3 space-y-2">
                  {legendItems.map((item) => (
                    <div key={item.label} className="flex items-center gap-2 text-xs text-slate-300">
                      <span className={cn("h-2.5 w-2.5 rounded-full", item.color)} />
                      {item.label}
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            <MapCanvas
              view={view}
              selectedFarm={selectedFarm.name}
              enabledLayers={enabledLayers}
              onSelectFarm={(farmName) => {
                const farm = farms.find((item) => item.name === farmName);
                if (farm) setSelectedFarm(farm);
              }}
            />
          </div>
        </section>

        <aside className="space-y-5">
          <InfoPanel selectedFarm={selectedFarm} />
          <RecentEvents />
        </aside>
      </div>
    </div>
  );
}

function MapCanvas({
  view,
  selectedFarm,
  enabledLayers,
  onSelectFarm,
}: {
  view: MapView;
  selectedFarm: string;
  enabledLayers: Record<LayerKey, boolean>;
  onSelectFarm: (farm: string) => void;
}) {
  const baseStyle =
    view === "Satellite"
      ? "bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.35),transparent_20%),radial-gradient(circle_at_70%_70%,rgba(14,165,233,0.28),transparent_18%),linear-gradient(135deg,#16321f,#0b1f2d_48%,#24351d)]"
      : view === "Terrain"
        ? "bg-[radial-gradient(circle_at_35%_28%,rgba(132,204,22,0.34),transparent_22%),radial-gradient(circle_at_65%_65%,rgba(180,83,9,0.2),transparent_24%),linear-gradient(135deg,#1d3328,#25331b_46%,#102b34)]"
        : "bg-[linear-gradient(90deg,rgba(148,163,184,0.1)_1px,transparent_1px),linear-gradient(0deg,rgba(148,163,184,0.1)_1px,transparent_1px),linear-gradient(135deg,#172033,#0f2430)] bg-[size:48px_48px,48px_48px,auto]";

  return (
    <div className={cn("relative min-h-[620px] overflow-hidden", baseStyle)}>
      <div className="absolute inset-0 opacity-35 [background-image:linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:72px_72px]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,transparent,rgba(2,6,23,0.42))]" />

      {enabledLayers["NDVI Vegetation"] && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.72 }}
          className="absolute left-[18%] top-[22%] h-[44%] w-[42%] rounded-[42%] bg-emerald-400/30 blur-sm"
        />
      )}
      {enabledLayers["Heat Maps"] && (
        <motion.div
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.75 }}
          transition={{ duration: 0.7 }}
          className="absolute right-[18%] top-[45%] h-48 w-48 rounded-full bg-amber-400/30 blur-xl"
        />
      )}
      {enabledLayers["Weather Overlay"] && (
        <motion.div
          animate={{ x: [0, 28, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute left-[8%] top-[12%] h-28 w-[70%] rounded-full bg-sky-300/16 blur-2xl"
        />
      )}
      {enabledLayers["Water Sources"] && (
        <div className="absolute bottom-[18%] left-[22%] h-20 w-[52%] -rotate-6 rounded-full border border-sky-300/50 bg-sky-400/20" />
      )}
      {enabledLayers["Farm Zones"] && (
        <>
          <Zone className="left-[22%] top-[25%] h-[24%] w-[28%]" label="Zone A" />
          <Zone className="right-[18%] top-[30%] h-[22%] w-[24%]" label="Zone B" />
          <Zone className="bottom-[18%] left-[44%] h-[20%] w-[25%]" label="Zone C" />
        </>
      )}
      {enabledLayers["Farm Boundaries"] && (
        <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <motion.path
            d="M16 21 L48 13 L78 24 L86 58 L65 84 L27 76 L10 49 Z"
            fill="rgba(16,185,129,0.06)"
            stroke="rgba(52,211,153,0.9)"
            strokeWidth="0.45"
            strokeDasharray="2 1.2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
          />
          {enabledLayers["Geo-Fencing"] && (
            <motion.path
              d="M28 31 L58 25 L74 44 L68 66 L40 69 L24 53 Z"
              fill="rgba(244,63,94,0.07)"
              stroke="rgba(251,113,133,0.9)"
              strokeWidth="0.38"
              strokeDasharray="1 1"
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2.8, repeat: Infinity }}
            />
          )}
        </svg>
      )}

      {farms.map((farm) => (
        <button
          key={farm.name}
          onClick={() => onSelectFarm(farm.name)}
          className="absolute z-10 -translate-x-1/2 -translate-y-1/2"
          style={{ left: farm.x, top: farm.y }}
        >
          <motion.span
            animate={{ y: selectedFarm === farm.name ? [0, -5, 0] : 0 }}
            transition={{ duration: 1.8, repeat: selectedFarm === farm.name ? Infinity : 0 }}
            className={cn(
              "flex items-center gap-2 rounded-lg border px-3 py-2 text-xs font-semibold shadow-xl backdrop-blur-xl",
              selectedFarm === farm.name
                ? "border-sky-200/70 bg-sky-300 text-slate-950"
                : "border-white/20 bg-slate-950/72 text-white hover:bg-slate-900",
            )}
          >
            <MapPin className="h-4 w-4" />
            {farm.name}
          </motion.span>
        </button>
      ))}

      {enabledLayers["Livestock GPS Tracking"] && (
        <div className="absolute inset-0">
          {[
            ["31%", "58%"],
            ["48%", "52%"],
            ["58%", "62%"],
            ["71%", "49%"],
            ["39%", "34%"],
          ].map(([left, top], index) => (
            <motion.span
              key={`${left}-${top}`}
              className="absolute h-2.5 w-2.5 rounded-full bg-violet-300 ring-4 ring-violet-400/20"
              style={{ left, top }}
              animate={{ scale: [1, 1.45, 1] }}
              transition={{ duration: 1.8, delay: index * 0.2, repeat: Infinity }}
            />
          ))}
        </div>
      )}

      {enabledLayers["Drone Monitoring"] && (
        <motion.div
          className="absolute left-[14%] top-[18%] z-10 flex items-center gap-2 rounded-lg border border-white/20 bg-slate-950/72 px-3 py-2 text-xs font-semibold text-white backdrop-blur-xl"
          animate={{ x: [0, 240, 420], y: [0, 80, 160] }}
          transition={{ duration: 9, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        >
          <Plane className="h-4 w-4 text-violet-300" />
          Drone-07
        </motion.div>
      )}

      <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div className="rounded-lg border border-white/10 bg-slate-950/72 p-3 backdrop-blur-xl">
          <p className="text-xs font-semibold uppercase text-slate-400">Viewport</p>
          <p className="mt-1 text-sm font-semibold text-white">{view} View / 10 m precision / EPSG:4326</p>
        </div>
        <div className="grid grid-cols-3 overflow-hidden rounded-lg border border-white/10 bg-slate-950/72 backdrop-blur-xl">
          <ToolButton icon={Ruler} label="Measure" />
          <ToolButton icon={Crosshair} label="Fence" />
          <ToolButton icon={LocateFixed} label="Locate" />
        </div>
      </div>
    </div>
  );
}

function Zone({ className, label }: { className: string; label: string }) {
  return (
    <div className={cn("absolute rounded-lg border border-emerald-300/45 bg-emerald-400/8", className)}>
      <span className="absolute left-2 top-2 rounded-md bg-slate-950/72 px-2 py-1 text-[11px] font-semibold text-emerald-100">{label}</span>
    </div>
  );
}

function ToolButton({ icon: Icon, label }: { icon: typeof Ruler; label: string }) {
  return (
    <button className="flex h-12 min-w-20 items-center justify-center gap-2 px-3 text-xs font-semibold text-slate-200 transition hover:bg-white/10">
      <Icon className="h-4 w-4 text-sky-300" />
      {label}
    </button>
  );
}

function InfoPanel({ selectedFarm }: { selectedFarm: (typeof farms)[number] }) {
  const riskClass =
    selectedFarm.riskLevel === "High"
      ? "bg-rose-400/14 text-rose-100"
      : selectedFarm.riskLevel === "Moderate"
        ? "bg-amber-400/14 text-amber-100"
        : "bg-emerald-400/14 text-emerald-100";

  return (
    <motion.section
      key={selectedFarm.name}
      initial={{ opacity: 0, x: 16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="rounded-lg border border-white/10 bg-slate-950/65 p-5 shadow-xl shadow-black/20 backdrop-blur-xl"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase text-slate-400">Selected Farm</p>
          <h2 className="mt-1 text-xl font-semibold text-white">{selectedFarm.name}</h2>
        </div>
        <span className={cn("rounded-md px-2.5 py-1 text-xs font-semibold", riskClass)}>{selectedFarm.riskLevel} Risk</span>
      </div>

      <div className="mt-5 grid gap-3">
        <PanelMetric icon={MapPin} label="Coordinates" value={selectedFarm.coordinates} />
        <PanelMetric icon={Ruler} label="Area" value={selectedFarm.area} />
        <PanelMetric icon={CloudSun} label="Weather" value={selectedFarm.weather} />
        <PanelMetric icon={Activity} label="Livestock Count" value={selectedFarm.livestockCount} />
        <PanelMetric icon={Sprout} label="Vegetation Health" value={selectedFarm.vegetationHealth} />
      </div>

      <div className="mt-5 rounded-lg border border-white/10 bg-white/6 p-4">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-semibold uppercase text-slate-400">Vegetation Health</span>
          <span className="font-semibold text-white">{selectedFarm.vegetationHealth}</span>
        </div>
        <div className="h-2 rounded-full bg-white/10">
          <div className="h-2 rounded-full bg-emerald-400" style={{ width: selectedFarm.vegetationHealth }} />
        </div>
      </div>
    </motion.section>
  );
}

function PanelMetric({ icon: Icon, label, value }: { icon: typeof MapPin; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/6 p-3">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-sky-400/12 text-sky-200">
        <Icon className="h-4 w-4" />
      </span>
      <div>
        <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
        <p className="mt-1 text-sm font-semibold text-slate-100">{value}</p>
      </div>
    </div>
  );
}

function RecentEvents() {
  return (
    <section className="rounded-lg border border-white/10 bg-slate-950/65 p-5 shadow-xl shadow-black/20 backdrop-blur-xl">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-semibold uppercase text-slate-200">Recent Events</h2>
          <p className="mt-1 text-xs text-slate-500">Live spatial operations feed</p>
        </div>
        <Waves className="h-5 w-5 text-sky-300" />
      </div>

      <div className="mt-4 space-y-3">
        {recentEvents.map((event, index) => (
          <motion.div
            key={event.title}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.05 }}
            className="rounded-lg border border-white/10 bg-white/6 p-3"
          >
            <div className="flex items-start gap-3">
              <span className={cn("mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg", event.severity === "High" ? "bg-rose-400/12 text-rose-200" : "bg-sky-400/12 text-sky-200")}>
                {event.severity === "High" ? <AlertTriangle className="h-4 w-4" /> : <Activity className="h-4 w-4" />}
              </span>
              <div>
                <p className="text-sm font-semibold text-white">{event.title}</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">{event.detail}</p>
                <p className="mt-2 text-xs text-slate-500">{event.time}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
