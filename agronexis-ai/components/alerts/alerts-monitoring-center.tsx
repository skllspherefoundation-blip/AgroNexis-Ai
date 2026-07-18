"use client";

import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import {
  AlertCircle,
  AlertTriangle,
  Bell,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Eye,
  Filter,
  Info,
  MailOpen,
  Search,
  ShieldCheck,
  Trash2,
  X,
} from "lucide-react";
import { ActionButton, MetricTile, PageHeader, SearchControl, SelectControl, StatusPill } from "@/components/dashboard/dashboard-ui";
import { alertFilterOptions, farmAlerts, type AlertPriority, type AlertStatus, type AlertType, type FarmAlert } from "@/lib/alerts-data";
import { cn } from "@/lib/utils";

type FilterValue = (typeof alertFilterOptions)[number];

const pageSize = 5;

const typeClass: Record<AlertType, string> = {
  Critical: "border-rose-300/20 bg-rose-400/12 text-rose-100",
  Warning: "border-amber-300/20 bg-amber-400/12 text-amber-100",
  Information: "border-sky-300/20 bg-sky-400/12 text-sky-100",
};

const priorityClass: Record<AlertPriority, string> = {
  High: "bg-rose-400/12 text-rose-100",
  Medium: "bg-amber-400/12 text-amber-100",
  Low: "bg-sky-400/12 text-sky-100",
};

const statusClass: Record<AlertStatus, string> = {
  Unread: "border-emerald-300/20 bg-emerald-400/12 text-emerald-100",
  Read: "border-slate-300/15 bg-white/8 text-slate-200",
  Resolved: "border-sky-300/20 bg-sky-400/12 text-sky-100",
};

const typeIcon: Record<AlertType, LucideIcon> = {
  Critical: AlertCircle,
  Warning: AlertTriangle,
  Information: Info,
};

export function AlertsMonitoringCenter() {
  const [alerts, setAlerts] = useState(farmAlerts);
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterValue>("All");
  const [page, setPage] = useState(1);
  const [selectedAlertId, setSelectedAlertId] = useState<string | null>(null);

  const selectedAlert = useMemo(() => alerts.find((alert) => alert.id === selectedAlertId) ?? null, [alerts, selectedAlertId]);

  const overview = useMemo(() => {
    const critical = alerts.filter((alert) => alert.type === "Critical" && alert.status !== "Resolved").length;
    const warning = alerts.filter((alert) => alert.type === "Warning" && alert.status !== "Resolved").length;
    const resolved = alerts.filter((alert) => alert.status === "Resolved").length;
    const unread = alerts.filter((alert) => alert.status === "Unread").length;

    return [
      { label: "Critical Alerts", value: String(critical), helper: critical > 0 ? "response required" : "all clear", icon: AlertCircle },
      { label: "Warning Alerts", value: String(warning), helper: "watch conditions", icon: AlertTriangle },
      { label: "Resolved Alerts", value: String(resolved), helper: "+1 closed today", icon: CheckCircle2 },
      { label: "Today's Alerts", value: String(alerts.length), helper: "live monitoring feed", icon: Clock3 },
      { label: "Unread Alerts", value: String(unread), helper: unread > 0 ? "needs review" : "inbox clear", icon: Bell },
    ];
  }, [alerts]);

  const filteredAlerts = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return alerts.filter((alert) => {
      const searchable = [alert.type, alert.farm, alert.priority, alert.message, alert.status, alert.description, alert.recommendation]
        .join(" ")
        .toLowerCase();

      const matchesFilter =
        filter === "All" ||
        alert.type === filter ||
        alert.status === filter;

      return (!normalized || searchable.includes(normalized)) && matchesFilter;
    });
  }, [alerts, filter, query]);

  const totalPages = Math.max(1, Math.ceil(filteredAlerts.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paginatedAlerts = filteredAlerts.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const unreadCount = alerts.filter((alert) => alert.status === "Unread").length;

  const resetPage = (update: () => void) => {
    update();
    setPage(1);
  };

  const markAsRead = (alertId: string) => {
    setAlerts((current) =>
      current.map((alert) => (alert.id === alertId && alert.status === "Unread" ? { ...alert, status: "Read" } : alert)),
    );
  };

  const resolveAlert = (alertId: string) => {
    setAlerts((current) => current.map((alert) => (alert.id === alertId ? { ...alert, status: "Resolved" } : alert)));
  };

  const deleteAlert = (alertId: string) => {
    const alert = alerts.find((item) => item.id === alertId);
    if (alert && !window.confirm(`Delete alert for ${alert.farm}?`)) return;

    setAlerts((current) => current.filter((item) => item.id !== alertId));
    if (selectedAlertId === alertId) setSelectedAlertId(null);
    setPage((value) => Math.max(1, Math.min(value, Math.ceil(Math.max(0, filteredAlerts.length - 1) / pageSize) || 1)));
  };

  const openAlert = (alertId: string) => {
    setSelectedAlertId(alertId);
    markAsRead(alertId);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Real-Time Monitoring"
        title="Alerts"
        accent="emerald"
        description="Monitor farm risks, AI-detected anomalies, unread notifications, response status, and recommended actions across connected operations."
        actions={
          <ActionButton icon={Bell} variant="primary" accent="emerald">
            {unreadCount} Unread
          </ActionButton>
        }
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {overview.map((stat, index) => (
          <MetricTile key={stat.label} {...stat} index={index} accent={stat.label.includes("Critical") ? "rose" : stat.label.includes("Warning") ? "amber" : "emerald"} />
        ))}
      </div>

      <section className="rounded-lg border border-white/10 bg-slate-950/55 shadow-xl shadow-black/20 backdrop-blur-xl">
        <div className="border-b border-white/10 p-5">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div>
              <h2 className="text-sm font-semibold uppercase text-slate-200">Alert Feed</h2>
              <p className="mt-1 text-sm text-slate-500">{filteredAlerts.length} matching alerts from live farm telemetry</p>
            </div>
            <div className="flex flex-wrap gap-2">
              <StatusPill className="bg-rose-400/12 text-rose-100">Critical response</StatusPill>
              <StatusPill className="bg-amber-400/12 text-amber-100">Warning watch</StatusPill>
              <StatusPill className="bg-emerald-400/12 text-emerald-100">{unreadCount} unread</StatusPill>
            </div>
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-[1.6fr_1fr]">
            <SearchControl icon={Search} value={query} onChange={(value) => resetPage(() => setQuery(value))} placeholder="Search farm, alert message, recommendation..." />
            <SelectControl icon={Filter} label="Alert filter" value={filter} options={alertFilterOptions} onChange={(value) => resetPage(() => setFilter(value as FilterValue))} />
          </div>
        </div>

        <div className="grid gap-4 p-5 xl:hidden">
          <AnimatePresence mode="popLayout">
            {paginatedAlerts.map((alert) => (
              <AlertCard
                key={alert.id}
                alert={alert}
                onView={() => openAlert(alert.id)}
                onRead={() => markAsRead(alert.id)}
                onResolve={() => resolveAlert(alert.id)}
                onDelete={() => deleteAlert(alert.id)}
              />
            ))}
          </AnimatePresence>
        </div>

        <div className="hidden overflow-x-auto xl:block">
          <table className="w-full min-w-[1120px] text-left text-sm">
            <thead className="border-b border-white/10 bg-white/5 text-xs uppercase text-slate-400">
              <tr>
                {["Alert Type", "Farm", "Priority", "Message", "Time", "Status", "Actions"].map((heading) => (
                  <th key={heading} className="px-5 py-4 font-semibold">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {paginatedAlerts.map((alert, index) => (
                <motion.tr
                  key={alert.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25, delay: index * 0.03 }}
                  className={cn("border-b border-white/10 transition hover:bg-white/5", alert.status === "Unread" && "bg-emerald-400/[0.035]")}
                >
                  <td className="px-5 py-4"><TypeBadge type={alert.type} /></td>
                  <td className="px-5 py-4 font-semibold text-white">{alert.farm}</td>
                  <td className="px-5 py-4"><PriorityBadge priority={alert.priority} /></td>
                  <td className="px-5 py-4 text-slate-300">
                    <div className="flex items-center gap-2">
                      {alert.status === "Unread" && <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400" />}
                      <span className="line-clamp-2">{alert.message}</span>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-slate-300">{alert.time}</td>
                  <td className="px-5 py-4"><StatusBadge status={alert.status} /></td>
                  <td className="px-5 py-4">
                    <AlertActions
                      alert={alert}
                      onView={() => openAlert(alert.id)}
                      onRead={() => markAsRead(alert.id)}
                      onResolve={() => resolveAlert(alert.id)}
                      onDelete={() => deleteAlert(alert.id)}
                    />
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>

        {paginatedAlerts.length === 0 && (
          <div className="border-t border-white/10 p-8 text-center text-sm text-slate-400">
            No alerts match the current search and filters.
          </div>
        )}

        <div className="flex flex-col gap-3 border-t border-white/10 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-400">
            Page {currentPage} of {totalPages}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((value) => Math.max(1, value - 1))}
              disabled={currentPage === 1}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/8 px-3 text-sm font-medium text-slate-200 transition hover:bg-white/12 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </button>
            <button
              type="button"
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
        {selectedAlert && <AlertDrawer alert={selectedAlert} onClose={() => setSelectedAlertId(null)} onResolve={() => resolveAlert(selectedAlert.id)} />}
      </AnimatePresence>
    </div>
  );
}

function TypeBadge({ type }: { type: AlertType }) {
  const Icon = typeIcon[type];

  return (
    <span className={cn("inline-flex items-center gap-2 rounded-md border px-2.5 py-1 text-xs font-semibold", typeClass[type])}>
      <Icon className="h-3.5 w-3.5" />
      {type}
    </span>
  );
}

function PriorityBadge({ priority }: { priority: AlertPriority }) {
  return <StatusPill className={priorityClass[priority]}>{priority}</StatusPill>;
}

function StatusBadge({ status }: { status: AlertStatus }) {
  return <span className={cn("inline-flex rounded-md border px-2.5 py-1 text-xs font-semibold", statusClass[status])}>{status}</span>;
}

function AlertActions({
  alert,
  onView,
  onRead,
  onResolve,
  onDelete,
}: {
  alert: FarmAlert;
  onView: () => void;
  onRead: () => void;
  onResolve: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <IconButton label="View alert" icon={Eye} onClick={onView} />
      <IconButton label="Mark as read" icon={MailOpen} onClick={onRead} disabled={alert.status !== "Unread"} />
      <IconButton label="Resolve alert" icon={ShieldCheck} onClick={onResolve} disabled={alert.status === "Resolved"} />
      <IconButton label="Delete alert" icon={Trash2} onClick={onDelete} danger />
    </div>
  );
}

function IconButton({
  label,
  icon: Icon,
  onClick,
  danger,
  disabled,
}: {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  danger?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      title={label}
      className={cn(
        "grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-white/8 text-slate-200 transition hover:bg-white/12 focus:outline-none focus:ring-2 focus:ring-emerald-300 disabled:cursor-not-allowed disabled:opacity-35",
        danger && "hover:border-rose-300/30 hover:bg-rose-400/10 hover:text-rose-100 focus:ring-rose-300",
      )}
    >
      <Icon className="h-4 w-4" />
    </button>
  );
}

function AlertCard({
  alert,
  onView,
  onRead,
  onResolve,
  onDelete,
}: {
  alert: FarmAlert;
  onView: () => void;
  onRead: () => void;
  onResolve: () => void;
  onDelete: () => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.25 }}
      className={cn("rounded-lg border border-white/10 bg-white/6 p-4", alert.status === "Unread" && "border-emerald-300/20 bg-emerald-400/[0.045]")}
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <TypeBadge type={alert.type} />
          <h3 className="mt-3 font-semibold text-white">{alert.farm}</h3>
          <p className="mt-1 text-sm leading-6 text-slate-400">{alert.message}</p>
        </div>
        {alert.status === "Unread" && <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400" />}
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <InfoBlock label="Priority" value={alert.priority} />
        <InfoBlock label="Time" value={alert.time} />
        <InfoBlock label="Status" value={alert.status} />
        <InfoBlock label="Detected" value={alert.detectedAt} />
      </div>
      <div className="mt-4 flex justify-end">
        <AlertActions alert={alert} onView={onView} onRead={onRead} onResolve={onResolve} onDelete={onDelete} />
      </div>
    </motion.article>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-white/10 bg-slate-950/35 p-3">
      <p className="text-xs font-semibold uppercase text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-medium text-slate-200">{value}</p>
    </div>
  );
}

function AlertDrawer({ alert, onClose, onResolve }: { alert: FarmAlert; onClose: () => void; onResolve: () => void }) {
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
            <p className="text-sm font-semibold uppercase text-emerald-300">Alert Details</p>
            <h2 className="mt-1 text-2xl font-semibold text-white">{alert.farm}</h2>
            <p className="mt-1 text-sm text-slate-400">{alert.message}</p>
          </div>
          <button
            type="button"
            aria-label="Close alert details"
            onClick={onClose}
            className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/8 text-slate-200 transition hover:bg-white/12"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-5 p-5">
          <section className="rounded-lg border border-white/10 bg-white/6 p-4">
            <div className="flex flex-wrap gap-2">
              <TypeBadge type={alert.type} />
              <PriorityBadge priority={alert.priority} />
              <StatusBadge status={alert.status} />
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <InfoBlock label="Affected Farm" value={alert.farm} />
              <InfoBlock label="Time Detected" value={alert.detectedAt} />
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-400">{alert.description}</p>
          </section>

          <section className="rounded-lg border border-emerald-300/15 bg-emerald-400/10 p-4">
            <h3 className="text-sm font-semibold uppercase text-emerald-100">AI Recommendation</h3>
            <p className="mt-2 text-sm leading-6 text-emerald-50">{alert.recommendation}</p>
          </section>

          <section className="rounded-lg border border-white/10 bg-white/6 p-4">
            <h3 className="text-sm font-semibold uppercase text-slate-200">Suggested Actions</h3>
            <div className="mt-3 space-y-2">
              {alert.suggestedActions.map((action) => (
                <div key={action} className="flex items-center gap-3 rounded-lg bg-slate-950/35 p-3 text-sm text-slate-300">
                  <span className="h-2 w-2 rounded-full bg-emerald-400" />
                  {action}
                </div>
              ))}
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <ActionButton type="button" onClick={onClose}>
              Close
            </ActionButton>
            <ActionButton type="button" icon={ShieldCheck} variant="primary" accent="emerald" onClick={onResolve} disabled={alert.status === "Resolved"}>
              Resolve Alert
            </ActionButton>
          </div>
        </div>
      </motion.aside>
    </motion.div>
  );
}
