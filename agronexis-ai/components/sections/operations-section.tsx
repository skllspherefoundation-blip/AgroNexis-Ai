"use client";

import { motion } from "framer-motion";
import { Gauge, Route, UsersRound } from "lucide-react";
import { Card } from "@/components/ui/card";

const items = [
  { icon: Route, label: "Dispatch routes", value: "142 optimized tasks" },
  { icon: Gauge, label: "Resource load", value: "78% equipment utilization" },
  { icon: UsersRound, label: "Team coverage", value: "24 field operators active" },
];

export function OperationsSection() {
  return (
    <section id="operations" className="bg-[#081C33] py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase text-violet-300">Operations</p>
            <h2 className="mt-3 text-3xl font-semibold text-white sm:text-4xl">
              Coordinate growers, machinery, and field crews from one workspace.
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {items.map((item, index) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <Card className="h-full p-5">
                  <item.icon className="h-6 w-6 text-violet-300" />
                  <p className="mt-5 text-sm text-slate-400">{item.label}</p>
                  <p className="mt-2 text-lg font-semibold text-white">{item.value}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
