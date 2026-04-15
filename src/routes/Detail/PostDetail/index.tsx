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
          <aside className="left-rail">
            <RelatedPosts />
          </aside>
          <article id="post-article">
            {category && (
              <div css={{ marginBottom: "0.5rem" }}>
                <Category readOnly={data.status?.[0] === "PublicOnDetail"}>
                  {category}
                </Category>
              </div>
            )}
            {data.type[0] === "Post" && <PostHeader data={data} />}
            {items.length > 0 && (
              <div className="inline-outline">
                <PostOutline items={items} activeId={activeId} />
              </div>
            )}
            <div id="post-content">
              <NotionRenderer recordMap={data.recordMap} />
            </div>
            {data.type[0] === "Post" && (
              <>
                <Footer />
                <CommentBox data={data} />
              </>
            )}
          </article>
          <aside className="right-rail">
            <PostOutline items={items} activeId={activeId} />
          </aside>
        </div>
      </StyledWrapper>
    </Backdrop>
  )
}

export default PostDetail

const Backdrop = styled.div`
  position: relative;
  left: 50%;
  width: 100vw;
  margin-left: -50vw;
  padding: 0.75rem 1rem 1.5rem;

  @media (min-width: 1024px) {
    padding: 1rem 2rem 2.5rem;
  }
`

const StyledWrapper = styled.div`
  position: relative;
  padding-top: 3rem;
  padding-bottom: 3rem;
  border-radius: 1.5rem;
  width: min(100%, 68rem);
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
      grid-template-columns: minmax(0, 15rem) minmax(0, 42rem) minmax(0, 15rem);
      gap: 1.5rem;
      align-items: start;
    }
  }

  article {
    margin: 0 auto;
    max-width: 42rem;
  }

  .inline-outline {
    margin-bottom: 1.5rem;

    @media (min-width: 1280px) {
      display: none;
    }
  }

  .left-rail,
  .right-rail {
    display: none;

    @media (min-width: 1280px) {
      display: block;
      position: sticky;
      top: 6rem;
      align-self: start;
    }
  }
`
