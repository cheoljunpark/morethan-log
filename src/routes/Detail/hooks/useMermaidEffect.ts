import { useEffect, useRef } from "react"
import useScheme from "src/hooks/useScheme"

/**
 *  Wait for mermaid to be defined in the dom
 *  Additionally, verify that the HTML CollectionOf has an array value.
 */
const waitForMermaidElements = (interval = 100, timeout = 5000) => {
  return new Promise<HTMLCollectionOf<Element>>((resolve) => {
    const startTime = Date.now()
    const elements: HTMLCollectionOf<Element> =
      document.getElementsByClassName("language-mermaid")

    const checkMerMaidCode = () => {
      if (elements.length > 0) {
        resolve(elements)
      } else if (Date.now() - startTime >= timeout) {
        resolve(elements)
      } else {
        setTimeout(checkMerMaidCode, interval)
      }
    }
    checkMerMaidCode()
  })
}
const useMermaidEffect = () => {
  const [scheme] = useScheme()
  const memoMermaid = useRef<Map<number, string>>(new Map())

  useEffect(() => {
    if (typeof document === "undefined") return

    let isCancelled = false

    waitForMermaidElements()
      .then(async (elements) => {
        if (isCancelled || elements.length === 0) return

        const mermaid = (await import("mermaid")).default

        if (isCancelled) return

        mermaid.initialize({
          startOnLoad: true,
          theme: scheme === "dark" ? "dark" : "default",
        })

        const promises = Array.from(elements)
          .filter((elements) => elements.tagName === "PRE")
          .map(async (element, i) => {
            if (memoMermaid.current.get(i) !== undefined) {
              const svg = await mermaid
                .render("mermaid" + i, memoMermaid.current.get(i) || "")
                .then((res) => res.svg)
              element.animate(
                [
                  { easing: "ease-in", opacity: 0 },
                  { easing: "ease-out", opacity: 1 },
                ],
                { duration: 300, fill: "both" }
              )
              element.innerHTML = svg
              return
            }
            const svg = await mermaid
              .render("mermaid" + i, element.textContent || "")
              .then((res) => res.svg)
            memoMermaid.current.set(i, element.textContent ?? "")
            element.innerHTML = svg
          })
        await Promise.all(promises)
      })

    return () => {
      isCancelled = true
    }
  }, [scheme])

  return
}

export default useMermaidEffect
