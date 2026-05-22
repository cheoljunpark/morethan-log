import styled from "@emotion/styled"
import Link from "next/link"
import { useRouter } from "next/router"
import { useMemo } from "react"
import { useUiLanguage } from "src/contexts/UiLanguageContext"
import usePostsQuery from "src/hooks/usePostsQuery"
import { formatDate } from "src/libs/utils"
import { filterPosts } from "src/libs/utils/notion"

const DEFAULT_SERIES = "전체 시리즈"

const Series: React.FC = () => {
  const router = useRouter()
  const { language, locale } = useUiLanguage()
  const posts = usePostsQuery()
  const currentSeries =
    typeof router.query.series === "string" && router.query.series.length > 0
      ? router.query.series
      : DEFAULT_SERIES

  const { filteredPosts, sortedSeries } = useMemo(() => {
    const publicPosts = filterPosts(posts).filter((post) => post.type?.[0] === "Post")
    const seriesMap = new Map<string, number>()

    publicPosts.forEach((post) => {
      const series = post.series?.[0]
      if (!series) return
      seriesMap.set(series, (seriesMap.get(series) || 0) + 1)
    })

    const nextFilteredPosts = publicPosts.filter((post) => {
      if (currentSeries === DEFAULT_SERIES) return true
      return post.series?.[0] === currentSeries
    })

    const nextSortedSeries = [
      { name: DEFAULT_SERIES, count: publicPosts.length },
      ...Array.from(seriesMap.entries())
        .sort((a, b) => b[1] - a[1])
        .map(([name, count]) => ({ name, count })),
    ]

    return {
      filteredPosts: nextFilteredPosts,
      sortedSeries: nextSortedSeries,
    }
  }, [currentSeries, posts])

  const updateQuery = (series: string) => {
    router.replace(
      {
        pathname: "/series",
        query: {
          series: series !== DEFAULT_SERIES ? series : undefined,
        },
      },
      undefined,
      { shallow: true, scroll: false }
    )
  }

  return (
    <StyledWrapper>
      <header className="hero">
        <div className="eyebrow">{language === "ko" ? "시리즈" : "Series"}</div>
        <h1>
          {language === "ko"
            ? "연재 흐름대로 글을 이어 읽는 페이지입니다"
            : "Read connected posts in series order"}
        </h1>
        <p>
          {language === "ko"
            ? "한 번에 끝나는 글보다, 주제를 조금씩 확장해 기록한 시리즈를 따라가며 맥락 있게 읽을 수 있도록 정리했습니다."
            : "Instead of isolated posts, this page helps you follow a topic through a connected sequence of notes."}
        </p>
        <div className="stats">
          <span>{language === "ko" ? `${sortedSeries.length - 1}개 시리즈` : `${sortedSeries.length - 1} series`}</span>
          <span>{language === "ko" ? `${filteredPosts.length}개 글` : `${filteredPosts.length} posts`}</span>
        </div>
      </header>

      <section className="filters">
        <div className="filter-label">{language === "ko" ? "시리즈" : "Series"}</div>
        <div className="chip-list">
          {sortedSeries.map((series) => (
            <button
              key={series.name}
              type="button"
              data-active={currentSeries === series.name}
              onClick={() => updateQuery(series.name)}
            >
              <span>{series.name}</span>
              <span className="count">{series.count}</span>
            </button>
          ))}
        </div>
      </section>

      {filteredPosts.length === 0 ? (
        <div className="empty-state">
          <h2>
            {language === "ko"
              ? "조건에 맞는 시리즈 글이 아직 없어요."
              : "No matching series posts yet."}
          </h2>
          <p>
            {language === "ko"
              ? "다른 시리즈를 고르면 이어 읽을 수 있는 글 묶음을 바로 볼 수 있습니다."
              : "Choose another series to browse a different sequence of posts."}
          </p>
        </div>
      ) : (
        <div className="post-list">
          {filteredPosts.map((post, index) => (
            <Link key={post.id} href={`/${post.slug}`} className="post-card">
              <div className="meta">
                {post.series?.[0] && <span className="series">{post.series[0]}</span>}
                <span className="step">
                  {language === "ko" ? `${index + 1}편` : `Part ${index + 1}`}
                </span>
                <time>{formatDate(post.date?.start_date || post.createdTime, locale)}</time>
              </div>
              <h2>{post.title}</h2>
              {post.summary && <p>{post.summary}</p>}
              {post.menu?.[0] && (
                <div className="category">{post.menu?.[0]}</div>
              )}
            </Link>
          ))}
        </div>
      )}
    </StyledWrapper>
  )
}

export default Series

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
  }

  .stats span,
  .series,
  .step,
  time,
  .category,
  .count {
    display: inline-flex;
    align-items: center;
    min-height: 1.8rem;
    padding: 0.25rem 0.6rem;
    border-radius: 9999px;
    background-color: ${({ theme }) => theme.colors.gray3};
    color: ${({ theme }) => theme.colors.gray10};
    font-size: 0.76rem;
    line-height: 1rem;
    font-weight: 600;
    white-space: nowrap;
  }

  .filters {
    display: grid;
    gap: 0.55rem;
    margin-bottom: 1.5rem;
    padding: 1rem 1.05rem;
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    border-radius: 1.2rem;
    background-color: ${({ theme }) =>
      theme.scheme === "light" ? "rgba(255, 255, 255, 0.72)" : "rgba(29, 36, 48, 0.8)"};
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
      border-color: rgba(20, 184, 166, 0.35);
      background: linear-gradient(
        135deg,
        rgba(20, 184, 166, 0.18),
        rgba(15, 118, 110, 0.08)
      );
      color: ${({ theme }) => theme.colors.gray12};
    }
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
`
