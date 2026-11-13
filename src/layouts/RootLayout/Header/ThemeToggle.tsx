import styled from "@emotion/styled"
import React from "react"
import { FiMoon, FiSun } from "react-icons/fi"
import { useUiLanguage } from "src/contexts/UiLanguageContext"
import useScheme from "src/hooks/useScheme"

type Props = {}

const ThemeToggle: React.FC<Props> = () => {
  const [scheme, setScheme] = useScheme()
  const ko = useUiLanguage().language === "ko"

  const handleClick = () => {
    setScheme(scheme === "light" ? "dark" : "light")
  }

  return (
    <StyledWrapper
      type="button"
      aria-label={
        scheme === "light"
          ? ko ? "다크 모드로 전환" : "Switch to dark mode"
          : ko ? "라이트 모드로 전환" : "Switch to light mode"
      }
      onClick={handleClick}
    >
      {scheme === "light" ? <FiMoon aria-hidden="true" /> : <FiSun aria-hidden="true" />}
    </StyledWrapper>
  )
}

export default ThemeToggle

const StyledWrapper = styled.button`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 1.8rem;
  height: 1.8rem;
  padding: 0;
  border: 0;
  background: transparent;
  color: ${({ theme }) => theme.colors.gray10};
  transition: color 120ms ease;

  &:hover {
    color: ${({ theme }) => theme.colors.gray12};
  }
  cursor: pointer;

  svg {
    width: 1rem;
    height: 1rem;
    stroke: currentColor;
  }
`
