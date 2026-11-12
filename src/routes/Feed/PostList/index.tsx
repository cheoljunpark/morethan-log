import styled from "@emotion/styled"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useMemo } from "react"
import { useUiLanguage } from "src/contexts/UiLanguageContext"
import useFeedScrollRestoration from "src/hooks/useFeedScrollRestoration"
import usePostsQuery from "src/hooks/usePostsQuery"
import getFeedQuery, { compactQuery } from "src/libs/utils/router/getFeedQuery"
import { filterFeedPosts } from "./filterFeedPosts"
import OrderButtons from "./OrderButtons"
import PostCard from "./PostCard"

const PAGE_SIZE = 10

const getPageFromQuery = (value: unknown) => {
  const page = Number(typeof value === "string" ? value : "1")
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1
}

const PostList: React.FC = () => {
  const router = useRouter()
  const { language } = useUiLanguage()
  const ko = language === "ko"
  const posts = usePostsQuery()
  const filter = useMemo(() => getFeedQuery(router.query), [router.query])
  const { q, tag, menu, submenu } = filter
  const filteredPosts = useMemo(() => filterFeedPosts(posts, filter), [posts, filter])

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE))
  const safePage = Math.min(getPageFromQuery(router.query.page), totalPages)
  const visiblePosts = filteredPosts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const updatePage = (page: number) => {
    void router.replace(
      { pathname: "/", query: compactQuery({ ...filter, page: page > 1 ? page : undefined }) },
      undefined,
      { shallow: true, scroll: false }
    )
  }

  const isRestored = useFeedScrollRestoration(
    JSON.stringify([filteredPosts.length, safePage, filter])
  )

  const isFiltered = Boolean(q || tag || menu || submenu)
  const heading = q
    ? ko ? `‘${q}’ 검색 결과` : `Results for “${q}”`
    : tag
      ? `#${tag}`
      : submenu
        ? `${menu} · ${submenu}`
        : menu || (ko ? "최신 글" : "Latest posts")

  return (
    <StyledWrapper id="feed-posts">
      {isFiltered && (
        <div className="overview">
          <div className="heading-row">
            <h2>
              {heading}
              <span className="count">{filteredPosts.length}</span>
            </h2>
            <div className="controls">
              <OrderButtons />
            </div>
          </div>
          <Link href="/" className="clear">
            {ko ? "필터 해제" : "Clear filter"} ×
          </Link>
        </div>
      )}

      <div
        className="post-area"
        style={{
          opacity: isRestored ? 1 : 0,
          transition: "opacity 120ms ease-out",
        }}
      >
        {!filteredPosts.length ? (
          <div className="empty-state">
            <h3>{language === "ko" ? "조건에 맞는 글이 없어요." : "No posts found"}</h3>
            <p>
              {language === "ko"
                ? "다른 검색어나 메뉴 조건으로 다시 찾아보세요."
                : "Try another query or different menu filters."}
            </p>
            <div className="empty-links">
              <Link href="/">{language === "ko" ? "처음으로" : "Back home"}</Link>
            </div>
          </div>
        ) : (
          visiblePosts.map((post) => <PostCard key={post.id} data={post} />)
        )}
      </div>

      {totalPages > 1 && (
        <nav className="pagination" aria-label="Feed pagination">
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => updatePage(1)}
          >
            {"<<"}
          </button>
          <button
            type="button"
            disabled={safePage <= 1}
            onClick={() => updatePage(safePage - 1)}
          >
            {"<"}
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
            <button
              key={page}
              type="button"
              data-active={page === safePage}
              onClick={() => updatePage(page)}
            >
              {page}
            </button>
          ))}
          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => updatePage(safePage + 1)}
          >
            {">"}
          </button>
          <button
            type="button"
            disabled={safePage >= totalPages}
            onClick={() => updatePage(totalPages)}
          >
            {">>"}
          </button>
        </nav>
      )}
    </StyledWrapper>
  )
}

export default PostList

const StyledWrapper = styled.section`
  margin-bottom: 3rem;

  .overview {
    padding-top: 36px;
  }

  .heading-row {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-end;
    gap: 1rem;

    h2 {
      display: flex;
      align-items: baseline;
      gap: 0.75rem;
      font-size: clamp(32px, 3.6vw, 40px);
      line-height: 1.1;
      font-weight: 600;
      letter-spacing: -0.03em;
    }

    .count {
      font-family: var(--font-text);
      font-size: 0.8rem;
      font-weight: 400;
      letter-spacing: 0;
      color: ${({ theme }) => theme.colors.gray9};
    }
  }

  .post-area {
    min-height: 6rem;
  }

  .clear {
    display: inline-block;
    margin-top: 10px;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.indigo9};

    &:hover {
      text-decoration: underline;
    }
  }

  .empty-state {
    padding: 3rem 0;

    h3 {
      margin-bottom: 0.4rem;
      font-size: 1.1rem;
      font-weight: 600;
    }

    p {
      margin: 0 0 1rem;
      color: ${({ theme }) => theme.colors.gray10};
    }
  }

  .empty-links a {
    font-family: var(--font-text);
    font-size: 0.8rem;
    text-decoration: underline;
    text-underline-offset: 0.2em;

    &:hover {
      color: ${({ theme }) => theme.colors.indigo9};
    }
  }

  .pagination {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.25rem;
    margin-top: 2.5rem;
    font-family: var(--font-text);
    font-size: 0.8rem;
  }

  .pagination button {
    min-width: 2rem;
    height: 2rem;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.colors.gray9};
    cursor: pointer;

    &:hover:not(:disabled) {
      color: ${({ theme }) => theme.colors.gray12};
    }

    &[data-active="true"] {
      color: ${({ theme }) => theme.colors.gray12};
      font-weight: 600;
      box-shadow: inset 0 -2px 0 ${({ theme }) => theme.colors.indigo9};
    }

    &:disabled {
      opacity: 0.35;
      cursor: default;
    }
  }
`
