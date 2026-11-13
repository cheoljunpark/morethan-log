import { useMemo } from "react"
import usePostsQuery from "src/hooks/usePostsQuery"
import { filterPosts } from "src/libs/utils/notion"

export type CountedItem = { name: string; count: number }

const countBy = (values: string[]): CountedItem[] => {
  const counts = new Map<string, number>()
  values.forEach((value) => counts.set(value, (counts.get(value) ?? 0) + 1))
  return Array.from(counts, ([name, count]) => ({ name, count })).sort(
    (a, b) => b.count - a.count
  )
}

/** Category (menu) and tag counts over the public posts, most used first. */
const usePostTaxonomy = () => {
  const posts = usePostsQuery()

  return useMemo(() => {
    const publicPosts = filterPosts(posts)
    return {
      total: publicPosts.length,
      menus: countBy(
        publicPosts.flatMap((post) => post.menu?.slice(0, 1) ?? [])
      ),
      tags: countBy(publicPosts.flatMap((post) => post.tags ?? [])),
    }
  }, [posts])
}

export default usePostTaxonomy
