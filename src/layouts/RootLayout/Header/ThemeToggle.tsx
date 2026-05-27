import styled from "@emotion/styled"
import React from "react"
import { FiMoon, FiSun } from "react-icons/fi"
import useScheme from "src/hooks/useScheme"

type Props = {}

const ThemeToggle: React.FC<Props> = () => {
  const [scheme, setScheme] = useScheme()

  const handleClick = () => {
    setScheme(scheme === "light" ? "dark" : "light")
  }

  return (
    <StyledWrapper
      type="button"
      aria-label={scheme === "light" ? "Switch to dark mode" : "Switch to light mode"}
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
  border-radius: 9999px;
  background: transparent;
  color: ${({ theme }) => theme.colors.gray12};
  cursor: pointer;

  svg {
    width: 1rem;
    height: 1rem;
    stroke: currentColor;
  }
`
