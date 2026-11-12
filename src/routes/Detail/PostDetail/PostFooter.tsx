import styled from "@emotion/styled"
import Image from "next/image"
import Link from "next/link"
import React from "react"
import { FiChevronLeft, FiChevronRight } from "react-icons/fi"
import { CONFIG } from "site.config"
import { useUiLanguage } from "src/contexts/UiLanguageContext"
import useAdjacentPosts from "src/hooks/useAdjacentPosts"
import usePostQuery from "src/hooks/usePostQuery"

type Props = {
  // Rendered between the author box and the previous/next row (comments).
  children?: React.ReactNode
}

const Footer: React.FC<Props> = ({ children }) => {
  const { language } = useUiLanguage()
  const post = usePostQuery()
  const { previousPost, nextPost } = useAdjacentPosts()
  const author = post?.author?.[0]

  return (
    <StyledWrapper>
      <div className="author">
        <Image
          src={author?.profile_photo || CONFIG.profile.image}
          alt=""
          width={64}
          height={64}
          style={{ objectFit: "cover", borderRadius: "9999px" }}
        />
        <div>
          <div className="author-name">{author?.name || CONFIG.profile.name}</div>
          <div className="author-role">{CONFIG.profile.role}</div>
          <p className="author-bio">{CONFIG.profile.bio}</p>
        </div>
      </div>

      {children}

      {(previousPost || nextPost) && (
        <nav className="adjacent" aria-label={language === "ko" ? "이전/다음 글" : "Adjacent posts"}>
          {previousPost ? (
            <Link
              href={`/${previousPost.slug}`}
              prefetch={false}
              className="adjacent-link prev"
              aria-label={`${language === "ko" ? "이전 글" : "Previous"}: ${previousPost.title}`}
            >
              <FiChevronLeft aria-hidden="true" />
              <span className="title">{previousPost.title}</span>
            </Link>
          ) : (
            <span />
          )}
          {nextPost && (
            <Link
              href={`/${nextPost.slug}`}
              prefetch={false}
              className="adjacent-link next"
              aria-label={`${language === "ko" ? "다음 글" : "Next"}: ${nextPost.title}`}
            >
              <span className="title">{nextPost.title}</span>
              <FiChevronRight aria-hidden="true" />
            </Link>
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

  .adjacent {
    margin-top: 40px;
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 24px;
    padding: 8px 0;
  }

  .adjacent-link {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
    min-height: 44px;
    color: ${({ theme }) => theme.colors.gray12};

    &.next {
      justify-content: flex-end;
    }

    svg {
      flex-shrink: 0;
      width: 24px;
      height: 24px;
      stroke-width: 1.75;
    }

    &:hover .title {
      color: ${({ theme }) => theme.colors.indigo9};
    }
  }

  .title {
    overflow: hidden;
    font-size: 17px;
    white-space: nowrap;
    text-overflow: ellipsis;
    transition: color 120ms ease;
  }
`
