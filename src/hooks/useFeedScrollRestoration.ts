import { useEffect, useLayoutEffect } from "react"
import { storageKey } from "src/constants/storage"

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect

/**
 * Returns the reader to where they left the feed (see libs/utils/feedScroll).
 * Runs in a layout effect, before the browser paints, so the list never needs
 * to be hidden while restoring — it stays visible in the server-rendered HTML.
 */
const useFeedScrollRestoration = (dependencyKey: string) => {
  useIsomorphicLayoutEffect(() => {
    const activePostId = window.sessionStorage.getItem(storageKey.feedActivePostId)
    const savedScrollY = window.sessionStorage.getItem(storageKey.feedScrollY)

    if (activePostId) {
      const target = document.querySelector<HTMLElement>(`[data-post-id="${activePostId}"]`)
      if (target) {
        const targetTop = target.getBoundingClientRect().top + window.scrollY - 120
        window.scrollTo({ top: Math.max(0, targetTop), behavior: "auto" })
        return
      }
    }

    if (savedScrollY) {
      window.scrollTo({ top: Number(savedScrollY), behavior: "auto" })
    }
  }, [dependencyKey])
}

export default useFeedScrollRestoration
