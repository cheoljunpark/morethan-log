import styled from "@emotion/styled"
import React from "react"

type TocItem = {
  id: string
  level: number
  text: string
}

type Props = {
  items: TocItem[]
  activeId: string
}

const PostOutline: React.FC<Props> = ({ items, activeId }) => {
  if (items.length === 0) return null

  return (
    <StyledWrapper>
      <div className="title">On This Page</div>
      <div className="items">
        {items.map((item) => (
          <a
            key={item.id}
            href={`#${item.id}`}
            className="item"
            data-level={item.level}
            data-active={item.id === activeId}
          >
            {item.text}
          </a>
        ))}
      </div>
    </StyledWrapper>
  )
}

export default PostOutline

const StyledWrapper = styled.aside`
  position: sticky;
  top: 6rem;
  padding: 1rem;
  border-radius: 1rem;
  background-color: ${({ theme }) => theme.colors.gray3};

  .title {
    margin-bottom: 0.85rem;
    font-size: 0.8rem;
    line-height: 1.1rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.gray10};
  }

  .items {
    display: grid;
    gap: 0.35rem;
  }

  .item {
    display: block;
    padding: 0.35rem 0.5rem;
    border-radius: 0.75rem;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.gray10};

    &[data-level="2"] {
      padding-left: 0.9rem;
    }

    &[data-level="3"] {
      padding-left: 1.3rem;
    }

    &[data-active="true"] {
      font-weight: 700;
      color: ${({ theme }) => theme.colors.gray12};
      background-color: ${({ theme }) => theme.colors.gray4};
    }

    &:hover {
      background-color: ${({ theme }) => theme.colors.gray4};
    }
  }
`
