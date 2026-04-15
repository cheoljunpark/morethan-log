import { idToUuid } from "notion-utils"
import { ExtendedRecordMap, ID } from "notion-types"

export default function getAllPageIds(
  response: ExtendedRecordMap,
  viewId?: string
) {
  const collectionQuery = response?.collection_query
  const views = collectionQuery
    ? (Object.values(collectionQuery)[0] as Record<string, any> | undefined)
    : undefined

  let pageIds: ID[] = []
  if (viewId && views) {
    const vId = idToUuid(viewId)
    pageIds = views[vId]?.blockIds ?? []
  } else if (views) {
    const pageSet = new Set<ID>()
    // * type not exist
    Object.values(views).forEach((view: any) => {
      view?.collection_group_results?.blockIds?.forEach((id: ID) =>
        pageSet.add(id)
      )
      view?.blockIds?.forEach((id: ID) => pageSet.add(id))
    })
    pageIds = [...pageSet]
  }

  if (pageIds.length) {
    return pageIds
  }

  const collectionIds = new Set(
    Object.keys(response?.collection ?? {}).map((id) => idToUuid(id))
  )
  const fallbackPageIds = new Set<ID>()

  Object.entries(response?.block ?? {}).forEach(([blockId, blockData]: any) => {
    const blockValue = blockData?.value ?? blockData
    if (!blockValue) return

    const isCollectionChild =
      blockValue.parent_table === "collection" &&
      collectionIds.has(idToUuid(blockValue.parent_id))
    const isPageLike =
      blockValue.type === "page" || blockValue.type === "collection_view_page"

    if (isCollectionChild && isPageLike) {
      fallbackPageIds.add(blockId as ID)
    }
  })

  return [...fallbackPageIds]
}
