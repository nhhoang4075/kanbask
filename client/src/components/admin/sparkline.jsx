"use client";

import { useEffect, useId, useRef, useState } from "react";

export default function Sparkline({ data, className, color = "var(--color-blue-green)" }) {
  const containerRef = useRef(null);
  const [size, setSize] = useState(null);
  const gradientId = useId();

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) setSize({ width, height });
    });
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  if (!data || data.length < 2) {
    return <div ref={containerRef} className={className} />;
  }

  if (!size) {
    // Reserve the space and measure before drawing anything — drawing with a
    // guessed size and letting ResizeObserver "correct" it afterwards causes
    // exactly the stretched line / oval endpoint dot this component exists
    // to avoid, since a viewBox that doesn't match the real pixel size gets
    // non-uniformly scaled by the browser.
    return <div ref={containerRef} className={className} />;
  }

  const { width, height } = size;
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

  return (
    <div ref={containerRef} className={className}>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="block">
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
    </div>
  );
}
