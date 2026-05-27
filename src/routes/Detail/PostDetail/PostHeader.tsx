import { CONFIG } from "site.config"
import Tag from "src/components/Tag"
import { TPost } from "src/types"
import { formatDate } from "src/libs/utils"
import Image from "next/image"
import React, { useState } from "react"
import styled from "@emotion/styled"
import { useUiLanguage } from "src/contexts/UiLanguageContext"
import useReadingTime from "src/hooks/useReadingTime"
import usePostQuery from "src/hooks/usePostQuery"
import AdaptiveThumbnail from "src/components/AdaptiveThumbnail"

type Props = {
  data: TPost
}

const PostHeader: React.FC<Props> = ({ data }) => {
  const { language, locale } = useUiLanguage()
  const post = usePostQuery()
  const readingTime = useReadingTime(post)
  const updatedAt = data.updatedAt?.start_date
  const [isShareCopied, setIsShareCopied] = useState(false)

  const handleShare = async () => {
    if (typeof window === "undefined") return

    const baseUrl = CONFIG.link.replace(/\/$/, "")
    const shareUrl = `${baseUrl}/${data.slug}`

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl)
        setIsShareCopied(true)
      } else {
        window.prompt(
          language === "ko" ? "이 링크를 복사하세요" : "Copy this link",
          shareUrl
        )
        setIsShareCopied(true)
      }
    } catch {
      setIsShareCopied(false)
    }

    window.setTimeout(() => {
      setIsShareCopied(false)
    }, 1200)
  }

  return (
    <StyledWrapper>
      <h1 className="title">{data.title}</h1>
      {data.type[0] !== "Paper" && (
        <nav>
          <div className="top">
            <div className="meta">
              {data.author && data.author[0] && data.author[0].name && (
                <div className="meta-pill author-pill">
                  <Image
                    css={{ borderRadius: "50%" }}
                    src={data.author[0].profile_photo || CONFIG.profile.image}
                    alt="profile_photo"
                    width={22}
                    height={22}
                  />
                  <div>{data.author[0].name}</div>
                </div>
              )}
              <div className="meta-pill date">
                {formatDate(
                  data?.date?.start_date || data.createdTime,
                  locale
                )}
              </div>
              {updatedAt && (
                <div className="meta-pill updated-at">
                  {language === "ko" ? "수정일" : "Updated"} {formatDate(updatedAt, locale)}
                </div>
              )}
              {readingTime && (
                <div className="meta-pill reading-time">
                  {language === "ko" ? `읽기 ${readingTime}분` : `${readingTime} min read`}
                </div>
              )}
            </div>
            <button
              className="share"
              data-copied={isShareCopied}
              onClick={handleShare}
              type="button"
              aria-label={isShareCopied ? "Copied link" : "Copy link"}
            >
              <span className="share-icon" aria-hidden="true" />
            </button>
          </div>
          <div className="mid">
            {data.tags && (
              <div className="tags">
                {data.tags.map((tag: string) => (
                  <Tag key={tag}>{tag}</Tag>
                ))}
              </div>
            )}
          </div>
          {data.thumbnail && (
            <div className="thumbnail">
              <AdaptiveThumbnail
                src={data.thumbnail}
                className="thumbnail-image"
                alt={data.title}
                sizes="(min-width: 1024px) 832px, 100vw"
              />
            </div>
          )}
        </nav>
      )}
    </StyledWrapper>
  )
}

export default PostHeader

const StyledWrapper = styled.div`
  .title {
    font-size: 2rem;
    line-height: 2.45rem;
    font-weight: 800;
    letter-spacing: -0.04em;
  }
  nav {
    margin-top: 1.5rem;
    color: ${({ theme }) => theme.colors.gray11};
    > .top {
      display: flex;
      flex-direction: column;
      margin-bottom: 0.75rem;
      gap: 0.75rem;

      @media (min-width: 768px) {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
      }

      .meta {
        display: flex;
        flex-wrap: wrap;
        gap: 0.75rem;
        align-items: center;

        .meta-pill {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          min-height: 2rem;
          padding: 0.4rem 0.8rem;
          border: 1px solid ${({ theme }) => theme.colors.gray6};
          border-radius: 9999px;
          background-color: ${({ theme }) =>
            theme.scheme === "light"
              ? "rgba(255, 255, 255, 0.82)"
              : "rgba(29, 36, 48, 0.82)"};
          font-size: 0.875rem;
          line-height: 1.25rem;
          font-weight: 600;
          letter-spacing: -0.01em;
          color: ${({ theme }) => theme.colors.gray11};
        }
        .reading-time {
          color: ${({ theme }) => theme.colors.gray11};
        }
        .updated-at {
          color: ${({ theme }) => theme.colors.gray11};
        }
        .author-pill {
          font-weight: 600;
        }
      }

      .share {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border: 1px solid ${({ theme }) => theme.colors.gray6};
        border-radius: 9999px;
        width: 2.1rem;
        height: 2.1rem;
        padding: 0;
        color: ${({ theme }) => theme.colors.gray12};
        background-color: ${({ theme }) =>
          theme.scheme === "light"
            ? "rgba(255, 255, 255, 0.82)"
            : "rgba(29, 36, 48, 0.82)"};
        cursor: pointer;

        &:hover {
          background-color: ${({ theme }) => theme.colors.gray4};
        }

        &[data-copied="true"] {
          color: ${({ theme }) =>
            theme.scheme === "light" ? "#0f766e" : "#5eead4"};
          border-color: ${({ theme }) =>
            theme.scheme === "light"
              ? "rgba(15, 118, 110, 0.28)"
              : "rgba(94, 234, 212, 0.28)"};
        }
      }

      .share-icon {
        width: 1rem;
        height: 1rem;
        background-color: currentColor;
        mask: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='9' y='9' width='13' height='13' rx='2' ry='2'/%3E%3Cpath d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'/%3E%3C/svg%3E")
          center / contain no-repeat;
        -webkit-mask: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Crect x='9' y='9' width='13' height='13' rx='2' ry='2'/%3E%3Cpath d='M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1'/%3E%3C/svg%3E")
          center / contain no-repeat;
      }

      .share[data-copied="true"] .share-icon {
        mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 6 9 17l-5-5'/%3E%3C/svg%3E");
        -webkit-mask-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2.4' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M20 6 9 17l-5-5'/%3E%3C/svg%3E");
      }
    }
    > .mid {
      display: flex;
      margin-bottom: 1rem;
      align-items: center;
      .tags {
        display: flex;
        overflow-x: auto;
        flex-wrap: nowrap;
        gap: 0.5rem;
        max-width: 100%;
      }
    }
    .thumbnail {
      overflow: hidden;
      position: relative;
      margin-bottom: 1.75rem;
      border-radius: 1.5rem;
      width: 100%;
      background-color: ${({ theme }) => theme.colors.gray3};
      padding-bottom: 66%;

      .thumbnail-image {
        transition: transform 300ms ease;
      }

      @media (min-width: 1024px) {
        padding-bottom: 50%;
      }
    }
  }
`
