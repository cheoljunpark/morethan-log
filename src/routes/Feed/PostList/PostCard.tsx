import styled from "@emotion/styled"
import Image from "next/image"
import Link from "next/link"
import { memo } from "react"
import { formatIndexDate, getPostDate } from "src/libs/utils"
import { saveFeedPosition } from "src/libs/utils/feedScroll"
import { TPost } from "src/types"

type Props = {
  data: TPost
}

const PostCard: React.FC<Props> = ({ data }) => {
  return (
    <StyledWrapper
      href={`/${data.slug}`}
      prefetch={false}
      onClick={() => saveFeedPosition(data.id)}
    >
      <article data-post-id={data.id} data-has-thumbnail={!!data.thumbnail}>
        <div className="body">
          <p className="meta">
            <time>{formatIndexDate(getPostDate(data))}.</time>
          </p>
          <h2>{data.title}</h2>
          {data.summary && <p className="summary">{data.summary}</p>}
        </div>
        {data.thumbnail && (
          <div className="thumb">
            <Image
              src={data.thumbnail}
              alt=""
              fill
              sizes="(max-width: 734px) 76px, 160px"
              style={{ objectFit: "cover" }}
            />
          </div>
        )}
      </article>
    </StyledWrapper>
  )
}

export default memo(PostCard)

const StyledWrapper = styled(Link)`
  display: block;

  article {
    padding: 28px 0 30px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray6};

    &[data-has-thumbnail="true"] {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 160px;
      gap: 32px;
      align-items: center;

      @media (max-width: 734px) {
        grid-template-columns: minmax(0, 1fr) 76px;
        gap: 16px;
      }
    }

    @media (max-width: 734px) {
      padding: 22px 0 24px;
    }
  }

  .body {
    min-width: 0;
  }

  .meta {
    display: flex;
    gap: 8px;
    margin: 0 0 8px;
    font-size: 13px;
    color: ${({ theme }) => theme.colors.gray10};
  }

  h2 {
    font-family: var(--font-display);
    font-size: 24px;
    line-height: 1.3;
    font-weight: 600;
    letter-spacing: -0.03em;
    color: ${({ theme }) => theme.colors.gray12};
    word-break: keep-all;
    transition: color 120ms ease;

    @media (max-width: 734px) {
      font-size: 19px;
    }
  }

  .summary {
    margin: 8px 0 0;
    font-size: 15px;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.gray11};
  }

  .thumb {
    position: relative;
    aspect-ratio: 3 / 2;
    border-radius: 12px;
    overflow: hidden;
    background: ${({ theme }) => theme.colors.gray4};

    img {
      transition: transform 240ms ease;
    }

    @media (max-width: 734px) {
      aspect-ratio: 1;
      border-radius: 8px;
    }
  }

  &:hover h2 {
    color: ${({ theme }) => theme.colors.indigo9};
  }

  &:hover .thumb img {
    transform: scale(1.04);
  }
`
