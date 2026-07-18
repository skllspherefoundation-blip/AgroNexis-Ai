"use client";

import { motion } from "framer-motion";
import { BrainCircuit, CloudSun, Droplets, Leaf, Radar, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { MetricCard } from "@/components/ui/metric-card";
import { fieldMetrics } from "@/lib/data";

const orbitItems = [
  { icon: Leaf, label: "Crop Health", className: "left-5 top-8" },
  { icon: Droplets, label: "Moisture", className: "right-6 top-24" },
  { icon: CloudSun, label: "Weather", className: "bottom-10 left-10" },
];

export function HeroSection() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(34,197,94,0.18),transparent_32%),radial-gradient(circle_at_80%_20%,rgba(14,165,233,0.16),transparent_28%),radial-gradient(circle_at_50%_90%,rgba(124,58,237,0.16),transparent_34%)]" />
      <div className="relative mx-auto grid min-h-[calc(100svh-4rem)] w-full max-w-7xl items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="max-w-3xl"
        >
          <Badge>AI-native precision agriculture command system</Badge>
          <h1 className="mt-6 max-w-4xl text-5xl font-semibold leading-tight text-white sm:text-6xl lg:text-7xl">
            AgroNexis AI
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">
            A premium operations platform that turns field telemetry, climate signals, and agronomy models into faster decisions for growers, cooperatives, and food enterprises.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="#features">Explore platform</Button>
            <Button href="#about" variant="secondary">
              View intelligence
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="relative"
        >
          <Card className="relative overflow-hidden p-4 sm:p-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div>
                <p className="text-xs font-medium uppercase text-slate-400">Live farm graph</p>
                <h2 className="mt-1 text-xl font-semibold text-white">Delta Valley Estate</h2>
              </div>
              <span className="rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-semibold text-emerald-200">
                Synced
              </span>
            </div>
            <div className="relative mt-5 aspect-square overflow-hidden rounded-lg border border-white/10 bg-[#0F172A]">
              <div className="absolute inset-4 rounded-lg border border-emerald-300/20 bg-[linear-gradient(135deg,rgba(34,197,94,0.18),transparent_40%),linear-gradient(45deg,rgba(14,165,233,0.14),transparent_36%)]" />
              <div className="absolute inset-x-0 top-1/2 h-px bg-sky-300/25" />
              <div className="absolute inset-y-0 left-1/2 w-px bg-sky-300/25" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
                className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-emerald-300/35"
              />
              <div className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-emerald-300/30 bg-emerald-400/10 text-emerald-200 shadow-[0_0_60px_rgba(34,197,94,0.2)]">
                <Radar className="h-10 w-10" />
              </div>
              {orbitItems.map((item) => (
                <div
                  key={item.label}
                  className={`absolute ${item.className} flex items-center gap-2 rounded-full border border-white/10 bg-slate-950/75 px-3 py-2 text-xs font-medium text-slate-200 backdrop-blur`}
                >
                  <item.icon className="h-4 w-4 text-emerald-300" />
                  {item.label}
                </div>
              ))}
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {fieldMetrics.map((metric) => (
                <MetricCard key={metric.label} {...metric} />
              ))}
            </div>
          </Card>
          <Card className="absolute -bottom-6 right-3 hidden max-w-xs p-4 lg:block">
            <div className="flex items-start gap-3">
              <span className="grid h-10 w-10 place-items-center rounded-lg bg-violet-400/15 text-violet-200">
                <BrainCircuit className="h-5 w-5" />
              </span>
              <div>
                <p className="font-semibold text-white">AI recommendation</p>
                <p className="mt-1 text-sm text-slate-400">Delay fungicide by 18 hours to avoid wind drift.</p>
              </div>
            </div>
          </Card>
          <Card className="absolute -left-4 top-10 hidden p-3 lg:block">
            <div className="flex items-center gap-2 text-sm font-medium text-slate-200">
              <ShieldCheck className="h-4 w-4 text-sky-300" />
              ISO-ready controls
            </div>
          </Card>
        </motion.div>
      </div>
    </section>
  );
}
