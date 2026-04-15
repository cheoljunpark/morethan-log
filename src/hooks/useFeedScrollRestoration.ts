import { useEffect } from "react"
import { storageKey } from "src/constants/storage"

const useFeedScrollRestoration = (dependencyKey: string) => {
  useEffect(() => {
    if (typeof window === "undefined") return

    const restore = () => {
      const activePostId = window.sessionStorage.getItem(storageKey.feedActivePostId)
      const savedScrollY = window.sessionStorage.getItem(storageKey.feedScrollY)

      if (activePostId) {
        const target = document.querySelector(
          `[data-post-id="${activePostId}"]`
        ) as HTMLElement | null

        if (target) {
          target.scrollIntoView({ block: "center" })
          return
        }
      }

      if (savedScrollY) {
        window.scrollTo({ top: Number(savedScrollY), behavior: "auto" })
      }
    }

    const timer = window.setTimeout(restore, 50)
    return () => window.clearTimeout(timer)
  }, [dependencyKey])
}

export default useFeedScrollRestoration
