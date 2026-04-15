import { useEffect, useMemo, useState } from "react"

type TocItem = {
  id: string
  level: number
  text: string
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\u3131-\u318e\uac00-\ud7a3\s-]/g, "")
    .replace(/\s+/g, "-")

const usePostToc = (containerId: string) => {
  const [items, setItems] = useState<TocItem[]>([])
  const [activeId, setActiveId] = useState("")

  useEffect(() => {
    if (typeof window === "undefined") return

    const container = document.getElementById(containerId)
    if (!container) return

    const syncHeadings = () => {
      const headings = Array.from(
        container.querySelectorAll("h1, h2, h3")
      ) as HTMLElement[]

      const nextItems = headings
        .map((heading, index) => {
          const text = heading.textContent?.trim()
          if (!text) return null

          if (!heading.id) {
            heading.id = `${slugify(text) || "section"}-${index + 1}`
          }

          const level = Number(heading.tagName.replace("H", ""))

          return {
            id: heading.id,
            level,
            text,
          }
        })
        .filter(Boolean) as TocItem[]

      setItems(nextItems)
    }

    syncHeadings()

    const observer = new MutationObserver(() => {
      syncHeadings()
    })

    observer.observe(container, {
      childList: true,
      subtree: true,
    })

    return () => observer.disconnect()
  }, [containerId])

  useEffect(() => {
    if (typeof window === "undefined" || items.length === 0) return

    const headings = items
      .map((item) => document.getElementById(item.id))
      .filter(Boolean) as HTMLElement[]

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              (a.target as HTMLElement).offsetTop -
              (b.target as HTMLElement).offsetTop
          )

        if (visibleEntries[0]) {
          setActiveId(visibleEntries[0].target.id)
        }
      },
      {
        rootMargin: "0px 0px -70% 0px",
        threshold: 0.1,
      }
    )

    headings.forEach((heading) => observer.observe(heading))

    return () => observer.disconnect()
  }, [items])

  return useMemo(
    () => ({
      items,
      activeId,
    }),
    [activeId, items]
  )
}

export default usePostToc
