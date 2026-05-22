import styled from "@emotion/styled"
import React, { InputHTMLAttributes } from "react"
import { useUiLanguage } from "src/contexts/UiLanguageContext"

interface Props extends InputHTMLAttributes<HTMLInputElement> {}

const SearchInput: React.FC<Props> = ({ ...props }) => {
  const { language } = useUiLanguage()

  return (
    <StyledWrapper>
      <div className="field">
        <span className="icon" aria-hidden="true" />
        <input
          className="mid"
          type="text"
          placeholder={language === "ko" ? "검색어를 입력하세요" : "Search posts"}
          {...props}
        />
      </div>
    </StyledWrapper>
  )
}

export default SearchInput

const StyledWrapper = styled.div`
  width: 100%;

  .field {
    position: relative;
    width: 100%;
  }

  .icon {
    position: absolute;
    top: 50%;
    left: 0.9rem;
    width: 0.78rem;
    height: 0.78rem;
    border: 1.8px solid ${({ theme }) => theme.colors.gray9};
    border-radius: 9999px;
    transform: translateY(-58%);
    opacity: 0.7;
    pointer-events: none;

    &::after {
      content: "";
      position: absolute;
      right: -0.18rem;
      bottom: -0.16rem;
      width: 0.34rem;
      height: 1.8px;
      border-radius: 9999px;
      background-color: ${({ theme }) => theme.colors.gray9};
      transform: rotate(45deg);
      transform-origin: center;
    }
  }

  .mid {
    width: 100%;
    height: 2.15rem;
    padding: 0.42rem 1rem 0.42rem 2.45rem;
    border-radius: 0.95rem;
    border: 1px solid ${({ theme }) => theme.colors.gray5};
    outline: none;
    background-color: ${({ theme }) => theme.colors.gray3};
    color: ${({ theme }) => theme.colors.gray12};
    font-size: 0.9rem;
    line-height: 1.2rem;
    transition:
      border-color 160ms ease,
      background-color 160ms ease,
      box-shadow 160ms ease;

    &::placeholder {
      color: ${({ theme }) => theme.colors.gray9};
    }

    &:focus {
      border-color: ${({ theme }) => theme.colors.gray7};
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.08);
    }
  }
`
