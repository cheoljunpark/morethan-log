import { TPost } from "src/types"
import { CONFIG } from "site.config"
import dynamic from "next/dynamic"
import styled from "@emotion/styled"
import { useUiLanguage } from "src/contexts/UiLanguageContext"
import { useEffect, useRef, useState } from "react"

const UtterancesComponent = dynamic(
  () => {
    return import("./Utterances")
  },
  { ssr: false }
)
const CusdisComponent = dynamic(
  () => {
    return import("./Cusdis")
  },
  { ssr: false }
)

type Props = {
  data: TPost
}

const CommentBox: React.FC<Props> = ({ data }) => {
  const { language } = useUiLanguage()
  const shellRef = useRef<HTMLDivElement | null>(null)
  const [isCommentVisible, setIsCommentVisible] = useState(false)

  useEffect(() => {
    const shell = shellRef.current
    if (!shell || isCommentVisible) return

    if (!("IntersectionObserver" in window)) {
      setIsCommentVisible(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsCommentVisible(true)
          observer.disconnect()
        }
      },
      {
        rootMargin: "640px 0px",
      }
    )

    observer.observe(shell)

    return () => {
      observer.disconnect()
    }
  }, [isCommentVisible])

  return (
    <StyledWrapper>
      <div ref={shellRef} className="comment-shell">
        <div className="title">{language === "ko" ? "댓글" : "Comments"}</div>
        {isCommentVisible && CONFIG.utterances.enable && <UtterancesComponent />}
        {isCommentVisible && CONFIG.cusdis.enable && (
          <CusdisComponent id={data.id} slug={data.slug} title={data.title} />
        )}
      </div>
    </StyledWrapper>
  )
}

export default CommentBox

const StyledWrapper = styled.div`
  width: 100%;
  margin-top: 3.5rem;

  .title {
    margin-bottom: 1.25rem;
    padding-bottom: 0.6rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray6};
    font-family: var(--font-text);
    font-size: 0.72rem;
    letter-spacing: -0.01em;
    color: ${({ theme }) => theme.colors.gray12};
  }
`
