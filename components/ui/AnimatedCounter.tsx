"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "framer-motion";

type Props = {
  /** Plain string label like "100+", "Africa", "360°" — counts numeric portion if present */
  value: string;
  duration?: number;
  className?: string;
};

export function AnimatedCounter({ value, duration = 1600, className = "" }: Props) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const prefersReduced = useReducedMotion();
  const numericMatch = value.match(/^(\d+)(.*)$/);
  const target = numericMatch ? parseInt(numericMatch[1], 10) : null;
  const suffix = numericMatch ? numericMatch[2] : "";
  const [display, setDisplay] = useState(target !== null ? "0" : value);

  useEffect(() => {
    if (target === null) return;
    if (!inView) return;
    if (prefersReduced) {
      setDisplay(`${target}${suffix}`);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = Math.round(eased * target);
      setDisplay(`${current}${suffix}`);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, target, suffix, duration, prefersReduced]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
