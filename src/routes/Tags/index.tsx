import styled from "@emotion/styled"
import Link from "next/link"
import { useRouter } from "next/router"
import { useMemo } from "react"
import { DEFAULT_CATEGORY } from "src/constants"
import { useUiLanguage } from "src/contexts/UiLanguageContext"
import { useCategoriesQuery } from "src/hooks/useCategoriesQuery"
import usePostsQuery from "src/hooks/usePostsQuery"
import { useTagsQuery } from "src/hooks/useTagsQuery"
import { formatDate } from "src/libs/utils"
import { filterPosts } from "src/libs/utils/notion"

const DEFAULT_TAG = "전체 태그"

const Tags: React.FC = () => {
  const router = useRouter()
  const { language, locale } = useUiLanguage()
  const posts = usePostsQuery()
  const tags = useTagsQuery()
  const categories = useCategoriesQuery()

  const currentTag =
    typeof router.query.tag === "string" && router.query.tag.length > 0
      ? router.query.tag
      : DEFAULT_TAG
  const currentCategory =
    typeof router.query.category === "string" && router.query.category.length > 0
      ? router.query.category
      : DEFAULT_CATEGORY

  const { filteredPosts, sortedTags, sortedCategories } = useMemo(() => {
    const publicPosts = filterPosts(posts)
    const nextFilteredPosts = publicPosts.filter((post) => {
      const matchesTag =
        currentTag === DEFAULT_TAG || (post.tags && post.tags.includes(currentTag))
      const matchesCategory =
        currentCategory === DEFAULT_CATEGORY ||
        post.menu?.[0] === currentCategory

      return matchesTag && matchesCategory
    })

    const nextSortedTags = [
      { name: DEFAULT_TAG, count: publicPosts.length },
      ...Object.entries(tags)
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count })),
    ]

    const nextSortedCategories = Object.entries(categories).map(([name, count]) => ({
      name,
      count,
    }))

    return {
      filteredPosts: nextFilteredPosts,
      sortedTags: nextSortedTags,
      sortedCategories: nextSortedCategories,
    }
  }, [categories, currentCategory, currentTag, posts, tags])

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

  return (
    <StyledWrapper>
      <header className="hero">
        <div className="eyebrow">{language === "ko" ? "태그" : "Tags"}</div>
        <h1>
          {language === "ko"
            ? "태그 중심으로 글을 다시 묶어 보는 탐색 페이지입니다"
            : "Explore posts again through tags"}
        </h1>
        <p>
          {language === "ko"
            ? "React, Next.js, 트러블슈팅 같은 주제별로 글을 다시 모아 보면 블로그를 조금 더 자료처럼 둘러보기 좋아집니다."
            : "Grouping posts again by topics like React, Next.js, and troubleshooting makes the blog easier to use as a reference."}
        </p>
        <div className="stats">
          <span>
            {language === "ko"
              ? `${Object.keys(tags).length}개 태그`
              : `${Object.keys(tags).length} tags`}
          </span>
          <span>{language === "ko" ? `${filteredPosts.length}개 글` : `${filteredPosts.length} posts`}</span>
        </div>
      </header>

      <section className="filters">
        <div className="filter-block">
          <div className="filter-label">{language === "ko" ? "태그" : "Tags"}</div>
          <div className="chip-list">
            {sortedTags.map((tag) => (
              <button
                key={tag.name}
                type="button"
                data-active={currentTag === tag.name}
                onClick={() => updateQuery({ tag: tag.name, category: currentCategory })}
              >
                <span>
                  {tag.name === DEFAULT_TAG
                    ? language === "ko"
                      ? "전체 태그"
                      : "All tags"
                    : `#${tag.name}`}
                </span>
                <span className="count">{tag.count}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="filter-block">
          <div className="filter-label">{language === "ko" ? "메뉴" : "Menu"}</div>
          <div className="chip-list">
            {sortedCategories.map((category) => (
              <button
                key={category.name}
                type="button"
                data-active={currentCategory === category.name}
                onClick={() =>
                  updateQuery({ tag: currentTag, category: category.name })
                }
              >
                <span>{category.name}</span>
                <span className="count">{category.count}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {filteredPosts.length === 0 ? (
        <div className="empty-state">
          <h2>{language === "ko" ? "조건에 맞는 글이 아직 없어요." : "No matching posts yet."}</h2>
          <p>
            {language === "ko"
              ? "태그나 메뉴를 바꾸면 다른 기록을 바로 찾아볼 수 있습니다."
              : "Try a different tag or menu to browse other posts."}
          </p>
        </div>
      ) : (
        <div className="post-list">
          {filteredPosts.map((post) => (
            <Link key={post.id} href={`/${post.slug}`} className="post-card">
              <div className="meta">
                {post.menu?.[0] && (
                  <span className="category">{post.menu?.[0]}</span>
                )}
                <time>{formatDate(post.date?.start_date || post.createdTime, locale)}</time>
              </div>
              <h2>{post.title}</h2>
              {post.summary && <p>{post.summary}</p>}
              {!!post.tags?.length && (
                <div className="tag-row">
                  {post.tags.slice(0, 4).map((tag) => (
                    <span key={tag} className="tag">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </StyledWrapper>
  )
}

export default Tags

const StyledWrapper = styled.div`
  padding: 2rem 0 3rem;

  .hero {
    margin-bottom: 1.25rem;
    padding: 1.4rem 1.5rem;
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    border-radius: 1.4rem;
    background-color: ${({ theme }) =>
      theme.scheme === "light" ? "rgba(255, 255, 255, 0.78)" : "rgba(29, 36, 48, 0.84)"};
  }

  .eyebrow {
    margin-bottom: 0.6rem;
    font-size: 0.78rem;
    line-height: 1rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.gray10};
  }

  h1 {
    margin-bottom: 0.85rem;
    font-size: 2rem;
    line-height: 2.45rem;
    font-weight: 800;
  }

  .hero p {
    max-width: 42rem;
    margin: 0 0 1rem;
    line-height: 1.8rem;
    color: ${({ theme }) => theme.colors.gray11};
  }

  .stats {
    display: flex;
    flex-wrap: wrap;
    gap: 0.55rem;

    span {
      display: inline-flex;
      align-items: center;
      min-height: 1.9rem;
      padding: 0.3rem 0.7rem;
      border-radius: 9999px;
      background-color: ${({ theme }) => theme.colors.gray3};
      color: ${({ theme }) => theme.colors.gray10};
      font-size: 0.82rem;
      line-height: 1rem;
      font-weight: 600;
    }
  }

  .filters {
    display: grid;
    gap: 0.9rem;
    margin-bottom: 1.5rem;
    padding: 1rem 1.05rem;
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    border-radius: 1.2rem;
    background-color: ${({ theme }) =>
      theme.scheme === "light" ? "rgba(255, 255, 255, 0.72)" : "rgba(29, 36, 48, 0.8)"};
  }

  .filter-block {
    display: grid;
    gap: 0.55rem;
  }

  .filter-label {
    font-size: 0.76rem;
    line-height: 1rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.gray10};
  }

  .chip-list {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .chip-list button {
    display: inline-flex;
    align-items: center;
    gap: 0.45rem;
    min-height: 1.95rem;
    padding: 0.35rem 0.72rem;
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    border-radius: 9999px;
    background-color: ${({ theme }) => theme.colors.gray2};
    color: ${({ theme }) => theme.colors.gray10};
    font-size: 0.8rem;
    line-height: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: border-color 180ms ease, background-color 180ms ease, color 180ms ease,
      transform 180ms ease;

    &:hover {
      transform: translateY(-1px);
      border-color: ${({ theme }) => theme.colors.gray8};
      background-color: ${({ theme }) => theme.colors.gray3};
    }

    &[data-active="true"] {
      border-color: rgba(59, 130, 246, 0.28);
      background: linear-gradient(
        135deg,
        rgba(59, 130, 246, 0.14),
        rgba(37, 99, 235, 0.06)
      );
      color: ${({ theme }) => theme.colors.gray12};
    }
  }

  .count {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    min-width: 1.25rem;
    height: 1.25rem;
    padding: 0 0.28rem;
    border-radius: 9999px;
    background-color: ${({ theme }) => theme.colors.gray4};
    font-size: 0.68rem;
    line-height: 0.9rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.gray10};
  }

  .empty-state {
    padding: 1.5rem;
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    border-radius: 1.2rem;
    background-color: ${({ theme }) =>
      theme.scheme === "light" ? "rgba(255, 255, 255, 0.74)" : "rgba(29, 36, 48, 0.8)"};
  }

  .empty-state h2 {
    margin-bottom: 0.5rem;
    font-size: 1.05rem;
    line-height: 1.45rem;
    font-weight: 700;
  }

  .empty-state p {
    color: ${({ theme }) => theme.colors.gray11};
    line-height: 1.7rem;
  }

  .post-list {
    display: grid;
    gap: 1rem;
  }

  .post-card {
    display: block;
    padding: 1.1rem 1.15rem;
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    border-radius: 1.2rem;
    background-color: ${({ theme }) =>
      theme.scheme === "light" ? "rgba(255, 255, 255, 0.8)" : "rgba(29, 36, 48, 0.82)"};
    transition: transform 180ms ease, border-color 180ms ease, box-shadow 180ms ease;

    &:hover {
      transform: translateY(-2px);
      border-color: ${({ theme }) => theme.colors.gray8};
      box-shadow: 0 12px 20px -14px rgba(0, 0, 0, 0.18);
    }
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.7rem;
  }

  .category,
  time,
  .tag {
    display: inline-flex;
    align-items: center;
    min-height: 1.75rem;
    padding: 0.25rem 0.6rem;
    border-radius: 9999px;
    background-color: ${({ theme }) => theme.colors.gray3};
    color: ${({ theme }) => theme.colors.gray10};
    font-size: 0.76rem;
    line-height: 1rem;
    font-weight: 600;
    white-space: nowrap;
  }

  h2 {
    margin-bottom: 0.55rem;
    font-size: 1.15rem;
    line-height: 1.75rem;
    font-weight: 800;
  }

  .post-card p {
    margin: 0 0 0.9rem;
    color: ${({ theme }) => theme.colors.gray11};
    line-height: 1.7rem;
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .tag-row {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
  }
`
