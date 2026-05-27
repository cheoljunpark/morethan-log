import Link from "next/link"
import { CONFIG } from "site.config"
import { memo } from "react"
import { formatDate } from "src/libs/utils"
import Tag from "../../../components/Tag"
import { TPost } from "../../../types"
import Category from "../../../components/Category"
import styled from "@emotion/styled"
import { storageKey } from "src/constants/storage"
import AdaptiveThumbnail from "src/components/AdaptiveThumbnail"
import normalizeFeedQueryString from "src/libs/utils/router/normalizeFeedQueryString"
import useUtterancesCommentCount from "src/hooks/useUtterancesCommentCount"

type Props = {
  data: TPost
}

const PostCard: React.FC<Props> = ({ data }) => {
  const category = data.menu?.[0]
  const primaryTag = data.tags?.[0]
  const secondaryTags = data.tags?.slice(1, 4) || []
  const showType = data.type[0] !== "Post"
  const commentCount = useUtterancesCommentCount(data.title)
  const handleClick = () => {
    if (typeof window === "undefined") return

    window.sessionStorage.setItem(storageKey.feedScrollY, `${window.scrollY}`)
    window.sessionStorage.setItem(storageKey.feedActivePostId, data.id)
    window.sessionStorage.setItem(
      storageKey.feedQueryString,
      normalizeFeedQueryString(window.location.search || "")
    )
  }

  return (
    <StyledWrapper href={`/${data.slug}`} prefetch={false} onClick={handleClick}>
      <article data-post-id={data.id}>
        <div className="thumbnail" data-empty={!data.thumbnail}>
          {data.thumbnail && (
            <AdaptiveThumbnail
              src={data.thumbnail}
              alt={data.title}
              className="thumbnail-image"
              sizes="(min-width: 1480px) 360px, (min-width: 1024px) 520px, 100vw"
            />
          )}
          {!data.thumbnail && (
            <div className="default-thumbnail" aria-hidden="true" />
          )}
        </div>
        <div data-category={!!category} className="content">
          <div className="eyebrow">
            <div className="meta-left">
              {showType && <span className="type">{data.type[0]}</span>}
            </div>
            <div className="meta-right">
              {category && (
                <div className="category">
                  <Category>{category}</Category>
                </div>
              )}
              {primaryTag && <span className="primary-tag">{primaryTag}</span>}
            </div>
          </div>
          <header className="top">
            <h2>{data.title}</h2>
          </header>
          <div className="date">
            <div className="content">
              {formatDate(
                data?.date?.start_date || data.createdTime,
                CONFIG.lang
              )}
            </div>
            {typeof commentCount === "number" && (
              <span className="comment-badge" aria-label={`댓글 ${commentCount}개`}>
                <span className="comment-icon" aria-hidden="true" />
                {commentCount}
              </span>
            )}
          </div>
          <div className="summary">
            <p>{data.summary}</p>
          </div>
          <div className="tags">
            {secondaryTags.map((tag: string, idx: number) => (
                <Tag key={idx}>{tag}</Tag>
              ))}
          </div>
        </div>
      </article>
    </StyledWrapper>
  )
}

export default memo(PostCard)

const StyledWrapper = styled(Link)`
  article {
    content-visibility: auto;
    contain-intrinsic-size: 24rem 30rem;
    overflow: hidden;
    position: relative;
    margin-bottom: 1.5rem;
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    border-radius: 1.25rem;
    background-color: ${({ theme }) =>
      theme.scheme === "light" ? "white" : theme.colors.gray4};
    transition-property: box-shadow, transform, border-color;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    transition-duration: 300ms;

    @media (min-width: 1024px) {
      margin-bottom: 2rem;
    }

    @media (max-width: 1023px) {
      position: relative;
      display: grid;
      grid-template-columns: minmax(0, 1fr) 4.6rem;
      gap: 0.75rem;
      align-items: stretch;
      margin-bottom: 0;
      padding: 0.9rem 0.1rem 0.9rem 0.8rem;
      border: 0;
      border-bottom: 1px solid ${({ theme }) => theme.colors.gray5};
      border-radius: 0;
      background-color: transparent;
      box-shadow: none;
      content-visibility: visible;
      contain-intrinsic-size: auto;

      &::before {
        content: "";
        position: absolute;
        left: 0.12rem;
        top: 1rem;
        bottom: 1rem;
        width: 0.18rem;
        border-radius: 9999px;
        background: linear-gradient(180deg, #14b8a6, #60a5fa);
        opacity: 0.78;
      }
    }

    :hover {
      transform: translateY(-2px);
      border-color: ${({ theme }) => theme.colors.gray8};
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.05);

      .thumbnail-image {
        transform: scale(1.02);
      }
    }

    > .thumbnail {
      position: relative;
      width: 100%;
      background-color: ${({ theme }) => theme.colors.gray2};
      padding-bottom: 58%;

      &[data-empty="true"] {
        background-color: #111111;
      }

      .thumbnail-image {
        transition: transform 300ms ease;
      }

      .default-thumbnail {
        position: absolute;
        inset: 0;
        background-image: url("/logo.png");
        background-position: center;
        background-repeat: no-repeat;
        background-size: min(34%, 7rem) auto;
      }

      @media (min-width: 1024px) {
        padding-bottom: 42%;
      }

      @media (max-width: 1023px) {
        grid-column: 2;
        grid-row: 1;
        align-self: stretch;
        min-height: 4.2rem;
        padding-bottom: 0;
        border-radius: 0.72rem;
        overflow: hidden;

        .default-thumbnail {
          background-size: min(40%, 2.3rem) auto;
        }
      }
    }
    > .content {
      display: grid;
      grid-template-rows: 1.42rem 4rem 1.45rem;
      row-gap: 0.62rem;
      padding: 1.15rem 1.15rem 1.2rem;

      @media (max-width: 1023px) {
        grid-column: 1;
        grid-row: 1;
        grid-template-rows: auto auto;
        row-gap: 0.42rem;
        min-width: 0;
        padding: 0;
      }

      > .eyebrow {
        display: flex;
        justify-content: space-between;
        gap: 0.75rem;
        align-items: center;
        min-height: 1.42rem;

        .meta-left,
        .meta-right {
          display: flex;
          gap: 0.3rem;
          align-items: center;
        }

        .meta-left {
          flex-wrap: wrap;
        }

        .meta-right {
          flex-wrap: nowrap;
          min-width: 0;
          max-width: 100%;
          overflow: hidden;
        }

        .category,
        .primary-tag {
          flex: 0 0 auto;
          white-space: nowrap;
        }

        .category > div {
          height: 1.42rem;
          min-height: 1.42rem;
          padding: 0 0.34rem;
          font-size: 0.62rem;
          line-height: 1;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        @media (max-width: 1023px) {
          display: none;
        }

        .type,
        .primary-tag {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 1.42rem;
          padding: 0 0.34rem;
          border-radius: 9999px;
          font-size: 0.62rem;
          line-height: 1;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .type {
          color: #115e59;
          background: rgba(20, 184, 166, 0.14);
        }

        .primary-tag {
          color: ${({ theme }) => theme.colors.gray11};
          background-color: ${({ theme }) => theme.colors.gray3};
        }
      }

      > .top {
        display: flex;
        gap: 1rem;
        justify-content: space-between;
        align-items: flex-start;
        min-height: 0;

        @media (min-width: 1024px) {
          align-items: flex-start;
        }

        h2 {
          margin: 0;
          display: -webkit-box;
          overflow: hidden;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          font-size: 1.2rem;
          line-height: 1.8rem;
          font-weight: 700;

          cursor: pointer;

          @media (min-width: 1024px) {
            font-size: 1.4rem;
            line-height: 2rem;
          }

          @media (max-width: 1023px) {
            font-size: 0.96rem;
            line-height: 1.38rem;
          }
        }

      }
      > .date {
        display: flex;
        gap: 0.5rem;
        align-items: center;
        justify-content: space-between;
        min-height: 1.45rem;

        .content {
          min-width: 0;
          font-size: 0.875rem;
          line-height: 1.25rem;
          font-weight: 500;
          letter-spacing: -0.01em;
          color: ${({ theme }) => theme.colors.gray10};
          @media (min-width: 1024px) {
            margin-left: 0;
          }
        }

        @media (max-width: 1023px) {
          justify-content: flex-start;
          gap: 0.38rem;
          min-height: 1.4rem;

          .content {
            display: inline-flex;
            align-items: center;
            min-height: 1.4rem;
            padding: 0.14rem 0.48rem;
            border-radius: 9999px;
            background-color: ${({ theme }) =>
              theme.scheme === "light" ? "rgba(240, 253, 250, 0.9)" : "rgba(20, 184, 166, 0.13)"};
            color: ${({ theme }) => (theme.scheme === "light" ? "#0f766e" : "#5eead4")};
            font-size: 0.68rem;
            line-height: 0.9rem;
            font-weight: 600;
          }

          .comment-badge {
            min-height: 1.4rem;
            padding: 0 0.46rem;
            font-size: 0.68rem;
          }
        }

        .comment-badge {
          display: inline-flex;
          flex: 0 0 auto;
          align-items: center;
          gap: 0.34rem;
          min-height: 1.45rem;
          padding: 0 0.5rem;
          border: 1px solid ${({ theme }) => theme.colors.gray6};
          border-radius: 9999px;
          font-size: 0.72rem;
          line-height: 1;
          font-weight: 700;
          color: ${({ theme }) =>
            theme.scheme === "light" ? "#0f766e" : "#5eead4"};
          background: ${({ theme }) =>
            theme.scheme === "light"
              ? "rgba(240, 253, 250, 0.9)"
              : "rgba(20, 184, 166, 0.12)"};
        }

        .comment-icon {
          width: 0.86rem;
          height: 0.86rem;
          flex: 0 0 auto;
          background: currentColor;
          mask: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z'/%3E%3Cpath d='M8 10h.01'/%3E%3Cpath d='M12 10h.01'/%3E%3Cpath d='M16 10h.01'/%3E%3C/svg%3E")
            center / contain no-repeat;
          -webkit-mask: url("data:image/svg+xml,%3Csvg viewBox='0 0 24 24' fill='none' stroke='black' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4z'/%3E%3Cpath d='M8 10h.01'/%3E%3Cpath d='M12 10h.01'/%3E%3Cpath d='M16 10h.01'/%3E%3C/svg%3E")
            center / contain no-repeat;
        }
      }
      > .summary {
        display: none;
        min-height: 0;

        p {
          margin: 0;
          display: -webkit-box;
          overflow: hidden;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          line-height: 1.8rem;
          color: ${({ theme }) => theme.colors.gray11};
        }
      }
      > .tags {
        display: none;
        flex-wrap: nowrap;
        gap: 0.35rem;
        max-width: 100%;
        overflow: hidden;

        > div {
          padding: 0.18rem 0.42rem;
          font-size: 0.68rem;
          line-height: 0.95rem;
        }
      }
    }

    @media (max-width: 1023px) {
      > .content > .date .comment-badge {
        min-height: 1.4rem;
        padding: 0 0.46rem;
        font-size: 0.68rem;
      }
    }
  }
`
