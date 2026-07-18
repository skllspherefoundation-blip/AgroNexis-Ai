import { quickActions } from "@/lib/dashboard-data";

export function QuickActions() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {quickActions.map((action) => (
        <button
          key={action.label}
          className="flex h-12 items-center gap-3 rounded-lg border border-white/10 bg-white/7 px-3 text-left text-sm font-semibold text-slate-100 transition hover:border-emerald-300/40 hover:bg-emerald-400/10"
        >
          <span className="grid h-8 w-8 place-items-center rounded-md bg-emerald-400/12 text-emerald-200">
            <action.icon className="h-4 w-4" />
          </span>
          {action.label}
        </button>
      ))}
    </div>
  );
}
