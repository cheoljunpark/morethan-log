import styled from "@emotion/styled"
import { useRouter } from "next/router"
import { useMemo } from "react"
import { useUiLanguage } from "src/contexts/UiLanguageContext"
import { storageKey } from "src/constants/storage"
import usePostsQuery from "src/hooks/usePostsQuery"
import { filterPosts } from "src/libs/utils/notion"
import getFeedQuery from "src/libs/utils/router/getFeedQuery"

const DEFAULT_MENU = "전체"

const getMenuAccent = (name: string) => {
  if (name === DEFAULT_MENU) {
    return { bg: "rgba(59, 130, 246, 0.14)", fg: "#1d4ed8" }
  }

  return { bg: "rgba(255, 255, 255, 0.86)", fg: "#64748b" }
}

const getMenuLabel = (name: string) => {
  if (name === DEFAULT_MENU) return "ALL"

  const compact = name.replace(/[^a-zA-Z0-9가-힣]/g, "")
  return compact.slice(0, 2).toUpperCase()
}

const normalizeIcon = (value?: string) => {
  if (!value) return null
  const trimmed = value.trim()
  return trimmed.length > 0 ? trimmed : null
}

const isIconUrl = (value?: string | null) => {
  if (!value) return false
  return /^(https?:)?\/\//.test(value) || value.startsWith("data:image")
}

const MenuList: React.FC = () => {
  const router = useRouter()
  const { language } = useUiLanguage()
  const posts = usePostsQuery()
  const currentMenu =
    typeof router.query.menu === "string" && router.query.menu.length > 0
      ? router.query.menu
      : DEFAULT_MENU
  const currentSubmenu =
    typeof router.query.submenu === "string" && router.query.submenu.length > 0
      ? router.query.submenu
      : ""

  const menuRows = useMemo(() => {
    const publicPosts = filterPosts(posts)
    const map = new Map<
      string,
      {
        name: string
        count: number
        icon?: string | null
        submenus: Map<string, number>
      }
    >()

    publicPosts.forEach((post) => {
      const name = post.menu?.[0]
      if (!name) return

      const icon = normalizeIcon(post.menuIcon)
      const submenu = post.submenu?.[0]
      const existing = map.get(name)

      if (!existing) {
        map.set(name, {
          name,
          count: 1,
          icon,
          submenus: new Map(submenu ? [[submenu, 1]] : []),
        })
        return
      }

      existing.count += 1
      if (!existing.icon && icon) {
        existing.icon = icon
      }
      if (submenu) {
        existing.submenus.set(submenu, (existing.submenus.get(submenu) || 0) + 1)
      }
    })

    return [
      { name: DEFAULT_MENU, count: publicPosts.length, icon: null, submenus: new Map() },
      ...Array.from(map.values())
        .sort((a, b) => b.count - a.count)
        .map((row) => ({
          ...row,
          submenuRows: Array.from(row.submenus.entries())
            .sort((a, b) => b[1] - a[1])
            .map(([name, count]) => ({ name, count })),
        })),
    ]
  }, [posts])

  const handleClick = (menu: string) => {
    const nextFeedQuery = getFeedQuery(router.query)

    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(storageKey.feedActivePostId)
      window.sessionStorage.removeItem(storageKey.feedScrollY)
    }

    void router.replace(
      {
        pathname: "/",
        query: {
          ...nextFeedQuery,
          category: undefined,
          page: undefined,
          tag: undefined,
          submenu: undefined,
          menu: menu !== DEFAULT_MENU ? menu : undefined,
          view: menu === DEFAULT_MENU ? "all" : undefined,
        },
      },
      undefined,
      {
        shallow: true,
        scroll: true,
      }
    ).then(() => {
      window.scrollTo({ top: 0, behavior: "auto" })
    })
  }

  const handleSubmenuClick = (menu: string, submenu: string) => {
    const nextFeedQuery = getFeedQuery(router.query)

    if (typeof window !== "undefined") {
      window.sessionStorage.removeItem(storageKey.feedActivePostId)
      window.sessionStorage.removeItem(storageKey.feedScrollY)
    }

    void router.replace(
      {
        pathname: "/",
        query: {
          ...nextFeedQuery,
          category: undefined,
          page: undefined,
          tag: undefined,
          menu: menu !== DEFAULT_MENU ? menu : undefined,
          submenu,
          view: undefined,
        },
      },
      undefined,
      {
        shallow: true,
        scroll: true,
      }
    ).then(() => {
      window.scrollTo({ top: 0, behavior: "auto" })
    })
  }

  return (
    <StyledWrapper>
      <div className="label">{language === "ko" ? "메뉴" : "Menus"}</div>
      <div className="content">
        {menuRows.map((row) => {
          const accent = getMenuAccent(row.name)
          const submenuRows =
            "submenuRows" in row && Array.isArray(row.submenuRows) ? row.submenuRows : []
          const isExpanded =
            row.name !== DEFAULT_MENU &&
            currentMenu === row.name &&
            submenuRows.length > 0

          return (
            <div key={row.name} className="menu-group">
              <button
                className="item"
                data-active={currentMenu === row.name || (row.name === DEFAULT_MENU && !currentMenu)}
                type="button"
                onClick={() => handleClick(row.name)}
              >
                <span
                  className="icon"
                  style={{
                    backgroundColor: accent.bg,
                    color: accent.fg,
                  }}
                >
                  {isIconUrl(row.icon) ? (
                    <span
                      className="icon-image"
                      style={{ backgroundImage: `url("${row.icon}")` }}
                      aria-hidden="true"
                    />
                  ) : (
                    row.icon || getMenuLabel(row.name)
                  )}
                </span>
                <span className="body">
                  <span className="name">
                    {row.name === DEFAULT_MENU ? (language === "ko" ? "전체" : "All") : row.name}
                  </span>
                  <span className="meta">
                    {language === "ko" ? `${row.count}개 글` : `${row.count} posts`}
                  </span>
                </span>
                <span className="count">{row.count}</span>
              </button>

              {isExpanded && (
                <div className="submenu-list">
                  {submenuRows.map((submenu) => (
                    <button
                      key={`${row.name}-${submenu.name}`}
                      type="button"
                      className="submenu-item"
                      data-active={currentSubmenu === submenu.name}
                      onClick={() => handleSubmenuClick(row.name, submenu.name)}
                    >
                      <span className="submenu-name">{submenu.name}</span>
                      <span className="submenu-count">{submenu.count}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </StyledWrapper>
  )
}

export default MenuList

const StyledWrapper = styled.div`
  min-width: 0;
  width: 100%;

  > .label {
    margin-bottom: 0.7rem;
    font-size: 0.72rem;
    line-height: 1rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.gray10};

    @media (max-width: 768px) {
      margin-bottom: 0.5rem;
    }
  }

  > .content {
    display: grid;
    gap: 0.55rem;

    @media (max-width: 768px) {
      gap: 0.45rem;
    }
  }

  .menu-group {
    display: grid;
    gap: 0.45rem;
  }

  .item {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    gap: 0.7rem;
    align-items: center;
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
    overflow: hidden;
    padding: 0.78rem 0.85rem;
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    border-radius: 1.1rem;
    background-color: ${({ theme }) =>
      theme.scheme === "light"
        ? "rgba(255, 255, 255, 0.82)"
        : "rgba(31, 39, 52, 0.82)"};
    text-align: left;
    cursor: pointer;
    transition: transform 180ms ease, border-color 180ms ease,
      background-color 180ms ease, box-shadow 180ms ease;

    &:hover {
      transform: translateY(-1px);
      border-color: ${({ theme }) => theme.colors.gray8};
      background-color: ${({ theme }) => theme.colors.gray3};
      box-shadow: 0 12px 24px -18px rgba(15, 23, 42, 0.3);
    }

    &[data-active="true"] {
      border-color: rgba(59, 130, 246, 0.28);
      background-color: ${({ theme }) => theme.colors.gray2};
    }

    @media (max-width: 768px) {
      gap: 0.6rem;
      padding: 0.72rem 0.78rem;
      border-radius: 1rem;
    }
  }

  .icon {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 2.1rem;
    height: 2.1rem;
    border-radius: 0.8rem;
    font-size: 0.8rem;
    line-height: 1rem;
    font-weight: 800;
    letter-spacing: 0.04em;
    text-transform: uppercase;
    overflow: hidden;

    .icon-image {
      width: 1.15rem;
      height: 1.15rem;
      display: block;
      background-position: center;
      background-repeat: no-repeat;
      background-size: contain;
    }
  }

  .body {
    min-width: 0;
    display: grid;
    gap: 0.12rem;
    overflow: hidden;
  }

  .name {
    min-width: 0;
    color: ${({ theme }) => theme.colors.gray12};
    font-size: 0.9rem;
    line-height: 1.2rem;
    font-weight: 700;
    word-break: keep-all;
    overflow-wrap: break-word;
  }

  .meta {
    color: ${({ theme }) => theme.colors.gray10};
    font-size: 0.72rem;
    line-height: 1rem;
    font-weight: 600;
  }

  .count {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    min-width: 1.55rem;
    height: 1.55rem;
    padding: 0 0.36rem;
    border-radius: 9999px;
    background-color: ${({ theme }) => theme.colors.gray4};
    color: ${({ theme }) => theme.colors.gray10};
    font-size: 0.7rem;
    line-height: 0.9rem;
    font-weight: 800;
  }

  .submenu-list {
    display: grid;
    gap: 0.4rem;
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
    padding-left: 0.8rem;
    overflow: hidden;
  }

  .submenu-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.5rem;
    width: 100%;
    min-width: 0;
    box-sizing: border-box;
    overflow: hidden;
    padding: 0.55rem 0.7rem;
    border: 1px solid ${({ theme }) => theme.colors.gray5};
    border-radius: 0.9rem;
    background-color: ${({ theme }) => theme.colors.gray2};
    color: ${({ theme }) => theme.colors.gray10};
    text-align: left;
    cursor: pointer;
    transition: border-color 180ms ease, background-color 180ms ease, transform 180ms ease;

    &:hover {
      transform: translateY(-1px);
      border-color: ${({ theme }) => theme.colors.gray7};
      background-color: ${({ theme }) => theme.colors.gray3};
    }

    &[data-active="true"] {
      border-color: rgba(59, 130, 246, 0.24);
      background-color: ${({ theme }) => theme.colors.gray2};
      color: ${({ theme }) => theme.colors.gray12};
    }
  }

  .submenu-name {
    min-width: 0;
    font-size: 0.8rem;
    line-height: 1.1rem;
    font-weight: 600;
    word-break: keep-all;
    overflow-wrap: break-word;
    overflow: hidden;
  }

  .submenu-count {
    flex-shrink: 0;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    min-width: 1.35rem;
    height: 1.35rem;
    padding: 0 0.32rem;
    border-radius: 9999px;
    background-color: ${({ theme }) => theme.colors.gray4};
    color: ${({ theme }) => theme.colors.gray10};
    font-size: 0.66rem;
    line-height: 0.85rem;
    font-weight: 700;
  }
`
