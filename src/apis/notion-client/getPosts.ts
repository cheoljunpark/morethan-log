import { CONFIG } from "site.config"
import { NotionAPI } from "notion-client"
import { idToUuid } from "notion-utils"

import getAllPageIds from "src/libs/utils/notion/getAllPageIds"
import getPageProperties from "src/libs/utils/notion/getPageProperties"
import { TPosts } from "src/types"
import { requestWithRetry } from "./requestWithRetry"
import { createTtlCache, NOTION_CACHE_TTL_MS } from "./ttlCache"
import { makePostSlug } from "src/libs/utils/slug"
import { getPostDate } from "src/libs/utils"

const postsCache = createTtlCache<TPosts>(NOTION_CACHE_TTL_MS)

/** All rows of the Notion posts database, newest first (unfiltered). */
export const getPosts = () => postsCache("posts", fetchPosts)

const fetchPosts = async (): Promise<TPosts> => {
  let id = CONFIG.notionConfig.pageId as string
  if (!id) {
    return []
  }

  const api = new NotionAPI()
  const normalizeValue = (entry: any) => entry?.value?.value ?? entry?.value
  const response = await requestWithRetry(() =>
    api.getPage(id, { fetchCollections: false })
  )

  id = idToUuid(id)
  let block = response.block
  const rootBlock = block?.[id]
  if (!rootBlock) {
    return []
  }

  const blockValue = normalizeValue(rootBlock)
  const rawMetadata = blockValue
  const viewId = rawMetadata?.view_ids?.[0]
  const collectionId = rawMetadata?.collection_id
  const collectionView = normalizeValue(response?.collection_view?.[viewId])

  if (collectionId && viewId && collectionView) {
    const collectionData: any = await requestWithRetry(() =>
      api.getCollectionData(collectionId, viewId, collectionView)
    )

    block = {
      ...block,
      ...(collectionData?.recordMap?.block ?? {}),
    }

    response.collection = {
      ...(response.collection ?? {}),
      ...(collectionData?.recordMap?.collection ?? {}),
    }

    response.collection_view = {
      ...(response.collection_view ?? {}),
      ...(collectionData?.recordMap?.collection_view ?? {}),
    }

    response.notion_user = {
      ...(response.notion_user ?? {}),
      ...(collectionData?.recordMap?.notion_user ?? {}),
    }

    response.collection_query = {
      ...(response.collection_query ?? {}),
      [collectionId]: {
        ...(response.collection_query?.[collectionId] ?? {}),
        [viewId]: collectionData?.result?.reducerResults,
      },
    }
  }

  const schema = normalizeValue(response?.collection?.[collectionId])?.schema
  if (!schema) {
    return []
  }

  if (
    rawMetadata?.type !== "collection_view_page" &&
    rawMetadata?.type !== "collection_view"
  ) {
    return []
  }

  // Order of the select options as arranged in Notion ("Edit property"),
  // so the site lists categories in the same order.
  const optionOrder = (propertyName: string) => {
    const property: any = Object.values(schema).find(
      (value: any) => value?.name === propertyName
    )
    const options: { value: string }[] = property?.options ?? []
    return new Map(options.map((option, index) => [option.value, index]))
  }
  const menuOrder = optionOrder("menu")
  const submenuOrder = optionOrder("submenu")

  const pageIds = getAllPageIds(response)
  const data = []

  for (let i = 0; i < pageIds.length; i++) {
    const pageId = pageIds[i]
    const properties = (await getPageProperties(pageId, block, schema)) || null
    if (!properties) continue

    const pageBlock = block?.[pageId]
    if (!pageBlock?.value) continue

    const pageBlockValue = (pageBlock.value as any)?.value ?? pageBlock.value
    properties.createdTime = new Date(pageBlockValue?.created_time).toString()
    // URL = the Notion "ID" property (auto-increment number, never changes),
    // e.g. /70. Rows without it fall back to a title-based slug.
    const postNumber = properties.ID ? String(properties.ID).trim() : ""
    delete properties.ID
    properties.slug = postNumber || makePostSlug(properties.title ?? "", pageId)

    const menuIndex = menuOrder.get(properties.menu?.[0])
    if (menuIndex !== undefined) properties.menuOrder = menuIndex
    const submenuIndex = submenuOrder.get(properties.submenu?.[0])
    if (submenuIndex !== undefined) properties.submenuOrder = submenuIndex

    if (!properties.updatedAt && pageBlockValue?.last_edited_time) {
      properties.updatedAt = {
        start_date: new Date(pageBlockValue.last_edited_time)
          .toISOString()
          .slice(0, 10),
      }
    }

    data.push(properties)
  }

  data.sort((a: any, b: any) => {
    const dateA = new Date(getPostDate(a))
    const dateB = new Date(getPostDate(b))
    return Number(dateB) - Number(dateA)
  })

  return data as TPosts
}
