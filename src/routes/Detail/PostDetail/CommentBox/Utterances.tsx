import { CONFIG } from "site.config"
import { useEffect, useRef, useState } from "react"
import styled from "@emotion/styled"
import useScheme from "src/hooks/useScheme"
import { useRouter } from "next/router"

//TODO: useRef?

type Props = {
  issueTerm?: string
}

const Utterances: React.FC<Props> = ({ issueTerm }) => {
  const [scheme] = useScheme()
  const router = useRouter()
  const anchorRef = useRef<HTMLDivElement | null>(null)
  const [height, setHeight] = useState<number | null>(null)

  useEffect(() => {
    const theme = scheme === "dark" ? "github-dark" : "github-light"
    const script = document.createElement("script")
    const anchor = anchorRef.current
    if (!anchor) return

    setHeight(null)
    anchor.innerHTML = ""
    script.setAttribute("src", "https://utteranc.es/client.js")
    script.setAttribute("crossorigin", "anonymous")
    script.setAttribute("async", `true`)
    script.setAttribute("theme", theme)
    const config: Record<string, string> = CONFIG.utterances.config
    Object.keys(config).forEach((key) => {
      script.setAttribute(key, config[key])
    })
    script.setAttribute(
      "issue-term",
      config["issue-term"] || issueTerm || "pathname"
    )
    anchor.appendChild(script)
    return () => {
      anchor.innerHTML = ""
    }
  }, [issueTerm, router.asPath, scheme])

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== "https://utteranc.es") return

      const data = event.data
      if (!data || data.type !== "resize" || typeof data.height !== "number") {
        return
      }

      setHeight(data.height)
    }

    window.addEventListener("message", handleMessage)

    return () => {
      window.removeEventListener("message", handleMessage)
    }
  }, [])

  return (
    <>
      <StyledWrapper style={height ? { minHeight: height } : undefined}>
        <div ref={anchorRef} className="utterances-anchor"></div>
      </StyledWrapper>
    </>
  )
}

export default Utterances

const StyledWrapper = styled.div`
  margin-top: 2.5rem;
  width: 100%;
  overflow: visible;

  .utterances,
  .utterances-anchor,
  .utterances-frame {
    display: block;
    width: 100% !important;
    max-width: 100% !important;
    margin: 0 auto !important;
  }

  .utterances-frame iframe,
  iframe.utterances-frame {
    width: 100% !important;
    max-width: 100% !important;
  }

  .timeline {
    margin-left: 0 !important;
    margin-right: 0 !important;
  }

  iframe.utterances-frame {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
`
