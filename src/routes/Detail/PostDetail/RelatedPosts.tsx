import styled from "@emotion/styled"
import Link from "next/link"
import React from "react"
import useRelatedPosts from "src/hooks/useRelatedPosts"

const RelatedPosts: React.FC = () => {
  const posts = useRelatedPosts()

  if (posts.length === 0) return null

  return (
    <StyledWrapper>
      <div className="title">Related Posts</div>
      <div className="list">
        {posts.map((post) => (
          <Link href={`/${post.slug}`} key={post.id} className="card">
            {post.series?.[0] && <div className="series">{post.series[0]}</div>}
            <div className="post-title">{post.title}</div>
            {post.summary && <p>{post.summary}</p>}
          </Link>
        ))}
      </div>
    </StyledWrapper>
  )
}

export default RelatedPosts

const StyledWrapper = styled.section`
  border: 1px solid ${({ theme }) => theme.colors.gray6};
  border-radius: 1.1rem;
  padding: 0.9rem;
  background-color: ${({ theme }) =>
    theme.scheme === "light" ? "rgba(255, 255, 255, 0.62)" : "rgba(29, 36, 48, 0.72)"};
  backdrop-filter: blur(14px);

  .title {
    margin-bottom: 1rem;
    font-size: 0.8rem;
    line-height: 1.1rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.gray10};
  }

  .list {
    display: grid;
    gap: 0.75rem;
  }

  .card {
    display: block;
    width: 100%;
    min-width: 0;
    padding: 0.85rem 0.9rem;
    border-radius: 0.95rem;
    background-color: ${({ theme }) => theme.colors.gray3};
    border: 1px solid transparent;

    &:hover {
      border-color: ${({ theme }) => theme.colors.gray6};
      background-color: ${({ theme }) => theme.colors.gray4};
    }
  }

  .series {
    margin-bottom: 0.35rem;
    font-size: 0.75rem;
    line-height: 1rem;
    font-weight: 700;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.gray10};
  }

  .post-title {
    margin-bottom: 0.45rem;
    line-height: 1.6;
    font-weight: 700;
    overflow-wrap: anywhere;
    color: ${({ theme }) => theme.colors.gray12};
  }

  p {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow-wrap: anywhere;
    line-height: 1.7;
    color: ${({ theme }) => theme.colors.gray11};
  }
`
