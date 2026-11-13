/**
 * Short-lived promise cache for Notion requests.
 *
 * It only merges the burst of identical requests made while one build or one
 * revalidation runs. Results expire after `ttlMs`, so a later regeneration
 * (ISR or /api/revalidate) fetches fresh data instead of reusing what this
 * server instance fetched first. Failed requests are dropped immediately.
 */
export const createTtlCache = <T>(ttlMs: number) => {
  const entries = new Map<string, { promise: Promise<T>; expiresAt: number }>()

  return (key: string, load: () => Promise<T>): Promise<T> => {
    const now = Date.now()
    const hit = entries.get(key)
    if (hit && hit.expiresAt > now) return hit.promise

    const promise = load()
    entries.set(key, { promise, expiresAt: now + ttlMs })
    promise.catch(() => {
      if (entries.get(key)?.promise === promise) entries.delete(key)
    })
    return promise
  }
}

export const NOTION_CACHE_TTL_MS = 30_000
