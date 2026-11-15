"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Shows a page the way a phone would, shrunk to fit its container.
 * The iframe is always `baseWidth` wide and is scaled down with a transform.
 */
export default function ScaledFrame({
  src,
  title,
  baseWidth = 390,
  baseHeight = 780,
  lazy = true,
}: {
  src: string;
  title: string;
  baseWidth?: number;
  baseHeight?: number;
  lazy?: boolean;
}) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.6);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const update = () => setScale(el.clientWidth / baseWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [baseWidth]);

  return (
    <div ref={box} className="relative w-full overflow-hidden bg-line" style={{ height: baseHeight * scale }}>
      <iframe
        src={src}
        title={title}
        loading={lazy ? "lazy" : "eager"}
        tabIndex={-1}
        className="absolute left-0 top-0 origin-top-left border-0 bg-white"
        style={{ width: baseWidth, height: baseHeight, transform: `scale(${scale})` }}
      />
    </div>
  );
}
