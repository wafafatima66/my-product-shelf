/** Public address of a stored photo. Safe to import anywhere (no Node code). */
export const mediaUrl = (key: string, thumb = false) =>
  key ? `/media/${key}${thumb ? "?t=1" : ""}` : "";
