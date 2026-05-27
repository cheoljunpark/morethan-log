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
  margin-top: 5.75rem;
  padding-top: 2.5rem;
  padding-bottom: 1.5rem;
  width: 100%;
  border-top: 1px solid ${({ theme }) => theme.colors.gray5};
  margin-bottom: 1rem;

  .comment-shell {
    width: min(100%, 42rem);
    margin: 0 auto;
  }

  .title {
    margin-bottom: 1.1rem;
    font-size: 0.8rem;
    line-height: 1.1rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.gray10};
  }
`
