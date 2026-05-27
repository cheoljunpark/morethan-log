import styled from "@emotion/styled"
import useDebouncedFeedSearch from "src/hooks/useDebouncedFeedSearch"
import SearchInput from "src/routes/Feed/SearchInput"
import { zIndexes } from "src/styles/zIndexes"
import LanguageToggle from "./LanguageToggle"
import Logo from "./Logo"
import NavBar from "./NavBar"
import ThemeToggle from "./ThemeToggle"

type Props = {
  fullWidth: boolean
}

const Header: React.FC<Props> = ({ fullWidth }) => {
  const {
    searchValue,
    handleChange,
    handleCompositionStart,
    handleCompositionEnd,
  } = useDebouncedFeedSearch()

  return (
    <StyledWrapper data-detail-safe="true">
      <div
        data-full-width={fullWidth}
        className="container"
      >
        <Logo />

        <div className="search-slot">
          <SearchInput
            value={searchValue}
            onChange={(e) => {
              handleChange(e.target.value)
            }}
            onCompositionStart={handleCompositionStart}
            onCompositionEnd={(e) => {
              handleCompositionEnd(e.currentTarget.value)
            }}
          />
        </div>

        <div className="controls">
          <LanguageToggle />
          <ThemeToggle />
        </div>
        <NavBar className="header-links" />
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
    align-items: center;
    justify-content: space-between;
    gap: 0.8rem;
    width: 100%;
    max-width: 1120px;
    min-height: 3rem;
    margin: 0 auto;
    padding: 0 1rem;

    @media (max-width: 768px) {
      display: grid;
      grid-template-columns: auto 1fr auto;
      align-items: center;
      gap: 0.35rem 0.45rem;
      min-height: auto;
      padding: 0.45rem 0.65rem;
    }

    @media (min-width: 1024px) {
      max-width: 1380px;
    }
  }

  .search-slot {
    display: none;

    @media (min-width: 1024px) {
      display: block;
      flex: 1;
      max-width: 24rem;
      margin-left: 0.8rem;
      margin-right: auto;
    }
  }

  .controls {
    display: flex;
    gap: 0.6rem;
    align-items: center;
    flex-shrink: 0;

    @media (max-width: 768px) {
      gap: 0.25rem;
      justify-self: end;
    }
  }

  .header-links {
    min-width: 0;

    @media (max-width: 768px) {
      grid-column: 1 / -1;
      width: 100%;
    }
  }
`
