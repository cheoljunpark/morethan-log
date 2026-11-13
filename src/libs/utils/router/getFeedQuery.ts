import { ParsedUrlQuery } from "querystring"

export type FeedQuery = {
  menu?: string
  order?: string
  q?: string
  tag?: string
}

const FEED_KEYS: (keyof FeedQuery)[] = ["menu", "order", "q", "tag"]

/**
 * Drops empty values. Next.js writes `undefined` query values as `key=`,
 * so every URL we build goes through this to stay clean.
 */
export const compactQuery = <T extends Record<string, unknown>>(query: T) =>
  Object.fromEntries(
    Object.entries(query).filter(
      ([, value]) => value !== undefined && value !== ""
    )
  ) as Partial<T>

/** The feed filters present in the URL; absent or empty params are omitted. */
const getFeedQuery = (query: ParsedUrlQuery): FeedQuery => {
  const picked: FeedQuery = {}
  FEED_KEYS.forEach((key) => {
    const value = query[key]
    if (typeof value === "string" && value.length > 0) picked[key] = value
  })
  return picked
}

export default getFeedQuery
