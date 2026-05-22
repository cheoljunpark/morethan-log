import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import styled from "@emotion/styled"
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
  const router = useRouter()
  const isHomePage = router.pathname === "/"
  const q = typeof router.query.q === "string" ? router.query.q : ""
  const [searchValue, setSearchValue] = useState(q)
  const [isComposing, setIsComposing] = useState(false)

  useEffect(() => {
    if (!isComposing) {
      setSearchValue(q)
    }
  }, [isComposing, q])

  const handleSearchChange = (value: string) => {
    const nextQuery = {
      ...router.query,
      q: value || undefined,
    }

    router.replace(
      {
        pathname: "/",
        query: nextQuery,
      },
      undefined,
      {
        shallow: true,
        scroll: false,
      }
    )
  }

  return (
    <StyledWrapper data-detail-safe="true">
      <div
        data-full-width={fullWidth}
        data-home-page={isHomePage}
        className="container"
      >
        <Logo />

        {isHomePage && (
          <div className="search-slot">
            <SearchInput
              value={searchValue}
              onChange={(e) => {
                const value = e.target.value
                setSearchValue(value)
                if (!isComposing) handleSearchChange(value)
              }}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={(e) => {
                const value = e.currentTarget.value
                setIsComposing(false)
                setSearchValue(value)
                handleSearchChange(value)
              }}
            />
          </div>
        )}

        <div className="nav">
          <LanguageToggle />
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
    align-items: center;
    justify-content: space-between;
    gap: 0.8rem;
    width: 100%;
    max-width: 1120px;
    min-height: 3rem;
    margin: 0 auto;
    padding: 0 1rem;

    @media (max-width: 768px) {
      gap: 0.45rem;
      min-height: 2.8rem;
      padding: 0 0.65rem;
    }

    &[data-full-width="true"] {
      @media (min-width: 768px) {
        padding-left: 6rem;
        padding-right: 6rem;
      }
    }

    &[data-home-page="true"] {
      @media (min-width: 1024px) {
        max-width: 1380px;
      }
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

  .nav {
    display: flex;
    gap: 0.6rem;
    align-items: center;
    flex-shrink: 0;

    @media (max-width: 768px) {
      gap: 0.25rem;
    }
  }
`
