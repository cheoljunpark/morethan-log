import { ParsedUrlQuery } from "querystring"

type FeedQuery = {
  category?: string
  menu?: string
  order?: string
  q?: string
  submenu?: string
  tag?: string
}

const getFeedQuery = (query: ParsedUrlQuery): FeedQuery => {
  const toStringValue = (value: string | string[] | undefined) =>
    typeof value === "string" && value.length > 0 ? value : undefined

  return {
    category: toStringValue(query.category),
    menu: toStringValue(query.menu),
    order: toStringValue(query.order),
    q: toStringValue(query.q),
    submenu: toStringValue(query.submenu),
    tag: toStringValue(query.tag),
  }
}

export default getFeedQuery
