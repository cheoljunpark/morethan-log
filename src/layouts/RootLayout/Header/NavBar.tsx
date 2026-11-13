import styled from "@emotion/styled"
import Link from "next/link"
import { useRouter } from "next/router"
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react"
import { useUiLanguage } from "src/contexts/UiLanguageContext"

type Props = {
  className?: string
}

const PREFETCH_PATHS = ["/projects", "/about"]

const useIsomorphicLayoutEffect =
  typeof window === "undefined" ? useEffect : useLayoutEffect

type IndicatorBox = { x: number; y: number; w: number; h: number }

/** Posts live at /[slug], so they count as part of Home. */
const isActivePath = (pathname: string, to: string) =>
  to === "/" ? pathname === "/" || pathname === "/[slug]" : pathname === to

const NavBar: React.FC<Props> = ({ className }) => {
  const router = useRouter()
  const { language } = useUiLanguage()

  const links = [
    { id: 1, name: language === "ko" ? "홈" : "Home", to: "/" },
    {
      id: 2,
      name: language === "ko" ? "프로젝트" : "Projects",
      to: "/projects",
    },
    { id: 3, name: language === "ko" ? "소개" : "About", to: "/about" },
  ]
  const activeIndex = links.findIndex((link) =>
    isActivePath(router.pathname, link.to)
  )

  // One indicator element slides between tabs instead of each link drawing
  // its own underline. Its box is measured from the active link.
  const listRef = useRef<HTMLUListElement>(null)
  const [box, setBox] = useState<IndicatorBox | null>(null)
  const [animate, setAnimate] = useState(false)

  useIsomorphicLayoutEffect(() => {
    const list = listRef.current
    if (!list) return

    const measure = () => {
      const link = list.querySelectorAll<HTMLElement>("a")[activeIndex]
      if (!link) return setBox(null)
      setBox({
        x: link.offsetLeft,
        y: link.offsetTop,
        w: link.offsetWidth,
        h: link.offsetHeight,
      })
    }

    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    return () => observer.disconnect()
  }, [activeIndex, language])

  // Turn on the slide only after the first placement, so it doesn't fly in.
  useEffect(() => {
    if (!box || animate) return
    const frame = window.requestAnimationFrame(() => setAnimate(true))
    return () => window.cancelAnimationFrame(frame)
  }, [box, animate])

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
      <ul ref={listRef}>
        {links.map((link, index) => {
          const active = index === activeIndex

          return (
            <li key={link.id}>
              <Link
                href={link.to}
                data-active={active}
                aria-current={active ? "page" : undefined}
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
        <span
          className="nav-indicator"
          aria-hidden="true"
          data-animate={animate}
          style={
            box
              ? ({
                  "--x": `${box.x}px`,
                  "--y": `${box.y}px`,
                  "--w": `${box.w}px`,
                  "--h": `${box.h}px`,
                } as React.CSSProperties)
              : { opacity: 0 }
          }
        />
      </ul>
    </StyledWrapper>
  )
}

export default NavBar

const StyledWrapper = styled.div`
  flex-shrink: 0;

  ul {
    position: relative;
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
    font-weight: 400;
    transition: color 120ms ease;

    &:hover,
    &[data-active="true"] {
      color: ${({ theme }) => theme.colors.gray12};
    }

    &[data-active="true"] {
      font-weight: 600;
    }
  }

  /* Horizontal tabs: a bar under the active link. Vertical lists (the
     mobile drawer) restyle it as a bar on the left, see Header. */
  .nav-indicator {
    position: absolute;
    left: 0;
    top: 0;
    width: var(--w, 0);
    height: 2px;
    border-radius: 2px;
    background: ${({ theme }) => theme.colors.gray12};
    transform: translate(var(--x, 0), calc(var(--y, 0) + var(--h, 0) - 2px));
    pointer-events: none;

    &[data-animate="true"] {
      transition: transform 260ms cubic-bezier(0.22, 1, 0.36, 1),
        width 260ms cubic-bezier(0.22, 1, 0.36, 1);
    }
  }
`
