import { CONFIG } from "site.config"
import Tag from "src/components/Tag"
import { TPost } from "src/types"
import { formatIndexDate, getPostDate, siteUrl } from "src/libs/utils"
import React, { useState } from "react"
import styled from "@emotion/styled"
import Image from "next/image"
import { FiLink } from "react-icons/fi"
import { useUiLanguage } from "src/contexts/UiLanguageContext"
import useReadingTime from "src/hooks/useReadingTime"
import usePostQuery from "src/hooks/usePostQuery"

type Props = {
  data: TPost
}

const PostHeader: React.FC<Props> = ({ data }) => {
  const { language } = useUiLanguage()
  const post = usePostQuery()
  const readingTime = useReadingTime(post)
  const [isShareCopied, setIsShareCopied] = useState(false)

  const handleShare = async () => {
    if (typeof window === "undefined") return

    const shareUrl = siteUrl(data.slug)

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
      {data.summary && <p className="summary">{data.summary}</p>}
      <div className="meta-row">
        <p className="meta">
          <time>{formatIndexDate(getPostDate(data))}.</time>
          <span>{CONFIG.profile.name}</span>
          {data.menu?.[0] && <span className="sep">{data.menu[0]}</span>}
          {readingTime && (
            <span className="sep">
              {language === "ko" ? `${readingTime}분` : `${readingTime} min`}
            </span>
          )}
        </p>
        <button
          className="share"
          data-copied={isShareCopied}
          onClick={handleShare}
          type="button"
          aria-label={language === "ko" ? "링크 복사" : "Copy link"}
          title={language === "ko" ? "링크 복사" : "Copy link"}
        >
          {isShareCopied ? (
            language === "ko" ? (
              "복사됨"
            ) : (
              "Copied"
            )
          ) : (
            <FiLink aria-hidden="true" />
          )}
        </button>
      </div>
      {data.tags && data.tags.length > 0 && (
        <div className="tags">
          {data.tags.map((tag: string) => (
            <Tag key={tag}>{tag}</Tag>
          ))}
        </div>
      )}
      {data.thumbnail && (
        <div className="cover">
          <Image
            src={data.thumbnail}
            alt=""
            fill
            priority
            sizes="(max-width: 800px) 100vw, 760px"
            style={{ objectFit: "cover" }}
          />
        </div>
      )}
    </StyledWrapper>
  )
}

export default PostHeader

const StyledWrapper = styled.div`
  margin-bottom: 40px;
  padding-bottom: 20px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray6};

  .title {
    font-family: var(--font-display);
    font-size: clamp(28px, 4vw, 40px);
    line-height: 1.2;
    font-weight: 600;
    letter-spacing: -0.03em;
    word-break: keep-all;
  }

  .summary {
    margin: 12px 0 0;
    font-size: 19px;
    line-height: 1.55;
    color: ${({ theme }) => theme.colors.gray10};
  }

  .meta-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    margin-top: 16px;
  }

  .meta {
    display: flex;
    flex-wrap: wrap;
    gap: 4px 8px;
    margin: 0;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.gray10};

    .sep::before {
      content: "·";
      margin-right: 8px;
      color: ${({ theme }) => theme.colors.gray9};
    }
  }

  .share {
    display: inline-flex;
    align-items: center;
    flex-shrink: 0;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.gray10};
    cursor: pointer;

    &:hover,
    &[data-copied="true"] {
      color: ${({ theme }) => theme.colors.indigo9};
    }
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 12px;
  }

  /* Representative image from the Notion "thumbnail" property */
  .cover {
    position: relative;
    aspect-ratio: 16 / 9;
    margin-top: 28px;
    border-radius: 18px;
    overflow: hidden;
    background: ${({ theme }) => theme.colors.gray4};
  }
`
