import { useEffect } from "react"

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9ㄱ-ㆎ가-힣\s-]/g, "")
    .replace(/\s+/g, "-")

/**
 * Gives every heading inside `containerId` a stable id so `#section` links
 * work, and offsets it below the sticky header when scrolled to. Re-runs as
 * the Notion content renders (it arrives after hydration).
 */
const useHeadingAnchors = (containerId: string) => {
  useEffect(() => {
    const container = document.getElementById(containerId)
    if (!container) return
    let timer: number | null = null

    const assignIds = () => {
      timer = null
      container
        .querySelectorAll<HTMLElement>("h1, h2, h3")
        .forEach((heading, index) => {
          const text = heading.textContent?.trim()
          if (!text) return
          if (!heading.id)
            heading.id = `${slugify(text) || "section"}-${index + 1}`
          heading.style.scrollMarginTop = "5.5rem"
        })
    }

    // setTimeout (not requestAnimationFrame) so this also runs in background
    // tabs, where animation frames are paused.
    const schedule = () => {
      if (timer === null) timer = window.setTimeout(assignIds, 0)
    }

    schedule()
    const observer = new MutationObserver(schedule)
    observer.observe(container, { childList: true, subtree: true })

    return () => {
      if (timer !== null) window.clearTimeout(timer)
      observer.disconnect()
    }
  }, [containerId])
}

export default useHeadingAnchors
