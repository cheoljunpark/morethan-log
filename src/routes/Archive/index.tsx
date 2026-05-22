import styled from "@emotion/styled"
import Link from "next/link"
import { useRouter } from "next/router"
import { useMemo } from "react"
import { DEFAULT_CATEGORY } from "src/constants"
import { useUiLanguage } from "src/contexts/UiLanguageContext"
import usePostsQuery from "src/hooks/usePostsQuery"
import { formatDate } from "src/libs/utils"
import { filterPosts } from "src/libs/utils/notion"

const DEFAULT_YEAR = "전체 연도"

const Archive: React.FC = () => {
  const router = useRouter()
  const { language, locale } = useUiLanguage()
  const posts = usePostsQuery()

  const currentYear =
    typeof router.query.year === "string" && router.query.year.length > 0
      ? router.query.year
      : DEFAULT_YEAR
  const currentCategory =
    typeof router.query.category === "string" && router.query.category.length > 0
      ? router.query.category
      : DEFAULT_CATEGORY

  const { groups, totalCount, years, categories } = useMemo(() => {
    const publicPosts = filterPosts(posts)
    const yearSet = new Set<string>()
    const categoryMap = new Map<string, number>()

    publicPosts.forEach((post) => {
      const rawDate = post.date?.start_date || post.createdTime
      const date = new Date(rawDate)
      yearSet.add(`${date.getFullYear()}`)

      const category = post.menu?.[0]
      if (category) {
        categoryMap.set(category, (categoryMap.get(category) || 0) + 1)
      }
    })

    const filteredPosts = publicPosts.filter((post) => {
      const rawDate = post.date?.start_date || post.createdTime
      const postYear = `${new Date(rawDate).getFullYear()}`
      const postCategory = post.menu?.[0] || DEFAULT_CATEGORY

      const matchesYear = currentYear === DEFAULT_YEAR || postYear === currentYear
      const matchesCategory =
        currentCategory === DEFAULT_CATEGORY || postCategory === currentCategory

      return matchesYear && matchesCategory
    })

    const archiveMap = new Map<
      string,
      {
        year: string
        months: Map<
          string,
          {
            monthLabel: string
            posts: typeof filteredPosts
          }
        >
      }
    >()

    filteredPosts.forEach((post) => {
      const rawDate = post.date?.start_date || post.createdTime
      const date = new Date(rawDate)
      const year = `${date.getFullYear()}`
      const monthKey = `${date.getMonth() + 1}`.padStart(2, "0")
      const monthLabel = date.toLocaleString(locale, {
        month: "long",
      })

      if (!archiveMap.has(year)) {
        archiveMap.set(year, { year, months: new Map() })
      }

      const yearEntry = archiveMap.get(year)!

      if (!yearEntry.months.has(monthKey)) {
        yearEntry.months.set(monthKey, {
          monthLabel,
          posts: [],
        })
      }

      yearEntry.months.get(monthKey)!.posts.push(post)
    })

    const nextGroups = Array.from(archiveMap.values())
      .sort((a, b) => Number(b.year) - Number(a.year))
      .map((yearEntry) => ({
        year: yearEntry.year,
        months: Array.from(yearEntry.months.entries())
          .sort(([a], [b]) => Number(b) - Number(a))
          .map(([month, value]) => ({
            month,
            monthLabel: value.monthLabel,
            posts: value.posts,
          })),
      }))

    return {
      groups: nextGroups,
      totalCount: filteredPosts.length,
      years: [DEFAULT_YEAR, ...Array.from(yearSet).sort((a, b) => Number(b) - Number(a))],
      categories: [
        { name: DEFAULT_CATEGORY, count: publicPosts.length },
        ...Array.from(categoryMap.entries())
          .sort((a, b) => b[1] - a[1])
          .map(([name, count]) => ({ name, count })),
      ],
    }
  }, [currentCategory, currentYear, locale, posts])

  const updateQuery = (next: { year?: string; category?: string }) => {
    router.replace(
      {
        pathname: "/archive",
        query: {
          year: next.year && next.year !== DEFAULT_YEAR ? next.year : undefined,
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
        <div className="eyebrow">{language === "ko" ? "아카이브" : "Archive"}</div>
        <h1>
          {language === "ko"
            ? "연도와 메뉴 기준으로 글을 다시 찾아보는 공간입니다"
            : "Browse posts again by year and menu"}
        </h1>
        <p>
          {language === "ko"
            ? "최신 글만 훑는 대신, 어떤 시기에 무엇을 공부하고 기록했는지 한 번에 살펴볼 수 있도록 정리했습니다."
            : "Instead of only reading the latest posts, this archive helps you revisit what was studied and recorded over time."}
        </p>
        <div className="stats">
          <span>{language === "ko" ? `${totalCount}개 글` : `${totalCount} posts`}</span>
          <span>{language === "ko" ? `${groups.length}개 연도` : `${groups.length} years`}</span>
        </div>
      </header>

      <section className="filters">
        <div className="filter-block">
          <div className="filter-label">{language === "ko" ? "연도" : "Year"}</div>
          <div className="chip-list">
            {years.map((year) => (
              <button
                key={year}
                type="button"
                data-active={currentYear === year}
                onClick={() => updateQuery({ year, category: currentCategory })}
              >
                {year}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-block">
          <div className="filter-label">{language === "ko" ? "메뉴" : "Menu"}</div>
          <div className="chip-list">
            {categories.map((category) => (
              <button
                key={category.name}
                type="button"
                data-active={currentCategory === category.name}
                onClick={() =>
                  updateQuery({ year: currentYear, category: category.name })
                }
              >
                <span>{category.name}</span>
                <span className="count">{category.count}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {groups.length === 0 ? (
        <div className="empty-state">
          <h2>조건에 맞는 글이 아직 없어요.</h2>
          <p>
            {language === "ko"
              ? "연도나 메뉴 필터를 바꾸면 다른 기록을 바로 찾아볼 수 있습니다."
              : "Try a different year or menu filter to find other entries."}
          </p>
        </div>
      ) : (
        <div className="timeline">
          {groups.map((group) => (
            <section key={group.year} className="year-section">
              <div className="year">{group.year}</div>
              <div className="months">
                {group.months.map((month) => (
                  <section key={`${group.year}-${month.month}`} className="month-block">
                    <div className="month-header">
                      <h2>{month.monthLabel}</h2>
                      <span>{month.posts.length}</span>
                    </div>
                    <div className="post-list">
                      {month.posts.map((post) => (
                        <Link key={post.id} href={`/${post.slug}`} className="post-row">
                          <div className="post-main">
                            <h3>{post.title}</h3>
                            {post.summary && <p>{post.summary}</p>}
                          </div>
                          <div className="post-meta">
                            {post.menu?.[0] && (
                              <span className="category">
                                {post.menu?.[0]}
                              </span>
                            )}
                            <time>
                              {formatDate(
                                post.date?.start_date || post.createdTime,
                                locale
                              )}
                            </time>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </StyledWrapper>
  )
}

export default Archive

const StyledWrapper = styled.div`
  padding: 2rem 0 3rem;

  .hero {
    margin-bottom: 1.25rem;
    padding: 1.4rem 1.5rem;
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    border-radius: 1.4rem;
    background-color: ${({ theme }) =>
      theme.scheme === "light" ? "rgba(255, 255, 255, 0.78)" : "rgba(29, 36, 48, 0.84)"};

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

    p {
      max-width: 42rem;
      margin: 0 0 1rem;
      line-height: 1.8rem;
      color: ${({ theme }) => theme.colors.gray11};
    }
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

    button {
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
      transition: border-color 180ms ease, background-color 180ms ease,
        color 180ms ease, transform 180ms ease;

      &:hover {
        transform: translateY(-1px);
        border-color: ${({ theme }) => theme.colors.gray8};
        background-color: ${({ theme }) => theme.colors.gray3};
      }

      &[data-active="true"] {
        border-color: rgba(20, 184, 166, 0.35);
        background: linear-gradient(
          135deg,
          rgba(20, 184, 166, 0.18),
          rgba(15, 118, 110, 0.08)
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
  }

  .empty-state {
    padding: 1.5rem;
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    border-radius: 1.2rem;
    background-color: ${({ theme }) =>
      theme.scheme === "light" ? "rgba(255, 255, 255, 0.74)" : "rgba(29, 36, 48, 0.8)"};

    h2 {
      margin-bottom: 0.5rem;
      font-size: 1.05rem;
      line-height: 1.45rem;
      font-weight: 700;
    }

    p {
      color: ${({ theme }) => theme.colors.gray11};
      line-height: 1.7rem;
    }
  }

  .timeline {
    display: grid;
    gap: 1.5rem;
  }

  .year-section {
    display: grid;
    gap: 1rem;

    @media (min-width: 1024px) {
      grid-template-columns: 7rem minmax(0, 1fr);
      align-items: start;
    }
  }

  .year {
    position: sticky;
    top: 4.5rem;
    align-self: start;
    font-size: 1.7rem;
    line-height: 2rem;
    font-weight: 800;
    letter-spacing: -0.03em;
  }

  .months {
    display: grid;
    gap: 1rem;
  }

  .month-block {
    padding: 1rem 1rem 0.5rem;
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    border-radius: 1.25rem;
    background-color: ${({ theme }) =>
      theme.scheme === "light" ? "rgba(255, 255, 255, 0.8)" : "rgba(29, 36, 48, 0.82)"};
  }

  .month-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-bottom: 0.75rem;

    h2 {
      font-size: 1rem;
      line-height: 1.4rem;
      font-weight: 700;
    }

    span {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      min-width: 1.6rem;
      height: 1.6rem;
      padding: 0 0.45rem;
      border-radius: 9999px;
      background-color: ${({ theme }) => theme.colors.gray3};
      color: ${({ theme }) => theme.colors.gray10};
      font-size: 0.75rem;
      line-height: 1rem;
      font-weight: 700;
    }
  }

  .post-list {
    display: grid;
  }

  .post-row {
    display: grid;
    gap: 0.75rem;
    padding: 0.9rem 0;
    border-top: 1px solid ${({ theme }) => theme.colors.gray5};

    &:first-of-type {
      border-top: none;
      padding-top: 0;
    }

    @media (min-width: 768px) {
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: start;
    }
  }

  .post-main {
    min-width: 0;

    h3 {
      margin-bottom: 0.35rem;
      font-size: 1.02rem;
      line-height: 1.55rem;
      font-weight: 700;
    }

    p {
      margin: 0;
      color: ${({ theme }) => theme.colors.gray11};
      line-height: 1.65rem;
      display: -webkit-box;
      overflow: hidden;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }

  .post-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    align-items: center;

    @media (min-width: 768px) {
      justify-content: flex-end;
    }

    .category,
    time {
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
  }
`
