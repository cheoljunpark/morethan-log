import styled from "@emotion/styled"
import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import { FiSearch } from "react-icons/fi"
import { useUiLanguage } from "src/contexts/UiLanguageContext"
import { zIndexes } from "src/styles/zIndexes"
import LanguageToggle from "./LanguageToggle"
import Logo from "./Logo"
import NavBar from "./NavBar"
import SearchOverlay from "./SearchOverlay"
import ThemeToggle from "./ThemeToggle"

const MobileMenuList = dynamic(() => import("src/routes/Feed/MenuList"), {
  ssr: false,
})

const MobileProfileCard = dynamic(() => import("src/routes/Feed/MobileProfileCard"), {
  ssr: false,
})

const Header: React.FC = () => {
  const router = useRouter()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const ko = useUiLanguage().language === "ko"

  const triggerRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  // Any navigation (menu link, category, search) closes the drawer.
  useEffect(() => {
    const close = () => setIsMobileMenuOpen(false)
    router.events.on("routeChangeStart", close)
    return () => router.events.off("routeChangeStart", close)
  }, [router.events])

  // Keyboard support while the drawer is open: focus moves into it, Tab stays
  // inside it, and Escape closes it and returns focus to the menu button.
  useEffect(() => {
    if (!isMobileMenuOpen) return
    const panel = panelRef.current
    if (!panel) return

    const focusables = () =>
      Array.from(
        panel.querySelectorAll<HTMLElement>("a[href], button:not([disabled]), input")
      ).filter((el) => el.offsetParent !== null)

    focusables()[0]?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMobileMenuOpen(false)
        triggerRef.current?.focus()
        return
      }
      if (event.key !== "Tab") return

      const items = focusables()
      if (items.length === 0) return
      const first = items[0]
      const last = items[items.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isMobileMenuOpen])

  return (
    <StyledWrapper>
      <div className="container">
        <Logo />
        <NavBar className="header-links" />

        <button
          ref={triggerRef}
          type="button"
          className="mobile-menu-trigger"
          aria-label={
            isMobileMenuOpen ? (ko ? "메뉴 닫기" : "Close menu") : ko ? "메뉴 열기" : "Open menu"
          }
          aria-expanded={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen((value) => !value)}
        >
          <span aria-hidden="true" />
        </button>

        <button
          type="button"
          className="search-trigger"
          aria-label={ko ? "검색" : "Search"}
          onClick={() => {
            setIsMobileMenuOpen(false)
            setIsSearchOpen(true)
          }}
        >
          <FiSearch aria-hidden="true" />
        </button>

        <div className="controls">
          <LanguageToggle />
          <ThemeToggle />
        </div>

        <div
          className="mobile-menu-backdrop"
          data-open={isMobileMenuOpen}
          onClick={() => setIsMobileMenuOpen(false)}
          aria-hidden="true"
        />

        <div
          ref={panelRef}
          className="mobile-menu-panel"
          data-open={isMobileMenuOpen}
          // Closed drawer is only slid off-screen; inert keeps its links out of
          // the Tab order and away from screen readers.
          {...(!isMobileMenuOpen && { inert: "" })}
        >
          <NavBar className="mobile-menu-links" />

          <div className="mobile-feed-menu">
            <MobileMenuList initialVisibleCount={5} />
          </div>

          <div className="mobile-menu-profile">
            <MobileProfileCard />
          </div>

          <div className="mobile-menu-controls">
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </div>
      <SearchOverlay open={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </StyledWrapper>
  )
}

export default Header

const StyledWrapper = styled.div`
  z-index: ${zIndexes.header};
  position: sticky;
  top: 0;
  /* Global nav: thin, translucent black in both schemes. */
  background-color: rgba(0, 0, 0, 0.8);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  color: rgba(255, 255, 255, 0.8);

  .container {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 2rem;
    width: 100%;
    max-width: 1024px;
    min-height: 44px;
    margin: 0 auto;
    padding: 0 22px;

    @media (max-width: 1023px) {
      display: grid;
      grid-template-columns: minmax(0, 1fr) auto auto;
      align-items: center;
      gap: 0.25rem;
      min-height: 48px;
      padding: 0 16px;
    }
  }

  > .container > a,
  > .container > .header-links a,
  > .container > .controls button {
    color: rgba(255, 255, 255, 0.8);

    &:hover,
    &[data-active="true"] {
      color: #ffffff;
    }
  }

  > .container > .header-links a {
    font-size: 12px;
    font-weight: 400;
    letter-spacing: -0.01em;

    &::after {
      display: none;
    }
  }

  > .container > .controls button + button::before {
    color: rgba(255, 255, 255, 0.35);
  }

  .search-trigger {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 32px;
    height: 32px;
    margin-left: auto;
    color: rgba(255, 255, 255, 0.8);
    cursor: pointer;

    svg {
      width: 16px;
      height: 16px;
    }

    &:hover {
      color: #ffffff;
    }

    &:active {
      transform: scale(0.95);
    }

    @media (max-width: 1023px) {
      order: 2;
      margin-left: 0;
    }
  }

  .mobile-menu-trigger {
    @media (max-width: 1023px) {
      order: 3;
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
      border: 0;
      background-color: transparent;
      color: #ffffff;
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
      background-color: ${({ theme }) => theme.colors.gray2};
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

  .mobile-menu-profile,
  .mobile-feed-menu {
    min-width: 0;
    width: 100%;
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
      padding: 0.5rem 0;
      font-size: 1.05rem;
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

  .mobile-menu-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.65rem;
    padding-top: 0.15rem;
  }
`
