"use client";

import { motion } from "framer-motion";

type LineChartProps = {
  data: number[];
  labels: string[];
  color?: string;
};

export function LineChart({ data, labels, color = "#22C55E" }: LineChartProps) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * 100;
    const y = 86 - ((value - min) / Math.max(max - min, 1)) * 68;
    return `${x},${y}`;
  });

  return (
    <div className="h-56 w-full">
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="h-full w-full overflow-visible">
        <defs>
          <linearGradient id={`line-fill-${color}`} x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.28" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[22, 44, 66, 88].map((y) => (
          <line key={y} x1="0" x2="100" y1={y} y2={y} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
        ))}
        <motion.polyline
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          fill="none"
          stroke={color}
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points.join(" ")}
          vectorEffect="non-scaling-stroke"
        />
        <polygon points={`0,100 ${points.join(" ")} 100,100`} fill={`url(#line-fill-${color})`} />
      </svg>
      <div className="mt-3 grid grid-cols-7 gap-1 text-xs text-slate-500">
        {labels.slice(0, 7).map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}
