import { CONFIG } from "site.config"
import Tag from "src/components/Tag"
import { TPost } from "src/types"
import { formatDate } from "src/libs/utils"
import Image from "next/image"
import React, { useState } from "react"
import styled from "@emotion/styled"
import useReadingTime from "src/hooks/useReadingTime"
import usePostQuery from "src/hooks/usePostQuery"

type Props = {
  data: TPost
}

const PostHeader: React.FC<Props> = ({ data }) => {
  const post = usePostQuery()
  const readingTime = useReadingTime(post)
  const series = data.series?.[0]
  const [shareLabel, setShareLabel] = useState("Copy Link")

  const handleShare = async () => {
    if (typeof window === "undefined") return

    const baseUrl = CONFIG.link.replace(/\/$/, "")
    const shareUrl = `${baseUrl}/${data.slug}`

    try {
      if (navigator.share) {
        await navigator.share({
          title: data.title,
          text: data.summary || data.title,
          url: shareUrl,
        })
        setShareLabel("Shared")
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl)
        setShareLabel("Copied")
      } else {
        window.prompt("Copy this link", shareUrl)
        setShareLabel("Ready")
      }
    } catch {
      setShareLabel("Copy Link")
    }

    window.setTimeout(() => {
      setShareLabel("Copy Link")
    }, 2000)
  }

  return (
    <StyledWrapper>
      {series && <div className="series">{series}</div>}
      <h1 className="title">{data.title}</h1>
      {data.type[0] !== "Paper" && (
        <nav>
          <div className="top">
            <div className="meta">
              {data.author && data.author[0] && data.author[0].name && (
                <>
                  <div className="author">
                    <Image
                      css={{ borderRadius: "50%" }}
                      src={data.author[0].profile_photo || CONFIG.profile.image}
                      alt="profile_photo"
                      width={24}
                      height={24}
                    />
                    <div className="">{data.author[0].name}</div>
                  </div>
                  <div className="hr"></div>
                </>
              )}
              <div className="date">
                {formatDate(
                  data?.date?.start_date || data.createdTime,
                  CONFIG.lang
                )}
              </div>
              {readingTime && (
                <div className="reading-time">{readingTime} min read</div>
              )}
            </div>
            <button className="share" onClick={handleShare} type="button">
              {shareLabel}
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
              <Image
                src={data.thumbnail}
                css={{ objectFit: "cover" }}
                fill
                alt={data.title}
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
  .series {
    margin-bottom: 0.75rem;
    font-size: 0.8rem;
    line-height: 1.1rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.gray10};
  }
  .title {
    font-size: 1.875rem;
    line-height: 2.25rem;
    font-weight: 700;
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

        .author {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        .hr {
          margin-top: 0.25rem;
          margin-bottom: 0.25rem;
          align-self: stretch;
          width: 1px;
          background-color: ${({ theme }) => theme.colors.gray10};
        }
        .date {
          margin-right: 0.5rem;

          @media (min-width: 768px) {
            margin-left: 0;
          }
        }
        .reading-time {
          color: ${({ theme }) => theme.colors.gray10};
        }
      }

      .share {
        border: none;
        border-radius: 9999px;
        width: fit-content;
        padding: 0.5rem 0.9rem;
        font-size: 0.875rem;
        line-height: 1.25rem;
        font-weight: 600;
        color: ${({ theme }) => theme.colors.gray12};
        background-color: ${({ theme }) => theme.colors.gray4};
        cursor: pointer;

        &:hover {
          background-color: ${({ theme }) => theme.colors.gray5};
        }
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
      background-color: ${({ theme }) => theme.colors.gray4};
      padding-bottom: 66%;

      @media (min-width: 1024px) {
        padding-bottom: 50%;
      }
    }
  }
`
