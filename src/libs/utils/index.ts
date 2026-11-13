import { CONFIG } from "site.config"

// Locale-independent "YYYY.MM.DD" used for index/meta lines.
export function formatIndexDate(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ""
  const mm = String(date.getMonth() + 1).padStart(2, "0")
  const dd = String(date.getDate()).padStart(2, "0")
  return `${date.getFullYear()}.${mm}.${dd}`
}

/** Absolute URL on this site. CONFIG.link may or may not end with "/". */
export function siteUrl(path = "/") {
  const base = CONFIG.link.replace(/\/+$/, "")
  const normalized = path.startsWith("/") ? path : `/${path}`
  return normalized === "/" ? `${base}/` : `${base}${normalized}`
}
