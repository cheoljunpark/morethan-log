import styled from "@emotion/styled"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"
import { CONFIG } from "site.config"
import { storageKey } from "src/constants/storage"
import { useUiLanguage } from "src/contexts/UiLanguageContext"
import useAdjacentPosts from "src/hooks/useAdjacentPosts"
import usePostQuery from "src/hooks/usePostQuery"
import normalizeFeedQueryString from "src/libs/utils/router/normalizeFeedQueryString"

const Footer: React.FC = () => {
  const router = useRouter()
  const { language } = useUiLanguage()
  const post = usePostQuery()
  const { previousPost, nextPost } = useAdjacentPosts()
  const author = post?.author?.[0]

  const handleBack = () => {
    if (typeof window === "undefined") {
      router.push("/")
      return
    }

    const feedQueryString = normalizeFeedQueryString(
      window.sessionStorage.getItem(storageKey.feedQueryString) || ""
    )

    router.push(`/${feedQueryString}`, undefined, { scroll: false })
  }

  return (
    <StyledWrapper>
      <div className="actions">
        <a onClick={handleBack}>{language === "ko" ? "목록으로" : "Back to list"}</a>
        <a onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          {language === "ko" ? "맨 위로" : "Back to top"}
        </a>
      </div>
      <div className="adjacent">
        {previousPost && (
          <Link href={`/${previousPost.slug}`} className="card prev">
            <div className="label">{language === "ko" ? "이전 글" : "Previous"}</div>
            <div className="title">{previousPost.title}</div>
          </Link>
        )}
        {nextPost && (
          <Link href={`/${nextPost.slug}`} className="card next">
            <div className="label">{language === "ko" ? "다음 글" : "Next"}</div>
            <div className="title">{nextPost.title}</div>
          </Link>
        )}
      </div>
      <div className="author-card">
        <div className="author-label">{language === "ko" ? "작성자" : "Written by"}</div>
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
