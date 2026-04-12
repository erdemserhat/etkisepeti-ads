/** Loads `ETKISEPETI_*` from `.env` (same keys everywhere; no per-mode files). */
export function getEtkisepetiApiBase(): string {
  return (
    process.env.ETKISEPETI_API_BASE?.replace(/\/$/, "") ||
    "https://api.etkisepeti.com"
  );
}

export function getEtkisepetiInternalKey(): string | null {
  const key = process.env.ETKISEPETI_INTERNAL_KEY;
  if (!key || key.trim() === "") return null;
  return key;
}
