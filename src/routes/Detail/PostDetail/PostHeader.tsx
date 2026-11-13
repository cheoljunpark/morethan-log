import Tag from "src/components/Tag"
import { TPost } from "src/types"
import { formatIndexDate, getPostDate, siteUrl } from "src/libs/utils"
import React, { useState } from "react"
import styled from "@emotion/styled"
import Image from "next/image"
import Link from "next/link"
import { FiChevronRight, FiLink } from "react-icons/fi"
import { useUiLanguage } from "src/contexts/UiLanguageContext"

type Props = {
  data: TPost
}

const PostHeader: React.FC<Props> = ({ data }) => {
  const { language } = useUiLanguage()
  const menu = data.menu?.[0]
  const submenu = data.submenu?.[0]
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
      {menu && (
        // Category path above the title; each part opens that list on the feed.
        <nav
          className="category"
          aria-label={language === "ko" ? "카테고리" : "Category"}
        >
          <Link href={{ pathname: "/", query: { menu } }}>{menu}</Link>
          {submenu && (
            <>
              <FiChevronRight aria-hidden="true" />
              <Link href={{ pathname: "/", query: { menu, submenu } }}>
                {submenu}
              </Link>
            </>
          )}
        </nav>
      )}
      <h1 className="title">{data.title}</h1>
      {data.summary && <p className="summary">{data.summary}</p>}
      <div className="meta-row">
        <p className="meta">
          <time>{formatIndexDate(getPostDate(data))}.</time>
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
  }

  .category {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
    margin-bottom: 10px;
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.indigo9};

    svg {
      width: 14px;
      height: 14px;
      color: ${({ theme }) => theme.colors.gray8};
    }

    a {
      padding: 6px 0;
    }

    a:hover {
      text-decoration: underline;
      text-underline-offset: 0.2em;
    }
  }

  /* 44px touch area around a small icon */
  .share {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    min-width: 44px;
    height: 44px;
    margin: -12px -12px -12px 0;
    border-radius: 10px;
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
