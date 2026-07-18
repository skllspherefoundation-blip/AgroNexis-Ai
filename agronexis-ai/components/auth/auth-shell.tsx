"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Activity, Check, Sparkles } from "lucide-react";

type AuthShellProps = {
  children: React.ReactNode;
};

const badges = [
  "AI Livestock Monitoring",
  "Satellite Farm Mapping",
  "Real-Time Weather Intelligence",
];

export function AuthShell({ children }: AuthShellProps) {
  return (
    <main className="min-h-screen bg-[#071A2F] text-white">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden lg:block">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1500937386664-56d1dfef3854?auto=format&fit=crop&w=1800&q=85')] bg-cover bg-center" />
          <div className="absolute inset-0 bg-[#071A2F]/80" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(34,197,94,0.24),transparent_32%),radial-gradient(circle_at_75%_20%,rgba(14,165,233,0.22),transparent_28%),linear-gradient(135deg,rgba(7,26,47,0.52),rgba(15,23,42,0.92))]" />

          <div className="relative flex h-full min-h-screen flex-col justify-between p-10 xl:p-14">
            <Link href="/" className="flex w-fit items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-emerald-500 text-slate-950 shadow-[0_0_36px_rgba(34,197,94,0.45)]">
                <Activity className="h-6 w-6" />
              </span>
              <span className="text-lg font-semibold">AgroNexis AI</span>
            </Link>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className="max-w-2xl"
            >
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-emerald-100 backdrop-blur">
                <Sparkles className="h-3.5 w-3.5 text-emerald-300" />
                Enterprise farm intelligence
              </div>
              <h1 className="text-5xl font-semibold leading-tight xl:text-6xl">
                Smart Agriculture Powered by Artificial Intelligence
              </h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-slate-200">
                Manage livestock, weather intelligence, geospatial mapping and farm analytics from one intelligent platform.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                {badges.map((badge) => (
                  <span
                    key={badge}
                    className="inline-flex items-center gap-2 rounded-full border border-emerald-300/25 bg-emerald-300/10 px-4 py-2 text-sm font-medium text-emerald-100 backdrop-blur"
                  >
                    <Check className="h-4 w-4" />
                    {badge}
                  </span>
                ))}
              </div>
            </motion.div>

            <div className="grid grid-cols-3 gap-3 text-sm text-slate-300">
              <div className="rounded-lg border border-white/10 bg-white/8 p-4 backdrop-blur">
                <p className="text-2xl font-semibold text-white">98%</p>
                <p className="mt-1">signal uptime</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/8 p-4 backdrop-blur">
                <p className="text-2xl font-semibold text-white">42k</p>
                <p className="mt-1">mapped acres</p>
              </div>
              <div className="rounded-lg border border-white/10 bg-white/8 p-4 backdrop-blur">
                <p className="text-2xl font-semibold text-white">24/7</p>
                <p className="mt-1">weather models</p>
              </div>
            </div>
          </div>
        </section>

        <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10 sm:px-6 lg:px-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(34,197,94,0.18),transparent_30%),radial-gradient(circle_at_90%_10%,rgba(14,165,233,0.16),transparent_26%),radial-gradient(circle_at_50%_100%,rgba(124,58,237,0.18),transparent_34%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-[size:72px_72px]" />
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.55, ease: "easeOut" }}
            className="relative w-full max-w-md"
          >
            <div className="mb-8 flex justify-center lg:hidden">
              <Link href="/" className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-500 text-slate-950">
                  <Activity className="h-5 w-5" />
                </span>
                <span className="text-lg font-semibold">AgroNexis AI</span>
              </Link>
            </div>
            {children}
          </motion.div>
        </section>
      </div>
    </main>
  );
}
