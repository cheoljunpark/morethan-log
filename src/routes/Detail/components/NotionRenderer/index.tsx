import dynamic from "next/dynamic"
import Image from "next/image"
import Link from "next/link"
import { ExtendedRecordMap } from "notion-types"
// Rendered on the server too, so the post body is in the HTML (first paint, SEO).
import { NotionRenderer as _NotionRenderer } from "react-notion-x"
import useScheme from "src/hooks/useScheme"

// core styles shared by all of react-notion-x (required)
import "react-notion-x/src/styles.css"

// Syntax colors come from this file's own light/dark token styles below.

// used for rendering equations (optional)

import "katex/dist/katex.min.css"
import { FC, useEffect, useRef } from "react"
import styled from "@emotion/styled"
import { Theme } from "@emotion/react"

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

// Notion callout background color → tone, so the color picked in Notion
// maps onto the blog's palette.
const BACKGROUND_TONES: [string, string][] = [
  ["blue", "key"],
  ["purple", "key"],
  ["green", "tip"],
  ["yellow", "warning"],
  ["orange", "warning"],
  ["brown", "warning"],
  ["red", "danger"],
  ["pink", "danger"],
]

const getCalloutTone = (callout: HTMLElement) => {
  const background = Array.from(callout.classList).find((name) =>
    name.includes("_background")
  )
  const fromColor = background
    ? BACKGROUND_TONES.find(([color]) => background.includes(color))
    : undefined
  if (fromColor) return fromColor[1]

  const iconText =
    callout.querySelector<HTMLElement>(".notion-page-icon-inline")?.innerText ||
    ""
  const text =
    callout
      .querySelector<HTMLElement>(".notion-callout-text")
      ?.innerText.toLowerCase() || ""

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

/** Click an image to see it full size; click, Esc or scroll closes it. */
const openImageViewer = (image: HTMLImageElement) => {
  const overlay = document.createElement("div")
  overlay.setAttribute("role", "dialog")
  overlay.setAttribute("aria-label", image.alt || "Image")
  Object.assign(overlay.style, {
    position: "fixed",
    inset: "0",
    zIndex: "100",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "4vmin",
    background: "rgba(0, 0, 0, 0)",
    backdropFilter: "blur(8px)",
    cursor: "zoom-out",
    transition: "background 200ms ease",
  })

  const full = document.createElement("img")
  full.src = image.currentSrc || image.src
  full.alt = image.alt
  Object.assign(full.style, {
    maxWidth: "100%",
    maxHeight: "100%",
    borderRadius: "12px",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.35)",
    transform: "scale(0.96)",
    opacity: "0",
    transition: "transform 220ms ease, opacity 220ms ease",
  })
  overlay.appendChild(full)
  document.body.appendChild(overlay)

  requestAnimationFrame(() => {
    overlay.style.background = "rgba(0, 0, 0, 0.82)"
    full.style.transform = "scale(1)"
    full.style.opacity = "1"
  })

  const close = () => {
    window.removeEventListener("keydown", onKey)
    window.removeEventListener("scroll", close)
    overlay.style.background = "rgba(0, 0, 0, 0)"
    full.style.opacity = "0"
    window.setTimeout(() => overlay.remove(), 200)
  }
  const onKey = (event: KeyboardEvent) => {
    if (event.key === "Escape") close()
  }
  overlay.addEventListener("click", close)
  window.addEventListener("keydown", onKey)
  window.addEventListener("scroll", close, { once: true })
}

const decorateImages = (root: ParentNode = document) => {
  root
    .querySelectorAll<HTMLImageElement>(".notion-asset-wrapper-image img")
    .forEach((image) => {
      if (image.dataset.zoomable === "true") return
      image.dataset.zoomable = "true"
      image.addEventListener("click", (event) => {
        // Images that link somewhere keep their link.
        if (image.closest("a")) return
        event.preventDefault()
        openImageViewer(image)
      })
    })
}

const NotionRenderer: FC<Props> = ({ recordMap }) => {
  const [scheme] = useScheme()
  const wrapperRef = useRef<HTMLDivElement | null>(null)

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
      decorateImages(wrapper)
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

type ThemeProps = { theme: Theme }

/** Picks a value by color scheme inside the styled template. */
const pick =
  (light: string, dark: string) =>
  ({ theme }: ThemeProps) =>
    theme.scheme === "light" ? light : dark

// Notion's text/background colors, tuned to stay readable in both schemes:
// name, light text, dark text, light background, dark background.
const NOTION_COLORS: [string, string, string, string, string][] = [
  ["gray", "#6e6e73", "#a1a1a6", "#f0f0f2", "#2a2a2c"],
  ["brown", "#8a5a3c", "#d0a585", "#f6efe9", "#3a2d25"],
  ["orange", "#c4540a", "#ffa159", "#fdf0e6", "#3d2a1b"],
  ["yellow", "#a3740a", "#f4c95d", "#fdf6dc", "#3a3218"],
  ["green", "#2f7d4f", "#6fcf97", "#eaf6ee", "#1d3326"],
  ["blue", "#0066cc", "#2997ff", "#eef5fd", "#16283d"],
  ["purple", "#7a4bc2", "#bf9cf5", "#f3eefc", "#2c2340"],
  ["pink", "#c03a7e", "#f58bc0", "#fcedf5", "#3c2030"],
  ["red", "#c53030", "#ff7b72", "#fdeeee", "#3d1f1f"],
]

const notionColorRules = ({ theme }: ThemeProps) => {
  const light = theme.scheme === "light"
  return NOTION_COLORS.map(
    ([name, lightText, darkText, lightBg, darkBg]) => `
      .notion-${name} { color: ${light ? lightText : darkText} !important; }
      .notion-${name}_background,
      .notion-${name}_background_co {
        background-color: ${light ? lightBg : darkBg} !important;
      }
    `
  ).join("")
}

const COPY_ICON =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='9' y='9' width='13' height='13' rx='2' ry='2'/%3E%3Cpath d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'/%3E%3C/svg%3E\")"
const CHECK_ICON =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 6 9 17l-5-5'/%3E%3C/svg%3E\")"
const CHEVRON_ICON =
  "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m9 6 6 6-6 6'/%3E%3C/svg%3E\")"
const MONO = `ui-monospace, "SF Mono", Menlo, Consolas, monospace`

const StyledWrapper = styled.div`
  /* Layout: undo react-notion-x's full-page chrome */
  .notion-collection-page-properties,
  .notion-aside {
    display: none !important;
  }
  .notion-page,
  .notion-page-content,
  .notion-page-content-inner {
    width: 100%;
    max-width: 100%;
    min-height: 0 !important;
    margin: 0;
    padding: 0;
  }
  .notion-page-content-has-aside {
    display: block !important;
    width: 100% !important;
  }
  .notion-full-page,
  .notion-page-scroller {
    height: auto !important;
    min-height: 0 !important;
    padding: 0 !important;
  }
  .notion-frame {
    height: auto !important;
    min-height: 0 !important;
  }

  /* Base text */
  .notion {
    font-family: var(--font-text);
    font-size: 17px;
    line-height: 1.8;
    letter-spacing: -0.01em;
    color: ${({ theme }) => theme.colors.gray12};
    word-break: keep-all;
    overflow-wrap: anywhere;
  }
  .notion-text {
    margin: 0.5em 0;
    padding: 0;
  }
  /* Empty Notion lines add only a little air, not a full line. */
  .notion-blank {
    height: 0.4em;
    min-height: 0;
    padding: 0;
  }
  ::selection {
    background: ${pick("rgba(0, 102, 204, 0.16)", "rgba(41, 151, 255, 0.3)")};
  }
  b,
  strong {
    font-weight: 600;
  }

  /* Headings: clear size steps, rule only under H1 */
  .notion-h {
    position: relative;
    padding: 0;
    font-family: var(--font-display);
    font-weight: 600 !important;
    line-height: 1.35;
    letter-spacing: -0.025em;
    color: ${({ theme }) => theme.colors.gray12};
    scroll-margin-top: 5rem;
  }
  .notion-h1 {
    margin: 3.2rem 0 1rem !important;
    padding-bottom: 0.6rem;
    font-size: 1.85rem !important;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray6};
  }
  .notion-h2 {
    margin: 2.6rem 0 0.8rem !important;
    font-size: 1.5rem !important;
  }
  .notion-h3 {
    margin: 2rem 0 0.6rem !important;
    font-size: 1.22rem !important;
  }
  .notion-h4 {
    margin: 1.6rem 0 0.4rem !important;
    font-size: 1.05rem !important;
    color: ${({ theme }) => theme.colors.gray11};
  }
  .notion-hash-link {
    fill: ${({ theme }) => theme.colors.gray8};
  }

  /* Links and inline code: one accent color */
  .notion-link {
    color: ${({ theme }) => theme.colors.indigo9};
    border-bottom: 0 !important;
    text-decoration: underline;
    text-decoration-thickness: 1px;
    text-decoration-color: ${pick(
      "rgba(0, 102, 204, 0.35)",
      "rgba(41, 151, 255, 0.4)"
    )};
    text-underline-offset: 0.22em;
    opacity: 1 !important;
    transition: text-decoration-color 120ms ease;

    &:hover {
      text-decoration-color: currentColor;
    }
  }
  .notion-inline-code {
    padding: 0.15em 0.4em !important;
    border-radius: 6px !important;
    background: ${pick(
      "rgba(0, 102, 204, 0.07)",
      "rgba(41, 151, 255, 0.12)"
    )} !important;
    color: ${({ theme }) => theme.colors.indigo10} !important;
    font-family: ${MONO} !important;
    font-size: 0.85em !important;
    word-break: break-word;
  }

  /* Lists */
  /* react-notion-x wraps each item in its own list, so no list margins. */
  .notion-list {
    width: 100%;
    margin: 0;
    padding-inline-start: 1.4em;
  }
  .notion-list li {
    padding: 0.1em 0 0.1em 0.15em;
  }
  .notion-list .notion-list {
    padding-inline-start: 1.2em;
  }
  .notion-list-disc {
    list-style-type: disc;
  }
  .notion-list-disc .notion-list-disc {
    list-style-type: circle;
  }
  .notion-list-disc .notion-list-disc .notion-list-disc {
    list-style-type: square;
  }
  .notion-list li::marker {
    color: ${({ theme }) => theme.colors.gray8};
  }
  .notion-list-numbered li::marker {
    font-variant-numeric: tabular-nums;
    font-weight: 500;
  }

  /* Checklist */
  .notion-to-do {
    margin: 0.2em 0;
  }
  .notion-to-do-item {
    display: flex;
    align-items: flex-start;
    gap: 0.6em;
    min-height: 0;
  }
  .notion-to-do-item .notion-property-checkbox {
    flex-shrink: 0;
    width: 18px;
    height: 18px;
    margin-top: 0.38em;
    border: 1.5px solid ${({ theme }) => theme.colors.gray8};
    border-radius: 5px;
    background: transparent;
  }
  .notion-property-checkbox-checked {
    border-color: ${({ theme }) => theme.colors.indigo9} !important;
    background: ${({ theme }) => theme.colors.indigo9} !important;
  }
  .notion-property-checkbox-checked svg {
    fill: #fff;
  }
  .notion-property-checkbox-unchecked > * {
    display: none;
  }
  .notion-to-do-checked {
    color: ${({ theme }) => theme.colors.gray9};
    text-decoration: line-through;
    opacity: 1;
  }

  /* Quote */
  .notion-quote {
    position: relative;
    margin: 1.6em 0 !important;
    padding: 0.2em 0 0.2em 1.2em !important;
    border: 0 !important;
    font-size: 1.06em !important;
    line-height: 1.75;
    color: ${({ theme }) => theme.colors.gray11};

    &::before {
      content: "";
      position: absolute;
      top: 0.25em;
      bottom: 0.25em;
      left: 0;
      width: 3px;
      border-radius: 3px;
      background: ${({ theme }) => theme.colors.indigo9};
    }
  }

  /* Divider */
  /* Divider */
  .notion-hr {
    margin: 2.4em 0;
    padding: 0;
    border: 0 !important;
    border-top: 1px solid ${({ theme }) => theme.colors.gray6} !important;
  }

  /* Callouts: soft tinted card, color taken from Notion */
  .notion-callout {
    align-items: flex-start;
    margin: 1.4em 0 !important;
    padding: 1em 1.15em !important;
    border: 0 !important;
    border-radius: 14px !important;
    background: ${({ theme }) => theme.colors.gray4} !important;
  }
  .notion-callout[data-tone="key"] {
    background: ${pick("#eef5fd", "#16283d")} !important;
  }
  .notion-callout[data-tone="tip"] {
    background: ${pick("#eaf6ee", "#1d3326")} !important;
  }
  .notion-callout[data-tone="warning"] {
    background: ${pick("#fdf6dc", "#3a3218")} !important;
  }
  .notion-callout[data-tone="danger"] {
    background: ${pick("#fdeeee", "#3d1f1f")} !important;
  }
  .notion-callout .notion-page-icon-inline {
    width: 1.4rem !important;
    height: 1.4rem !important;
    margin-top: 0.15em;
    font-size: 1.1rem !important;
    line-height: 1.4rem !important;
  }
  .notion-callout-text {
    min-width: 0;
    margin-left: 0.7rem !important;
    line-height: 1.75;
    color: ${({ theme }) => theme.colors.gray12};
  }
  .notion-callout-text > .notion-text:first-of-type {
    margin-top: 0;
  }
  .notion-callout-text > .notion-text:last-of-type {
    margin-bottom: 0;
  }

  /* Toggle */
  .notion-toggle {
    margin: 0.3em 0;
    padding: 0;
  }
  .notion-toggle > summary {
    display: flex;
    align-items: center;
    gap: 0.5em;
    padding: 0.35em 0;
    list-style: none;
    font-weight: 500;
    cursor: pointer;

    &::-webkit-details-marker {
      display: none;
    }

    &::before {
      content: "";
      flex-shrink: 0;
      width: 1em;
      height: 1em;
      background-color: ${({ theme }) => theme.colors.gray9};
      -webkit-mask: ${CHEVRON_ICON} center / contain no-repeat;
      mask: ${CHEVRON_ICON} center / contain no-repeat;
      transition: transform 180ms ease;
    }

    &:hover::before {
      background-color: ${({ theme }) => theme.colors.gray12};
    }
  }
  .notion-toggle[open] > summary::before {
    transform: rotate(90deg);
  }
  .notion-toggle > div {
    margin: 0.2em 0 0.6em 0.55em;
    padding-left: 1.1em;
    border-left: 1px solid ${({ theme }) => theme.colors.gray6};
  }

  /* Tables: clean rules, header row, horizontal scroll on phones */
  .notion-simple-table {
    display: block;
    width: 100%;
    margin: 1.4em 0;
    overflow-x: auto;
    border: 0 !important;
    border-collapse: collapse;
    font-size: 15px;
    line-height: 1.6;
  }
  .notion-simple-table td {
    min-width: 7em;
    padding: 0.65em 0.9em;
    border: 0 !important;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray6};
    vertical-align: top;
  }
  .notion-simple-table td {
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray6} !important;
  }
  .notion-simple-table tr:first-of-type td {
    border-bottom-color: ${({ theme }) => theme.colors.gray8} !important;
    font-weight: 600;
    background: transparent;
  }
  .notion-simple-table-cell {
    white-space: normal;
  }

  /* Images, video, files */
  .notion-asset-wrapper {
    max-width: 100%;
    margin: 1.8em auto;
  }
  .notion-asset-wrapper img,
  .notion-asset-wrapper video,
  .notion-asset-wrapper iframe,
  .notion-yt-lite {
    border-radius: 14px !important;
  }
  .notion-asset-wrapper-image img {
    background: ${({ theme }) => theme.colors.gray4};
    box-shadow: 0 0 0 1px
      ${pick("rgba(0, 0, 0, 0.06)", "rgba(255, 255, 255, 0.08)")};
    cursor: zoom-in;
  }
  .notion-asset-caption {
    padding: 0.7em 0 0;
    text-align: center;
    font-size: 14px;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.gray9};
  }
  .notion-file {
    width: 100%;
    margin: 0.8em 0;
  }
  .notion-file-link {
    display: flex;
    align-items: center;
    gap: 0.6em;
    padding: 0.75em 1em;
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    border-radius: 12px;
    background: ${({ theme }) => theme.colors.gray1};
    transition: border-color 120ms ease;

    &:hover {
      border-color: ${({ theme }) => theme.colors.gray8};
      background: ${({ theme }) => theme.colors.gray1};
    }
  }
  .notion-file-icon {
    fill: ${({ theme }) => theme.colors.gray9};
  }
  .notion-file-info {
    display: flex;
    align-items: baseline;
    gap: 0.5em;
  }
  .notion-file-title {
    font-weight: 500;
  }
  .notion-file-size {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.gray9};
  }

  /* Bookmarks: card with title, description, thumbnail */
  .notion-bookmark {
    margin: 1em 0;
    overflow: hidden;
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    border-radius: 14px;
    background: ${({ theme }) => theme.colors.gray1};
    transition: border-color 120ms ease;

    &:hover {
      border-color: ${({ theme }) => theme.colors.gray8};
    }

    > div:first-of-type {
      padding: 14px 16px;
    }
  }
  .notion-bookmark-title {
    font-size: 15px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray12};
  }
  .notion-bookmark-description {
    margin-top: 4px;
    font-size: 13px;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.gray10};
  }
  .notion-bookmark-link {
    margin-top: 8px;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.gray9};
  }

  /* Equations */
  .notion-equation-block {
    margin: 1.2em 0;
    overflow-x: auto;
  }

  /* Code blocks */
  pre.notion-code {
    position: relative;
    margin: 1.4em 0 !important;
    padding: 0 !important;
    overflow: hidden;
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    border-radius: 14px;
    background: ${pick("#f7f7f9", "#161617")} !important;
    line-height: 1.7;
    tab-size: 2;
  }
  .notion-code-toolbar {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.45rem 0.5rem 0.45rem 1rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray6};
    background: ${pick("#efeff2", "#1d1d1f")};

    /* Editor-window dots */
    &::before {
      content: "";
      flex-shrink: 0;
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: #ff5f57;
      box-shadow: 16px 0 0 #febc2e, 32px 0 0 #28c840;
      margin-right: 36px;
    }
  }
  .notion-code-language {
    font-family: var(--font-text);
    font-size: 12px;
    font-weight: 500;
    text-transform: lowercase;
    color: ${({ theme }) => theme.colors.gray9};
  }
  .notion-code-actions {
    margin-left: auto;
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
  }
  .notion-code-copy {
    display: none !important;
  }
  .notion-code-action {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    height: 26px;
    padding: 0 0.6rem;
    border: 0;
    border-radius: 7px;
    background: transparent;
    color: ${({ theme }) => theme.colors.gray9};
    font-family: var(--font-text);
    font-size: 12px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 120ms ease, color 120ms ease;

    &:hover {
      background: ${({ theme }) => theme.colors.gray5};
      color: ${({ theme }) => theme.colors.gray12};
    }
  }
  .notion-code-copy-action {
    width: 26px;
    padding: 0;

    &::before {
      content: "";
      width: 14px;
      height: 14px;
      background-color: currentColor;
      -webkit-mask: ${COPY_ICON} center / contain no-repeat;
      mask: ${COPY_ICON} center / contain no-repeat;
    }

    &[data-copied="true"] {
      color: ${pick("#2f7d4f", "#6fcf97")};
    }

    &[data-copied="true"]::before {
      -webkit-mask-image: ${CHECK_ICON};
      mask-image: ${CHECK_ICON};
    }
  }
  pre.notion-code code {
    display: block;
    padding: 1rem 1.15rem 1.1rem !important;
    overflow-x: auto;
    background: transparent !important;
    color: ${({ theme }) => theme.colors.gray12};
    font-family: ${MONO};
    font-size: 13.5px;
    text-shadow: none;
    white-space: pre;
    word-break: normal;
    overflow-wrap: normal;
    scrollbar-width: thin;
  }
  pre.notion-code[data-collapsed="true"] code {
    max-height: 22rem;
    overflow: hidden;
    -webkit-mask-image: linear-gradient(to bottom, #000 80%, transparent);
    mask-image: linear-gradient(to bottom, #000 80%, transparent);
  }

  /* Syntax tokens (GitHub-like), per scheme */
  .token.comment,
  .token.prolog,
  .token.doctype,
  .token.cdata {
    color: ${pick("#6e7781", "#8b949e")};
    font-style: italic;
  }
  .token.punctuation,
  .token.operator {
    color: ${pick("#57606a", "#a1a1a6")};
    background: none;
  }
  .token.property,
  .token.tag,
  .token.constant,
  .token.symbol,
  .token.deleted {
    color: ${pick("#116329", "#7ee787")};
  }
  .token.boolean,
  .token.number {
    color: ${pick("#0550ae", "#79c0ff")};
  }
  .token.selector,
  .token.attr-name,
  .token.string,
  .token.char,
  .token.builtin,
  .token.inserted {
    color: ${pick("#0a3069", "#a5d6ff")};
  }
  .token.entity,
  .token.url,
  .token.variable,
  .token.regex,
  .token.important {
    color: ${pick("#953800", "#ffa657")};
    background: none;
  }
  .token.atrule,
  .token.attr-value,
  .token.keyword {
    color: ${pick("#cf222e", "#ff7b72")};
  }
  .token.function,
  .token.class-name {
    color: ${pick("#8250df", "#d2a8ff")};
  }

  /* Notion text and background colors */
  ${notionColorRules}

  @media (max-width: 734px) {
    .notion {
      font-size: 16px;
      line-height: 1.75;
    }
    .notion-h1 {
      font-size: 1.6rem !important;
    }
    .notion-h2 {
      font-size: 1.35rem !important;
    }
    .notion-h3 {
      font-size: 1.15rem !important;
    }
  }
`
