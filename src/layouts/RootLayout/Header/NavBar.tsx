import styled from "@emotion/styled"
import Link from "next/link"
import { useRouter } from "next/router"
import { useCallback, useEffect } from "react"
import { useUiLanguage } from "src/contexts/UiLanguageContext"

type Props = {
  className?: string
}

const PREFETCH_PATHS = ["/about"]

const NavBar: React.FC<Props> = ({ className }) => {
  const router = useRouter()
  const { language } = useUiLanguage()

  const links = [
    { id: 3, name: language === "ko" ? "소개" : "About", to: "/about" },
  ]
  const prefetchStaticPages = useCallback(() => {
    PREFETCH_PATHS.forEach((path) => {
      void router.prefetch(path)
    })
  }, [router])

  useEffect(() => {
    if (typeof window === "undefined") return

    if ("requestIdleCallback" in window) {
      const idleId = window.requestIdleCallback(prefetchStaticPages, {
        timeout: 1500,
      })

      return () => {
        window.cancelIdleCallback(idleId)
      }
    }

    const timer = globalThis.setTimeout(prefetchStaticPages, 800)

    return () => {
      globalThis.clearTimeout(timer)
    }
  }, [prefetchStaticPages])

  return (
    <StyledWrapper className={className}>
      <ul>
        {links.map((link) => {
          const active = router.pathname === link.to

          return (
            <li key={link.id}>
              <Link
                href={link.to}
                data-active={active}
                onFocus={() => {
                  void router.prefetch(link.to)
                }}
                onMouseEnter={() => {
                  void router.prefetch(link.to)
                }}
              >
                {link.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </StyledWrapper>
  )
}

export default NavBar

const StyledWrapper = styled.div`
  flex-shrink: 0;

  ul {
    display: flex;
    align-items: center;
    gap: 1.4rem;
    margin: 0;
  }

  li {
    display: block;
  }

  a {
    position: relative;
    display: inline-flex;
    align-items: center;
    min-height: 2rem;
    color: ${({ theme }) => theme.colors.gray10};
    font-size: 0.875rem;
    line-height: 1;
    font-weight: 500;
    transition: color 120ms ease;

    &::after {
      content: "";
      position: absolute;
      left: 0;
      right: 0;
      bottom: 0.2rem;
      height: 1px;
      background: currentColor;
      transform: scaleX(0);
      transform-origin: left;
      transition: transform 160ms ease;
    }

    &:hover,
    &[data-active="true"] {
      color: ${({ theme }) => theme.colors.gray12};
    }

    &:hover::after,
    &[data-active="true"]::after {
      transform: scaleX(1);
    }
  }
`
