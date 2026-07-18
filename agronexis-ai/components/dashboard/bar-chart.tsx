"use client";

import { motion } from "framer-motion";

type BarChartProps = {
  data: number[];
  labels: string[];
  color?: string;
};

export function BarChart({ data, labels, color = "bg-sky-400" }: BarChartProps) {
  const max = Math.max(...data);

  return (
    <div className="flex h-56 items-end gap-3">
      {data.map((value, index) => (
        <div key={`${labels[index]}-${value}`} className="flex flex-1 flex-col items-center gap-2">
          <div className="flex h-44 w-full items-end rounded-md bg-white/5 p-1">
            <motion.div
              initial={{ height: 0 }}
              whileInView={{ height: `${(value / max) * 100}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.05 }}
              className={`w-full rounded ${color} shadow-[0_0_22px_rgba(14,165,233,0.22)]`}
            />
          </div>
          <span className="text-xs text-slate-500">{labels[index]}</span>
        </div>
      ))}
    </div>
  );
}
