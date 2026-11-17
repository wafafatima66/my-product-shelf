/**
 * Public address of a stored photo. Safe to import anywhere (no Node code).
 * A key that is already a web address (Vercel Blob) is used as it is; the thumbnail sits next to it.
 */
export const mediaUrl = (key: string, thumb = false) => {
  if (!key) return "";
  if (key.startsWith("https://")) return thumb ? key.replace(/\.jpg$/, "-t.jpg") : key;
  return `/media/${key}${thumb ? "?t=1" : ""}`;
};
