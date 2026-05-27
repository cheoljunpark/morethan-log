import styled from "@emotion/styled"
import Image from "next/image"
import Link from "next/link"
import { useCallback, useMemo } from "react"
import { storageKey } from "src/constants/storage"
import { useUiLanguage } from "src/contexts/UiLanguageContext"
import useFeedScrollRestoration from "src/hooks/useFeedScrollRestoration"
import usePostsQuery from "src/hooks/usePostsQuery"
import useUtterancesCommentCount from "src/hooks/useUtterancesCommentCount"
import { formatDate } from "src/libs/utils"
import { filterPosts } from "src/libs/utils/notion"
import normalizeFeedQueryString from "src/libs/utils/router/normalizeFeedQueryString"

type CommentBadgeProps = {
  title: string
}

const CommentBadge: React.FC<CommentBadgeProps> = ({ title }) => {
  const commentCount = useUtterancesCommentCount(title)

  if (typeof commentCount !== "number") {
    return null
  }

  return (
    <span className="comment-badge" aria-label={`댓글 ${commentCount}개`}>
      <span className="comment-icon" aria-hidden="true" />
      {commentCount}
    </span>
  )
}

const HomeLanding: React.FC = () => {
  const { language, locale } = useUiLanguage()
  const posts = usePostsQuery()
  const saveFeedPosition = useCallback((postId: string) => {
    if (typeof window === "undefined") return

    sessionStorage.setItem("feedScrollY", String(window.scrollY))
    sessionStorage.setItem("feedActivePostId", postId)
    sessionStorage.setItem(
      storageKey.feedQueryString,
      normalizeFeedQueryString(window.location.search || "")
    )
  }, [])
  const { latestPosts, popularPosts, recommendedPost } = useMemo(() => {
    const publicPosts = filterPosts(posts)
    const latest = publicPosts.slice(0, 4)

    const popular = [...publicPosts]
      .sort((a, b) => {
        const score = (post: (typeof publicPosts)[number]) => {
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
  const isRestored = useFeedScrollRestoration(
    JSON.stringify([
      "home-landing",
      recommendedPost?.id || "",
      latestPosts.map((post) => post.id).join(","),
      popularPosts.map((post) => post.id).join(","),
    ])
  )

  return (
    <StyledWrapper
      style={{
        opacity: isRestored ? 1 : 0,
        transition: "opacity 120ms ease-out",
      }}
    >
      {recommendedPost && (
        <section className="hero" data-post-id={recommendedPost.id}>
          <div className="hero-copy">
            <div className="eyebrow">{language === "ko" ? "추천 글" : "Recommended"}</div>
            <h1>{recommendedPost.title}</h1>
            {recommendedPost.summary && <p>{recommendedPost.summary}</p>}
            <div className="meta">
              <span>{recommendedPost.menu?.[0] || (language === "ko" ? "글" : "Post")}</span>
              <time>
                {formatDate(
                  recommendedPost.date?.start_date || recommendedPost.createdTime,
                  locale
                )}
              </time>
              <CommentBadge title={recommendedPost.title} />
              <Link href={`/${recommendedPost.slug}`} prefetch={false} className="hero-link mobile" onClick={() => saveFeedPosition(recommendedPost.id)}>
                {language === "ko" ? "바로 읽기" : "Read now"}
              </Link>
            </div>
          </div>

          <div className="hero-visual">
            {recommendedPost.thumbnail ? (
              <Image
                src={recommendedPost.thumbnail}
                fill
                alt=""
                priority
                sizes="(min-width: 1024px) 360px, 100vw"
                css={{ objectFit: "cover" }}
              />
            ) : (
              <div className="hero-fallback">
                <span>
                  {recommendedPost.menu?.[0] || (language === "ko" ? "개발 글" : "Writing")}
                </span>
              </div>
            )}
            <Link href={`/${recommendedPost.slug}`} prefetch={false} className="hero-link desktop" onClick={() => saveFeedPosition(recommendedPost.id)}>
              {language === "ko" ? "바로 읽기" : "Read now"}
            </Link>
          </div>
        </section>
      )}

      <section className="content-grid">
        <div className="section-block latest">
          <div className="section-header">
            <h2>{language === "ko" ? "최신글" : "Latest posts"}</h2>
            <Link href="/archive">{language === "ko" ? "전체" : "All"}</Link>
          </div>

          <div className="list-stack">
            {latestPosts.map((post) => (
              <Link
                key={post.id}
                href={`/${post.slug}`}
                prefetch={false}
                className="list-item"
                data-post-id={post.id}
                onClick={() => saveFeedPosition(post.id)}
              >
                <div className="item-main">
                  <div className="item-kicker">{language === "ko" ? "최신" : "Latest"}</div>
                  <div className="title">{post.title}</div>
                  <div className="chips">
                    <span>{post.menu?.[0] || (language === "ko" ? "글" : "Post")}</span>
                    <time>{formatDate(post.date?.start_date || post.createdTime, locale)}</time>
                    <CommentBadge title={post.title} />
                  </div>
                </div>
                {post.thumbnail && (
                  <div className="thumb" aria-hidden="true">
                    <Image
                      src={post.thumbnail}
                      fill
                      alt=""
                      sizes="(min-width: 1024px) 120px, 100vw"
                      css={{ objectFit: "cover" }}
                    />
                  </div>
                )}
              </Link>
            ))}
          </div>
        </div>

        <div className="section-block popular">
          <div className="section-header">
            <h2>{language === "ko" ? "인기글" : "Popular posts"}</h2>
          </div>

          <div className="spotlight-grid">
            {popularPosts.map((post) => (
              <Link
                key={post.id}
                href={`/${post.slug}`}
                prefetch={false}
                className="spotlight-card"
                data-post-id={post.id}
                onClick={() => saveFeedPosition(post.id)}
              >
                <div className="spotlight-body">
                  <div className="item-kicker">{language === "ko" ? "인기" : "Popular"}</div>
                  <div className="title">{post.title}</div>
                  <div className="chips">
                    <span>{post.menu?.[0] || (language === "ko" ? "글" : "Post")}</span>
                    <time>{formatDate(post.date?.start_date || post.createdTime, locale)}</time>
                    <CommentBadge title={post.title} />
                  </div>
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

  > * {
    position: relative;
    z-index: 1;
  }

  .hero,
  .section-block {
    margin-bottom: 1rem;
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    border-radius: 1.45rem;
  }

  .hero {
    display: grid;
    gap: 1rem;
    padding: 1.4rem;
    overflow: hidden;
    border-color: ${({ theme }) =>
      theme.scheme === "light" ? "rgba(116, 144, 189, 0.34)" : "rgba(83, 112, 158, 0.46)"};
    background-color: ${({ theme }) =>
      theme.scheme === "light" ? "rgba(248, 251, 255, 0.94)" : "rgba(29, 38, 52, 0.94)"};
    box-shadow: 0 24px 54px -40px rgba(15, 23, 42, 0.34);

    @media (min-width: 1024px) {
      grid-template-columns: minmax(0, 1.15fr) minmax(18rem, 0.85fr);
      align-items: stretch;
      min-height: 23rem;
    }

    @media (max-width: 1023px) {
      gap: 0.85rem;
      margin-bottom: 0.85rem;
      padding: 0.75rem;
      border-radius: 1.25rem;
    }
  }

  .hero-copy {
    display: flex;
    flex-direction: column;
    justify-content: center;

    @media (max-width: 1023px) {
      padding: 0 0.25rem 0.15rem;
    }
  }

  .eyebrow {
    margin-bottom: 0.5rem;
    font-size: 0.76rem;
    line-height: 1rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.gray10};

    @media (max-width: 1023px) {
      margin-bottom: 0.35rem;
      font-size: 0.7rem;
      line-height: 0.9rem;
      letter-spacing: 0.06em;
    }
  }

  .hero h1,
  .section-header h2 {
    color: ${({ theme }) => theme.colors.gray12};
  }

  .hero h1 {
    max-width: 34rem;
    margin-bottom: 0.8rem;
    font-size: 2.15rem;
    line-height: 2.8rem;
    font-weight: 800;
    letter-spacing: -0.04em;
    word-break: keep-all;

    @media (max-width: 1023px) {
      margin-bottom: 0.6rem;
      font-size: 1.42rem;
      line-height: 1.82rem;
      letter-spacing: -0.035em;
      display: -webkit-box;
      overflow: hidden;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
    }
  }

  .hero p {
    max-width: 32rem;
    margin: 0 0 1.1rem;
    color: ${({ theme }) => theme.colors.gray11};
    line-height: 1.8rem;
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;

    @media (max-width: 1023px) {
      display: none;
    }
  }

  .hero-link {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    min-width: 6.2rem;
    height: 2.35rem;
    padding: 0 1rem;
    border-radius: 9999px;
    color: white;
    background-color: #0f766e;
    font-size: 0.84rem;
    line-height: 1rem;
    font-weight: 700;
    white-space: nowrap;
    box-shadow: 0 16px 30px -24px rgba(37, 99, 235, 0.6);

    &.desktop {
      display: none;
    }

    @media (max-width: 1023px) {
      align-self: flex-start;
      width: auto;
      min-width: 4.6rem;
      height: 1.45rem;
      margin-top: 0;
      padding: 0 0.58rem;
      background-color: #0d9488;
      font-size: 0.68rem;
      line-height: 0.9rem;
      box-shadow: 0 12px 22px -18px rgba(13, 148, 136, 0.85);
    }

    @media (min-width: 1024px) {
      &.mobile {
        display: none;
      }

      &.desktop {
        display: inline-flex;
        position: absolute;
        left: 1rem;
        bottom: 1rem;
      }
    }
  }

  .hero-visual {
    position: relative;
    min-height: 15rem;
    border-radius: 1.25rem;
    overflow: hidden;
    background-color: ${({ theme }) => theme.colors.gray3};
    box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.12);

    @media (max-width: 1023px) {
      order: -1;
      min-height: 10.2rem;
      border-radius: 1rem;
      background-color: ${({ theme }) =>
        theme.scheme === "light" ? "rgba(241, 245, 249, 0.9)" : "rgba(15, 23, 42, 0.9)"};
    }
  }

  .hero-fallback {
    display: flex;
    width: 100%;
    height: 100%;
    justify-content: center;
    align-items: center;
    padding: 1.5rem;
    color: white;
    font-size: 1.1rem;
    line-height: 1.6rem;
    font-weight: 700;
    text-align: center;
    letter-spacing: -0.02em;
  }

  .meta,
  .chips {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;

    @media (max-width: 1023px) {
      gap: 0.36rem;
    }
  }

  .meta > span,
  .meta > time,
  .chips > span:not(.comment-badge),
  .chips > time {
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

  .comment-badge {
    display: inline-flex;
    align-items: center;
    gap: 0.34rem;
    flex: 0 0 auto;
    min-height: 1.45rem;
    padding: 0 0.5rem;
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    border-radius: 9999px;
    font-size: 0.72rem;
    line-height: 1;
    color: ${({ theme }) =>
      theme.scheme === "light" ? "#0f766e" : "#5eead4"};
    background-color: ${({ theme }) =>
      theme.scheme === "light"
        ? "rgba(240, 253, 250, 0.92)"
        : "rgba(20, 184, 166, 0.12)"};
    font-weight: 700;
  }

  .comment-icon {
    width: 0.86rem;
    height: 0.86rem;
    flex: 0 0 auto;
    background: currentColor;
    mask: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z'/%3E%3Cpath d='M8 10h.01'/%3E%3Cpath d='M12 10h.01'/%3E%3Cpath d='M16 10h.01'/%3E%3C/svg%3E")
      center / contain no-repeat;
    -webkit-mask: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z'/%3E%3Cpath d='M8 10h.01'/%3E%3Cpath d='M12 10h.01'/%3E%3Cpath d='M16 10h.01'/%3E%3C/svg%3E")
      center / contain no-repeat;
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

    @media (max-width: 1023px) {
      margin-bottom: 0.75rem;
      padding: 0 0.05rem;

      h2 {
        font-size: 1.18rem;
        line-height: 1.5rem;
      }

      a {
        width: auto;
        min-width: 2.4rem;
        min-height: 1.6rem;
        font-size: 0.74rem;
      }
    }
  }

  .content-grid {
    display: grid;
    gap: 1rem;

    @media (min-width: 1024px) {
      grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
      align-items: start;
    }
  }

  .section-block {
    padding: 1.2rem 1.25rem 1.25rem;
    backdrop-filter: blur(10px);
    box-shadow: 0 16px 44px -36px rgba(15, 23, 42, 0.26);

    @media (max-width: 1023px) {
      padding: 1rem 0.8rem;
      border-radius: 1.2rem;
    }
  }

  .section-block.latest {
    background-color: ${({ theme }) =>
      theme.scheme === "light" ? "rgba(255, 255, 255, 0.84)" : "rgba(30, 39, 52, 0.84)"};
  }

  .section-block.popular {
    background-color: ${({ theme }) =>
      theme.scheme === "light" ? "rgba(255, 255, 255, 0.84)" : "rgba(28, 37, 50, 0.84)"};
  }

  .list-stack,
  .spotlight-grid {
    display: grid;
    gap: 0.8rem;

    @media (max-width: 1023px) {
      gap: 0;
    }
  }

  .item-kicker {
    margin-bottom: 0.35rem;
    color: ${({ theme }) => theme.colors.gray9};
    font-size: 0.72rem;
    line-height: 1rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .list-item,
  .spotlight-card {
    display: block;
    border-radius: 1rem;
    transition: transform 180ms ease, background-color 180ms ease, box-shadow 180ms ease;

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 14px 28px -24px rgba(15, 23, 42, 0.26);
    }
  }

  .list-item {
    display: grid;
    grid-template-columns: minmax(0, 1fr);
    gap: 0.9rem;
    align-items: center;
    min-height: 5rem;
    padding: 1rem 1rem 1.05rem;
    background-color: ${({ theme }) => theme.colors.gray2};

    @media (min-width: 1024px) {
      grid-template-columns: minmax(0, 1fr) 7rem;
    }

    @media (max-width: 1023px) {
      position: relative;
      gap: 0.75rem;
      min-height: auto;
      padding: 0.9rem 0.1rem 0.9rem 0.8rem;
      border-bottom: 1px solid ${({ theme }) => theme.colors.gray5};
      border-radius: 0;
      background-color: transparent;
      box-shadow: none;

      &::before {
        content: "";
        position: absolute;
        left: 0.12rem;
        top: 1rem;
        bottom: 1rem;
        width: 0.18rem;
        border-radius: 9999px;
        background: linear-gradient(180deg, #14b8a6, #60a5fa);
        opacity: 0.78;
      }

      &:has(.thumb) {
        grid-template-columns: minmax(0, 1fr) 4.4rem;
        padding-left: 0.8rem;
      }

      &:active {
        transform: scale(0.99);
      }

      &:last-child {
        border-bottom: 0;
      }
    }
  }

  .item-main {
    min-width: 0;

    @media (max-width: 1023px) {
      padding-left: 0;
    }
  }

  .list-item:has(.thumb) .item-main {
    @media (max-width: 1023px) {
      grid-column: 1;
      padding-left: 0;
    }
  }

  .item-main .title,
  .spotlight-card .title {
    margin-bottom: 0.45rem;
    color: ${({ theme }) => theme.colors.gray12};
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 700;
    word-break: keep-all;

    @media (max-width: 1023px) {
      margin-bottom: 0.42rem;
      font-size: 0.95rem;
      line-height: 1.35rem;
      display: -webkit-box;
      overflow: hidden;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
    }
  }

  .list-item .thumb {
    position: relative;
    display: none;
    width: 100%;
    height: 4.9rem;
    border-radius: 0.95rem;
    overflow: hidden;
    background-color: ${({ theme }) => theme.colors.gray3};

    @media (min-width: 1024px) {
      display: block;
    }

    @media (max-width: 1023px) {
      display: block;
      grid-column: 2;
      grid-row: 1;
      align-self: stretch;
      height: auto;
      min-height: 4rem;
      border-radius: 0.7rem;
    }
  }

  .spotlight-card {
    overflow: hidden;
    min-height: 7rem;
    border: 1px solid rgba(59, 130, 246, 0.08);
    background-color: ${({ theme }) => theme.colors.gray2};

    @media (max-width: 1023px) {
      position: relative;
      min-height: auto;
      padding-left: 0.8rem;
      border: 0;
      border-bottom: 1px solid ${({ theme }) => theme.colors.gray5};
      border-radius: 0;
      background-color: transparent;

      &::before {
        content: "";
        position: absolute;
        left: 0.12rem;
        top: 1rem;
        bottom: 1rem;
        width: 0.18rem;
        border-radius: 9999px;
        background: linear-gradient(180deg, #14b8a6, #60a5fa);
        opacity: 0.78;
      }

      &:last-child {
        border-bottom: 0;
      }
    }
  }

  .spotlight-body {
    padding: 1rem 1rem 1rem;

    @media (max-width: 1023px) {
      padding: 0.86rem 0.1rem;
    }
  }

  .spotlight-card .title {
    font-size: 1.08rem;
    line-height: 1.55rem;

    @media (max-width: 1023px) {
      font-size: 0.95rem;
      line-height: 1.35rem;
    }
  }

  @media (max-width: 1023px) {
    .spotlight-grid {
      counter-reset: none;
    }

    .list-item .item-kicker {
      display: none;
    }

    .spotlight-card .item-kicker {
      margin-bottom: 0.25rem;
      font-size: 0.66rem;
      line-height: 0.85rem;
      color: ${({ theme }) => theme.colors.gray10};
    }

    .meta > span,
    .meta > time,
    .chips > span:not(.comment-badge),
    .chips > time {
      min-height: 1.45rem;
      padding: 0.16rem 0.5rem;
      font-size: 0.68rem;
      line-height: 0.9rem;
    }

    .chips > span:not(.comment-badge) {
      background-color: ${({ theme }) =>
        theme.scheme === "light" ? "rgba(219, 234, 254, 0.72)" : "rgba(37, 99, 235, 0.18)"};
      color: ${({ theme }) => (theme.scheme === "light" ? "#1d4ed8" : "#93c5fd")};
    }

    .chips > time {
      background-color: ${({ theme }) =>
        theme.scheme === "light" ? "rgba(240, 253, 250, 0.9)" : "rgba(20, 184, 166, 0.13)"};
      color: ${({ theme }) => (theme.scheme === "light" ? "#0f766e" : "#5eead4")};
    }

    .comment-badge {
      min-height: 1.4rem;
      padding: 0 0.46rem;
      font-size: 0.68rem;
    }
  }
`
