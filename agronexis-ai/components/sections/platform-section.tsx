"use client";

import { motion } from "framer-motion";
import { Activity, Bot, Layers3, Satellite } from "lucide-react";
import { Card } from "@/components/ui/card";
import { capabilityCards } from "@/lib/data";

const icons = [Satellite, Bot, Activity, Layers3];

export function PlatformSection() {
  return (
    <section id="features" className="scroll-mt-16 border-y border-white/10 bg-slate-950/30 py-20">
      <span id="platform" className="block scroll-mt-16" aria-hidden="true" />
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase text-emerald-300">Platform</p>
          <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
            One operating layer for every acre, asset, and agronomy workflow.
          </h2>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {capabilityCards.map((card, index) => {
            const Icon = icons[index];
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.45, delay: index * 0.08 }}
              >
                <Card className="h-full p-5 transition duration-300 hover:-translate-y-1 hover:border-emerald-300/30">
                  <span className="grid h-11 w-11 place-items-center rounded-lg bg-white/8 text-emerald-300">
                    <Icon className="h-5 w-5" />
                  </span>
                  <h3 className="mt-5 text-lg font-semibold text-white">{card.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-slate-400">{card.description}</p>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
