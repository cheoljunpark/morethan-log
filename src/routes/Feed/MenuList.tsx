import styled from "@emotion/styled"
import { useRouter } from "next/router"
import { useState } from "react"
import { useUiLanguage } from "src/contexts/UiLanguageContext"
import usePostTaxonomy from "src/hooks/usePostTaxonomy"
import { clearFeedPosition } from "src/libs/utils/feedScroll"
import { compactQuery } from "src/libs/utils/router/getFeedQuery"

type Props = {
  /** Collapse the list to this many categories behind a "show more" toggle. */
  initialVisibleCount?: number
}

/** Category list for the mobile menu drawer. */
const MenuList: React.FC<Props> = ({ initialVisibleCount }) => {
  const router = useRouter()
  const { language } = useUiLanguage()
  const ko = language === "ko"
  const { menus, total } = usePostTaxonomy()
  const [showAll, setShowAll] = useState(false)
  const currentMenu = typeof router.query.menu === "string" ? router.query.menu : ""
  const currentSubmenu = typeof router.query.submenu === "string" ? router.query.submenu : ""

  const select = (menu?: string, submenu?: string) => {
    clearFeedPosition()
    void router.push({ pathname: "/", query: compactQuery({ menu, submenu }) }).then(() => window.scrollTo(0, 0))
  }

  const isCollapsible =
    typeof initialVisibleCount === "number" && menus.length > initialVisibleCount
  const visibleMenus = isCollapsible && !showAll ? menus.slice(0, initialVisibleCount) : menus
  const hiddenCount = menus.length - visibleMenus.length

  return (
    <StyledWrapper>
      <div className="label">{ko ? "카테고리" : "Categories"}</div>
      <div className="content">
        <button type="button" className="item" data-active={!currentMenu} onClick={() => select()}>
          <span className="name">{ko ? "전체" : "All"}</span>
          <span className="count">{total}</span>
        </button>

        {visibleMenus.map((menu) => (
          <div key={menu.name}>
            <button
              type="button"
              className="item"
              data-active={currentMenu === menu.name}
              onClick={() => select(menu.name)}
            >
              <span className="name">{menu.name}</span>
              <span className="count">{menu.count}</span>
            </button>

            {currentMenu === menu.name && menu.submenus.length > 0 && (
              <div className="submenu-list">
                {menu.submenus.map((submenu) => (
                  <button
                    key={submenu.name}
                    type="button"
                    className="submenu-item"
                    data-active={currentSubmenu === submenu.name}
                    onClick={() => select(menu.name, submenu.name)}
                  >
                    <span className="submenu-name">{submenu.name}</span>
                    <span className="submenu-count">{submenu.count}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}

        {isCollapsible && (
          <button type="button" className="show-more" onClick={() => setShowAll((v) => !v)}>
            {showAll
              ? ko ? "접기" : "Collapse"
              : ko ? `${hiddenCount}개 더 보기` : `Show ${hiddenCount} more`}
          </button>
        )}
      </div>
    </StyledWrapper>
  )
}

export default MenuList

const StyledWrapper = styled.div`
  min-width: 0;
  width: 100%;

  > .label {
    margin-bottom: 10px;
    font-family: var(--font-display);
    font-size: 14px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: ${({ theme }) => theme.colors.gray12};
  }

  > .content {
    display: grid;
  }

  .item {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.75rem;
    width: 100%;
    padding: 0.3rem 0;
    color: ${({ theme }) => theme.colors.gray10};
    font-size: 0.9rem;
    line-height: 1.35;
    cursor: pointer;
    transition: color 120ms ease;

    &:hover {
      color: ${({ theme }) => theme.colors.gray12};
    }

    &[data-active="true"] {
      color: ${({ theme }) => theme.colors.gray12};
      font-weight: 600;

      .count {
        color: ${({ theme }) => theme.colors.indigo9};
      }
    }
  }



  .name {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .count,
  .submenu-count {
    font-family: var(--font-text);
    font-size: 0.72rem;
    font-weight: 400;
    color: ${({ theme }) => theme.colors.gray9};
  }

  .submenu-list {
    display: grid;
    margin: 0.1rem 0 0.4rem;
    padding-left: 0.75rem;
    border-left: 1px solid ${({ theme }) => theme.colors.gray6};
  }

  .submenu-item {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 0.75rem;
    padding: 0.2rem 0;
    font-size: 0.82rem;
    color: ${({ theme }) => theme.colors.gray10};
    cursor: pointer;

    &:hover,
    &[data-active="true"] {
      color: ${({ theme }) => theme.colors.gray12};
    }

    &[data-active="true"] .submenu-name {
      font-weight: 600;
    }
  }

  .show-more {
    margin-top: 0.4rem;
    font-family: var(--font-text);
    font-size: 0.72rem;
    color: ${({ theme }) => theme.colors.gray9};
    cursor: pointer;

    &:hover {
      color: ${({ theme }) => theme.colors.indigo9};
    }
  }
`
