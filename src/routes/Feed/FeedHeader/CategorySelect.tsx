import { useRouter } from "next/router"
import React from "react"
import { DEFAULT_CATEGORY } from "src/constants"
import styled from "@emotion/styled"
import { useCategoriesQuery } from "src/hooks/useCategoriesQuery"
import getFeedQuery from "src/libs/utils/router/getFeedQuery"

type Props = {}

const CategorySelect: React.FC<Props> = () => {
  const router = useRouter()
  const data = useCategoriesQuery()

  const currentCategory = `${router.query.category || ``}` || DEFAULT_CATEGORY

  const handleOptionClick = (category: string) => {
    router.push(
      {
        pathname: "/",
        query: {
          ...getFeedQuery(router.query),
          category,
        },
      },
      undefined,
      { scroll: false }
    )
  }

  return (
    <StyledWrapper>
      <div className="label">Category</div>
      <div className="content">
        {Object.keys(data).map((key, idx) => (
          <button
            className="item"
            data-active={currentCategory === key}
            key={idx}
            type="button"
            onClick={() => handleOptionClick(key)}
          >
            <span className="name">{key}</span>
            <span className="count">{data[key]}</span>
          </button>
        ))}
      </div>
    </StyledWrapper>
  )
}

export default CategorySelect

const StyledWrapper = styled.div`
  min-width: 0;
  width: 100%;

  > .label {
    margin-bottom: 0.55rem;
    font-size: 0.72rem;
    line-height: 1rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.gray10};
  }

  > .content {
    display: grid;
    gap: 0.45rem;

    > .item {
      display: flex;
      width: 100%;
      min-width: 0;
      gap: 0.45rem;
      align-items: center;
      justify-content: space-between;
      box-sizing: border-box;
      padding: 0.58rem 0.72rem;
      border: 1px solid ${({ theme }) => theme.colors.gray6};
      border-radius: 0.9rem;
      background-color: ${({ theme }) =>
        theme.scheme === "light"
          ? "rgba(255, 255, 255, 0.8)"
          : "rgba(31, 39, 52, 0.82)"};
      color: ${({ theme }) => theme.colors.gray11};
      font-size: 0.8rem;
      line-height: 1.1rem;
      font-weight: 600;
      cursor: pointer;
      transition: border-color 180ms ease, background-color 180ms ease,
        transform 180ms ease, color 180ms ease;

      .count {
        flex-shrink: 0;
        display: inline-flex;
        justify-content: center;
        align-items: center;
        min-width: 1.3rem;
        height: 1.3rem;
        padding: 0 0.32rem;
        border-radius: 9999px;
        background-color: ${({ theme }) => theme.colors.gray4};
        font-size: 0.68rem;
        line-height: 0.9rem;
        font-weight: 700;
        color: ${({ theme }) => theme.colors.gray10};
      }

      .name {
        min-width: 0;
        word-break: keep-all;
        overflow-wrap: break-word;
        text-align: left;
      }

      &:hover {
        transform: translateY(-1px);
        border-color: ${({ theme }) => theme.colors.gray8};
        background-color: ${({ theme }) => theme.colors.gray3};
      }

      &[data-active="true"] {
        border-color: rgba(20, 184, 166, 0.35);
        background: linear-gradient(
          135deg,
          rgba(20, 184, 166, 0.18),
          rgba(15, 118, 110, 0.08)
        );
        color: ${({ theme }) => theme.colors.gray12};

        .count {
          background-color: rgba(20, 184, 166, 0.18);
          color: #0f766e;
        }
      }
    }
  }
`
