import styled from "@emotion/styled"
import Link from "next/link"
import { useRouter } from "next/router"
import { useMemo, useState } from "react"
import { DEFAULT_CATEGORY } from "src/constants"
import { useUiLanguage } from "src/contexts/UiLanguageContext"
import usePostsQuery from "src/hooks/usePostsQuery"
import { formatDate } from "src/libs/utils"
import { filterPosts } from "src/libs/utils/notion"

const DEFAULT_TAG = "전체 태그"
const PAGE_SIZE = 9
const SIDEBAR_LIMIT = 6

const getPageFromQuery = (value: unknown) => {
  const page = Number(typeof value === "string" ? value : "1")
  return Number.isFinite(page) && page > 0 ? Math.floor(page) : 1
}

const Tags: React.FC = () => {
  const router = useRouter()
  const { language, locale } = useUiLanguage()
  const posts = usePostsQuery()
  const [isTagExpanded, setIsTagExpanded] = useState(false)
  const [isMenuExpanded, setIsMenuExpanded] = useState(false)

  const currentTag =
    typeof router.query.tag === "string" && router.query.tag.length > 0
      ? router.query.tag
      : DEFAULT_TAG
  const currentMenu =
    typeof router.query.category === "string" && router.query.category.length > 0
      ? router.query.category
      : DEFAULT_CATEGORY
  const currentPage = getPageFromQuery(router.query.page)

  const { visiblePosts, tags, menus, totalCount, totalPages, safePage } = useMemo(() => {
    const publicPosts = filterPosts(posts)
    const tagMap = new Map<string, number>()
    const menuMap = new Map<string, number>()

    publicPosts.forEach((post) => {
      post.tags?.forEach((tag) => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
      })

      const menu = post.menu?.[0]
      if (menu) {
        menuMap.set(menu, (menuMap.get(menu) || 0) + 1)
      }
    })

    const filteredPosts = publicPosts.filter((post) => {
      return (
        (currentTag === DEFAULT_TAG || Boolean(post.tags?.includes(currentTag))) &&
        (currentMenu === DEFAULT_CATEGORY || post.menu?.[0] === currentMenu)
      )
    })

    const totalPages = Math.max(1, Math.ceil(filteredPosts.length / PAGE_SIZE))
    const safePage = Math.min(currentPage, totalPages)

    return {
      visiblePosts: filteredPosts.slice(
        (safePage - 1) * PAGE_SIZE,
        safePage * PAGE_SIZE
      ),
      tags: [
        { name: DEFAULT_TAG, count: publicPosts.length },
        ...Array.from(tagMap.entries())
          .sort((a, b) => b[1] - a[1])
          .map(([name, count]) => ({ name, count })),
      ],
      menus: [
        { name: DEFAULT_CATEGORY, count: publicPosts.length },
        ...Array.from(menuMap.entries())
          .sort((a, b) => b[1] - a[1])
          .map(([name, count]) => ({ name, count })),
      ],
      totalCount: filteredPosts.length,
      totalPages,
      safePage,
    }
  }, [currentMenu, currentPage, currentTag, posts])

  const visibleTags = useMemo(() => {
    if (isTagExpanded || tags.length <= SIDEBAR_LIMIT) {
      return tags
    }

    const topTags = tags.slice(0, SIDEBAR_LIMIT)
    if (topTags.some((tag) => tag.name === currentTag)) {
      return topTags
    }

    const selectedTag = tags.find((tag) => tag.name === currentTag)
    return selectedTag
      ? [...tags.slice(0, SIDEBAR_LIMIT - 1), selectedTag]
      : topTags
  }, [currentTag, isTagExpanded, tags])

  const visibleMenus = useMemo(() => {
    if (isMenuExpanded || menus.length <= SIDEBAR_LIMIT) {
      return menus
    }

    const topMenus = menus.slice(0, SIDEBAR_LIMIT)
    if (topMenus.some((menu) => menu.name === currentMenu)) {
      return topMenus
    }

    const selectedMenu = menus.find((menu) => menu.name === currentMenu)
    return selectedMenu
      ? [...menus.slice(0, SIDEBAR_LIMIT - 1), selectedMenu]
      : topMenus
  }, [currentMenu, isMenuExpanded, menus])

  const updateQuery = (next: { tag?: string; category?: string }) => {
    router.replace(
      {
        pathname: "/tags",
        query: {
          tag: next.tag && next.tag !== DEFAULT_TAG ? next.tag : undefined,
          category:
            next.category && next.category !== DEFAULT_CATEGORY
              ? next.category
              : undefined,
        },
      },
      undefined,
      { shallow: true, scroll: false }
    )
  }

  const updatePage = (page: number) => {
    router.replace(
      {
        pathname: "/tags",
        query: {
          tag: currentTag !== DEFAULT_TAG ? currentTag : undefined,
          category: currentMenu !== DEFAULT_CATEGORY ? currentMenu : undefined,
          page: page > 1 ? page : undefined,
        },
      },
      undefined,
      { shallow: true, scroll: false }
    )
  }

  return (
    <StyledWrapper>
      <header className="hero">
        <div className="eyebrow">{language === "ko" ? "태그" : "Tags"}</div>
        <h1>{language === "ko" ? "태그별로 글 다시 보기" : "Browse posts by tag"}</h1>
        <p>
          {language === "ko"
            ? "왼쪽에서 태그와 메뉴를 고르면, 그 주제에 맞는 글만 오른쪽에 정리됩니다."
            : "Pick a tag and menu on the left, then browse matching posts on the right."}
        </p>
      </header>

      <section className="layout">
        <aside className="sidebar">
          <div className="side-card">
            <div className="side-title">{language === "ko" ? "태그" : "Tags"}</div>
            <div className="menu-list">
              {visibleTags.map((tag) => (
                <button
                  key={tag.name}
                  type="button"
                  className="menu-item"
                  data-active={currentTag === tag.name}
                  onClick={() => updateQuery({ tag: tag.name, category: currentMenu })}
                >
                  <span>{tag.name === DEFAULT_TAG ? DEFAULT_TAG : `#${tag.name}`}</span>
                  <span className="count">{tag.count}</span>
                </button>
              ))}
            </div>
            {tags.length > SIDEBAR_LIMIT && (
              <button
                type="button"
                className="side-toggle"
                onClick={() => setIsTagExpanded((value) => !value)}
              >
                {isTagExpanded
                  ? language === "ko" ? "접기" : "Show less"
                  : language === "ko" ? `전체 ${tags.length}개 보기` : `Show all ${tags.length}`}
              </button>
            )}
          </div>

          <div className="side-card">
            <div className="side-title">{language === "ko" ? "메뉴" : "Menu"}</div>
            <div className="menu-list">
              {visibleMenus.map((menu) => (
                <button
                  key={menu.name}
                  type="button"
                  className="menu-item"
                  data-active={currentMenu === menu.name}
                  onClick={() => updateQuery({ tag: currentTag, category: menu.name })}
                >
                  <span>{menu.name}</span>
                  <span className="count">{menu.count}</span>
                </button>
              ))}
            </div>
            {menus.length > SIDEBAR_LIMIT && (
              <button
                type="button"
                className="side-toggle"
                onClick={() => setIsMenuExpanded((value) => !value)}
              >
                {isMenuExpanded
                  ? language === "ko" ? "접기" : "Show less"
                  : language === "ko" ? `전체 ${menus.length}개 보기` : `Show all ${menus.length}`}
              </button>
            )}
          </div>
        </aside>

        <div className="result-panel">
          <div className="result-header">
            <div>
              <div className="result-eyebrow">{language === "ko" ? "결과" : "Results"}</div>
              <h2>
                {language === "ko" ? `${totalCount}개의 글` : `${totalCount} posts`}
              </h2>
            </div>
            <div className="result-meta">
              {currentTag !== DEFAULT_TAG && <span>#{currentTag}</span>}
              {currentMenu !== DEFAULT_CATEGORY && <span>{currentMenu}</span>}
              {totalPages > 1 && <span>{`${safePage} / ${totalPages}`}</span>}
            </div>
          </div>

          {visiblePosts.length === 0 ? (
            <div className="empty-state">
              <h3>{language === "ko" ? "조건에 맞는 글이 아직 없어요." : "No matching posts yet."}</h3>
              <p>
                {language === "ko"
                  ? "왼쪽에서 다른 태그나 메뉴를 골라보세요."
                  : "Choose another tag or menu from the left."}
              </p>
            </div>
          ) : (
            <div className="post-grid">
              {visiblePosts.map((post, index) => (
                <Link key={post.id} href={`/${post.slug}`} className="post-card">
                  <span className="post-index">
                    {String((safePage - 1) * PAGE_SIZE + index + 1).padStart(2, "0")}
                  </span>
                  <div className="post-body">
                    <h3>{post.title}</h3>
                    {post.summary && <p>{post.summary}</p>}
                  </div>
                  <div className="meta">
                    {post.menu?.[0] && <span className="badge">{post.menu[0]}</span>}
                    <span className="date">
                      {formatDate(post.date?.start_date || post.createdTime, locale)}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <nav className="pagination" aria-label="Tags pagination">
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
        </div>
      </section>
    </StyledWrapper>
  )
}

export default Tags

const StyledWrapper = styled.div`
  display: grid;
  gap: 1.2rem;
  padding: 1.5rem 0 3rem;

  .hero {
    padding: 1.5rem 1.6rem;
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    border-radius: 1.4rem;
    background-color: ${({ theme }) =>
      theme.scheme === "light" ? "rgba(255, 255, 255, 0.82)" : "rgba(29, 36, 48, 0.84)"};
  }

  .eyebrow,
  .result-eyebrow,
  .side-title {
    margin-bottom: 0.5rem;
    color: ${({ theme }) => theme.colors.gray10};
    font-size: 0.78rem;
    line-height: 1rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  h1 {
    margin-bottom: 0.8rem;
    font-size: 2rem;
    line-height: 2.45rem;
    font-weight: 800;
  }

  .hero p {
    max-width: 40rem;
    color: ${({ theme }) => theme.colors.gray11};
    line-height: 1.75rem;
  }

  .layout {
    display: grid;
    gap: 1rem;
    min-width: 0;

    @media (min-width: 1024px) {
      grid-template-columns: minmax(212px, 0.76fr) minmax(0, 2.84fr);
      align-items: start;
    }
  }

  .sidebar {
    display: grid;
    gap: 1rem;
    min-width: 0;
  }

  .side-card,
  .result-panel {
    min-width: 0;
    width: 100%;
    box-sizing: border-box;
    overflow: hidden;
    padding: 1rem;
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    border-radius: 1.25rem;
    background-color: ${({ theme }) =>
      theme.scheme === "light" ? "rgba(255, 255, 255, 0.82)" : "rgba(29, 36, 48, 0.84)"};
  }

  .menu-list {
    display: grid;
    gap: 0.55rem;
    min-width: 0;
  }

  .side-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    width: calc(100% - 0.2rem);
    min-height: 2.25rem;
    box-sizing: border-box;
    margin: 0.7rem auto 0;
    padding: 0 0.75rem;
    border: 1px dashed ${({ theme }) => theme.colors.gray6};
    border-radius: 0.85rem;
    background-color: transparent;
    color: ${({ theme }) => theme.colors.gray10};
    font-size: 0.78rem;
    line-height: 1rem;
    font-weight: 700;
    text-align: center;
    white-space: nowrap;
    cursor: pointer;
    transition:
      border-color 180ms ease,
      background-color 180ms ease,
      color 180ms ease;

    &:hover {
      border-color: ${({ theme }) => theme.colors.gray8};
      background-color: ${({ theme }) => theme.colors.gray2};
      color: ${({ theme }) => theme.colors.gray12};
    }
  }

  .menu-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.6rem;
    width: 100%;
    min-width: 0;
    min-height: 2.9rem;
    box-sizing: border-box;
    overflow: hidden;
    padding: 0.65rem 0.82rem;
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    border-radius: 1rem;
    background-color: ${({ theme }) => theme.colors.gray2};
    color: ${({ theme }) => theme.colors.gray11};
    font-size: 0.88rem;
    line-height: 1.25rem;
    font-weight: 600;
    text-align: left;
    transition:
      border-color 180ms ease,
      background-color 180ms ease,
      transform 180ms ease;

    &:hover {
      transform: translateY(-1px);
      border-color: ${({ theme }) => theme.colors.gray8};
      background-color: ${({ theme }) => theme.colors.gray3};
    }

    &[data-active="true"] {
      border-color: rgba(59, 130, 246, 0.28);
      background-color: ${({ theme }) =>
        theme.scheme === "light" ? "rgba(226, 232, 240, 0.86)" : "rgba(51, 65, 85, 0.72)"};
      color: ${({ theme }) => theme.colors.gray12};
    }
  }

  .count,
  .result-meta span,
  .badge,
  .date {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 1.8rem;
    padding: 0.28rem 0.68rem;
    border-radius: 9999px;
    background-color: ${({ theme }) =>
      theme.scheme === "light" ? "rgba(241, 245, 249, 0.72)" : "rgba(45, 55, 72, 0.78)"};
    color: ${({ theme }) => theme.colors.gray10};
    font-size: 0.76rem;
    line-height: 1rem;
    font-weight: 600;
  }

  .result-panel {
    display: grid;
    gap: 1rem;
  }

  .result-header {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: start;
  }

  .result-header h2 {
    font-size: 1.35rem;
    line-height: 1.8rem;
    font-weight: 800;
  }

  .result-meta,
  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
    align-items: center;
  }

  .result-meta {
    justify-content: flex-end;
  }

  .empty-state {
    padding: 1.25rem 1rem;
    border-radius: 1rem;
    background-color: ${({ theme }) => theme.colors.gray2};
  }

  .empty-state h3 {
    margin-bottom: 0.45rem;
    font-size: 1.08rem;
    line-height: 1.6rem;
    font-weight: 700;
  }

  .empty-state p {
    color: ${({ theme }) => theme.colors.gray11};
    line-height: 1.7rem;
  }

  .post-grid {
    display: grid;
    gap: 0.35rem;
  }

  .post-card {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: 0.9rem;
    align-items: start;
    padding: 0.9rem 0.95rem;
    border-radius: 0.9rem;
    border-bottom: 1px solid ${({ theme }) =>
      theme.scheme === "light" ? "rgba(203, 213, 225, 0.56)" : "rgba(71, 85, 105, 0.5)"};
    transition:
      color 180ms ease,
      background-color 180ms ease;

    &:hover {
      background-color: ${({ theme }) =>
        theme.scheme === "light" ? "rgba(248, 250, 252, 0.72)" : "rgba(31, 41, 55, 0.52)"};
    }

    &:last-child {
      border-bottom: 0;
    }
  }

  .post-index {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 2.15rem;
    height: 2.15rem;
    border-radius: 0.75rem;
    background: ${({ theme }) =>
      theme.scheme === "light"
        ? "linear-gradient(135deg, rgba(20, 184, 166, 0.18), rgba(59, 130, 246, 0.2))"
        : "linear-gradient(135deg, rgba(45, 212, 191, 0.22), rgba(96, 165, 250, 0.2))"};
    color: ${({ theme }) => (theme.scheme === "light" ? "#0f766e" : "#99f6e4")};
    font-size: 0.76rem;
    line-height: 1rem;
    font-weight: 800;
    box-shadow: inset 0 0 0 1px
      ${({ theme }) =>
        theme.scheme === "light"
          ? "rgba(20, 184, 166, 0.18)"
          : "rgba(153, 246, 228, 0.16)"};
  }

  .post-body {
    min-width: 0;
    display: grid;
    gap: 0.35rem;
  }

  .meta {
    justify-content: flex-end;
  }

  .post-card h3 {
    font-size: 1rem;
    line-height: 1.45rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.gray12};
    word-break: keep-all;
  }

  .post-card p {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    color: ${({ theme }) => theme.colors.gray11};
    font-size: 0.88rem;
    line-height: 1.55rem;
    word-break: keep-all;
  }

  @media (max-width: 768px) {
    .post-card {
      grid-template-columns: auto minmax(0, 1fr);
      gap: 0.65rem;
      padding: 0.85rem 0.75rem;
    }

    .meta {
      justify-content: flex-start;
      grid-column: 2;
    }
  }

  .pagination {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 0.45rem;
    padding-top: 0.35rem;
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
