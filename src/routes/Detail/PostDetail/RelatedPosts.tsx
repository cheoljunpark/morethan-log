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
  margin-top: 2rem;

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
    padding: 1rem;
    border-radius: 1rem;
    background-color: ${({ theme }) => theme.colors.gray3};

    &:hover {
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
    color: ${({ theme }) => theme.colors.gray12};
  }

  p {
    line-height: 1.7;
    color: ${({ theme }) => theme.colors.gray11};
  }
`
