export function formatDateTimeISOToReadable(iso: string, options?: {
  locale?: string;
  timeZone?: string;
}) {
  const date = new Date(iso);
  const locale = options?.locale ?? "en-GB"; // DD/MM/YYYY format
  // Use IST by default for this app. Fixed timezone keeps SSR/CSR in sync.
  const timeZone = options?.timeZone ?? "Asia/Kolkata";
  return new Intl.DateTimeFormat(locale, {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
    timeZone,
  }).format(date);
}
