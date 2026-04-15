import { useLayoutEffect, useState } from "react"
import { storageKey } from "src/constants/storage"

const useFeedScrollRestoration = (dependencyKey: string) => {
  const [isRestored, setIsRestored] = useState(false)

  useLayoutEffect(() => {
    if (typeof window === "undefined") return

    setIsRestored(false)

    const restore = () => {
      const activePostId = window.sessionStorage.getItem(storageKey.feedActivePostId)
      const savedScrollY = window.sessionStorage.getItem(storageKey.feedScrollY)

      if (activePostId) {
        const target = document.querySelector(
          `[data-post-id="${activePostId}"]`
        ) as HTMLElement | null

        if (target) {
          const targetTop =
            target.getBoundingClientRect().top + window.scrollY - 120
          window.scrollTo({ top: Math.max(0, targetTop), behavior: "auto" })
          setIsRestored(true)
          return
        }
      }

      if (savedScrollY) {
        window.scrollTo({ top: Number(savedScrollY), behavior: "auto" })
      }

      setIsRestored(true)
    }

    const frame = window.requestAnimationFrame(restore)
    return () => window.cancelAnimationFrame(frame)
  }, [dependencyKey])

  return isRestored
}

export default useFeedScrollRestoration
