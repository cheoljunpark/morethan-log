import React from "react"
import PostHeader from "./PostHeader"
import Footer from "./PostFooter"
import CommentBox from "./CommentBox"
import styled from "@emotion/styled"
import NotionRenderer from "../components/NotionRenderer"
import usePostQuery from "src/hooks/usePostQuery"
import useHeadingAnchors from "src/hooks/useHeadingAnchors"
import useReadingProgress from "src/hooks/useReadingProgress"

type Props = {}

const PostDetail: React.FC<Props> = () => {
  const data = usePostQuery()
  useHeadingAnchors("post-content")
  const progress = useReadingProgress("post-article")

  if (!data) return null

  return (
    <StyledWrapper>
      <div className="progress" aria-hidden="true">
        <div
          className="bar"
          style={{ transform: `scaleX(${progress / 100})` }}
        />
      </div>
      <div className="shell">
        <article id="post-article">
          <PostHeader data={data} />
          <div id="post-content">
            <NotionRenderer recordMap={data.recordMap} />
          </div>
          <Footer>
            <CommentBox data={data} />
          </Footer>
        </article>
      </div>
    </StyledWrapper>
  )
}

export default PostDetail

const StyledWrapper = styled.div`
  width: 100%;
  padding: 3.5rem 1.5rem 5rem;

  @media (max-width: 768px) {
    padding: 2rem 1.1rem 3rem;
  }

  .progress {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 40;
    height: 2px;
    pointer-events: none;

    .bar {
      height: 100%;
      background: ${({ theme }) => theme.colors.indigo9};
      transform-origin: left;
      transition: transform 80ms linear;
    }
  }

  .shell {
    width: 100%;
    max-width: 760px;
    margin: 0 auto;
  }

  article {
    min-width: 0;
  }
`
