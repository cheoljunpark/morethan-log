type RecordMapGroup = Record<string, any> | undefined

const normalizeEntry = (entry: any) => {
  if (!entry) return entry

  return {
    ...entry,
    value: entry?.value?.value ?? entry?.value,
  }
}

const normalizeGroup = (group: RecordMapGroup) => {
  if (!group) return group

  return Object.fromEntries(
    Object.entries(group).map(([key, value]) => [key, normalizeEntry(value)])
  )
}

export const normalizeRecordMap = (recordMap: any) => {
  if (!recordMap) return recordMap

  return {
    ...recordMap,
    block: normalizeGroup(recordMap.block),
    collection: normalizeGroup(recordMap.collection),
    collection_view: normalizeGroup(recordMap.collection_view),
    notion_user: normalizeGroup(recordMap.notion_user),
  }
}
