import styled from "@emotion/styled"
import { useRouter } from "next/router"
import React from "react"
import getFeedQuery from "src/libs/utils/router/getFeedQuery"

type Props = {
  children: string
}

const Tag: React.FC<Props> = ({ children }) => {
  const router = useRouter()

  const handleClick = (value: string) => {
    router.push(
      {
        pathname: "/",
        query: {
          ...getFeedQuery(router.query),
          tag: value,
        },
      },
      undefined,
      { scroll: false }
    )
  }
  return (
    <StyledWrapper onClick={() => handleClick(children)}>
      {children}
    </StyledWrapper>
  )
}

export default Tag

const StyledWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  white-space: nowrap;
  font-size: 0.75rem;
  line-height: 1.2;
  color: ${({ theme }) => theme.colors.gray10};
  cursor: pointer;
  transition: color 120ms ease;

  &::before {
    content: "#";
    color: ${({ theme }) => theme.colors.gray9};
  }

  &:hover {
    color: ${({ theme }) => theme.colors.indigo9};
  }
`
