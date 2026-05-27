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
  --toggle-width: 4.7rem;
  --toggle-height: 1.82rem;
  --thumb-inset: 2px;
  --toggle-padding: 0px;

  position: relative;
  box-sizing: border-box;
  display: inline-grid;
  grid-template-columns: repeat(2, 1fr);
  align-items: center;
  width: var(--toggle-width);
  min-width: var(--toggle-width);
  height: var(--toggle-height);
  border: 1px solid ${({ theme }) => theme.colors.gray6};
  border-radius: 9999px;
  background-color: ${({ theme }) => theme.colors.gray2};
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.16);
  overflow: hidden;

  .thumb {
    position: absolute;
    top: var(--thumb-inset);
    bottom: var(--thumb-inset);
    left: var(--thumb-inset);
    width: calc(50% - var(--thumb-inset));
    border-radius: 9999px;
    background-color: ${({ theme }) => theme.colors.gray4};
    box-shadow: 0 6px 14px -10px rgba(15, 23, 42, 0.45);
    transition:
      left 220ms cubic-bezier(0.22, 1, 0.36, 1),
      background-color 180ms ease,
      box-shadow 180ms ease;
  }

  &[data-language="en"] .thumb {
    left: 50%;
  }

  button {
    box-sizing: border-box;
    position: relative;
    z-index: 1;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    min-width: 0;
    height: calc(var(--toggle-height) - (var(--toggle-padding) * 2));
    padding: 0;
    border: none;
    border-radius: 9999px;
    background-color: transparent;
    color: ${({ theme }) => theme.colors.gray10};
    font-size: 0.73rem;
    line-height: 1;
    font-weight: 700;
    text-align: center;
    text-transform: lowercase;
    cursor: pointer;
    user-select: none;
    transform: translateY(0) scale(1);
    transition:
      transform 160ms ease,
      color 180ms ease,
      opacity 180ms ease;

    &:hover {
      transform: translateY(-1px);
      color: ${({ theme }) => theme.colors.gray12};
    }

    &:active {
      transform: translateY(0) scale(0.96);
    }

    &[data-active="true"] {
      color: ${({ theme }) => theme.colors.gray12};
    }

    &[data-active="false"] {
      opacity: 0.88;
    }
  }

  @media (max-width: 1023px) {
    --toggle-width: 3.85rem;
    --toggle-height: 1.5rem;

    button {
      font-size: 0.64rem;
    }
  }
`
