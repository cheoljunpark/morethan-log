import { useEffect, useRef, useState } from "react"

const useReadingProgress = (targetId: string) => {
  const [progress, setProgress] = useState(0)
  const progressRef = useRef(0)

  useEffect(() => {
    if (typeof window === "undefined") return
    let frame: number | null = null

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

      if (Math.abs(progressRef.current - nextProgress) < 0.5) {
        return
      }

      progressRef.current = nextProgress
      setProgress(nextProgress)
    }

    const scheduleUpdate = () => {
      if (frame !== null) return

      frame = window.requestAnimationFrame(() => {
        frame = null
        updateProgress()
      })
    }

    updateProgress()
    window.addEventListener("scroll", scheduleUpdate, { passive: true })
    window.addEventListener("resize", scheduleUpdate)

    return () => {
      if (frame !== null) {
        window.cancelAnimationFrame(frame)
      }

      window.removeEventListener("scroll", scheduleUpdate)
      window.removeEventListener("resize", scheduleUpdate)
    }
  }, [targetId])

  return progress
}

export default useReadingProgress
