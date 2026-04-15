import React, { useCallback, useEffect, useRef } from "react"
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
import { storageKey } from "src/constants/storage"

type Props = {}

const PostDetail: React.FC<Props> = () => {
  const router = useRouter()
  const articleRef = useRef<HTMLDivElement | null>(null)
  const leftRailRef = useRef<HTMLElement | null>(null)
  const rightRailRef = useRef<HTMLElement | null>(null)
  const data = usePostQuery()
  const { items, activeId } = usePostToc("post-content")
  const progress = useReadingProgress("post-article")

  const category = data?.category?.[0]

  const handleBackdropClick = useCallback(() => {
    if (typeof window === "undefined") {
      router.push("/")
      return
    }

    const feedQueryString =
      window.sessionStorage.getItem(storageKey.feedQueryString) || ""

    router.push(`/${feedQueryString}`, undefined, { scroll: false })
  }, [router])

  useEffect(() => {
    const handlePointerDown = (event: MouseEvent) => {
      if (window.innerWidth < 1280) return

      const target = event.target as Node | null
      if (!target) return

      if (
        target instanceof Element &&
        target.closest('[data-detail-safe="true"]')
      ) {
        return
      }

      const clickedInsideArticle = articleRef.current?.contains(target)
      const clickedInsideLeftRail = leftRailRef.current?.contains(target)
      const clickedInsideRightRail = rightRailRef.current?.contains(target)

      if (clickedInsideArticle || clickedInsideLeftRail || clickedInsideRightRail) {
        return
      }

      handleBackdropClick()
    }

    document.addEventListener("mousedown", handlePointerDown)

    return () => {
      document.removeEventListener("mousedown", handlePointerDown)
    }
  }, [handleBackdropClick])

  if (!data) return null

  return (
    <Backdrop onClick={handleBackdropClick}>
      <DesktopShell onClick={(event) => event.stopPropagation()}>
        <aside ref={leftRailRef} className="desktop-rail left">
          <RelatedPosts />
        </aside>
        <ArticleCard ref={articleRef}>
          <div className="progress" aria-hidden="true">
            <div className="bar" style={{ width: `${progress}%` }} />
          </div>
          <article id="post-article">
            {category && (
              <div css={{ marginBottom: "0.75rem" }}>
                <Category readOnly={data.status?.[0] === "PublicOnDetail"}>
                  {category}
                </Category>
              </div>
            )}
            {data.type[0] === "Post" && <PostHeader data={data} />}
            {items.length > 0 && (
              <div className="mobile-outline">
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
        </ArticleCard>
        <aside ref={rightRailRef} className="desktop-rail right">
          <PostOutline items={items} activeId={activeId} />
        </aside>
      </DesktopShell>
    </Backdrop>
  )
}

export default PostDetail

const Backdrop = styled.div`
  width: 100%;
  padding: 0.75rem 1rem 0;

  @media (min-width: 1024px) {
    padding: 1rem 1.5rem 0;
  }
`

const DesktopShell = styled.div`
  display: block;
  width: min(100%, 120rem);
  margin: 0 auto;

  @media (min-width: 1280px) {
    display: grid;
    grid-template-columns: minmax(14rem, 17rem) minmax(0, 52rem) minmax(14rem, 17rem);
    gap: 1.5rem;
    align-items: start;
    justify-content: center;
  }

  .desktop-rail {
    display: none;

    @media (min-width: 1280px) {
      display: block;
      width: 100%;
      min-width: 0;
      max-width: 100%;
      position: sticky;
      top: 5.75rem;
      max-height: calc(100vh - 7rem);
      overflow-y: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }
  }
`

const ArticleCard = styled.div`
  position: relative;
  width: 100%;
  max-width: 52rem;
  margin: 0 auto;
  border: 1px solid ${({ theme }) => theme.colors.gray6};
  border-radius: 1.9rem;
  background-color: ${({ theme }) =>
    theme.scheme === "light"
      ? "rgba(255, 255, 255, 0.88)"
      : "rgba(28, 35, 46, 0.86)"};
  backdrop-filter: blur(16px);
  box-shadow: 0 30px 80px -48px rgba(15, 23, 42, 0.35);
  overflow: clip;

  article {
    width: 100%;
    max-width: 46rem;
    margin: 0 auto;
    padding: 2rem 1.35rem 1.1rem;

    @media (min-width: 768px) {
      padding: 2.25rem 2rem 1.25rem;
    }
  }

  .progress {
    position: sticky;
    top: 0;
    z-index: 10;
    height: 3px;
    background: transparent;

    .bar {
      height: 100%;
      border-radius: 9999px;
      background: linear-gradient(90deg, #0f766e, #14b8a6);
      transition: width 120ms ease-out;
    }
  }

  .mobile-outline {
    margin-bottom: 1.5rem;

    @media (min-width: 1280px) {
      display: none;
    }
  }
`
