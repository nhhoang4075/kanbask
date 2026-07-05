"use client";

import { useId } from "react";

export default function Sparkline({ data, className, color = "var(--color-blue-green)" }) {
  if (!data || data.length < 2) return null;

  const width = 100;
  const height = 32;
  const padding = 3;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const step = (width - padding * 2) / (data.length - 1);

  const points = data.map((value, i) => [
    padding + i * step,
    height - padding - ((value - min) / range) * (height - padding * 2)
  ]);

  const linePath = `M ${points.map((p) => p.join(",")).join(" L ")}`;
  const areaPath = `${linePath} L ${width - padding},${height} L ${padding},${height} Z`;
  const [lastX, lastY] = points[points.length - 1];
  const gradientId = useId();

  return (
    <svg viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none" className={className}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={color} stopOpacity="0.35" />
          <stop offset="1" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={areaPath} fill={`url(#${gradientId})`} />
      <path
        d={linePath}
        fill="none"
        stroke={color}
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx={lastX} cy={lastY} r="2.4" fill={color} />
    </svg>
  );
}
