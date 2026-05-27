import styled from "@emotion/styled"
import Link from "next/link"
import { useRouter } from "next/router"
import React, { useMemo } from "react"
import { DEFAULT_CATEGORY } from "src/constants"
import { useUiLanguage } from "src/contexts/UiLanguageContext"
import useFeedScrollRestoration from "src/hooks/useFeedScrollRestoration"
import usePostsQuery from "src/hooks/usePostsQuery"
import { FeedHeader } from "src/routes/Feed/FeedHeader"
import PostCard from "src/routes/Feed/PostList/PostCard"

type Props = {
  q: string
}

const PAGE_SIZE = 9

const getPageFromQuery = (value: unknown) => {
  const page = Number(typeof value === "string" ? value : "1")
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1
}

const PostList: React.FC<Props> = ({ q }) => {
  const router = useRouter()
  const { language } = useUiLanguage()
  const data = usePostsQuery()

  const currentTag = `${router.query.tag || ""}` || undefined
  const currentCategory = `${router.query.category || ""}` || DEFAULT_CATEGORY
  const currentMenu = `${router.query.menu || ""}` || undefined
  const currentSubmenu = `${router.query.submenu || ""}` || undefined
  const currentOrder = `${router.query.order || ""}` || "desc"
  const currentPage = getPageFromQuery(router.query.page)
  const currentView = `${router.query.view || ""}` || undefined

  const searchIndex = useMemo(() => {
    return new Map(
      data.map((post) => {
        const tagContent = post.tags ? post.tags.join(" ") : ""
        const menuContent = post.menu ? post.menu.join(" ") : ""
        const submenuContent = post.submenu ? post.submenu.join(" ") : ""
        const searchContent =
          post.title +
          (post.summary || "") +
          tagContent +
          menuContent +
          submenuContent

        return [post.id, searchContent.toLowerCase()]
      })
    )
  }, [data])

  const filteredPosts = useMemo(() => {
    let nextPosts = [...data]
    const normalizedQuery = q.trim().toLowerCase()

    if (currentTag) {
      nextPosts = nextPosts.filter(
        (post) => post && post.tags && post.tags.includes(currentTag)
      )
    }

    if (currentCategory !== DEFAULT_CATEGORY) {
      nextPosts = nextPosts.filter(
        (post) => post && post.menu && post.menu.includes(currentCategory)
      )
    }

    if (currentMenu) {
      nextPosts = nextPosts.filter(
        (post) => post && post.menu && post.menu.includes(currentMenu)
      )
    }

    if (currentSubmenu) {
      nextPosts = nextPosts.filter(
        (post) => post && post.submenu && post.submenu.includes(currentSubmenu)
      )
    }

    if (normalizedQuery) {
      nextPosts = nextPosts.filter((post) => {
        return (searchIndex.get(post.id) || "").includes(normalizedQuery)
      })
    }

    if (currentOrder !== "desc") {
      nextPosts = [...nextPosts].reverse()
    }

    return nextPosts
  }, [currentCategory, currentMenu, currentOrder, currentSubmenu, currentTag, data, q, searchIndex])

  const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const visiblePosts = filteredPosts.slice(
    (safePage - 1) * PAGE_SIZE,
    safePage * PAGE_SIZE
  )

  const updatePage = (page: number) => {
    router.replace(
      {
        pathname: "/",
        query: {
          q: q || undefined,
          tag: currentTag,
          category:
            currentCategory !== DEFAULT_CATEGORY ? currentCategory : undefined,
          menu: currentMenu,
          submenu: currentSubmenu,
          order: currentOrder !== "desc" ? currentOrder : undefined,
          view: currentView,
          page: page > 1 ? page : undefined,
        },
      },
      undefined,
      { shallow: true, scroll: false }
    )
  }

  const isRestored = useFeedScrollRestoration(
    JSON.stringify([
      filteredPosts.length,
      safePage,
      currentTag,
      currentCategory,
      currentMenu,
      currentSubmenu,
      currentOrder,
      currentView,
      q,
    ])
  )

  const isFiltered = Boolean(
    q || currentTag || currentMenu || currentSubmenu || currentCategory !== DEFAULT_CATEGORY
  )

  const heading = isFiltered
    ? language === "ko"
      ? "필터 결과"
      : "Filtered results"
    : language === "ko"
      ? "최신 글"
      : "Latest posts"

  const subtitle = isFiltered
    ? language === "ko"
      ? `${filteredPosts.length}개의 글이 현재 조건과 맞아요.`
      : `${filteredPosts.length} posts match the current filters.`
    : language === "ko"
      ? `${filteredPosts.length}개의 글을 최신순으로 보고 있어요.`
      : `${filteredPosts.length} posts are sorted from newest to oldest.`

  return (
    <StyledWrapper id="feed-posts">
      <div className="overview">
        <div className="heading-row">
          <div className="heading-copy">
            <div className="eyebrow">{language === "ko" ? "피드" : "Feed"}</div>
            <h2>{heading}</h2>
            <p>{subtitle}</p>
          </div>

          <div className="controls">
            <FeedHeader />
            <div className="result-count">{filteredPosts.length}</div>
          </div>
        </div>

        <div className="chips">
          {q && (
            <span className="chip">
              {language === "ko" ? "검색어" : "Query"}: {q}
            </span>
          )}
          {currentTag && (
            <span className="chip">
              {language === "ko" ? "태그" : "Tag"}: #{currentTag}
            </span>
          )}
          {currentMenu && (
            <span className="chip">
              {language === "ko" ? "메뉴" : "Menu"}: {currentMenu}
            </span>
          )}
          {currentSubmenu && (
            <span className="chip">
              {language === "ko" ? "서브메뉴" : "Submenu"}: {currentSubmenu}
            </span>
          )}
          {currentCategory !== DEFAULT_CATEGORY && (
            <span className="chip">
              {language === "ko" ? "분류" : "Category"}: {currentCategory}
            </span>
          )}
        </div>
      </div>

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
  .overview {
    margin-bottom: 1rem;
    padding: 0.85rem 0.95rem;
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    border-radius: 1.2rem;
    background-color: ${({ theme }) =>
      theme.scheme === "light"
        ? "rgba(255, 255, 255, 0.76)"
        : "rgba(29, 36, 48, 0.82)"};
  }

  .heading-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.6rem;
  }

  .heading-copy {
    min-width: 0;
  }

  .controls {
    display: inline-flex;
    align-items: center;
    gap: 0.55rem;
    flex-shrink: 0;
  }

  .eyebrow {
    margin-bottom: 0.25rem;
    font-size: 0.72rem;
    line-height: 0.95rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.gray10};
  }

  h2 {
    margin-bottom: 0.15rem;
    font-size: 1.1rem;
    line-height: 1.45rem;
    font-weight: 800;
  }

  p {
    margin: 0;
    color: ${({ theme }) => theme.colors.gray11};
    line-height: 1.35rem;
    font-size: 0.88rem;
  }

  .result-count {
    flex-shrink: 0;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    min-width: 2rem;
    height: 2rem;
    padding: 0 0.6rem;
    border-radius: 9999px;
    background-color: ${({ theme }) => theme.colors.gray3};
    color: ${({ theme }) => theme.colors.gray12};
    font-size: 0.84rem;
    line-height: 1rem;
    font-weight: 700;
  }

  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
  }

  .chip,
  .empty-links a {
    display: inline-flex;
    align-items: center;
    min-height: 1.75rem;
    padding: 0.22rem 0.55rem;
    border-radius: 9999px;
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    background-color: ${({ theme }) => theme.colors.gray2};
    color: ${({ theme }) => theme.colors.gray10};
    font-size: 0.74rem;
    line-height: 1rem;
    font-weight: 600;
  }

  .post-area {
    min-height: 6rem;
    display: grid;
    gap: 1rem;

    @media (min-width: 1024px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 1.15rem;
    }

    @media (min-width: 1480px) {
      grid-template-columns: repeat(3, minmax(0, 1fr));
    }
  }

  .post-area > a,
  .empty-state {
    min-width: 0;
  }

  .post-area > a article {
    height: 100%;
    margin-bottom: 0;
  }

  .empty-state {
    grid-column: 1 / -1;
    padding: 1.1rem 1rem;
    border: 1px dashed ${({ theme }) => theme.colors.gray6};
    border-radius: 1.1rem;
    background-color: ${({ theme }) => theme.colors.gray2};

    h3 {
      margin-bottom: 0.4rem;
      font-size: 1rem;
      line-height: 1.35rem;
      font-weight: 700;
      color: ${({ theme }) => theme.colors.gray12};
    }

    p {
      margin-bottom: 0.7rem;
    }
  }

  .empty-links {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .pagination {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.45rem;
    padding-top: 1rem;
  }

  .pagination button {
    min-width: 1.8rem;
    height: 1.8rem;
    padding: 0 0.25rem;
    border: 0;
    border-radius: 0;
    background: transparent;
    color: ${({ theme }) => theme.colors.gray8};
    opacity: 0.58;
    font-size: 0.82rem;
    line-height: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition:
      opacity 180ms ease,
      color 180ms ease;

    &:hover:not(:disabled) {
      color: ${({ theme }) => theme.colors.gray12};
      opacity: 1;
    }

    &[data-active="true"] {
      color: ${({ theme }) => theme.colors.gray12};
      opacity: 1;
    }

    &:disabled {
      opacity: 0.3;
      cursor: not-allowed;
    }
  }
`
