import NavBar from "./NavBar"
import Logo from "./Logo"
import ThemeToggle from "./ThemeToggle"
import styled from "@emotion/styled"
import { zIndexes } from "src/styles/zIndexes"

type Props = {
  fullWidth: boolean
}

const Header: React.FC<Props> = ({ fullWidth }) => {
  return (
    <StyledWrapper data-detail-safe="true">
      <div data-full-width={fullWidth} className="container">
        <Logo />
        <div className="nav">
          <ThemeToggle />
          <NavBar />
        </div>
      </div>
    </StyledWrapper>
  )
}

export default Header

const StyledWrapper = styled.div`
  z-index: ${zIndexes.header};
  position: sticky;
  top: 0;
  background-color: ${({ theme }) =>
    theme.scheme === "dark" ? "rgba(23, 28, 36, 0.78)" : "rgba(245, 247, 251, 0.72)"};
  backdrop-filter: blur(14px);
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray6};
  box-shadow: 0 8px 30px -24px rgba(15, 23, 42, 0.28);

  .container {
    display: flex;
    padding-left: 1rem;
    padding-right: 1rem;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 1120px;
    height: 3rem;
    margin: 0 auto;
    &[data-full-width="true"] {
      @media (min-width: 768px) {
        padding-left: 6rem;
        padding-right: 6rem;
      }
    }
    .nav {
      display: flex;
      gap: 0.75rem;
      align-items: center;
    }
  }
`
