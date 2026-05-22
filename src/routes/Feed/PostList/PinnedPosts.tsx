import styled from "@emotion/styled"
import Link from "next/link"
import React, { useMemo } from "react"
import { storageKey } from "src/constants/storage"
import { DEFAULT_CATEGORY } from "src/constants"
import { useUiLanguage } from "src/contexts/UiLanguageContext"
import usePostsQuery from "src/hooks/usePostsQuery"
import { formatDate } from "src/libs/utils"
import PostCard from "src/routes/Feed/PostList/PostCard"
import { filterPosts } from "./filterPosts"

type Props = {
  q: string
  compact?: boolean
}

const PinnedPosts: React.FC<Props> = ({ q, compact = false }) => {
  const { language, locale } = useUiLanguage()
  const data = usePostsQuery()

  const filteredPosts = useMemo(() => {
    const baseFiltered = filterPosts({
      posts: data,
      q,
      category: DEFAULT_CATEGORY,
      order: "desc",
    })

    return baseFiltered.filter((post) => post.tags?.includes("Pinned"))
  }, [data, q])

  const handleClick = (postId: string) => {
    if (typeof window === "undefined") return

    window.sessionStorage.setItem(storageKey.feedScrollY, `${window.scrollY}`)
    window.sessionStorage.setItem(storageKey.feedActivePostId, postId)
  }

  if (filteredPosts.length === 0) return null

  if (compact) {
    return (
      <CompactWrapper id="pinned-posts">
        <div className="wrapper">
          <div>
            <div className="eyebrow">{language === "ko" ? "고정" : "Pinned"}</div>
            <div className="header">{language === "ko" ? "고정 글" : "Pinned posts"}</div>
          </div>
          <div className="count">{filteredPosts.length}</div>
        </div>
        <div className="list">
          {filteredPosts.map((post) => (
            <Link
              key={post.slug}
              href={`/${post.slug}`}
              className="item"
              onClick={() => handleClick(post.id)}
            >
              <div className="title">{post.title}</div>
              {post.summary && <p>{post.summary}</p>}
              <div className="meta">
                <span>
                  {post.menu?.[0] || (language === "ko" ? "글" : "Post")}
                </span>
                <time>{formatDate(post.date?.start_date || post.createdTime, locale)}</time>
              </div>
            </Link>
          ))}
        </div>
      </CompactWrapper>
    )
  }

  return (
    <StyledWrapper id="pinned-posts">
      <div className="wrapper">
        <div className="header">{language === "ko" ? "고정 글" : "Pinned posts"}</div>
      </div>
      <div className="my-2">
        {filteredPosts.map((post) => (
          <PostCard key={post.slug} data={post} />
        ))}
      </div>
    </StyledWrapper>
  )
}

export default PinnedPosts

const sharedSectionStyles = `
  position: relative;
  scroll-margin-top: 5rem;

  .wrapper {
    display: flex;
    margin-bottom: 1rem;
    justify-content: space-between;
    align-items: center;
  }

  .eyebrow {
    margin-bottom: 0.3rem;
    font-size: 0.76rem;
    line-height: 1rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .header {
    display: flex;
    gap: 0.25rem;
    align-items: center;
    font-size: 1.25rem;
    line-height: 1.75rem;
    font-weight: 700;
  }
`

const StyledWrapper = styled.div`
  ${sharedSectionStyles}

  .eyebrow {
    color: ${({ theme }) => theme.colors.gray10};
  }

  .wrapper {
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray6};
  }

  .header {
    margin-top: 0.5rem;
    margin-bottom: 0.5rem;
  }
`

const CompactWrapper = styled.section`
  ${sharedSectionStyles}

  .eyebrow {
    color: ${({ theme }) => theme.colors.gray10};
  }

  padding: 1rem;
  border: 1px solid ${({ theme }) => theme.colors.gray6};
  border-radius: 1.25rem;
  background-color: ${({ theme }) =>
    theme.scheme === "light" ? "rgba(255, 255, 255, 0.8)" : "rgba(29, 36, 48, 0.82)"};

  .count {
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

  .list {
    display: grid;
    gap: 0.75rem;
  }

  .item {
    display: block;
    padding: 0.85rem 0.9rem;
    border-radius: 1rem;
    background-color: ${({ theme }) => theme.colors.gray2};
    transition: transform 180ms ease, background-color 180ms ease;

    &:hover {
      transform: translateY(-1px);
      background-color: ${({ theme }) => theme.colors.gray3};
    }
  }

  .title {
    margin-bottom: 0.4rem;
    color: ${({ theme }) => theme.colors.gray12};
    font-size: 0.98rem;
    line-height: 1.45rem;
    font-weight: 700;
    word-break: keep-all;
  }

  p {
    margin: 0 0 0.75rem;
    color: ${({ theme }) => theme.colors.gray11};
    line-height: 1.58rem;
    font-size: 0.84rem;
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 0.45rem;
    color: ${({ theme }) => theme.colors.gray10};
    font-size: 0.75rem;
    line-height: 1rem;
    font-weight: 600;
  }
`
