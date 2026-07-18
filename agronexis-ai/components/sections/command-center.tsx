"use client";

import { motion } from "framer-motion";
import { LockKeyhole, ServerCog, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export function CommandCenter() {
  return (
    <section id="security" className="py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <Card className="overflow-hidden">
          <div className="grid gap-0 lg:grid-cols-[1fr_0.8fr]">
            <div className="p-6 sm:p-10">
              <p className="text-sm font-semibold uppercase text-emerald-300">Enterprise ready</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-semibold text-white sm:text-4xl">
                Built for regulated food supply chains and multi-region farm operations.
              </h2>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-400">
                Role-based access, audit trails, secure integrations, and deployment-ready architecture for teams that need precision and governance.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/login">Start workspace</Button>
                <Button href="#features" variant="secondary">
                  See architecture
                </Button>
              </div>
            </div>
            <div className="border-t border-white/10 bg-white/5 p-6 sm:p-10 lg:border-l lg:border-t-0">
              <div className="space-y-4">
                {[
                  { icon: ShieldCheck, label: "SOC 2 aligned controls" },
                  { icon: LockKeyhole, label: "Granular permissions" },
                  { icon: ServerCog, label: "API-first data fabric" },
                ].map((item, index) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, x: 18 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: index * 0.08 }}
                    className="flex items-center gap-4 rounded-lg border border-white/10 bg-slate-950/45 p-4"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-lg bg-emerald-400/15 text-emerald-200">
                      <item.icon className="h-5 w-5" />
                    </span>
                    <p className="font-medium text-slate-100">{item.label}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
