import styled from "@emotion/styled"
import Image from "next/image"
import Link from "next/link"
import { useMemo } from "react"
import { useUiLanguage } from "src/contexts/UiLanguageContext"
import usePostsQuery from "src/hooks/usePostsQuery"
import { formatDate } from "src/libs/utils"
import { filterPosts } from "src/libs/utils/notion"

const HomeLanding: React.FC = () => {
  const { language, locale } = useUiLanguage()
  const posts = usePostsQuery()

  const { latestPosts, popularPosts, recommendedPost } = useMemo(() => {
    const publicPosts = filterPosts(posts)
    const latest = publicPosts.slice(0, 4)

    const popular = [...publicPosts]
      .sort((a, b) => {
        const score = (post: (typeof publicPosts)[number]) => {
          if (post.series?.[0]) return 4
          if (post.thumbnail) return 3
          if (post.summary) return 2
          if (post.tags?.length) return 1
          return 0
        }

        const scoreDiff = score(b) - score(a)
        if (scoreDiff !== 0) return scoreDiff

        const aTime = new Date(a.date?.start_date || a.createdTime).getTime()
        const bTime = new Date(b.date?.start_date || b.createdTime).getTime()
        return bTime - aTime
      })
      .slice(0, 4)

    return {
      latestPosts: latest,
      popularPosts: popular,
      recommendedPost: popular[0] || latest[0] || null,
    }
  }, [posts])

  return (
    <StyledWrapper>
      {recommendedPost && (
        <section className="hero">
          <div className="hero-copy">
            <div className="eyebrow">{language === "ko" ? "추천 글" : "Recommended"}</div>
            <h1>{recommendedPost.title}</h1>
            {recommendedPost.summary && <p>{recommendedPost.summary}</p>}
            <div className="meta">
              <span>
                {recommendedPost.menu?.[0] || (language === "ko" ? "글" : "Post")}
              </span>
              <time>
                {formatDate(
                  recommendedPost.date?.start_date || recommendedPost.createdTime,
                  locale
                )}
              </time>
            </div>
          </div>
          <Link href={`/${recommendedPost.slug}`} className="hero-link">
            {language === "ko" ? "바로 읽기" : "Read now"}
          </Link>
        </section>
      )}

      <section className="content-grid">
        <div className="section-block">
          <div className="section-header">
            <h2>{language === "ko" ? "최신글" : "Latest posts"}</h2>
            <Link href="/archive">{language === "ko" ? "전체" : "All"}</Link>
          </div>

          <div className="list-stack">
            {latestPosts.map((post) => (
              <Link key={post.id} href={`/${post.slug}`} className="list-item">
                <div className="item-main">
                  <div className="title">{post.title}</div>
                  <div className="chips">
                    <span>
                      {post.menu?.[0] || (language === "ko" ? "글" : "Post")}
                    </span>
                    <time>{formatDate(post.date?.start_date || post.createdTime, locale)}</time>
                  </div>
                </div>
                {post.thumbnail && (
                  <div className="thumb" aria-hidden="true">
                    <Image
                      src={post.thumbnail}
                      fill
                      alt=""
                      css={{ objectFit: "cover" }}
                    />
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>

        <div className="section-block">
          <div className="section-header">
            <h2>{language === "ko" ? "인기글" : "Popular posts"}</h2>
          </div>

          <div className="spotlight-grid">
            {popularPosts.map((post) => (
              <Link key={post.id} href={`/${post.slug}`} className="spotlight-card">
                <div className="title">{post.title}</div>
                <div className="chips">
                  <span>
                    {post.menu?.[0] || (language === "ko" ? "글" : "Post")}
                  </span>
                  <time>{formatDate(post.date?.start_date || post.createdTime, locale)}</time>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </StyledWrapper>
  )
}

export default HomeLanding

const StyledWrapper = styled.section`
  margin-bottom: 1.5rem;
  position: relative;

  &::before {
    content: "";
    position: absolute;
    inset: -1.2rem -0.6rem auto;
    height: 18rem;
    pointer-events: none;
    background:
      radial-gradient(circle at 18% 12%, rgba(56, 189, 248, 0.12), transparent 28%),
      radial-gradient(circle at 82% 18%, rgba(16, 185, 129, 0.1), transparent 30%),
      radial-gradient(circle at 50% 72%, rgba(37, 99, 235, 0.06), transparent 34%);
    filter: blur(18px);
    opacity: ${({ theme }) => (theme.scheme === "light" ? 1 : 0.72)};
    z-index: 0;
  }

  > * {
    position: relative;
    z-index: 1;
  }

  .hero,
  .section-block {
    margin-bottom: 1rem;
    padding: 1.25rem 1.3rem;
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    border-radius: 1.45rem;
    background:
      radial-gradient(circle at top right, rgba(59, 130, 246, 0.08), transparent 28%),
      radial-gradient(circle at top left, rgba(16, 185, 129, 0.07), transparent 24%),
      ${({ theme }) =>
        theme.scheme === "light"
          ? "rgba(255, 255, 255, 0.84)"
          : "rgba(29, 36, 48, 0.84)"};
  }

  .hero {
    display: grid;
    gap: 1rem;
    border-color: ${({ theme }) =>
      theme.scheme === "light" ? "rgba(116, 144, 189, 0.34)" : "rgba(83, 112, 158, 0.46)"};
    background:
      linear-gradient(135deg, rgba(255, 255, 255, 0.12), transparent 58%),
      radial-gradient(circle at 82% 18%, rgba(37, 99, 235, 0.16), transparent 26%),
      radial-gradient(circle at 16% 18%, rgba(20, 184, 166, 0.14), transparent 24%),
      ${({ theme }) =>
        theme.scheme === "light"
          ? "linear-gradient(135deg, rgba(240, 247, 255, 0.98), rgba(234, 244, 252, 0.92) 58%, rgba(228, 241, 252, 0.9))"
          : "linear-gradient(135deg, rgba(33, 43, 58, 0.94), rgba(28, 39, 54, 0.9) 58%, rgba(24, 34, 48, 0.88))"};
    box-shadow: 0 18px 48px -34px rgba(15, 23, 42, 0.28);

    @media (min-width: 1024px) {
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: end;
    }
  }

  .eyebrow {
    margin-bottom: 0.45rem;
    font-size: 0.76rem;
    line-height: 1rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.gray10};
  }

  .hero h1,
  .section-header h2 {
    color: ${({ theme }) => theme.colors.gray12};
  }

  .hero h1 {
    max-width: 46rem;
    margin-bottom: 0.6rem;
    font-size: 1.8rem;
    line-height: 2.35rem;
    font-weight: 800;
    letter-spacing: -0.04em;
    word-break: keep-all;
  }

  .hero p {
    max-width: 42rem;
    margin: 0 0 0.9rem;
    color: ${({ theme }) => theme.colors.gray11};
    line-height: 1.68rem;
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .hero-link {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    min-width: 5.4rem;
    height: 2.2rem;
    padding: 0 0.95rem;
    border-radius: 9999px;
    color: white;
    background: linear-gradient(135deg, #2563eb, #0f766e);
    font-size: 0.82rem;
    line-height: 1rem;
    font-weight: 700;
    white-space: nowrap;
  }

  .meta,
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
  }

  .meta span,
  .meta time,
  .chips span,
  .chips time {
    display: inline-flex;
    align-items: center;
    min-height: 1.7rem;
    padding: 0.22rem 0.58rem;
    border-radius: 9999px;
    background-color: ${({ theme }) => theme.colors.gray3};
    color: ${({ theme }) => theme.colors.gray10};
    font-size: 0.74rem;
    line-height: 1rem;
    font-weight: 600;
  }

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1rem;

    h2 {
      font-size: 1.35rem;
      line-height: 1.85rem;
      font-weight: 800;
    }

    a {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 4rem;
      min-width: 4rem;
      min-height: 1.9rem;
      color: ${({ theme }) => theme.colors.gray10};
      font-size: 0.8rem;
      line-height: 1rem;
      font-weight: 600;
      text-align: center;
      white-space: nowrap;
    }
  }

  .content-grid {
    display: grid;
    gap: 1rem;

    @media (min-width: 1024px) {
      grid-template-columns: minmax(0, 1.2fr) minmax(0, 0.8fr);
      align-items: start;
    }
  }

  .list-stack,
  .spotlight-grid {
    display: grid;
    gap: 0.8rem;
  }

  .section-block {
    backdrop-filter: blur(10px);
    box-shadow: 0 16px 44px -36px rgba(15, 23, 42, 0.26);
  }

  .content-grid > .section-block:first-of-type {
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.22), transparent 42%),
      radial-gradient(circle at 10% 0%, rgba(56, 189, 248, 0.09), transparent 24%),
      ${({ theme }) =>
        theme.scheme === "light"
          ? "rgba(255, 255, 255, 0.8)"
          : "rgba(30, 39, 52, 0.82)"};
  }

  .content-grid > .section-block:last-of-type {
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.18), transparent 44%),
      radial-gradient(circle at 88% 0%, rgba(20, 184, 166, 0.08), transparent 26%),
      ${({ theme }) =>
        theme.scheme === "light"
          ? "rgba(255, 255, 255, 0.78)"
          : "rgba(28, 37, 50, 0.8)"};
  }

  .list-item,
  .spotlight-card {
    display: block;
    min-height: 5.6rem;
    padding: 0.95rem 1rem;
    border-radius: 1rem;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.18), transparent),
      ${({ theme }) => theme.colors.gray2};
    transition: transform 180ms ease, background-color 180ms ease, box-shadow 180ms ease;

    &:hover {
      transform: translateY(-1px);
      background-color: ${({ theme }) => theme.colors.gray3};
      box-shadow: 0 14px 28px -24px rgba(15, 23, 42, 0.26);
    }
  }

  .item-main .title,
  .spotlight-card .title {
    margin-bottom: 0.35rem;
    color: ${({ theme }) => theme.colors.gray12};
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 700;
    word-break: keep-all;
  }

  .list-item p,
  .spotlight-card p {
    margin: 0 0 0.8rem;
    color: ${({ theme }) => theme.colors.gray11};
    line-height: 1.55rem;
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
  }

  .list-item {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 0.9rem;
    align-items: center;

    @media (min-width: 1024px) {
      grid-template-columns: minmax(0, 1fr) 7rem;
      min-height: 5.6rem;
    }
  }

  .list-item .item-main {
    min-width: 0;
  }

  .list-item .thumb {
    position: relative;
    display: none;
    width: 100%;
    height: 4.7rem;
    border-radius: 0.9rem;
    overflow: hidden;
    background:
      linear-gradient(135deg, rgba(37, 99, 235, 0.14), rgba(15, 118, 110, 0.12)),
      ${({ theme }) => theme.colors.gray3};

    @media (min-width: 1024px) {
      display: block;
    }
  }

  .spotlight-card time {
    margin-top: 0.1rem;
  }
`
