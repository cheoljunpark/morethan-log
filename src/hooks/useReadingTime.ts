import { estimatePageReadTime } from "notion-utils"
import { useMemo } from "react"
import { PostDetail } from "src/types"

const useReadingTime = (post?: PostDetail | null) => {
  return useMemo(() => {
    if (!post?.recordMap?.block || !post.id) {
      return null
    }

    const pageBlock = post.recordMap.block[post.id]?.value as any
    if (!pageBlock) {
      return null
    }

    const estimate = estimatePageReadTime(pageBlock, post.recordMap)
    return Math.max(1, Math.ceil(estimate.totalReadTimeInMinutes))
  }, [post])
}

export default useReadingTime
