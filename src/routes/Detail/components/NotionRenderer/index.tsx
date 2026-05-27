import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { ExtendedRecordMap } from "notion-types"
import useScheme from "src/hooks/useScheme"

// core styles shared by all of react-notion-x (required)
import "react-notion-x/src/styles.css"

// used for code syntax highlighting (optional)
import "prismjs/themes/prism-tomorrow.css"

// used for rendering equations (optional)

import "katex/dist/katex.min.css"
import { FC, useEffect, useRef } from "react"
import styled from "@emotion/styled"

const _NotionRenderer = dynamic(
  () => import("react-notion-x").then((m) => m.NotionRenderer),
  { ssr: false }
)

const Code = dynamic(() =>
  import("react-notion-x/build/third-party/code").then(async (m) => m.Code)
)

const Collection = dynamic(() =>
  import("react-notion-x/build/third-party/collection").then(
    (m) => m.Collection
  )
)
const Equation = dynamic(() =>
  import("react-notion-x/build/third-party/equation").then((m) => m.Equation)
)
const Pdf = dynamic(
  () => import("react-notion-x/build/third-party/pdf").then((m) => m.Pdf),
  {
    ssr: false,
  }
)
const Modal = dynamic(
  () => import("react-notion-x/build/third-party/modal").then((m) => m.Modal),
  {
    ssr: false,
  }
)

const mapPageUrl = (id?: string) => {
  if (!id) {
    return "https://www.notion.so"
  }

  return "https://www.notion.so/" + id.replace(/-/g, "")
}

type Props = {
  recordMap: ExtendedRecordMap
}

type PrismApi = {
  highlightAllUnder: (container: ParentNode) => void
}

let prismPromise: Promise<PrismApi> | null = null

const loadPrism = () => {
  if (!prismPromise) {
    prismPromise = import("prismjs/prism").then(async (prismModule) => {
      await Promise.all([
        import("prismjs/components/prism-markup-templating.js"),
        import("prismjs/components/prism-markup.js"),
        import("prismjs/components/prism-bash.js"),
        import("prismjs/components/prism-c.js"),
        import("prismjs/components/prism-cpp.js"),
        import("prismjs/components/prism-csharp.js"),
        import("prismjs/components/prism-docker.js"),
        import("prismjs/components/prism-java.js"),
        import("prismjs/components/prism-js-templates.js"),
        import("prismjs/components/prism-coffeescript.js"),
        import("prismjs/components/prism-diff.js"),
        import("prismjs/components/prism-git.js"),
        import("prismjs/components/prism-go.js"),
        import("prismjs/components/prism-kotlin.js"),
        import("prismjs/components/prism-graphql.js"),
        import("prismjs/components/prism-handlebars.js"),
        import("prismjs/components/prism-less.js"),
        import("prismjs/components/prism-makefile.js"),
        import("prismjs/components/prism-markdown.js"),
        import("prismjs/components/prism-objectivec.js"),
        import("prismjs/components/prism-ocaml.js"),
        import("prismjs/components/prism-python.js"),
        import("prismjs/components/prism-reason.js"),
        import("prismjs/components/prism-rust.js"),
        import("prismjs/components/prism-sass.js"),
        import("prismjs/components/prism-scss.js"),
        import("prismjs/components/prism-solidity.js"),
        import("prismjs/components/prism-sql.js"),
        import("prismjs/components/prism-stylus.js"),
        import("prismjs/components/prism-swift.js"),
        import("prismjs/components/prism-wasm.js"),
        import("prismjs/components/prism-yaml.js"),
      ])

      const moduleWithDefault = prismModule as typeof prismModule & {
        default?: PrismApi
      }

      return moduleWithDefault.default || (prismModule as PrismApi)
    })
  }

  return prismPromise
}

const getCodeLanguage = (codeElement: HTMLElement | null) => {
  if (!codeElement) return "code"

  const classNames = codeElement.className.split(" ")
  const languageClass = classNames.find((name) => name.startsWith("language-"))

  if (!languageClass) return "code"

  return languageClass.replace("language-", "") || "code"
}

const copyText = async (text: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textarea = document.createElement("textarea")
  textarea.value = text
  textarea.setAttribute("readonly", "true")
  textarea.style.position = "fixed"
  textarea.style.top = "-9999px"
  textarea.style.opacity = "0"
  document.body.appendChild(textarea)
  textarea.select()
  document.execCommand("copy")
  textarea.remove()
}

const decorateCodeBlocks = (root: ParentNode = document) => {
  if (typeof window === "undefined") return

  const blocks = root.querySelectorAll<HTMLElement>("pre.notion-code")

  blocks.forEach((block) => {
    if (block.dataset.enhanced === "true") return

    const code = block.querySelector<HTMLElement>("code")
    if (!code) return

    const language = getCodeLanguage(code)
    const lineCount = code.innerText.split("\n").length
    const isLongCode = lineCount > 18
    const existingCopy = block.querySelector<HTMLElement>(".notion-code-copy")
    const codeText = code.innerText

    const toolbar = document.createElement("div")
    toolbar.className = "notion-code-toolbar"

    const languageBadge = document.createElement("span")
    languageBadge.className = "notion-code-language"
    languageBadge.innerText = language

    const actions = document.createElement("div")
    actions.className = "notion-code-actions"

    if (existingCopy) {
      existingCopy.remove()
    }

    const copyButton = document.createElement("button")
    copyButton.type = "button"
    copyButton.className = "notion-code-action notion-code-copy-action"
    copyButton.setAttribute("aria-label", "Copy code")
    copyButton.dataset.copied = "false"
    copyButton.onclick = async (event) => {
      event.preventDefault()
      event.stopPropagation()

      try {
        await copyText(codeText)
      } catch {
        return
      }

      copyButton.dataset.copied = "true"
      window.setTimeout(() => {
        copyButton.dataset.copied = "false"
      }, 1200)
    }

    actions.appendChild(copyButton)

    if (isLongCode) {
      block.dataset.collapsed = "true"

      const toggleButton = document.createElement("button")
      toggleButton.type = "button"
      toggleButton.className = "notion-code-action"
      toggleButton.innerText = "Expand"
      toggleButton.onclick = () => {
        const nextCollapsed = block.dataset.collapsed !== "true"
        block.dataset.collapsed = nextCollapsed ? "true" : "false"
        toggleButton.innerText = nextCollapsed ? "Expand" : "Collapse"
      }

      actions.appendChild(toggleButton)
    }

    toolbar.appendChild(languageBadge)
    toolbar.appendChild(actions)
    block.prepend(toolbar)
    block.dataset.enhanced = "true"
  })
}

const getCalloutTone = (callout: HTMLElement) => {
  const iconText =
    callout.querySelector<HTMLElement>(".notion-page-icon-inline")?.innerText || ""
  const text =
    callout.querySelector<HTMLElement>(".notion-callout-text")?.innerText.toLowerCase() || ""

  const source = `${iconText} ${text}`

  if (
    source.includes("주의") ||
    source.includes("warning") ||
    source.includes("warn") ||
    source.includes("⚠") ||
    source.includes("❗")
  ) {
    return "warning"
  }

  if (
    source.includes("실수") ||
    source.includes("pitfall") ||
    source.includes("error") ||
    source.includes("mistake") ||
    source.includes("⛔") ||
    source.includes("🚫")
  ) {
    return "danger"
  }

  if (
    source.includes("팁") ||
    source.includes("tip") ||
    source.includes("추천") ||
    source.includes("💡") ||
    source.includes("✨")
  ) {
    return "tip"
  }

  if (
    source.includes("핵심") ||
    source.includes("요약") ||
    source.includes("정리") ||
    source.includes("summary") ||
    source.includes("key point") ||
    source.includes("📌") ||
    source.includes("✅")
  ) {
    return "key"
  }

  return "default"
}

const decorateCallouts = (root: ParentNode = document) => {
  if (typeof window === "undefined") return

  const callouts = root.querySelectorAll<HTMLElement>(".notion-callout")

  callouts.forEach((callout) => {
    callout.dataset.tone = getCalloutTone(callout)
  })
}

const NotionRenderer: FC<Props> = ({ recordMap }) => {
  const [scheme] = useScheme()
  const wrapperRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const originalLog = console.log
    const originalError = console.error

    console.log = (...args: unknown[]) => {
      const [firstArg] = args
      if (
        typeof firstArg === "string" &&
        firstArg.toLowerCase().includes("missing user")
      ) {
        return
      }

      originalLog(...args)
    }

    console.error = (...args: unknown[]) => {
      const [firstArg] = args

      if (
        typeof firstArg === "string" &&
        firstArg.includes(
          "Warning: Can't perform a React state update on a component that hasn't mounted yet."
        )
      ) {
        return
      }

      originalError(...args)
    }

    return () => {
      console.log = originalLog
      console.error = originalError
    }
  }, [])

  useEffect(() => {
    let animationFrame: number | null = null
    let fallbackTimer: number | null = null
    let hasHighlighted = false
    let isDisposed = false

    const highlightCodeBlocks = async () => {
      const wrapper = wrapperRef.current

      if (
        hasHighlighted ||
        !wrapper ||
        !wrapper.querySelector("pre.notion-code code[class*='language-']")
      ) {
        return
      }

      hasHighlighted = true

      try {
        const Prism = await loadPrism()
        if (!isDisposed && wrapperRef.current) {
          Prism.highlightAllUnder(wrapperRef.current)
        }
      } catch {
        hasHighlighted = false
      }
    }

    const runDecorations = () => {
      animationFrame = null
      const wrapper = wrapperRef.current
      if (!wrapper) return

      decorateCodeBlocks(wrapper)
      decorateCallouts(wrapper)
      void highlightCodeBlocks()
    }

    const scheduleDecorations = () => {
      if (animationFrame !== null) return
      animationFrame = window.requestAnimationFrame(runDecorations)
    }

    scheduleDecorations()

    if (wrapperRef.current) {
      fallbackTimer = window.setTimeout(scheduleDecorations, 250)
    }

    const observer = new MutationObserver(scheduleDecorations)

    if (!wrapperRef.current) {
      return undefined
    }

    observer.observe(wrapperRef.current, {
      childList: true,
      subtree: true,
    })

    return () => {
      isDisposed = true
      if (animationFrame !== null) {
        window.cancelAnimationFrame(animationFrame)
      }
      if (fallbackTimer !== null) {
        window.clearTimeout(fallbackTimer)
      }
      observer.disconnect()
    }
  }, [recordMap])

  return (
    <StyledWrapper ref={wrapperRef}>
      <_NotionRenderer
        darkMode={scheme === "dark"}
        recordMap={recordMap}
        components={{
          Code,
          Collection,
          Equation,
          Modal,
          Pdf,
          nextImage: Image,
          nextLink: Link,
        }}
        mapPageUrl={mapPageUrl}
      />
    </StyledWrapper>
  )
}

export default NotionRenderer

const StyledWrapper = styled.div`
  /* // TODO: why render? */
  .notion-collection-page-properties {
    display: none !important;
  }
  .notion-page {
    padding: 0;
    margin: 0;
    min-height: 0 !important;
    width: 100%;
    max-width: 100%;
  }
  .notion-full-page {
    padding-bottom: 0 !important;
  }
  .notion-page-no-cover,
  .notion-page-has-cover,
  .notion-page-has-cover.notion-page-has-icon.notion-page-has-text-icon,
  .notion-page-has-cover.notion-page-no-icon {
    padding-top: 0 !important;
    margin-top: 0 !important;
  }
  .notion-frame {
    height: auto !important;
    min-height: 0 !important;
  }
  .notion-page-scroller {
    height: auto !important;
    min-height: 0 !important;
    padding-bottom: 0 !important;
  }
  .notion-page-content {
    width: 100%;
    min-height: 0 !important;
  }
  .notion-page-content-has-aside {
    width: 100% !important;
    display: block !important;
  }
  .notion-page-content-inner {
    width: 100%;
    max-width: 100%;
    min-height: 0 !important;
  }
  .notion-aside {
    display: none !important;
  }
  .notion-list {
    width: 100%;
  }
  .notion-callout {
    margin: 0.95rem 0 !important;
    padding: 1rem 1rem 1rem 0.9rem !important;
    border: 1px solid ${({ theme }) => theme.colors.gray6} !important;
    border-radius: 1rem !important;
    background-color: ${({ theme }) =>
      theme.scheme === "light" ? "rgba(246, 248, 252, 0.94)" : "rgba(29, 36, 48, 0.92)"} !important;
    box-shadow: 0 10px 20px -18px rgba(0, 0, 0, 0.18);
  }
  .notion-callout[data-tone="key"] {
    border-color: rgba(59, 130, 246, 0.28) !important;
    background: linear-gradient(
      135deg,
      rgba(59, 130, 246, 0.14),
      rgba(37, 99, 235, 0.04)
    ) !important;
  }
  .notion-callout[data-tone="tip"] {
    border-color: rgba(16, 185, 129, 0.28) !important;
    background: linear-gradient(
      135deg,
      rgba(16, 185, 129, 0.14),
      rgba(5, 150, 105, 0.04)
    ) !important;
  }
  .notion-callout[data-tone="warning"] {
    border-color: rgba(245, 158, 11, 0.3) !important;
    background: linear-gradient(
      135deg,
      rgba(245, 158, 11, 0.14),
      rgba(217, 119, 6, 0.04)
    ) !important;
  }
  .notion-callout[data-tone="danger"] {
    border-color: rgba(239, 68, 68, 0.3) !important;
    background: linear-gradient(
      135deg,
      rgba(239, 68, 68, 0.14),
      rgba(220, 38, 38, 0.04)
    ) !important;
  }
  .notion-callout .notion-page-icon-inline {
    width: 2rem !important;
    height: 2rem !important;
    line-height: 2rem !important;
    font-size: 1.15rem !important;
    margin-right: 0.2rem !important;
  }
  .notion-callout-text {
    margin-left: 0.7rem !important;
    color: ${({ theme }) => theme.colors.gray12};
    line-height: 1.75rem;
  }
  .notion-callout-text b,
  .notion-callout-text strong {
    color: ${({ theme }) => theme.colors.gray12};
  }
  .notion-code {
    overflow: hidden;
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    border-radius: 1rem;
    background-color: ${({ theme }) =>
      theme.scheme === "light" ? "rgba(245, 247, 251, 0.94)" : "rgba(21, 28, 38, 0.92)"};
  }
  .notion-code-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.75rem;
    padding: 0.2rem 0.56rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray6};
    background-color: ${({ theme }) =>
      theme.scheme === "light" ? "rgba(238, 242, 248, 0.96)" : "rgba(26, 34, 46, 0.96)"};
  }
  .notion-code-language {
    display: inline-flex;
    align-items: center;
    min-height: 0.95rem;
    padding: 0 0.3rem;
    border-radius: 9999px;
    background-color: ${({ theme }) => theme.colors.gray3};
    color: ${({ theme }) => theme.colors.gray10};
    font-size: 0.72rem;
    line-height: 1rem;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }
  .notion-code-actions {
    display: inline-flex;
    gap: 0.45rem;
    align-items: center;
  }
  .notion-code-copy {
    position: static !important;
    display: inline-flex;
    align-items: center;
  }
  .notion-code-copy-button {
    position: static !important;
    transform: none !important;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 1.75rem;
    min-height: 1.75rem;
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    border-radius: 9999px;
    color: ${({ theme }) => theme.colors.gray10};
    background-color: transparent;
  }
  .notion-code-copy-tooltip {
    position: static !important;
    margin-left: 0.35rem;
    transform: none !important;
  }
  .notion-code-action {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    min-height: 1.16rem;
    padding: 0.06rem 0.4rem;
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    border-radius: 9999px;
    background-color: transparent;
    color: ${({ theme }) => theme.colors.gray10};
    font-size: 0.72rem;
    line-height: 1rem;
    font-weight: 600;
    cursor: pointer;

    &:hover {
      background-color: ${({ theme }) => theme.colors.gray3};
      color: ${({ theme }) => theme.colors.gray12};
    }
  }
  .notion-code-copy-action {
    width: 1.25rem;
    min-width: 1.25rem;
    height: 1.25rem;
    min-height: 1.25rem;
    padding: 0;

    &::before {
      content: "";
      width: 0.68rem;
      height: 0.68rem;
      background-color: currentColor;
      mask: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='9' y='9' width='13' height='13' rx='2' ry='2'/%3E%3Cpath d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'/%3E%3C/svg%3E")
        center / contain no-repeat;
      -webkit-mask: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='9' y='9' width='13' height='13' rx='2' ry='2'/%3E%3Cpath d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'/%3E%3C/svg%3E")
        center / contain no-repeat;
    }

    &[data-copied="true"] {
      color: ${({ theme }) =>
        theme.scheme === "light" ? "#0f766e" : "#5eead4"};
      border-color: ${({ theme }) =>
        theme.scheme === "light"
          ? "rgba(15, 118, 110, 0.28)"
          : "rgba(94, 234, 212, 0.28)"};
    }

    &[data-copied="true"]::before {
      mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 6 9 17l-5-5'/%3E%3C/svg%3E");
      -webkit-mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 6 9 17l-5-5'/%3E%3C/svg%3E");
    }
  }
  .notion-code pre {
    overflow-x: auto !important;
    overflow-y: hidden !important;
    scrollbar-width: none;
  }
  pre.notion-code {
    margin: 0 !important;
    padding: 0 !important;
    max-height: none;
  }
  pre.notion-code[data-collapsed="true"] code {
    max-height: 22rem;
    display: block;
    overflow: hidden;
  }
  pre.notion-code code {
    display: block;
    padding: 0.95rem 1rem 1rem !important;
  }
  .notion-code pre::-webkit-scrollbar {
    width: 0;
    height: 0;
  }
  .notion-code code {
    overflow-wrap: normal;
    word-break: normal;
  }
`
