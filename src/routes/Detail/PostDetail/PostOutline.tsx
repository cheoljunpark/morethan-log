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
  width: 100%;
  min-width: 0;
  max-width: 100%;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.colors.gray6};
  border-radius: 1.1rem;
  padding: 0.9rem;
  background-color: ${({ theme }) =>
    theme.scheme === "light" ? "rgba(255, 255, 255, 0.62)" : "rgba(29, 36, 48, 0.72)"};
  backdrop-filter: blur(14px);

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
    width: 100%;
    min-width: 0;
  }

  .item {
    display: block;
    width: 100%;
    max-width: 100%;
    box-sizing: border-box;
    padding: 0.35rem 0.5rem;
    border-radius: 0.75rem;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.gray10};
    overflow-wrap: anywhere;
    word-break: break-word;

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
