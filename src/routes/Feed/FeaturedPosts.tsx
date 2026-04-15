import styled from "@emotion/styled"
import Image from "next/image"
import Link from "next/link"
import { useMemo } from "react"
import { CONFIG } from "site.config"
import { storageKey } from "src/constants/storage"
import usePostsQuery from "src/hooks/usePostsQuery"
import { formatDate } from "src/libs/utils"

type Props = {
  enabled: boolean
}

const FeaturedPosts: React.FC<Props> = ({ enabled }) => {
  const posts = usePostsQuery()

  const featuredPosts = useMemo(() => {
    const selected = posts.filter(
      (post) =>
        post.tags?.includes("Featured") || post.tags?.includes("Pinned")
    )

    const base = selected.length >= 3 ? selected : posts
    return base.slice(0, 3)
  }, [posts])

  const handleClick = (postId: string) => {
    if (typeof window === "undefined") return

    window.sessionStorage.setItem(storageKey.feedScrollY, `${window.scrollY}`)
    window.sessionStorage.setItem(storageKey.feedActivePostId, postId)
  }

  if (!enabled || featuredPosts.length === 0) return null

  const [primaryPost, ...secondaryPosts] = featuredPosts

  return (
    <StyledWrapper>
      <div className="section-header">
        <div className="eyebrow">Featured Writing</div>
        <h2>Start Here</h2>
      </div>
      <div className="grid">
        <Link
          href={`/${primaryPost.slug}`}
          className="primary"
          onClick={() => handleClick(primaryPost.id)}
        >
          {primaryPost.thumbnail && (
            <div className="thumb">
              <Image
                src={primaryPost.thumbnail}
                fill
                alt={primaryPost.title}
                css={{ objectFit: "cover" }}
              />
            </div>
          )}
          <div className="content">
            <div className="meta">
              <span>{primaryPost.type[0]}</span>
              {primaryPost.series?.[0] && <span>{primaryPost.series[0]}</span>}
            </div>
            <h3>{primaryPost.title}</h3>
            {primaryPost.summary && <p>{primaryPost.summary}</p>}
            <div className="date">
              {formatDate(
                primaryPost.date?.start_date || primaryPost.createdTime,
                CONFIG.lang
              )}
            </div>
          </div>
        </Link>
        <div className="secondary">
          {secondaryPosts.map((post) => (
            <Link
              href={`/${post.slug}`}
              className="secondary-card"
              key={post.id}
              onClick={() => handleClick(post.id)}
            >
              <div className="meta">
                <span>{post.type[0]}</span>
                {post.series?.[0] && <span>{post.series[0]}</span>}
              </div>
              <h3>{post.title}</h3>
              {post.summary && <p>{post.summary}</p>}
              <div className="date">
                {formatDate(post.date?.start_date || post.createdTime, CONFIG.lang)}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </StyledWrapper>
  )
}

export default FeaturedPosts

const StyledWrapper = styled.section`
  margin-bottom: 1.5rem;

  .section-header {
    margin-bottom: 1rem;
  }

  .eyebrow {
    margin-bottom: 0.35rem;
    font-size: 0.8rem;
    line-height: 1.1rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: #0f766e;
  }

  h2 {
    font-size: 1.75rem;
    line-height: 2.2rem;
    font-weight: 800;
  }

  .grid {
    display: grid;
    gap: 1rem;

    @media (min-width: 1024px) {
      grid-template-columns: minmax(0, 1.45fr) minmax(0, 1fr);
    }
  }

  .primary,
  .secondary-card {
    display: block;
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    border-radius: 1.4rem;
    overflow: hidden;
    background-color: ${({ theme }) =>
      theme.scheme === "light" ? "white" : theme.colors.gray4};
    transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;

    &:hover {
      transform: translateY(-2px);
      border-color: ${({ theme }) => theme.colors.gray8};
      box-shadow: 0 12px 20px -10px rgba(0, 0, 0, 0.18);
    }
  }

  .thumb {
    position: relative;
    width: 100%;
    padding-bottom: 58%;
    background:
      linear-gradient(135deg, rgba(15, 118, 110, 0.12), rgba(20, 184, 166, 0.03)),
      ${({ theme }) => theme.colors.gray2};
  }

  .content,
  .secondary-card {
    padding: 1.15rem;
  }

  .secondary {
    display: grid;
    gap: 1rem;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-bottom: 0.85rem;

    span {
      display: inline-flex;
      align-items: center;
      min-height: 1.7rem;
      padding: 0.2rem 0.55rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      line-height: 1rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
      color: ${({ theme }) => theme.colors.gray10};
      background-color: ${({ theme }) => theme.colors.gray3};
    }
  }

  .primary h3 {
    margin-bottom: 0.75rem;
    font-size: 1.7rem;
    line-height: 2.15rem;
    font-weight: 800;
  }

  .secondary-card h3 {
    margin-bottom: 0.55rem;
    font-size: 1.1rem;
    line-height: 1.7rem;
    font-weight: 700;
  }

  p {
    margin-bottom: 1rem;
    color: ${({ theme }) => theme.colors.gray11};
    line-height: 1.8rem;
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
  }

  .date {
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas,
      "Liberation Mono", "Courier New", monospace;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: ${({ theme }) => theme.colors.gray10};
  }
`
