"use client";

import { motion } from "framer-motion";
import { BarChart3, LineChart, Map } from "lucide-react";
import { Card } from "@/components/ui/card";

export function InsightsSection() {
  return (
    <section className="border-y border-white/10 bg-slate-950/35 py-20">
      <div className="mx-auto grid w-full max-w-7xl gap-6 px-4 sm:px-6 lg:grid-cols-3 lg:px-8">
        {[
          { icon: Map, title: "Zone maps", text: "Variable-rate prescriptions and stress overlays for every block." },
          { icon: LineChart, title: "Forecasts", text: "Yield, irrigation, disease, and labor forecasts in one timeline." },
          { icon: BarChart3, title: "Board reporting", text: "Executive-ready views for ROI, risk, and sustainability outcomes." },
        ].map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
          >
            <Card className="h-full p-6">
              <item.icon className="h-7 w-7 text-sky-300" />
              <h3 className="mt-5 text-xl font-semibold text-white">{item.title}</h3>
              <p className="mt-3 text-sm leading-6 text-slate-400">{item.text}</p>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
