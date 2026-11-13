import { NotionAPI } from "notion-client"
import { normalizeRecordMap } from "./normalizeRecordMap"
import { requestWithRetry } from "./requestWithRetry"
import { createTtlCache, NOTION_CACHE_TTL_MS } from "./ttlCache"

const recordMapCache = createTtlCache<any>(NOTION_CACHE_TTL_MS)

export const getRecordMap = (pageId: string) =>
  recordMapCache(pageId, () =>
    requestWithRetry(() => new NotionAPI().getPage(pageId)).then(
      normalizeRecordMap
    )
  )
