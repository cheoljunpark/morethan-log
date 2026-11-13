import { NotionAPI } from "notion-client"
import { normalizeRecordMap } from "./normalizeRecordMap"
import { requestWithRetry } from "./requestWithRetry"
import { createTtlCache, NOTION_CACHE_TTL_MS } from "./ttlCache"

type FallbackUser = {
  id: string
  name?: string | null
  profile_photo?: string | null
}

const recordMapCache = createTtlCache<any>(NOTION_CACHE_TTL_MS)

const withFallbackUsers = (
  recordMap: any,
  fallbackUsers: FallbackUser[] = []
) => {
  if (!fallbackUsers.length) {
    return recordMap
  }

  const notionUser = { ...(recordMap?.notion_user ?? {}) }

  fallbackUsers.forEach((user) => {
    if (!user?.id || notionUser[user.id]) {
      return
    }

    notionUser[user.id] = {
      role: "reader",
      value: {
        id: user.id,
        type: "person",
        name: user.name ?? "Guest",
        profile_photo: user.profile_photo ?? null,
      },
    }
  })

  return {
    ...recordMap,
    notion_user: notionUser,
  }
}

export const getRecordMap = async (
  pageId: string,
  fallbackUsers: FallbackUser[] = []
) => {
  const recordMap = await recordMapCache(pageId, () =>
    requestWithRetry(() => new NotionAPI().getPage(pageId)).then(
      normalizeRecordMap
    )
  )
  return withFallbackUsers(recordMap, fallbackUsers)
}
