import styled from "@emotion/styled"
import Link from "next/link"
import { memo } from "react"
import { CONFIG } from "site.config"
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
      <article data-post-id={data.id}>
        <p className="meta">
          <time>{formatIndexDate(getPostDate(data))}.</time>
          <span>{CONFIG.profile.name}</span>
        </p>
        <h2>{data.title}</h2>
        {data.summary && <p className="summary">{data.summary}</p>}
      </article>
    </StyledWrapper>
  )
}

export default memo(PostCard)

const StyledWrapper = styled(Link)`
  display: block;

  article {
    padding: 36px 0 40px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray6};

    @media (max-width: 734px) {
      padding: 28px 0 32px;
    }
  }

  .meta {
    display: flex;
    gap: 8px;
    margin: 0 0 12px;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.gray10};
  }

  h2 {
    font-family: var(--font-display);
    font-size: 32px;
    line-height: 1.25;
    font-weight: 600;
    letter-spacing: -0.03em;
    color: ${({ theme }) => theme.colors.gray12};
    word-break: keep-all;
    transition: color 120ms ease;

    @media (max-width: 734px) {
      font-size: 24px;
    }
  }

  .summary {
    margin: 14px 0 0;
    font-size: 16px;
    line-height: 1.6;
    color: ${({ theme }) => theme.colors.gray11};
  }

  &:hover h2 {
    color: ${({ theme }) => theme.colors.indigo9};
  }
`
