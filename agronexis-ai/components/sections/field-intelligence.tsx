"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Sprout } from "lucide-react";
import { Card } from "@/components/ui/card";
import { insights } from "@/lib/data";

export function FieldIntelligence() {
  return (
    <section id="about" className="scroll-mt-16 py-20">
      <span id="intelligence" className="block scroll-mt-16" aria-hidden="true" />
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8">
        <div>
          <p className="text-sm font-semibold uppercase text-sky-300">Intelligence</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            Explainable AI that agronomy teams can trust in the field.
          </h2>
          <p className="mt-4 text-base leading-7 text-slate-400">
            AgroNexis AI scores each recommendation with source traceability, forecast confidence, and operational impact so leaders can move from signal to action quickly.
          </p>
        </div>
        <Card className="overflow-hidden">
          <div className="border-b border-white/10 p-5">
            <div className="flex items-center gap-3">
              <span className="grid h-11 w-11 place-items-center rounded-lg bg-emerald-400/15 text-emerald-200">
                <Sprout className="h-5 w-5" />
              </span>
              <div>
                <h3 className="font-semibold text-white">Decision queue</h3>
                <p className="text-sm text-slate-400">Ranked by urgency, confidence, and ROI.</p>
              </div>
            </div>
          </div>
          <div className="divide-y divide-white/10">
            {insights.map((insight, index) => (
              <motion.div
                key={insight}
                initial={{ opacity: 0, x: 18 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
                className="flex items-center justify-between gap-4 p-5"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-300" />
                  <p className="text-sm font-medium text-slate-200">{insight}</p>
                </div>
                <span className="hidden rounded-full bg-sky-400/10 px-3 py-1 text-xs font-semibold text-sky-200 sm:inline-flex">
                  Review
                </span>
              </motion.div>
            ))}
          </div>
        </Card>
      </div>
    </section>
  );
}
