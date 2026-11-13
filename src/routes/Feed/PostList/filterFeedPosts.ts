import { TPost } from "src/types"

export type FeedFilter = {
  q?: string
  tag?: string
  menu?: string
  order?: string
}

const searchableText = (post: TPost) =>
  [post.title, post.summary, ...(post.tags ?? []), ...(post.menu ?? [])]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()

/** Applies the feed's URL filters. Posts arrive newest-first; order=asc reverses them. */
export const filterFeedPosts = (
  posts: TPost[],
  filter: FeedFilter
): TPost[] => {
  const query = filter.q?.trim().toLowerCase()

  const matched = posts.filter(
    (post) =>
      (!filter.tag || post.tags?.includes(filter.tag)) &&
      (!filter.menu || post.menu?.includes(filter.menu)) &&
      (!query || searchableText(post).includes(query))
  )

  return filter.order === "asc" ? matched.reverse() : matched
}
