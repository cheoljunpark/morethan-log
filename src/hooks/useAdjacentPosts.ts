import { useMemo } from "react"
import usePostQuery from "./usePostQuery"
import usePostsQuery from "./usePostsQuery"

const useAdjacentPosts = () => {
  const currentPost = usePostQuery()
  const posts = usePostsQuery()

  return useMemo(() => {
    if (!currentPost) {
      return {
        previousPost: null,
        nextPost: null,
      }
    }

    const currentIndex = posts.findIndex((post) => post.id === currentPost.id)
    if (currentIndex < 0) {
      return {
        previousPost: null,
        nextPost: null,
      }
    }

    return {
      previousPost: posts[currentIndex + 1] ?? null,
      nextPost: posts[currentIndex - 1] ?? null,
    }
  }, [currentPost, posts])
}

export default useAdjacentPosts
