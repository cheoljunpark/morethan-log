import styled from "@emotion/styled"
import Link from "next/link"
import { useRouter } from "next/router"
import { useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { FiCheck, FiChevronDown, FiChevronRight } from "react-icons/fi"
import { MenuItem } from "src/hooks/usePostTaxonomy"
import { zIndexes } from "src/styles/zIndexes"

type Props = {
  menu: MenuItem
  currentSubmenu?: string
}

type Position = { top: number; left: number }

/**
 * The selected category chip when it has submenus: shows "Menu › Submenu ▾"
 * and opens a small list of its submenus. The list is placed with fixed
 * positioning in <body>, since the chip row scrolls sideways on phones and
 * would clip it.
 */
const MenuChipWithSubmenus: React.FC<Props> = ({ menu, currentSubmenu }) => {
  const router = useRouter()
  const buttonRef = useRef<HTMLButtonElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState<Position | null>(null)
  const open = position !== null

  const close = () => setPosition(null)

  const toggle = () => {
    if (open) return close()
    const rect = buttonRef.current?.getBoundingClientRect()
    if (!rect) return
    // Keep the list inside the screen on narrow phones.
    const left = Math.min(rect.left, window.innerWidth - 216)
    setPosition({ top: rect.bottom + 6, left: Math.max(8, left) })
  }

  useEffect(() => {
    if (!open) return

    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node
      if (
        !listRef.current?.contains(target) &&
        !buttonRef.current?.contains(target)
      ) {
        close()
      }
    }
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        close()
        buttonRef.current?.focus()
      }
    }

    document.addEventListener("pointerdown", onPointerDown)
    window.addEventListener("keydown", onKeyDown)
    window.addEventListener("scroll", close, { passive: true })
    window.addEventListener("resize", close)
    router.events.on("routeChangeStart", close)
    return () => {
      document.removeEventListener("pointerdown", onPointerDown)
      window.removeEventListener("keydown", onKeyDown)
      window.removeEventListener("scroll", close)
      window.removeEventListener("resize", close)
      router.events.off("routeChangeStart", close)
    }
  }, [open, router.events])

  const options = [
    { name: "전체", submenu: undefined },
    ...menu.submenus.map(({ name }) => ({ name, submenu: name })),
  ]

  return (
    <>
      <ChipButton
        ref={buttonRef}
        type="button"
        data-active="true"
        aria-haspopup="true"
        aria-expanded={open}
        onClick={toggle}
      >
        {menu.name}
        {currentSubmenu && (
          <>
            <FiChevronRight className="sep" aria-hidden="true" />
            {currentSubmenu}
          </>
        )}
        <FiChevronDown className="caret" data-open={open} aria-hidden="true" />
      </ChipButton>

      {open &&
        createPortal(
          <List
            ref={listRef}
            style={{ top: position.top, left: position.left }}
            aria-label={`${menu.name} 하위 메뉴`}
          >
            {options.map(({ name, submenu }) => {
              const selected = (submenu ?? "") === (currentSubmenu ?? "")
              return (
                <Link
                  key={name}
                  href={{
                    pathname: "/",
                    query: submenu
                      ? { menu: menu.name, submenu }
                      : { menu: menu.name },
                  }}
                  scroll={false}
                  data-selected={selected}
                  aria-current={selected ? "page" : undefined}
                >
                  {name}
                  {selected && <FiCheck aria-hidden="true" />}
                </Link>
              )
            })}
          </List>,
          document.body
        )}
    </>
  )
}

export default MenuChipWithSubmenus

const ChipButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  padding: 6px 10px 6px 14px;
  border-radius: 9999px;
  font-size: 14px;
  white-space: nowrap;
  cursor: pointer;

  .sep {
    width: 13px;
    height: 13px;
    opacity: 0.6;
  }

  .caret {
    width: 15px;
    height: 15px;
    margin-left: 2px;
    transition: transform 160ms ease;

    &[data-open="true"] {
      transform: rotate(180deg);
    }
  }
`

const List = styled.div`
  position: fixed;
  z-index: ${zIndexes.header + 5};
  display: grid;
  min-width: 200px;
  max-height: 60vh;
  overflow-y: auto;
  padding: 6px;
  border: 1px solid ${({ theme }) => theme.colors.gray6};
  border-radius: 14px;
  background: ${({ theme }) => theme.colors.gray1};
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.16);
  animation: submenu-in 140ms ease-out;

  @keyframes submenu-in {
    from {
      opacity: 0;
      transform: translateY(-4px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  a {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    padding: 10px 12px;
    border-radius: 9px;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.gray11};

    &:hover,
    &:focus-visible {
      background: ${({ theme }) => theme.colors.gray4};
    }

    &[data-selected="true"] {
      font-weight: 600;
      color: ${({ theme }) => theme.colors.gray12};
    }

    svg {
      width: 16px;
      height: 16px;
      color: ${({ theme }) => theme.colors.indigo9};
    }
  }
`
