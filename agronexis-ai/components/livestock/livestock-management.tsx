"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity,
  Baby,
  ChevronLeft,
  ChevronRight,
  ClipboardList,
  Filter,
  HeartPulse,
  MapPin,
  Microscope,
  Search,
  ShieldCheck,
  Syringe,
  Utensils,
  Weight,
} from "lucide-react";
import { ActionButton, MetricTile, PageHeader, SearchControl, SelectControl, StatusPill } from "@/components/dashboard/dashboard-ui";
import { animals, livestockStats, livestockTabs, type Animal } from "@/lib/livestock-data";
import { cn } from "@/lib/utils";

const pageSize = 4;
const allValue = "All";

const statusClass: Record<Animal["healthStatus"], string> = {
  Healthy: "border-emerald-300/20 bg-emerald-400/12 text-emerald-100",
  Watch: "border-amber-300/20 bg-amber-400/12 text-amber-100",
  Diseased: "border-rose-300/20 bg-rose-400/12 text-rose-100",
  Recovering: "border-sky-300/20 bg-sky-400/12 text-sky-100",
};

const vaccineClass: Record<Animal["vaccinationStatus"], string> = {
  Current: "bg-emerald-400/12 text-emerald-100",
  "Due Soon": "bg-amber-400/12 text-amber-100",
  Overdue: "bg-rose-400/12 text-rose-100",
};

const featureIcons = [ClipboardList, HeartPulse, Syringe, Microscope, MapPin, Utensils, Baby, Weight, Activity];

function unique<T extends keyof Animal>(field: T) {
  return [allValue, ...Array.from(new Set(animals.map((animal) => String(animal[field]))))];
}

function scoreColor(score: number) {
  if (score >= 90) return "bg-emerald-400";
  if (score >= 75) return "bg-sky-400";
  if (score >= 65) return "bg-amber-400";
  return "bg-rose-400";
}

export function LivestockManagement() {
  const [query, setQuery] = useState("");
  const [species, setSpecies] = useState(allValue);
  const [farm, setFarm] = useState(allValue);
  const [healthStatus, setHealthStatus] = useState(allValue);
  const [age, setAge] = useState(allValue);
  const [page, setPage] = useState(1);

  const filteredAnimals = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return animals.filter((animal) => {
      const searchable = [
        animal.tagId,
        animal.species,
        animal.breed,
        animal.farm,
        animal.location,
        animal.healthStatus,
        animal.vaccinationStatus,
      ]
        .join(" ")
        .toLowerCase();

      return (
        (!normalized || searchable.includes(normalized)) &&
        (species === allValue || animal.species === species) &&
        (farm === allValue || animal.farm === farm) &&
        (healthStatus === allValue || animal.healthStatus === healthStatus) &&
        (age === allValue || String(animal.age) === age)
      );
    });
  }, [age, farm, healthStatus, query, species]);

  const totalPages = Math.max(1, Math.ceil(filteredAnimals.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedAnimals = filteredAnimals.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function resetPage(update: () => void) {
    update();
    setPage(1);
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Livestock Operations"
        title="Livestock Management"
        accent="emerald"
        description="Track animal identity, biometric health, vaccinations, disease risk, location, feeding, breeding, weight, and longitudinal medical records."
        actions={
          <>
            <ActionButton icon={ShieldCheck} accent="emerald">Audit Records</ActionButton>
            <ActionButton icon={Activity} variant="primary" accent="emerald">Run AI Scan</ActionButton>
          </>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {livestockStats.map((stat, index) => (
          <MetricTile key={stat.label} {...stat} index={index} accent="emerald" />
        ))}
      </div>

      <section className="rounded-lg border border-white/10 bg-slate-950/55 shadow-xl shadow-black/20 backdrop-blur-xl">
        <div className="border-b border-white/10 p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-sm font-semibold uppercase text-slate-200">Animal List</h2>
              <p className="mt-1 text-sm text-slate-500">{filteredAnimals.length} matching records across connected farms</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {livestockTabs.map((tab, index) => {
                const Icon = featureIcons[index] ?? ClipboardList;
                return (
                  <span key={tab} className="inline-flex h-9 items-center gap-2 rounded-lg border border-white/10 bg-white/8 px-3 text-xs font-medium text-slate-300">
                    <Icon className="h-3.5 w-3.5 text-emerald-300" />
                    {tab}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-[1.4fr_repeat(4,1fr)]">
            <SearchControl icon={Search} value={query} onChange={(value) => resetPage(() => setQuery(value))} placeholder="Search tag, breed, farm, location..." />
            <FilterSelect label="Species" value={species} options={unique("species")} onChange={(value) => resetPage(() => setSpecies(value))} />
            <FilterSelect label="Farm" value={farm} options={unique("farm")} onChange={(value) => resetPage(() => setFarm(value))} />
            <FilterSelect label="Health Status" value={healthStatus} options={unique("healthStatus")} onChange={(value) => resetPage(() => setHealthStatus(value))} />
            <FilterSelect label="Age" value={age} options={unique("age")} onChange={(value) => resetPage(() => setAge(value))} />
          </div>
        </div>

        <div className="grid gap-4 p-5 xl:hidden">
          <AnimatePresence mode="popLayout">
            {paginatedAnimals.map((animal) => (
              <AnimalCard key={animal.id} animal={animal} />
            ))}
          </AnimatePresence>
        </div>

        <div className="hidden overflow-x-auto xl:block">
          <table className="w-full min-w-[1160px] text-left text-sm">
            <thead className="border-b border-white/10 bg-white/5 text-xs uppercase text-slate-400">
              <tr>
                {["Animal", "Species", "Age", "Location", "Vitals", "Health", "Vaccination", "GPS Position", "Last Checkup"].map((heading) => (
                  <th key={heading} className="px-5 py-4 font-semibold">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedAnimals.map((animal, index) => (
                <motion.tr
                  key={animal.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.03 }}
                  className="border-b border-white/10 transition hover:bg-white/5"
                >
                  <td className="px-5 py-4">
                    <AnimalIdentity animal={animal} />
                  </td>
                  <td className="px-5 py-4 text-slate-300">{animal.species}<div className="text-xs text-slate-500">{animal.breed}</div></td>
                  <td className="px-5 py-4 text-slate-300">{animal.age} yrs</td>
                  <td className="px-5 py-4 text-slate-300">{animal.location}<div className="text-xs text-slate-500">{animal.farm}</div></td>
                  <td className="px-5 py-4 text-slate-300">{animal.temperature}<div className="text-xs text-slate-500">{animal.heartRate}</div></td>
                  <td className="px-5 py-4"><StatusBadge status={animal.healthStatus} /></td>
                  <td className="px-5 py-4"><VaccinationBadge status={animal.vaccinationStatus} /></td>
                  <td className="px-5 py-4 text-slate-300">{animal.gpsPosition}</td>
                  <td className="px-5 py-4 text-slate-300">{animal.lastCheckup}</td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

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
    </div>
  );
}

function FilterSelect({ label, value, options, onChange }: { label: string; value: string; options: string[]; onChange: (value: string) => void }) {
  return <SelectControl icon={Filter} label={label} value={value} options={options} onChange={onChange} />;
}

function AnimalIdentity({ animal }: { animal: Animal }) {
  return (
    <div className="flex items-center gap-3">
      <div className="relative h-12 w-12 overflow-hidden rounded-lg border border-white/10 bg-white">
        <Image src={animal.photo} alt={`${animal.tagId} ${animal.species}`} fill sizes="48px" className="object-contain p-1.5" />
      </div>
      <div>
        <div className="font-semibold text-white">{animal.tagId}</div>
        <div className="text-xs text-slate-500">{animal.weight}</div>
      </div>
    </div>
  );
}

function AnimalCard({ animal }: { animal: Animal }) {
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
        <AnimalIdentity animal={animal} />
        <StatusBadge status={animal.healthStatus} />
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <Info label="Species" value={`${animal.species} / ${animal.breed}`} />
        <Info label="Age" value={`${animal.age} years`} />
        <Info label="Location" value={`${animal.location}, ${animal.farm}`} />
        <Info label="Vitals" value={`${animal.temperature} / ${animal.heartRate}`} />
        <Info label="Vaccination Status" value={animal.vaccinationStatus} />
        <Info label="GPS Position" value={animal.gpsPosition} />
        <Info label="Last Checkup" value={animal.lastCheckup} />
        <Info label="Feeding Schedule" value={animal.feedingSchedule} />
        <Info label="Breeding Records" value={animal.breedingStatus} />
        <Info label="Medical History" value={animal.medicalHistory} />
      </div>
      <div className="mt-4">
        <div className="mb-2 flex items-center justify-between text-xs">
          <span className="font-semibold uppercase text-slate-400">AI Health Score</span>
          <span className="font-semibold text-white">{animal.aiHealthScore}/100</span>
        </div>
        <div className="h-2 rounded-full bg-white/10">
          <div className={cn("h-2 rounded-full", scoreColor(animal.aiHealthScore))} style={{ width: `${animal.aiHealthScore}%` }} />
        </div>
      </div>
    </motion.article>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-slate-200">{value}</p>
    </div>
  );
}

function StatusBadge({ status }: { status: Animal["healthStatus"] }) {
  return <StatusPill className={cn("border", statusClass[status])}>{status}</StatusPill>;
}

function VaccinationBadge({ status }: { status: Animal["vaccinationStatus"] }) {
  return <StatusPill className={vaccineClass[status]}>{status}</StatusPill>;
}
