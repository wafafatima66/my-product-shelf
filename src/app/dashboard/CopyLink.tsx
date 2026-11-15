"use client";

import { useState, useSyncExternalStore } from "react";
import { btnGhost, btnSmall } from "@/components/ui";

const noSubscribe = () => () => {};

export default function CopyLink({ path, copyLabel, copiedLabel }: { path: string; copyLabel: string; copiedLabel: string }) {
  const origin = useSyncExternalStore(noSubscribe, () => window.location.origin, () => "");
  const url = origin + path;
  const [done, setDone] = useState(false);

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <a href={path} target="_blank" className="min-w-0 flex-1 truncate rounded-xl bg-paper px-3.5 py-2.5 text-[14px] font-medium underline-offset-2 hover:underline">
        {url}
      </a>
      <button
        type="button"
        className={`${btnGhost} ${btnSmall}`}
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(url);
            setDone(true);
            setTimeout(() => setDone(false), 1800);
          } catch {
            /* clipboard unavailable */
          }
        }}
      >
        {done ? `✓ ${copiedLabel}` : copyLabel}
      </button>
    </div>
  );
}
