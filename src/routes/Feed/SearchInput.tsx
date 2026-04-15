import styled from "@emotion/styled"
import React, { InputHTMLAttributes } from "react"

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

const SearchInput: React.FC<Props> = ({ ...props }) => {
  return (
    <StyledWrapper>
      <input
        className="mid"
        type="text"
        placeholder="Search Keyword..."
        {...props}
      />
    </StyledWrapper>
  )
}

export default SearchInput

const StyledWrapper = styled.div`
  width: 100%;

  > .mid {
    padding-top: 0.68rem;
    padding-bottom: 0.68rem;
    padding-left: 1.25rem;
    padding-right: 1.25rem;
    border-radius: 1rem;
    border: 1px solid ${({ theme }) => theme.colors.gray5};
    outline-style: none;
    width: 100%;
    background-color: ${({ theme }) => theme.colors.gray3};
  }
`
