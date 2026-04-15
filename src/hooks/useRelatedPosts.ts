import { useMemo } from "react"
import usePostQuery from "./usePostQuery"
import usePostsQuery from "./usePostsQuery"

const useRelatedPosts = () => {
  const currentPost = usePostQuery()
  const posts = usePostsQuery()

  return useMemo(() => {
    if (!currentPost) return []

    const currentTags = new Set(currentPost.tags || [])
    const currentCategory = currentPost.category?.[0]
    const currentSeries = currentPost.series?.[0]

    return posts
      .filter((post) => post.id !== currentPost.id)
      .map((post) => {
        const sharedTags = (post.tags || []).filter((tag) =>
          currentTags.has(tag)
        ).length
        const sameCategory =
          currentCategory && post.category?.includes(currentCategory) ? 2 : 0
        const sameSeries =
          currentSeries && post.series?.[0] === currentSeries ? 4 : 0

        return {
          post,
          score: sharedTags * 2 + sameCategory + sameSeries,
        }
      })
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3)
      .map((item) => item.post)
  }, [currentPost, posts])
}

export default useRelatedPosts
