import { NotionAPI } from "notion-client"
import { requestWithRetry } from "./requestWithRetry"

export const getRecordMap = async (pageId: string) => {
  const api = new NotionAPI()
  const recordMap = await requestWithRetry(() => api.getPage(pageId))
  return recordMap
}
