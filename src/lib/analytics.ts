/** Send a Google Analytics event. Does nothing when analytics is not loaded (dev, blockers, no ID). */
export function track(event: string, params: Record<string, string | number> = {}) {
  if (typeof window === "undefined") return;
  (window as unknown as { gtag?: (...a: unknown[]) => void }).gtag?.("event", event, params);
}
