import usePostQuery from "./usePostQuery"
import usePostsQuery from "./usePostsQuery"

const useSeriesPosts = () => {
  const post = usePostQuery()
  const posts = usePostsQuery()
  const currentSeries = post?.series?.[0]

  if (!post || !currentSeries) {
    return {
      currentSeries: null,
      currentIndex: -1,
      seriesPosts: [],
      totalCount: 0,
    }
  }

  const seriesPosts = posts.filter(
    (item) => item.series?.[0] === currentSeries && item.type?.[0] === "Post"
  )
  const currentIndex = seriesPosts.findIndex((item) => item.id === post.id)

  return {
    currentSeries,
    currentIndex,
    seriesPosts,
    totalCount: seriesPosts.length,
  }
}

export default useSeriesPosts
