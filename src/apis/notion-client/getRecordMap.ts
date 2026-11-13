import { NotionAPI } from "notion-client"
import { normalizeRecordMap } from "./normalizeRecordMap"
import { requestWithRetry } from "./requestWithRetry"

type FallbackUser = {
  id: string
  name?: string | null
  profile_photo?: string | null
}

const recordMapCache = new Map<string, Promise<any>>()

const withFallbackUsers = (recordMap: any, fallbackUsers: FallbackUser[] = []) => {
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
  const cached = recordMapCache.get(pageId)
  if (cached) {
    const recordMap = await cached
    return withFallbackUsers(recordMap, fallbackUsers)
  }

  const api = new NotionAPI()
  const promise = requestWithRetry(() => api.getPage(pageId)).then((recordMap) =>
    normalizeRecordMap(recordMap)
  )

  recordMapCache.set(pageId, promise)

  try {
    const recordMap = await promise
    return withFallbackUsers(recordMap, fallbackUsers)
  } catch (error) {
    recordMapCache.delete(pageId)
    throw error
  }
}
