import styled from "@emotion/styled"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import { CONFIG } from "site.config"
import useAdjacentPosts from "src/hooks/useAdjacentPosts"

type Props = {
  // Rendered between the author box and the previous/next row (comments).
  children?: React.ReactNode
}

const Footer: React.FC<Props> = ({ children }) => {
  const { previousPost, nextPost } = useAdjacentPosts()

  return (
    <StyledWrapper>
      <div className="author">
        <Image
          src={CONFIG.profile.image}
          alt=""
          width={64}
          height={64}
          style={{ objectFit: "cover", borderRadius: "9999px" }}
        />
        <div>
          <div className="author-name">{CONFIG.profile.name}</div>
          <div className="author-role">{CONFIG.profile.role}</div>
          <p className="author-bio">{CONFIG.profile.bio}</p>
        </div>
      </div>

      {children}

      {(previousPost || nextPost) && (
        <nav className="adjacent" aria-label="이전 글과 다음 글">
          {previousPost ? (
            <Link
              href={`/${previousPost.slug}`}
              prefetch={false}
              className="adjacent-link prev"
            >
              <span className="label">
                <FiChevronLeft aria-hidden="true" />
                이전 글
              </span>
              <span className="title">{previousPost.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {nextPost ? (
            <Link
              href={`/${nextPost.slug}`}
              prefetch={false}
              className="adjacent-link next"
            >
              <span className="label">
                다음 글
                <FiChevronRight aria-hidden="true" />
              </span>
              <span className="title">{nextPost.title}</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      )}
    </StyledWrapper>
  )
}

export default Footer

const StyledWrapper = styled.div`
  margin-top: 64px;

  .author {
    display: flex;
    align-items: flex-start;
    gap: 20px;
    margin-bottom: 24px;
    padding: 28px;
    border-radius: 18px;
    background: ${({ theme }) => theme.colors.gray4};

    img {
      flex-shrink: 0;
    }
  }

  .author-name {
    font-size: 17px;
    font-weight: 600;
  }

  .author-role {
    font-size: 14px;
    color: ${({ theme }) => theme.colors.gray10};
  }

  .author-bio {
    margin: 8px 0 0;
    font-size: 15px;
    line-height: 1.55;
    color: ${({ theme }) => theme.colors.gray11};
  }

  /* Previous / next: two labelled cards side by side (stacked on phones). */
  .adjacent {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
    margin-top: 40px;

    @media (max-width: 734px) {
      grid-template-columns: 1fr;
    }
  }

  .adjacent-link {
    display: grid;
    gap: 6px;
    min-width: 0;
    padding: 16px 18px;
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    border-radius: 14px;
    background: ${({ theme }) => theme.colors.gray1};
    transition: border-color 120ms ease;

    &.next {
      text-align: right;

      .label {
        justify-content: flex-end;
      }
    }

    &:hover {
      border-color: ${({ theme }) => theme.colors.gray8};
    }

    &:hover .title {
      color: ${({ theme }) => theme.colors.indigo9};
    }
  }

  .label {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.gray9};

    svg {
      width: 14px;
      height: 14px;
    }
  }

  .title {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    font-size: 16px;
    font-weight: 600;
    line-height: 1.4;
    color: ${({ theme }) => theme.colors.gray12};
    transition: color 120ms ease;
  }
`
