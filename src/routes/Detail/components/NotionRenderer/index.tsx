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
import { FC, useEffect } from "react"
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

const NotionRenderer: FC<Props> = ({ recordMap }) => {
  const [scheme] = useScheme()

  useEffect(() => {
    const originalLog = console.log

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

    return () => {
      console.log = originalLog
    }
  }, [])

  return (
    <StyledWrapper>
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
  .notion-code {
    overflow: hidden;
  }
  .notion-code pre {
    overflow-x: auto !important;
    overflow-y: hidden !important;
    scrollbar-width: none;
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
