"use client";

import { FormEvent, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDownUp,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Edit3,
  Eye,
  Filter,
  Leaf,
  MapPin,
  Plus,
  Search,
  Sprout,
  ThermometerSun,
  Trash2,
  Tractor,
  Waves,
  X,
} from "lucide-react";
import { ActionButton, MetricTile, PageHeader, ProgressBar, SearchControl, SelectControl, StatusPill } from "@/components/dashboard/dashboard-ui";
import { cropTypes, farms as seedFarms, farmStatuses, healthStatuses, type Farm, type FarmHealth, type FarmStatus } from "@/lib/farms-data";
import { cn } from "@/lib/utils";

type SortKey = keyof Pick<Farm, "name" | "location" | "cropType" | "moisture" | "temperature" | "lastUpdated" | "status">;
type SortDirection = "asc" | "desc";
type FarmForm = Pick<Farm, "name" | "location" | "size" | "cropType" | "gps" | "owner" | "description">;

const pageSize = 5;
const emptyForm: FarmForm = {
  name: "",
  location: "",
  size: "",
  cropType: "",
  gps: "",
  owner: "",
  description: "",
};

const healthClass: Record<FarmHealth, string> = {
  Excellent: "bg-emerald-400/12 text-emerald-100",
  Good: "bg-sky-400/12 text-sky-100",
  Watch: "bg-amber-400/12 text-amber-100",
  Critical: "bg-rose-400/12 text-rose-100",
};

const statusClass: Record<FarmStatus, string> = {
  Operational: "border-emerald-300/20 bg-emerald-400/12 text-emerald-100",
  Monitoring: "border-sky-300/20 bg-sky-400/12 text-sky-100",
  Maintenance: "border-amber-300/20 bg-amber-400/12 text-amber-100",
};

function parseTemperature(value: string) {
  return Number(value.replace(/[^\d.-]/g, ""));
}

function sortValue(farm: Farm, sortKey: SortKey) {
  if (sortKey === "temperature") return parseTemperature(farm.temperature);
  return farm[sortKey];
}

export function FarmsDashboard() {
  const [farms, setFarms] = useState(seedFarms);
  const [query, setQuery] = useState("");
  const [crop, setCrop] = useState("All");
  const [status, setStatus] = useState("All");
  const [health, setHealth] = useState("All");
  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [selectedFarmId, setSelectedFarmId] = useState<string | null>(null);
  const [modalMode, setModalMode] = useState<"add" | "edit" | null>(null);
  const [editingFarmId, setEditingFarmId] = useState<string | null>(null);
  const [form, setForm] = useState<FarmForm>(emptyForm);
  const [errors, setErrors] = useState<Partial<Record<keyof FarmForm, string>>>({});
  const selectedFarm = useMemo(() => farms.find((farm) => farm.id === selectedFarmId) ?? null, [farms, selectedFarmId]);

  const overview = useMemo(() => {
    const activeFarms = farms.filter((farm) => farm.status === "Operational").length;
    const monitored = farms.filter((farm) => farm.status === "Monitoring").length;
    const irrigationActive = farms.filter((farm) => farm.moisture < 70 && farm.status !== "Maintenance").length;
    const averageMoisture = Math.round(farms.reduce((total, farm) => total + farm.moisture, 0) / farms.length);
    const healthScore = Math.round(
      farms.reduce((total, farm) => {
        const score = farm.healthStatus === "Excellent" ? 96 : farm.healthStatus === "Good" ? 84 : farm.healthStatus === "Watch" ? 68 : 42;
        return total + score;
      }, 0) / farms.length,
    );

    return [
      { label: "Total Farms", value: String(farms.length), helper: "+2 this quarter", icon: Tractor },
      { label: "Active Farms", value: String(activeFarms), helper: "+8.4% uptime", icon: Sprout },
      { label: "Under Monitoring", value: String(monitored), helper: "AI watchlist", icon: Eye },
      { label: "Irrigation Active", value: String(irrigationActive), helper: "adaptive cycles", icon: Waves },
      { label: "Avg Soil Moisture", value: `${averageMoisture}%`, helper: "+4.1% weekly", icon: Droplets },
      { label: "Crop Health Score", value: `${healthScore}%`, helper: "+3.7% trend", icon: Leaf },
    ];
  }, [farms]);

  const filteredFarms = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    const results = farms.filter((farm) => {
      const searchable = [
        farm.name,
        farm.location,
        farm.size,
        farm.cropType,
        farm.healthStatus,
        farm.status,
        farm.owner,
      ]
        .join(" ")
        .toLowerCase();

      return (
        (!normalized || searchable.includes(normalized)) &&
        (crop === "All" || farm.cropType === crop) &&
        (status === "All" || farm.status === status) &&
        (health === "All" || farm.healthStatus === health)
      );
    });

    return [...results].sort((a, b) => {
      const first = sortValue(a, sortKey);
      const second = sortValue(b, sortKey);
      const modifier = sortDirection === "asc" ? 1 : -1;

      if (typeof first === "number" && typeof second === "number") {
        return (first - second) * modifier;
      }

      return String(first).localeCompare(String(second)) * modifier;
    });
  }, [crop, farms, health, query, sortDirection, sortKey, status]);

  const totalPages = Math.max(1, Math.ceil(filteredFarms.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedFarms = filteredFarms.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  const resetPage = (update: () => void) => {
    update();
    setPage(1);
  };

  const openAddModal = () => {
    setModalMode("add");
    setEditingFarmId(null);
    setForm(emptyForm);
    setErrors({});
  };

  const openEditModal = (farm: Farm) => {
    setModalMode("edit");
    setEditingFarmId(farm.id);
    setForm({
      name: farm.name,
      location: farm.location,
      size: farm.size,
      cropType: farm.cropType,
      gps: farm.gps,
      owner: farm.owner,
      description: farm.description,
    });
    setErrors({});
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingFarmId(null);
    setErrors({});
  };

  const updateSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDirection((direction) => (direction === "asc" ? "desc" : "asc"));
      return;
    }

    setSortKey(key);
    setSortDirection("asc");
  };

  const deleteFarm = (farmId: string) => {
    const farm = farms.find((item) => item.id === farmId);
    if (farm && !window.confirm(`Delete ${farm.name}? This removes it from the current farm registry.`)) return;

    setFarms((current) => current.filter((farm) => farm.id !== farmId));
    if (selectedFarmId === farmId) setSelectedFarmId(null);
    setPage((value) => Math.max(1, Math.min(value, Math.ceil(Math.max(0, filteredFarms.length - 1) / pageSize) || 1)));
  };

  const validateForm = () => {
    const nextErrors: Partial<Record<keyof FarmForm, string>> = {};
    (Object.keys(form) as (keyof FarmForm)[]).forEach((field) => {
      if (!form[field].trim()) nextErrors[field] = "This field is required.";
    });
    return nextErrors;
  };

  const submitFarm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validateForm();
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    if (modalMode === "edit" && editingFarmId) {
      setFarms((current) =>
        current.map((farm) =>
          farm.id === editingFarmId
            ? {
                ...farm,
                ...form,
                lastUpdated: "Just now",
              }
            : farm,
        ),
      );
    } else {
      const newFarm: Farm = {
        id: `farm-${Date.now()}`,
        ...form,
        healthStatus: "Good",
        moisture: 62,
        temperature: "27°C",
        lastUpdated: "Just now",
        status: "Monitoring",
        soilCondition: "Baseline soil profile pending first sensor sync.",
        weather: "Weather profile pending station assignment.",
        recommendations: ["Complete first satellite pass.", "Assign irrigation profile.", "Schedule agronomy inspection."],
        activities: ["Farm record created", "Awaiting telemetry sync", "Owner profile attached"],
      };
      setFarms((current) => [newFarm, ...current]);
      setPage(1);
    }

    closeModal();
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Farm Operations"
        title="Farms"
        accent="emerald"
        description="Manage connected farms, crop status, moisture telemetry, irrigation activity, weather conditions, and AI recommendations from one operational view."
        actions={
          <ActionButton icon={Plus} variant="primary" accent="emerald" onClick={openAddModal}>
            Add Farm
          </ActionButton>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {overview.map((stat, index) => (
          <MetricTile key={stat.label} {...stat} index={index} accent="emerald" />
        ))}
      </div>

      <section className="rounded-lg border border-white/10 bg-slate-950/55 shadow-xl shadow-black/20 backdrop-blur-xl">
        <div className="border-b border-white/10 p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-sm font-semibold uppercase text-slate-200">Farm Registry</h2>
              <p className="mt-1 text-sm text-slate-500">{filteredFarms.length} matching farms across monitored regions</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusPill className="bg-emerald-400/12 text-emerald-100">Live telemetry</StatusPill>
              <StatusPill className="bg-sky-400/12 text-sky-100">Satellite synced</StatusPill>
              <StatusPill className="bg-violet-400/12 text-violet-100">AI scored</StatusPill>
            </div>
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
            <SearchControl icon={Search} value={query} onChange={(value) => resetPage(() => setQuery(value))} placeholder="Search farm, owner, location, crop..." />
            <SelectControl icon={Filter} label="Crop Type" value={crop} options={cropTypes} onChange={(value) => resetPage(() => setCrop(value))} />
            <SelectControl icon={Filter} label="Health Status" value={health} options={healthStatuses} onChange={(value) => resetPage(() => setHealth(value))} />
            <SelectControl icon={Filter} label="Status" value={status} options={farmStatuses} onChange={(value) => resetPage(() => setStatus(value))} />
          </div>
        </div>

        <div className="grid gap-4 p-5 xl:hidden">
          <AnimatePresence mode="popLayout">
            {paginatedFarms.map((farm) => (
              <FarmCard
                key={farm.id}
                farm={farm}
                onView={() => setSelectedFarmId(farm.id)}
                onEdit={() => openEditModal(farm)}
                onDelete={() => deleteFarm(farm.id)}
              />
            ))}
          </AnimatePresence>
        </div>

        <div className="hidden overflow-x-auto xl:block">
          <table className="w-full min-w-[1220px] text-left text-sm">
            <thead className="border-b border-white/10 bg-white/5 text-xs uppercase text-slate-400">
              <tr>
                <SortableHeading label="Farm Name" sortKey="name" activeKey={sortKey} direction={sortDirection} onSort={updateSort} />
                <SortableHeading label="Location" sortKey="location" activeKey={sortKey} direction={sortDirection} onSort={updateSort} />
                <th className="px-5 py-4 font-semibold">Farm Size</th>
                <SortableHeading label="Crop Type" sortKey="cropType" activeKey={sortKey} direction={sortDirection} onSort={updateSort} />
                <th className="px-5 py-4 font-semibold">Health Status</th>
                <SortableHeading label="Moisture Level" sortKey="moisture" activeKey={sortKey} direction={sortDirection} onSort={updateSort} />
                <SortableHeading label="Temperature" sortKey="temperature" activeKey={sortKey} direction={sortDirection} onSort={updateSort} />
                <SortableHeading label="Last Updated" sortKey="lastUpdated" activeKey={sortKey} direction={sortDirection} onSort={updateSort} />
                <SortableHeading label="Status" sortKey="status" activeKey={sortKey} direction={sortDirection} onSort={updateSort} />
                <th className="px-5 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedFarms.map((farm, index) => (
                <motion.tr
                  key={farm.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.03 }}
                  className="border-b border-white/10 transition hover:bg-white/5"
                >
                  <td className="px-5 py-4 font-semibold text-white">{farm.name}</td>
                  <td className="px-5 py-4 text-slate-300">{farm.location}</td>
                  <td className="px-5 py-4 text-slate-300">{farm.size}</td>
                  <td className="px-5 py-4 text-slate-300">{farm.cropType}</td>
                  <td className="px-5 py-4"><HealthBadge status={farm.healthStatus} /></td>
                  <td className="px-5 py-4">
                    <div className="min-w-28">
                      <div className="mb-1 flex items-center justify-between text-xs text-slate-400">
                        <span>{farm.moisture}%</span>
                      </div>
                      <ProgressBar value={farm.moisture} className={farm.moisture < 45 ? "bg-rose-400" : farm.moisture < 60 ? "bg-amber-400" : "bg-emerald-400"} />
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-300">{farm.temperature}</td>
                  <td className="px-5 py-4 text-slate-300">{farm.lastUpdated}</td>
                  <td className="px-5 py-4"><StatusBadge status={farm.status} /></td>
                  <td className="px-5 py-4">
                    <RowActions
                      onView={() => setSelectedFarmId(farm.id)}
                      onEdit={() => openEditModal(farm)}
                      onDelete={() => deleteFarm(farm.id)}
                    />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginatedFarms.length === 0 && (
          <div className="border-t border-white/10 p-8 text-center text-sm text-slate-400">
            No farms match the current search and filters.
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              disabled={currentPage === 1}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/8 px-3 text-sm font-medium text-slate-200 transition hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <button
              onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
              disabled={currentPage === totalPages}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/8 px-3 text-sm font-medium text-slate-200 transition hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {selectedFarm && <FarmDrawer farm={selectedFarm} onClose={() => setSelectedFarmId(null)} />}
        {modalMode && (
          <FarmModal
            mode={modalMode}
            form={form}
            errors={errors}
            onChange={(field, value) => {
              setForm((current) => ({ ...current, [field]: value }));
              setErrors((current) => ({ ...current, [field]: undefined }));
            }}
            onSubmit={submitFarm}
            onClose={closeModal}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function SortableHeading({
  label,
  sortKey,
  activeKey,
  direction,
  onSort,
}: {
  label: string;
  sortKey: SortKey;
  activeKey: SortKey;
  direction: SortDirection;
  onSort: (key: SortKey) => void;
}) {
  return (
    <th className="px-5 py-4 font-semibold">
      <button
        type="button"
        onClick={() => onSort(sortKey)}
        className="inline-flex items-center gap-1 rounded-md transition hover:text-white focus:outline-none focus:ring-2 focus:ring-emerald-300"
      >
        {label}
        <ArrowDownUp className={cn("h-3.5 w-3.5", activeKey === sortKey && "text-emerald-300")} />
        {activeKey === sortKey && <span className="sr-only">sorted {direction}</span>}
      </button>
    </th>
  );
}

function HealthBadge({ status }: { status: FarmHealth }) {
  return <StatusPill className={healthClass[status]}>{status}</StatusPill>;
}

function StatusBadge({ status }: { status: FarmStatus }) {
  return <span className={cn("inline-flex rounded-md border px-2.5 py-1 text-xs font-semibold", statusClass[status])}>{status}</span>;
}

function RowActions({ onView, onEdit, onDelete }: { onView: () => void; onEdit: () => void; onDelete: () => void }) {
  return (
    <div className="flex items-center gap-2">
      <IconButton label="View farm" icon={Eye} onClick={onView} />
      <IconButton label="Edit farm" icon={Edit3} onClick={onEdit} />
      <IconButton label="Delete farm" icon={Trash2} onClick={onDelete} danger />
    </div>
  );
}

function IconButton({
  label,
  icon: Icon,
  onClick,
  danger,
}: {
  label: string;
  icon: typeof Eye;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/8 text-slate-200 transition hover:bg-white/12 focus:outline-none focus:ring-2 focus:ring-emerald-300",
        danger && "hover:border-rose-300/30 hover:bg-rose-400/10 hover:text-rose-100 focus:ring-rose-300",
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function FarmCard({ farm, onView, onEdit, onDelete }: { farm: Farm; onView: () => void; onEdit: () => void; onDelete: () => void }) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25 }}
      className="rounded-lg border border-white/10 bg-white/6 p-4"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-semibold text-white">{farm.name}</h3>
          <p className="mt-1 flex items-center gap-1 text-sm text-slate-400">
            <MapPin className="h-3.5 w-3.5" />
            {farm.location}
          </p>
        </div>
        <HealthBadge status={farm.healthStatus} />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Info label="Farm Size" value={farm.size} />
        <Info label="Crop Type" value={farm.cropType} />
        <Info label="Moisture" value={`${farm.moisture}%`} />
        <Info label="Temperature" value={farm.temperature} />
        <Info label="Last Updated" value={farm.lastUpdated} />
        <Info label="Status" value={farm.status} />
      </div>
      <div className="mt-4 flex justify-end">
        <RowActions onView={onView} onEdit={onEdit} onDelete={onDelete} />
      </div>
    </motion.article>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/35 p-3">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-200">{value}</p>
    </div>
  );
}

function FarmDrawer({ farm, onClose }: { farm: Farm; onClose: () => void }) {
  return (
    <motion.div
      className="fixed inset-0 z-[70] bg-slate-950/70 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.aside
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ duration: 0.28, ease: "easeOut" }}
        onClick={(event) => event.stopPropagation()}
        className="ml-auto flex h-full w-full max-w-2xl flex-col overflow-y-auto border-l border-white/10 bg-[#071A2F] shadow-2xl shadow-black/40"
      >
        <div className="sticky top-0 z-10 flex items-start justify-between gap-4 border-b border-white/10 bg-[#071A2F]/95 p-5 backdrop-blur-xl">
          <div>
            <p className="text-sm font-semibold uppercase text-emerald-300">Farm Details</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">{farm.name}</h2>
            <p className="mt-1 text-sm text-slate-400">{farm.location}</p>
          </div>
          <button
            type="button"
            aria-label="Close farm details"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/8 text-slate-200 transition hover:bg-white/12"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <section className="rounded-lg border border-white/10 bg-white/6 p-4">
            <h3 className="text-sm font-semibold uppercase text-slate-200">Farm Information</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <Info label="Owner" value={farm.owner} />
              <Info label="GPS Coordinates" value={farm.gps} />
              <Info label="Farm Size" value={farm.size} />
              <Info label="Crop Type" value={farm.cropType} />
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-400">{farm.description}</p>
          </section>

          <section className="overflow-hidden rounded-lg border border-white/10 bg-slate-950/45">
            <div className="flex aspect-[16/9] items-center justify-center bg-[linear-gradient(135deg,rgba(34,197,94,0.18),transparent_42%),linear-gradient(45deg,rgba(14,165,233,0.16),transparent_38%)]">
              <div className="rounded-lg border border-white/10 bg-slate-950/55 px-4 py-3 text-center backdrop-blur">
                <p className="text-sm font-semibold text-white">Satellite Image Placeholder</p>
                <p className="mt-1 text-xs text-slate-400">NDVI and boundary layers ready for imagery sync</p>
              </div>
            </div>
          </section>

          <div className="grid gap-4 sm:grid-cols-2">
            <DetailBlock icon={Droplets} title="Soil Condition" text={farm.soilCondition} />
            <DetailBlock icon={ThermometerSun} title="Weather" text={farm.weather} />
          </div>

          <section className="rounded-lg border border-white/10 bg-white/6 p-4">
            <h3 className="text-sm font-semibold uppercase text-slate-200">AI Recommendations</h3>
            <div className="mt-3 space-y-2">
              {farm.recommendations.map((recommendation) => (
                <p key={recommendation} className="rounded-lg border border-emerald-300/15 bg-emerald-400/10 p-3 text-sm text-emerald-100">
                  {recommendation}
                </p>
              ))}
            </div>
          </section>

          <section className="rounded-lg border border-white/10 bg-white/6 p-4">
            <h3 className="text-sm font-semibold uppercase text-slate-200">Recent Activities</h3>
            <div className="mt-3 space-y-2">
              {farm.activities.map((activity) => (
                <div key={activity} className="flex items-center gap-3 rounded-lg bg-slate-950/35 p-3 text-sm text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  {activity}
                </div>
              ))}
            </div>
          </section>
        </div>
      </motion.aside>
    </motion.div>
  );
}

function DetailBlock({ icon: Icon, title, text }: { icon: typeof Droplets; title: string; text: string }) {
  return (
    <section className="rounded-lg border border-white/10 bg-white/6 p-4">
      <span className="grid h-10 w-10 place-items-center rounded-lg bg-sky-400/12 text-sky-200">
        <Icon className="h-5 w-5" />
      </span>
      <h3 className="mt-4 text-sm font-semibold uppercase text-slate-200">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-400">{text}</p>
    </section>
  );
}

function FarmModal({
  mode,
  form,
  errors,
  onChange,
  onSubmit,
  onClose,
}: {
  mode: "add" | "edit";
  form: FarmForm;
  errors: Partial<Record<keyof FarmForm, string>>;
  onChange: (field: keyof FarmForm, value: string) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onClose: () => void;
}) {
  return (
    <motion.div
      className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-slate-950/72 p-4 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.form
        initial={{ opacity: 0, y: 18, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 18, scale: 0.98 }}
        transition={{ duration: 0.24 }}
        onSubmit={onSubmit}
        onClick={(event) => event.stopPropagation()}
        className="w-full max-w-2xl rounded-lg border border-white/10 bg-[#071A2F] p-5 shadow-2xl shadow-black/40"
        noValidate
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase text-emerald-300">{mode === "add" ? "Add Farm" : "Edit Farm"}</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">
              {mode === "add" ? "Create farm record" : "Update farm record"}
            </h2>
          </div>
          <button
            type="button"
            aria-label="Close farm form"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/8 text-slate-200 transition hover:bg-white/12"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <FormField label="Farm Name" value={form.name} error={errors.name} onChange={(value) => onChange("name", value)} />
          <FormField label="Location" value={form.location} error={errors.location} onChange={(value) => onChange("location", value)} />
          <FormField label="Farm Size" value={form.size} error={errors.size} onChange={(value) => onChange("size", value)} />
          <FormField label="Crop Type" value={form.cropType} error={errors.cropType} onChange={(value) => onChange("cropType", value)} />
          <FormField label="GPS Coordinates" value={form.gps} error={errors.gps} onChange={(value) => onChange("gps", value)} />
          <FormField label="Owner" value={form.owner} error={errors.owner} onChange={(value) => onChange("owner", value)} />
          <FormField
            label="Description"
            value={form.description}
            error={errors.description}
            onChange={(value) => onChange("description", value)}
            className="sm:col-span-2"
            multiline
          />
        </div>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <ActionButton type="button" onClick={onClose}>
            Cancel
          </ActionButton>
          <ActionButton type="submit" icon={Plus} variant="primary" accent="emerald">
            {mode === "add" ? "Add Farm" : "Save Changes"}
          </ActionButton>
        </div>
      </motion.form>
    </motion.div>
  );
}

function FormField({
  label,
  value,
  error,
  onChange,
  className,
  multiline,
}: {
  label: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  className?: string;
  multiline?: boolean;
}) {
  const inputId = label.toLowerCase().replaceAll(" ", "-");
  const inputClass = cn(
    "mt-2 w-full rounded-lg border bg-white/8 px-3 text-sm text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/60 focus:bg-white/10",
    multiline ? "min-h-24 py-3" : "h-11",
    error ? "border-rose-400/70" : "border-white/10",
  );

  return (
    <label htmlFor={inputId} className={cn("block", className)}>
      <span className="text-sm font-medium text-slate-200">{label}</span>
      {multiline ? (
        <textarea id={inputId} value={value} onChange={(event) => onChange(event.target.value)} className={inputClass} />
      ) : (
        <input id={inputId} value={value} onChange={(event) => onChange(event.target.value)} className={inputClass} />
      )}
      {error && <p className="mt-1.5 text-xs font-medium text-rose-200">{error}</p>}
    </label>
  );
}
