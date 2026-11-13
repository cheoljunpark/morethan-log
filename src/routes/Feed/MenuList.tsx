import styled from "@emotion/styled"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { FiChevronDown } from "react-icons/fi"
import { useUiLanguage } from "src/contexts/UiLanguageContext"
import usePostTaxonomy from "src/hooks/usePostTaxonomy"
import { clearFeedPosition } from "src/libs/utils/feedScroll"
import { compactQuery } from "src/libs/utils/router/getFeedQuery"

/**
 * Category tree for the mobile menu drawer, so posts can be filtered from any
 * page. Submenus stay folded; the chevron opens them, and the current
 * category starts open.
 */
const MenuList: React.FC = () => {
  const router = useRouter()
  const ko = useUiLanguage().language === "ko"
  const { menus } = usePostTaxonomy()
  const onFeed = router.pathname === "/"
  const currentMenu =
    onFeed && typeof router.query.menu === "string" ? router.query.menu : ""
  const currentSubmenu =
    onFeed && typeof router.query.submenu === "string"
      ? router.query.submenu
      : ""

  const [openMenu, setOpenMenu] = useState(currentMenu)
  useEffect(() => setOpenMenu(currentMenu), [currentMenu])

  const select = (menu?: string, submenu?: string) => {
    clearFeedPosition()
    void router
      .push({ pathname: "/", query: compactQuery({ menu, submenu }) })
      .then(() => window.scrollTo(0, 0))
  }

  return (
    <StyledWrapper>
      <div className="label">{ko ? "카테고리" : "Categories"}</div>
      <ul>
        {menus.map((menu) => {
          const hasSubmenus = menu.submenus.length > 0
          const open = hasSubmenus && openMenu === menu.name

          return (
            <li key={menu.name}>
              <div className="row">
                <button
                  type="button"
                  className="item"
                  data-active={currentMenu === menu.name && !currentSubmenu}
                  onClick={() => select(menu.name)}
                >
                  {menu.name}
                </button>
                {hasSubmenus && (
                  <button
                    type="button"
                    className="toggle"
                    data-open={open}
                    aria-expanded={open}
                    aria-label={
                      ko ? `${menu.name} 하위 메뉴` : `${menu.name} submenus`
                    }
                    onClick={() => setOpenMenu(open ? "" : menu.name)}
                  >
                    <FiChevronDown aria-hidden="true" />
                  </button>
                )}
              </div>

              {open && (
                <ul className="submenu-list">
                  {menu.submenus.map((submenu) => (
                    <li key={submenu.name}>
                      <button
                        type="button"
                        className="submenu-item"
                        data-active={
                          currentMenu === menu.name &&
                          currentSubmenu === submenu.name
                        }
                        onClick={() => select(menu.name, submenu.name)}
                      >
                        {submenu.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          )
        })}
      </ul>
    </StyledWrapper>
  )
}

export default MenuList

const StyledWrapper = styled.nav`
  min-width: 0;

  > .label {
    margin-bottom: 8px;
    font-size: 12px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray9};
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  button {
    display: block;
    width: 100%;
    text-align: left;
    color: ${({ theme }) => theme.colors.gray11};
    cursor: pointer;
    transition: color 120ms ease;

    &:hover,
    &[data-active="true"] {
      color: ${({ theme }) => theme.colors.gray12};
    }

    &[data-active="true"] {
      font-weight: 600;
    }
  }

  .row {
    display: flex;
    align-items: center;
  }

  .item {
    flex: 1;
    min-width: 0;
    padding: 0.4rem 0;
    font-size: 0.95rem;
  }

  .toggle {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    width: 2rem;
    height: 2rem;
    color: ${({ theme }) => theme.colors.gray9};

    svg {
      width: 16px;
      height: 16px;
      transition: transform 180ms ease;
    }

    &[data-open="true"] svg {
      transform: rotate(180deg);
    }
  }

  .submenu-list {
    margin: 0 0 0.3rem 0.2rem;
    padding-left: 0.75rem;
    border-left: 1px solid ${({ theme }) => theme.colors.gray6};
  }

  .submenu-item {
    padding: 0.25rem 0;
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.gray10};
  }
`
