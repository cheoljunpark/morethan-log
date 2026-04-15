import { CONFIG } from "site.config"
import { NotionAPI } from "notion-client"
import { idToUuid } from "notion-utils"

import getAllPageIds from "src/libs/utils/notion/getAllPageIds"
import getPageProperties from "src/libs/utils/notion/getPageProperties"
import { TPosts } from "src/types"
import { requestWithRetry } from "./requestWithRetry"

/**
 * @param {{ includePages: boolean }} - false: posts only / true: include pages
 */

// TODO: react query를 사용해서 처음 불러온 뒤로는 해당데이터만 사용하도록 수정
export const getPosts = async () => {
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
  const collectionValue = normalizeValue(
    Object.values(response?.collection ?? {})[0]
  ) as any
  const collection = collectionValue?.value ?? collectionValue
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

  // Check Type
  if (
    rawMetadata?.type !== "collection_view_page" &&
    rawMetadata?.type !== "collection_view"
  ) {
    return []
  } else {
    // Construct Data
    const pageIds = getAllPageIds(response)
    const data = []
    for (let i = 0; i < pageIds.length; i++) {
      const id = pageIds[i]
      const properties = (await getPageProperties(id, block, schema)) || null
      if (!properties) continue
      // Add fullwidth, createdtime to properties
      const pageBlock = block?.[id]
      if (!pageBlock?.value) continue
      const pageBlockValue = (pageBlock.value as any)?.value ?? pageBlock.value
      properties.createdTime = new Date(
        pageBlockValue?.created_time
      ).toString()
      if (!properties.updatedAt && pageBlockValue?.last_edited_time) {
        properties.updatedAt = {
          start_date: new Date(pageBlockValue.last_edited_time)
            .toISOString()
            .slice(0, 10),
        }
      }
      properties.fullWidth =
        (pageBlockValue?.format as any)?.page_full_width ?? false

      data.push(properties)
    }

    // Sort by date
    data.sort((a: any, b: any) => {
      const dateA: any = new Date(a?.date?.start_date || a.createdTime)
      const dateB: any = new Date(b?.date?.start_date || b.createdTime)
      return dateB - dateA
    })

    const posts = data as TPosts
    return posts
  }
}
