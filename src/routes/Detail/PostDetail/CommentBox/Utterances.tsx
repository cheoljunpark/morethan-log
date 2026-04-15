import { CONFIG } from "site.config"
import { useEffect, useRef } from "react"
import styled from "@emotion/styled"
import useScheme from "src/hooks/useScheme"
import { useRouter } from "next/router"

//TODO: useRef?

type Props = {
  issueTerm: string
}

const Utterances: React.FC<Props> = ({ issueTerm }) => {
  const [scheme] = useScheme()
  const router = useRouter()
  const anchorRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const theme = scheme === "dark" ? "github-dark" : "github-light"
    const script = document.createElement("script")
    const anchor = anchorRef.current
    if (!anchor) return

    anchor.innerHTML = ""
    script.setAttribute("src", "https://utteranc.es/client.js")
    script.setAttribute("crossorigin", "anonymous")
    script.setAttribute("async", `true`)
    script.setAttribute("theme", theme)
    const config: Record<string, string> = CONFIG.utterances.config
    Object.keys(config).forEach((key) => {
      script.setAttribute(key, config[key])
    })
    script.setAttribute("issue-term", issueTerm)
    anchor.appendChild(script)
    return () => {
      anchor.innerHTML = ""
    }
  }, [issueTerm, router.asPath, scheme])
  return (
    <>
      <StyledWrapper>
        <div ref={anchorRef} className="utterances-frame"></div>
      </StyledWrapper>
    </>
  )
}

export default Utterances

const StyledWrapper = styled.div`
  margin-top: 2.5rem;
  width: 100%;
  min-height: 14rem;
  overflow: hidden;

  .utterances,
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
