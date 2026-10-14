export function getSiteOrigin(): string {
  const raw = process.env.SITE_URL?.trim();
  if (raw) {
    try {
      return new URL(raw).origin;
    } catch {
      // ignore invalid URL
    }
  }
  return process.env.NODE_ENV === "production"
    ? "https://harmanpreetsingh.me"
    : "http://localhost:3000";
}

export const LOCAL_ORIGIN = "http://localhost:3000";
