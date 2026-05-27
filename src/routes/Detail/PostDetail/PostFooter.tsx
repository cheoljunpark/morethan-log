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
        <button
          type="button"
          className="action-button list"
          onClick={handleBack}
          aria-label={language === "ko" ? "목록으로" : "Back to list"}
        >
          <span aria-hidden="true" />
        </button>
        <button
          type="button"
          className="action-button top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label={language === "ko" ? "맨 위로" : "Back to top"}
        >
          <span aria-hidden="true" />
        </button>
      </div>
      <div className="adjacent">
        {previousPost && (
          <Link
            href={`/${previousPost.slug}`}
            prefetch={false}
            className="card prev"
            data-thumbnail={!!previousPost.thumbnail}
          >
            {previousPost.thumbnail && (
              <Image
                className="adjacent-thumbnail"
                src={previousPost.thumbnail}
                alt=""
                fill
                sizes="(min-width: 768px) 340px, 100vw"
              />
            )}
            <span className="nav-icon" aria-hidden="true" />
            <div className="label">{language === "ko" ? "이전 글" : "Previous"}</div>
            <div className="title">{previousPost.title}</div>
          </Link>
        )}
        {nextPost && (
          <Link
            href={`/${nextPost.slug}`}
            prefetch={false}
            className="card next"
            data-thumbnail={!!nextPost.thumbnail}
          >
            {nextPost.thumbnail && (
              <Image
                className="adjacent-thumbnail"
                src={nextPost.thumbnail}
                alt=""
                fill
                sizes="(min-width: 768px) 340px, 100vw"
              />
            )}
            <span className="nav-icon" aria-hidden="true" />
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
    color: ${({ theme }) => theme.colors.gray10};

    .action-button {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 2.1rem;
      height: 2.1rem;
      margin-top: 0.5rem;
      border: 1px solid ${({ theme }) => theme.colors.gray6};
      border-radius: 9999px;
      background-color: ${({ theme }) =>
        theme.scheme === "light"
          ? "rgba(255, 255, 255, 0.82)"
          : "rgba(29, 36, 48, 0.82)"};
      color: ${({ theme }) => theme.colors.gray10};
      cursor: pointer;

      &:hover {
        background-color: ${({ theme }) => theme.colors.gray4};
        color: ${({ theme }) => theme.colors.gray12};
      }

      span {
        width: 1rem;
        height: 1rem;
        background-color: currentColor;
        mask-position: center;
        mask-repeat: no-repeat;
        mask-size: contain;
        -webkit-mask-position: center;
        -webkit-mask-repeat: no-repeat;
        -webkit-mask-size: contain;
      }
    }

    .action-button.list span {
      mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 6h13'/%3E%3Cpath d='M8 12h13'/%3E%3Cpath d='M8 18h13'/%3E%3Cpath d='M3 6h.01'/%3E%3Cpath d='M3 12h.01'/%3E%3Cpath d='M3 18h.01'/%3E%3C/svg%3E");
      -webkit-mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M8 6h13'/%3E%3Cpath d='M8 12h13'/%3E%3Cpath d='M8 18h13'/%3E%3Cpath d='M3 6h.01'/%3E%3Cpath d='M3 12h.01'/%3E%3Cpath d='M3 18h.01'/%3E%3C/svg%3E");
    }

    .action-button.top span {
      mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m18 15-6-6-6 6'/%3E%3C/svg%3E");
      -webkit-mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m18 15-6-6-6 6'/%3E%3C/svg%3E");
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
    position: relative;
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    column-gap: 0.75rem;
    align-items: center;
    min-height: 6rem;
    padding: 1rem;
    overflow: hidden;
    border-radius: 1rem;
    background-color: ${({ theme }) =>
      theme.scheme === "light" ? "#1f2433" : "#202636"};
    color: white;
    box-shadow: 0 16px 36px -28px rgba(15, 23, 42, 0.38);

    &:hover {
      transform: translateY(-1px);
      box-shadow: 0 20px 42px -30px rgba(15, 23, 42, 0.48);
    }

    &::before {
      content: "";
      position: absolute;
      inset: 0;
      z-index: 1;
      background:
        linear-gradient(90deg, rgba(22, 26, 39, 0.72), rgba(22, 26, 39, 0.34)),
        radial-gradient(circle at 82% 50%, rgba(255, 255, 255, 0.18), transparent 38%);
    }

    &[data-thumbnail="false"]::before {
      background:
        linear-gradient(90deg, rgba(22, 26, 39, 0.92), rgba(22, 26, 39, 0.7)),
        radial-gradient(circle at 82% 50%, rgba(255, 255, 255, 0.18), transparent 38%);
    }

    > * {
      position: relative;
      z-index: 1;
    }
  }

  .adjacent-thumbnail {
    z-index: 0 !important;
    object-fit: cover;
  }

  .nav-icon {
    grid-row: 1 / span 2;
    display: inline-flex;
    width: 2.1rem;
    height: 2.1rem;
    border: 2px solid rgba(255, 255, 255, 0.5);
    border-radius: 9999px;

    &::before {
      content: "";
      width: 100%;
      height: 100%;
      background-color: rgba(255, 255, 255, 0.72);
      mask-position: center;
      mask-repeat: no-repeat;
      mask-size: 1.1rem 1.1rem;
      -webkit-mask-position: center;
      -webkit-mask-repeat: no-repeat;
      -webkit-mask-size: 1.1rem 1.1rem;
    }
  }

  .prev .nav-icon::before {
    mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m15 18-6-6 6-6'/%3E%3C/svg%3E");
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m15 18-6-6 6-6'/%3E%3C/svg%3E");
  }

  .next .nav-icon::before {
    mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m9 18 6-6-6-6'/%3E%3C/svg%3E");
    -webkit-mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='m9 18 6-6-6-6'/%3E%3C/svg%3E");
  }

  .label {
    margin-bottom: 0.2rem;
    font-size: 0.75rem;
    line-height: 1rem;
    color: #f6b26b;
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .title {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    color: rgba(255, 255, 255, 0.94);
    font-size: 1rem;
    line-height: 1.45rem;
    font-weight: 800;
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
