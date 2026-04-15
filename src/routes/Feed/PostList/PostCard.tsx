import Link from "next/link"
import { CONFIG } from "site.config"
import { formatDate } from "src/libs/utils"
import Tag from "../../../components/Tag"
import { TPost } from "../../../types"
import Image from "next/image"
import Category from "../../../components/Category"
import styled from "@emotion/styled"
import { storageKey } from "src/constants/storage"

type Props = {
  data: TPost
}

const PostCard: React.FC<Props> = ({ data }) => {
  const category = (data.category && data.category?.[0]) || undefined
  const series = data.series?.[0]
  const primaryTag = data.tags?.[0]
  const secondaryTags = data.tags?.slice(1, 4) || []
  const handleClick = () => {
    if (typeof window === "undefined") return

    window.sessionStorage.setItem(storageKey.feedScrollY, `${window.scrollY}`)
    window.sessionStorage.setItem(storageKey.feedActivePostId, data.id)
  }

  return (
    <StyledWrapper href={`/${data.slug}`} onClick={handleClick}>
      <article data-post-id={data.id}>
        {data.thumbnail && (
          <div className="thumbnail">
            <Image
              src={data.thumbnail}
              fill
              alt={data.title}
              css={{ objectFit: "cover" }}
            />
          </div>
        )}
        <div data-thumb={!!data.thumbnail} data-category={!!category} className="content">
          <div className="eyebrow">
            <div className="meta-left">
              <span className="type">{data.type[0]}</span>
              {series && <span className="series">{series}</span>}
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

export default PostCard

const StyledWrapper = styled(Link)`
  article {
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

    @media (min-width: 768px) {
      margin-bottom: 2rem;
    }

    :hover {
      transform: translateY(-2px);
      border-color: ${({ theme }) => theme.colors.gray8};
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
        0 4px 6px -2px rgba(0, 0, 0, 0.05);
    }

    > .thumbnail {
      position: relative;
      width: 100%;
      background:
        linear-gradient(135deg, rgba(15, 118, 110, 0.08), rgba(20, 184, 166, 0.02)),
        ${({ theme }) => theme.colors.gray2};
      padding-bottom: 58%;

      @media (min-width: 1024px) {
        padding-bottom: 42%;
      }
    }
    > .content {
      padding: 1.15rem 1.15rem 1.2rem;

      &[data-thumb="false"] {
        padding-top: 1.15rem;
      }

      > .eyebrow {
        display: flex;
        justify-content: space-between;
        gap: 0.75rem;
        align-items: center;
        margin-bottom: 0.9rem;

        .meta-left,
        .meta-right {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          align-items: center;
        }

        .type,
        .series,
        .primary-tag {
          display: inline-flex;
          align-items: center;
          min-height: 1.7rem;
          padding: 0.2rem 0.55rem;
          border-radius: 9999px;
          font-size: 0.75rem;
          line-height: 1rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .type {
          color: #115e59;
          background: rgba(20, 184, 166, 0.14);
        }

        .series {
          color: ${({ theme }) => theme.colors.gray10};
          background-color: ${({ theme }) => theme.colors.gray3};
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

        @media (min-width: 768px) {
          align-items: center;
        }

        h2 {
          margin-bottom: 0.7rem;
          font-size: 1.2rem;
          line-height: 1.8rem;
          font-weight: 700;

          cursor: pointer;

          @media (min-width: 768px) {
            font-size: 1.4rem;
            line-height: 2rem;
          }
        }

      }
      > .date {
        display: flex;
        margin-bottom: 0.95rem;
        gap: 0.5rem;
        align-items: center;

        .content {
          font-size: 0.875rem;
          line-height: 1.25rem;
          font-weight: 500;
          letter-spacing: -0.01em;
          color: ${({ theme }) => theme.colors.gray10};
          @media (min-width: 768px) {
            margin-left: 0;
          }
        }
      }
      > .summary {
        margin-bottom: 1rem;

        p {
          display: -webkit-box;
          overflow: hidden;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          line-height: 1.8rem;
          color: ${({ theme }) => theme.colors.gray11};
        }
      }
      > .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
      }
    }
  }
`
