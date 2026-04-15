import styled from "@emotion/styled"
import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"
import Image from "next/image"
import { CONFIG } from "site.config"
import useAdjacentPosts from "src/hooks/useAdjacentPosts"
import usePostQuery from "src/hooks/usePostQuery"
import useSeriesPosts from "src/hooks/useSeriesPosts"
import { storageKey } from "src/constants/storage"

type Props = {}

const Footer: React.FC<Props> = () => {
  const router = useRouter()
  const post = usePostQuery()
  const { previousPost, nextPost } = useAdjacentPosts()
  const { currentSeries, currentIndex, seriesPosts, totalCount } = useSeriesPosts()
  const author = post?.author?.[0]

  const handleBack = () => {
    if (typeof window === "undefined") {
      router.push("/")
      return
    }

    const feedQueryString =
      window.sessionStorage.getItem(storageKey.feedQueryString) || ""

    router.push(`/${feedQueryString}`, undefined, { scroll: false })
  }

  return (
    <StyledWrapper>
      {currentSeries && totalCount > 1 && (
        <div className="series">
          <div className="series-header">
            <div className="series-title">{currentSeries}</div>
            <div className="series-progress">
              {currentIndex + 1} / {totalCount}
            </div>
          </div>
          <div className="series-list">
            {seriesPosts.map((post, index) => (
              <Link
                href={`/${post.slug}`}
                key={post.id}
                className="series-item"
                data-active={post.slug === router.query.slug}
              >
                <div className="series-step">Part {index + 1}</div>
                <div className="series-name">{post.title}</div>
              </Link>
            ))}
          </div>
        </div>
      )}
      <div className="actions">
        <a onClick={handleBack}>Back</a>
        <a onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          Top
        </a>
      </div>
      <div className="adjacent">
        {previousPost && (
          <Link href={`/${previousPost.slug}`} className="card prev">
            <div className="label">← Previous</div>
            <div className="title">{previousPost.title}</div>
          </Link>
        )}
        {nextPost && (
          <Link href={`/${nextPost.slug}`} className="card next">
            <div className="label">Next →</div>
            <div className="title">{nextPost.title}</div>
          </Link>
        )}
      </div>
      <div className="author-card">
        <div className="author-label">Written by</div>
        <div className="author-body">
          <Image
            src={author?.profile_photo || CONFIG.profile.image}
            alt={author?.name || CONFIG.profile.name}
            width={44}
            height={44}
            style={{ objectFit: "contain" }}
          />
          <div>
            <div className="author-name">{author?.name || CONFIG.profile.name}</div>
            <div className="author-role">{CONFIG.profile.role}</div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  )
}

export default Footer

const StyledWrapper = styled.div`
  margin-top: 2rem;

  .series {
    margin-bottom: 1.75rem;
    padding: 1rem;
    border-radius: 1rem;
    background-color: ${({ theme }) => theme.colors.gray3};
  }

  .series-header {
    display: flex;
    justify-content: space-between;
    gap: 1rem;
    align-items: baseline;
    margin-bottom: 1rem;
  }

  .series-title {
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.gray12};
  }

  .series-progress {
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: ${({ theme }) => theme.colors.gray10};
  }

  .series-list {
    display: grid;
    gap: 0.75rem;
  }

  .series-item {
    display: block;
    padding: 0.85rem 1rem;
    border-radius: 0.9rem;
    background-color: ${({ theme }) => theme.colors.gray4};

    &[data-active="true"] {
      outline: 1px solid ${({ theme }) => theme.colors.gray8};
      background-color: ${({ theme }) => theme.colors.gray5};
    }
  }

  .series-step {
    margin-bottom: 0.35rem;
    font-size: 0.75rem;
    line-height: 1rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.gray10};
  }

  .series-name {
    line-height: 1.6;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray12};
  }

  .actions {
    display: flex;
    justify-content: space-between;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.gray10};

    a {
      margin-top: 0.5rem;
      cursor: pointer;

      :hover {
        color: ${({ theme }) => theme.colors.gray12};
      }
    }
  }

  .adjacent {
    display: grid;
    gap: 0.75rem;
    margin-top: 1.5rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  .card {
    display: block;
    padding: 1rem;
    border-radius: 1rem;
    background-color: ${({ theme }) => theme.colors.gray3};

    &:hover {
      background-color: ${({ theme }) => theme.colors.gray4};
    }
  }

  .label {
    margin-bottom: 0.4rem;
    font-size: 0.75rem;
    line-height: 1rem;
    color: ${({ theme }) => theme.colors.gray10};
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .title {
    line-height: 1.6;
    font-weight: 600;
  }

  .author-card {
    margin-top: 1.5rem;
    padding: 1rem;
    border-radius: 1rem;
    background-color: ${({ theme }) => theme.colors.gray3};
  }

  .author-label {
    margin-bottom: 0.6rem;
    font-size: 0.75rem;
    line-height: 1rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.gray10};
  }

  .author-body {
    display: flex;
    gap: 0.75rem;
    align-items: center;

    img {
      border-radius: 9999px;
    }
  }

  .author-name {
    line-height: 1.4;
    font-weight: 700;
    color: ${({ theme }) => theme.colors.gray12};
  }

  .author-role {
    margin-top: 0.15rem;
    font-size: 0.875rem;
    line-height: 1.25rem;
    color: ${({ theme }) => theme.colors.gray10};
  }
`
