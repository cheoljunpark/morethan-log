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
  width: 100%;
  padding: 0.75rem 1rem 1.5rem;

  @media (min-width: 1024px) {
    padding: 1rem 2rem 2.5rem;
  }
`

const StyledWrapper = styled.div`
  position: relative;
  padding-top: 2.5rem;
  padding-bottom: 1.5rem;
  border: 1px solid ${({ theme }) => theme.colors.gray6};
  border-radius: 1.75rem;
  width: min(100%, 72rem);
  background-color: ${({ theme }) =>
    theme.scheme === "light"
      ? "rgba(255, 255, 255, 0.78)"
      : "rgba(35, 44, 58, 0.72)"};
  backdrop-filter: blur(18px);
  box-shadow: 0 30px 80px -48px rgba(15, 23, 42, 0.45);
  margin: 0 auto;
  cursor: default;

  .progress {
    position: sticky;
    z-index: 20;
    top: 0;
    margin: -2.5rem -1.5rem 1.25rem;
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
      position: relative;
      padding-left: 14.75rem;
      padding-right: 14.75rem;
    }
  }

  article {
    margin: 0 auto;
    max-width: 39rem;
    min-width: 0;
    padding-bottom: 0.5rem;
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
      position: absolute;
      top: 0;
      min-width: 0;
      width: 13rem;
      max-height: calc(100vh - 7.5rem);
      overflow-y: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }

  .left-rail {
    left: 0;
  }

  .right-rail {
    right: 0;
  }
`
