import styled from "@emotion/styled"
import { useRouter } from "next/router"
import React from "react"
import { useTagsQuery } from "src/hooks/useTagsQuery"
import getFeedQuery from "src/libs/utils/router/getFeedQuery"

type Props = {}

const TagList: React.FC<Props> = () => {
  const router = useRouter()
  const currentTag = router.query.tag || undefined
  const data = useTagsQuery()

  const handleClickTag = (value: string) => {
    const nextQuery = {
      ...getFeedQuery(router.query),
      tag: currentTag === value ? undefined : value,
    }

    router.push(
      {
        pathname: "/",
        query: nextQuery,
      },
      undefined,
      { scroll: false }
    )
  }

  return (
    <StyledWrapper>
      <div className="top">Explore Tags</div>
      <div className="list">
        {Object.entries(data).map(([key, count]) => (
          <button
            key={key}
            data-active={key === currentTag}
            type="button"
            onClick={() => handleClickTag(key)}
          >
            <span className="name">#{key}</span>
            <span className="count">{count}</span>
          </button>
        ))}
      </div>
    </StyledWrapper>
  )
}

export default TagList

const StyledWrapper = styled.div`
  border: 1px solid ${({ theme }) => theme.colors.gray6};
  border-radius: 1.25rem;
  padding: 0.95rem;
  background-color: ${({ theme }) =>
    theme.scheme === "light"
      ? "rgba(255, 255, 255, 0.74)"
      : "rgba(28, 35, 46, 0.82)"};
  backdrop-filter: blur(14px);

  .top {
    padding: 0 0.1rem;
    margin-bottom: 0.75rem;
    font-size: 0.78rem;
    line-height: 1.1rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.gray10};
  }

  .list {
    display: flex;
    gap: 0.55rem;
    overflow: auto;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
    }

    @media (min-width: 1024px) {
      display: grid;
      gap: 0.6rem;
    }

    button {
      display: inline-flex;
      flex-shrink: 0;
      gap: 0.5rem;
      align-items: center;
      justify-content: space-between;
      min-width: fit-content;
      padding: 0.7rem 0.85rem;
      border: 1px solid ${({ theme }) => theme.colors.gray6};
      border-radius: 0.95rem;
      background-color: ${({ theme }) =>
        theme.scheme === "light"
          ? "rgba(255, 255, 255, 0.82)"
          : "rgba(31, 39, 52, 0.82)"};
      font-size: 0.875rem;
      line-height: 1.25rem;
      font-weight: 600;
      color: ${({ theme }) => theme.colors.gray11};
      cursor: pointer;
      transition: transform 180ms ease, border-color 180ms ease,
        background-color 180ms ease, color 180ms ease;

      .count {
        display: inline-flex;
        justify-content: center;
        align-items: center;
        min-width: 1.5rem;
        height: 1.5rem;
        padding: 0 0.4rem;
        border-radius: 9999px;
        background-color: ${({ theme }) => theme.colors.gray4};
        font-size: 0.72rem;
        line-height: 1rem;
        font-weight: 700;
        color: ${({ theme }) => theme.colors.gray10};
      }

      &:hover {
        transform: translateY(-1px);
        border-color: ${({ theme }) => theme.colors.gray8};
        background-color: ${({ theme }) => theme.colors.gray3};
      }

      &[data-active="true"] {
        color: ${({ theme }) => theme.colors.gray12};
        border-color: rgba(59, 130, 246, 0.28);
        background: linear-gradient(
          135deg,
          rgba(59, 130, 246, 0.14),
          rgba(37, 99, 235, 0.06)
        );

        .count {
          background-color: rgba(59, 130, 246, 0.16);
          color: #1d4ed8;
        }
      }
    }
  }
`
