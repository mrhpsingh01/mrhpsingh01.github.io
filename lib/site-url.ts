export function getSiteOrigin(): string | undefined {
  const raw = process.env.SITE_URL?.trim();
  if (!raw) return undefined;
  try {
    return new URL(raw).origin;
  } catch {
    return undefined;
  }
}

export const LOCAL_ORIGIN = "http://localhost:3000";
