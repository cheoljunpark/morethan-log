import { useMemo } from "react"
import usePostsQuery from "src/hooks/usePostsQuery"
import { filterPosts } from "src/libs/utils/notion"

export type CountedItem = { name: string; count: number }
export type MenuItem = CountedItem & { submenus: CountedItem[] }
type RankedItem = CountedItem & { order?: number }

const byCountDesc = (a: CountedItem, b: CountedItem) => b.count - a.count

/** Notion option order first; anything without one goes last, by count. */
const byNotionOrder = (a: RankedItem, b: RankedItem) =>
  (a.order ?? Infinity) - (b.order ?? Infinity) || byCountDesc(a, b)

const toSortedItems = (map: Map<string, number>): CountedItem[] =>
  Array.from(map, ([name, count]) => ({ name, count })).sort(byCountDesc)

const toRankedItems = (
  map: Map<string, { count: number; order?: number }>
): CountedItem[] =>
  Array.from(map, ([name, { count, order }]) => ({ name, count, order }))
    .sort(byNotionOrder)
    .map(({ name, count }) => ({ name, count }))

/**
 * Category (menu → submenu) and tag counts over the public posts. Categories
 * follow the option order set in Notion; tags are sorted by count.
 */
const usePostTaxonomy = () => {
  const posts = usePostsQuery()

  return useMemo(() => {
    const publicPosts = filterPosts(posts)
    const menus = new Map<
      string,
      {
        count: number
        order?: number
        submenus: Map<string, { count: number; order?: number }>
      }
    >()
    const tags = new Map<string, number>()

    publicPosts.forEach((post) => {
      const menu = post.menu?.[0]
      if (menu) {
        const entry = menus.get(menu) ?? {
          count: 0,
          order: post.menuOrder,
          submenus: new Map(),
        }
        entry.count += 1
        const submenu = post.submenu?.[0]
        if (submenu) {
          const sub = entry.submenus.get(submenu) ?? {
            count: 0,
            order: post.submenuOrder,
          }
          sub.count += 1
          entry.submenus.set(submenu, sub)
        }
        menus.set(menu, entry)
      }
      post.tags?.forEach((tag) => tags.set(tag, (tags.get(tag) ?? 0) + 1))
    })

    const menuItems: MenuItem[] = Array.from(
      menus,
      ([name, { count, order, submenus }]) => ({
        name,
        count,
        order,
        submenus: toRankedItems(submenus),
      })
    )
      .sort(byNotionOrder)
      .map(({ name, count, submenus }) => ({ name, count, submenus }))

    return {
      menus: menuItems,
      tags: toSortedItems(tags),
    }
  }, [posts])
}

export default usePostTaxonomy
