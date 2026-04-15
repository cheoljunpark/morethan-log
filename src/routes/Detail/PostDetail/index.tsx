import React from "react"
import PostHeader from "./PostHeader"
import Footer from "./PostFooter"
import CommentBox from "./CommentBox"
import Category from "src/components/Category"
import styled from "@emotion/styled"
import NotionRenderer from "../components/NotionRenderer"
import usePostQuery from "src/hooks/usePostQuery"
import usePostToc from "src/hooks/usePostToc"
import useReadingProgress from "src/hooks/useReadingProgress"
import PostOutline from "./PostOutline"
import RelatedPosts from "./RelatedPosts"
import { useRouter } from "next/router"

type Props = {}

const PostDetail: React.FC<Props> = () => {
  const router = useRouter()
  const data = usePostQuery()
  const { items, activeId } = usePostToc("post-content")
  const progress = useReadingProgress("post-article")

  if (!data) return null

  const category = (data.category && data.category?.[0]) || undefined
  const handleBackdropClick = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
      return
    }

    router.push("/")
  }

  return (
    <Backdrop onClick={handleBackdropClick}>
      <StyledWrapper onClick={(event) => event.stopPropagation()}>
        <div className="progress" aria-hidden="true">
          <div className="bar" style={{ width: `${progress}%` }} />
        </div>
        <div className="layout">
          <article id="post-article">
            {category && (
              <div css={{ marginBottom: "0.5rem" }}>
                <Category readOnly={data.status?.[0] === "PublicOnDetail"}>
                  {category}
                </Category>
              </div>
            )}
            {data.type[0] === "Post" && <PostHeader data={data} />}
            <div id="post-content">
              <NotionRenderer recordMap={data.recordMap} />
            </div>
            {data.type[0] === "Post" && (
              <>
                <RelatedPosts />
                <Footer />
                <CommentBox data={data} />
              </>
            )}
          </article>
          <div className="outline">
            <PostOutline items={items} activeId={activeId} />
          </div>
        </div>
      </StyledWrapper>
    </Backdrop>
  )
}

export default PostDetail

const Backdrop = styled.div`
  padding: 0.5rem 0;

  @media (min-width: 1024px) {
    padding: 1rem 0 2rem;
  }
`

const StyledWrapper = styled.div`
  position: relative;
  padding-top: 3rem;
  padding-bottom: 3rem;
  border-radius: 1.5rem;
  max-width: 72rem;
  background-color: ${({ theme }) =>
    theme.scheme === "light" ? "white" : theme.colors.gray4};
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
  margin: 0 auto;
  cursor: default;

  .progress {
    position: sticky;
    z-index: 20;
    top: 0;
    margin: -3rem -1.5rem 1.5rem;
    height: 3px;
    background-color: transparent;

    .bar {
      height: 100%;
      border-radius: 9999px;
      background: linear-gradient(90deg, #0f766e, #14b8a6);
      transition: width 120ms ease-out;
    }
  }

  .layout {
    display: block;
    padding-left: 1.5rem;
    padding-right: 1.5rem;

    @media (min-width: 1280px) {
      display: grid;
      grid-template-columns: minmax(0, 42rem) 16rem;
      gap: 2rem;
      align-items: start;
    }
  }

  > .layout > article {
    margin: 0 auto;
    max-width: 42rem;
  }

  .outline {
    display: none;

    @media (min-width: 1280px) {
      display: block;
    }
  }
`
