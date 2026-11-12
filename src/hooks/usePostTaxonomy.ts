import { useMemo } from "react"
import usePostsQuery from "src/hooks/usePostsQuery"
import { filterPosts } from "src/libs/utils/notion"

export type CountedItem = { name: string; count: number }
export type MenuItem = CountedItem & { submenus: CountedItem[] }

const byCountDesc = (a: CountedItem, b: CountedItem) => b.count - a.count

const toSortedItems = (map: Map<string, number>): CountedItem[] =>
  Array.from(map, ([name, count]) => ({ name, count })).sort(byCountDesc)

/** Category (menu → submenu) and tag counts over the public posts. */
const usePostTaxonomy = () => {
  const posts = usePostsQuery()

  return useMemo(() => {
    const publicPosts = filterPosts(posts)
    const menus = new Map<string, { count: number; submenus: Map<string, number> }>()
    const tags = new Map<string, number>()

    publicPosts.forEach((post) => {
      const menu = post.menu?.[0]
      if (menu) {
        const entry = menus.get(menu) ?? { count: 0, submenus: new Map() }
        entry.count += 1
        const submenu = post.submenu?.[0]
        if (submenu) entry.submenus.set(submenu, (entry.submenus.get(submenu) ?? 0) + 1)
        menus.set(menu, entry)
      }
      post.tags?.forEach((tag) => tags.set(tag, (tags.get(tag) ?? 0) + 1))
    })

    const menuItems: MenuItem[] = Array.from(menus, ([name, { count, submenus }]) => ({
      name,
      count,
      submenus: toSortedItems(submenus),
    })).sort(byCountDesc)

    return {
      total: publicPosts.length,
      menus: menuItems,
      tags: toSortedItems(tags),
    }
  }, [posts])
}

export default usePostTaxonomy
