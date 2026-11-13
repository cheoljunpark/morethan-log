import { useEffect, useLayoutEffect } from "react"
import { storageKey } from "src/constants/storage"
import { clearFeedPosition } from "src/libs/utils/feedScroll"

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect

/**
 * Returns the reader to where they left the feed after visiting a post (see
 * libs/utils/feedScroll). Runs once when the feed mounts, then forgets the
 * position, so changing filters or sort order never jumps the page.
 * A layout effect restores before paint, so the list never has to be hidden.
 */
const useFeedScrollRestoration = () => {
  useIsomorphicLayoutEffect(() => {
    const activePostId = window.sessionStorage.getItem(
      storageKey.feedActivePostId
    )
    const savedScrollY = window.sessionStorage.getItem(storageKey.feedScrollY)
    clearFeedPosition()

    const target =
      activePostId &&
      document.querySelector<HTMLElement>(`[data-post-id="${activePostId}"]`)
    if (target) {
      const targetTop =
        target.getBoundingClientRect().top + window.scrollY - 120
      window.scrollTo({ top: Math.max(0, targetTop), behavior: "auto" })
    } else if (savedScrollY) {
      window.scrollTo({ top: Number(savedScrollY), behavior: "auto" })
    }
  }, [])
}

export default useFeedScrollRestoration
