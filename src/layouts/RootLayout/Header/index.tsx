import styled from "@emotion/styled"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useState } from "react"
import useDebouncedFeedSearch from "src/hooks/useDebouncedFeedSearch"
import SearchInput from "src/routes/Feed/SearchInput"
import { zIndexes } from "src/styles/zIndexes"
import LanguageToggle from "./LanguageToggle"
import Logo from "./Logo"
import NavBar from "./NavBar"
import ThemeToggle from "./ThemeToggle"

const MobileMenuList = dynamic(() => import("src/routes/Feed/MenuList"), {
  ssr: false,
})

const MobileProfileCard = dynamic(() => import("src/routes/Feed/MobileProfileCard"), {
  ssr: false,
})

const MobileArchiveFilters = dynamic(() => import("./MobileArchiveFilters"), {
  ssr: false,
})

const MobileTagFilters = dynamic(() => import("./MobileTagFilters"), {
  ssr: false,
})

type Props = {
  fullWidth: boolean
}

const Header: React.FC<Props> = ({ fullWidth }) => {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const isFeedPage = router.pathname === "/"
  const isArchivePage = router.pathname === "/archive"
  const isTagsPage = router.pathname === "/tags"
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

        <button
          type="button"
          className="mobile-menu-trigger"
          aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((value) => !value)}
        >
          <span aria-hidden="true" />
        </button>

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

        <div
          className="mobile-menu-backdrop"
          data-open={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />

        <div className="mobile-menu-panel" data-open={isMobileMenuOpen}>
          {isFeedPage && (
            <div className="mobile-menu-search">
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
          )}

          <NavBar
            className="mobile-menu-links"
            onNavigate={() => setIsMobileMenuOpen(false)}
          />

          {isArchivePage && (
            <div
              className="mobile-page-filters"
              onClickCapture={(event) => {
                const target = event.target as HTMLElement

                if (target.closest(".show-more")) {
                  return
                }

                if (target.closest("button")) {
                  setIsMobileMenuOpen(false)
                }
              }}
            >
              <MobileArchiveFilters />
            </div>
          )}

          {isTagsPage && (
            <div
              className="mobile-page-filters"
              onClickCapture={(event) => {
                const target = event.target as HTMLElement

                if (target.closest(".show-more")) {
                  return
                }

                if (target.closest("button")) {
                  setIsMobileMenuOpen(false)
                }
              }}
            >
              <MobileTagFilters />
            </div>
          )}

          {isFeedPage && (
            <>
              <div
                className="mobile-feed-menu"
                onClickCapture={(event) => {
                  const target = event.target as HTMLElement

                  if (target.closest(".show-more")) {
                    return
                  }

                  if (target.closest("button")) {
                    setIsMobileMenuOpen(false)
                  }
                }}
              >
                <MobileMenuList initialVisibleCount={5} />
              </div>

              <div className="mobile-menu-profile">
                <MobileProfileCard />
              </div>
            </>
          )}

          <div className="mobile-menu-controls">
            <LanguageToggle />
            <ThemeToggle />
          </div>
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
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.8rem;
    width: 100%;
    max-width: 1120px;
    min-height: 3rem;
    margin: 0 auto;
    padding: 0 1rem;

    @media (max-width: 1023px) {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto;
      align-items: center;
      gap: 0.38rem 0.55rem;
      min-height: auto;
      padding: 0.5rem 0.72rem;
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

    @media (max-width: 1023px) {
      display: none;
    }
  }

  .header-links {
    min-width: 0;

    @media (max-width: 1023px) {
      display: none;
    }
  }

  .mobile-menu-trigger {
    display: none;

    @media (max-width: 1023px) {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      justify-self: end;
      width: 2rem;
      height: 2rem;
      padding: 0;
      border: 1px solid ${({ theme }) => theme.colors.gray6};
      border-radius: 9999px;
      background-color: ${({ theme }) => theme.colors.gray2};
      color: ${({ theme }) => theme.colors.gray12};
      cursor: pointer;

      span,
      span::before,
      span::after {
        display: block;
        width: 0.9rem;
        height: 1.5px;
        border-radius: 9999px;
        background-color: currentColor;
        transition:
          transform 180ms ease,
          opacity 180ms ease;
      }

      span {
        position: relative;
      }

      span::before,
      span::after {
        content: "";
        position: absolute;
        left: 0;
      }

      span::before {
        transform: translateY(-0.32rem);
      }

      span::after {
        transform: translateY(0.32rem);
      }

      &[aria-expanded="true"] span {
        transform: rotate(45deg);
      }

      &[aria-expanded="true"] span::before {
        opacity: 0;
      }

      &[aria-expanded="true"] span::after {
        transform: rotate(-90deg);
      }
    }
  }

  .mobile-menu-panel {
    display: none;

    @media (max-width: 1023px) {
      position: fixed;
      top: 0;
      left: 0;
      z-index: ${zIndexes.header + 2};
      display: grid;
      align-content: flex-start;
      grid-auto-rows: max-content;
      gap: 0.7rem;
      width: min(22rem, calc(100vw - 2.5rem));
      height: 100dvh;
      max-height: 100dvh;
      padding: 1rem;
      overflow-y: auto;
      overflow-x: hidden;
      overscroll-behavior: contain;
      touch-action: pan-y;
      -webkit-overflow-scrolling: touch;
      border-right: 1px solid ${({ theme }) => theme.colors.gray6};
      background-color: ${({ theme }) =>
        theme.scheme === "light"
          ? "rgba(255, 255, 255, 0.96)"
          : "rgba(23, 28, 36, 0.96)"};
      box-shadow: 24px 0 52px -36px rgba(15, 23, 42, 0.45);
      backdrop-filter: blur(16px);
      transform: translateX(-105%);
      transition: transform 220ms cubic-bezier(0.22, 1, 0.36, 1);

      &[data-open="true"] {
        transform: translateX(0);
      }

      &::-webkit-scrollbar {
        display: none;
      }

      scrollbar-width: none;
    }
  }

  .mobile-menu-backdrop {
    display: none;

    @media (max-width: 1023px) {
      position: fixed;
      inset: 0;
      z-index: ${zIndexes.header + 1};
      display: block;
      pointer-events: none;
      background-color: rgba(15, 23, 42, 0);
      transition: background-color 180ms ease;

      &[data-open="true"] {
        pointer-events: auto;
        background-color: ${({ theme }) =>
          theme.scheme === "light"
            ? "rgba(15, 23, 42, 0.18)"
            : "rgba(0, 0, 0, 0.34)"};
      }
    }
  }

  .mobile-menu-search,
  .mobile-menu-profile,
  .mobile-page-filters,
  .mobile-feed-menu {
    min-width: 0;
    width: 100%;
  }

  .mobile-menu-search {
    padding-bottom: 0.7rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray5};
  }

  .mobile-menu-profile {
    padding-top: 0.15rem;

    > div > .mid {
      margin-bottom: 0;
    }
  }

  .mobile-menu-links {
    min-width: 0;
    padding-bottom: 0.7rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray5};

    ul {
      display: grid;
      grid-template-columns: 1fr;
      gap: 0.5rem;
      width: 100%;
      min-width: 0;
    }

    li,
    a {
      width: 100%;
      min-width: 0;
      max-width: 100%;
      box-sizing: border-box;
    }

    a {
      min-height: 2rem;
      justify-content: flex-start;
      padding: 0.65rem 0.8rem;
      border: 1px solid ${({ theme }) => theme.colors.gray5};
      background-color: ${({ theme }) => theme.colors.gray2};
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }

  .mobile-feed-menu {
    min-width: 0;
    overflow: visible;
    padding-top: 0.15rem;
    padding-bottom: 0.7rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray5};
  }

  .mobile-page-filters {
    min-width: 0;
    overflow: visible;
    padding-bottom: 0.7rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray5};
  }

  .mobile-menu-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.65rem;
    padding-top: 0.15rem;
  }
`
