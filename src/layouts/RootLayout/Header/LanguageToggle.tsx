import styled from "@emotion/styled"
import React from "react"
import { useUiLanguage } from "src/contexts/UiLanguageContext"

const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useUiLanguage()

  return (
    <StyledWrapper data-language={language}>
      <div className="thumb" aria-hidden="true" />
      <button
        type="button"
        data-active={language === "ko"}
        aria-pressed={language === "ko"}
        onClick={() => setLanguage("ko")}
      >
        ko
      </button>
      <button
        type="button"
        data-active={language === "en"}
        aria-pressed={language === "en"}
        onClick={() => setLanguage("en")}
      >
        en
      </button>
    </StyledWrapper>
  )
}

export default LanguageToggle

const StyledWrapper = styled.div`
  display: inline-flex;
  align-items: center;
  font-size: 0.72rem;

  .thumb {
    display: none;
  }

  button + button::before {
    content: "/";
    margin: 0 0.35rem;
    color: ${({ theme }) => theme.colors.gray7};
  }

  button {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0;
    color: ${({ theme }) => theme.colors.gray9};
    letter-spacing: -0.01em;
    cursor: pointer;
    transition: color 120ms ease;

    &:hover,
    &[data-active="true"] {
      color: ${({ theme }) => theme.colors.gray12};
    }

    &[data-active="true"] {
      font-weight: 600;
    }
  }
`
