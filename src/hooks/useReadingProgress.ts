import { useEffect, useState } from "react"

const useReadingProgress = (targetId: string) => {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (typeof window === "undefined") return

    const updateProgress = () => {
      const target = document.getElementById(targetId)
      if (!target) return

      const rect = target.getBoundingClientRect()
      const scrollTop = window.scrollY
      const targetTop = rect.top + scrollTop
      const targetHeight = target.offsetHeight
      const viewportHeight = window.innerHeight
      const distance = Math.max(targetHeight - viewportHeight, 1)
      const rawProgress = ((scrollTop - targetTop) / distance) * 100
      const nextProgress = Math.min(100, Math.max(0, rawProgress))

      setProgress(nextProgress)
    }

    updateProgress()
    window.addEventListener("scroll", updateProgress, { passive: true })
    window.addEventListener("resize", updateProgress)

    return () => {
      window.removeEventListener("scroll", updateProgress)
      window.removeEventListener("resize", updateProgress)
    }
  }, [targetId])

  return progress
}

export default useReadingProgress
