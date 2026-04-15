import { ParsedUrlQuery } from "querystring"

type FeedQuery = {
  category?: string
  order?: string
  q?: string
  tag?: string
}

const getFeedQuery = (query: ParsedUrlQuery): FeedQuery => {
  const toStringValue = (value: string | string[] | undefined) =>
    typeof value === "string" && value.length > 0 ? value : undefined

  return {
    category: toStringValue(query.category),
    order: toStringValue(query.order),
    q: toStringValue(query.q),
    tag: toStringValue(query.tag),
  }
}

export default getFeedQuery
