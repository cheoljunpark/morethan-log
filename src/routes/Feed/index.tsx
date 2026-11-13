import styled from "@emotion/styled"
import Link from "next/link"
import { useRouter } from "next/router"
import { useState } from "react"
import { CONFIG } from "site.config"
import { useUiLanguage } from "src/contexts/UiLanguageContext"
import usePostTaxonomy from "src/hooks/usePostTaxonomy"
import getFeedQuery from "src/libs/utils/router/getFeedQuery"

import MenuChipWithSubmenus from "./MenuChipWithSubmenus"
import PostList from "./PostList"

const TAG_LIMIT = 12

const Feed: React.FC = () => {
  const router = useRouter()
  const { language } = useUiLanguage()
  const ko = language === "ko"
  const {
    q = "",
    menu: currentMenu,
    submenu: currentSubmenu,
    tag: currentTag,
  } = getFeedQuery(router.query)
  const { menus, tags } = usePostTaxonomy()
  const [showAllTags, setShowAllTags] = useState(false)

  // Collapsed list keeps the selected tag visible even if it ranks below the cut.
  const visibleTags =
    showAllTags || tags.length <= TAG_LIMIT
      ? tags
      : tags.filter(
          (tag, index) => index < TAG_LIMIT || tag.name === currentTag
        )

  return (
    <StyledWrapper>
      <section className="banner">
        <p className="eyebrow">{CONFIG.profile.role}</p>
        <h1>{CONFIG.blog.title}</h1>
        <p className="subtitle">{CONFIG.profile.bio}</p>
      </section>

      <nav
        className="category-chips"
        aria-label={ko ? "카테고리" : "Categories"}
      >
        <Link
          href="/"
          data-active={!currentMenu && !currentTag && !q}
          scroll={false}
        >
          {ko ? "전체" : "All"}
        </Link>
        {menus.map((menu) =>
          // The selected menu with submenus becomes "Menu › Submenu ▾".
          menu.name === currentMenu && menu.submenus.length > 0 ? (
            <MenuChipWithSubmenus
              key={menu.name}
              menu={menu}
              currentSubmenu={currentSubmenu}
            />
          ) : (
            <Link
              key={menu.name}
              href={{ pathname: "/", query: { menu: menu.name } }}
              data-active={currentMenu === menu.name}
              scroll={false}
            >
              {menu.name}
            </Link>
          )
        )}
      </nav>

      <div className="layout">
        <main className="content-column">
          <PostList />
        </main>

        <aside className="sidebar">
          {tags.length > 0 && (
            <section>
              <h2>{ko ? "태그" : "Tags"}</h2>
              <ul>
                {visibleTags.map(({ name, count }) => (
                  <li key={name}>
                    <Link
                      href={{ pathname: "/", query: { tag: name } }}
                      data-active={currentTag === name}
                      scroll={false}
                    >
                      {name} ({count})
                    </Link>
                  </li>
                ))}
              </ul>
              {tags.length > TAG_LIMIT && (
                <button
                  type="button"
                  className="more"
                  onClick={() => setShowAllTags((value) => !value)}
                >
                  {showAllTags
                    ? ko
                      ? "접기"
                      : "Show less"
                    : ko
                    ? `${tags.length}개 모두 보기`
                    : `Show all ${tags.length}`}
                </button>
              )}
            </section>
          )}
        </aside>
      </div>
    </StyledWrapper>
  )
}

export default Feed

const StyledWrapper = styled.div`
  padding-bottom: 72px;

  /* Full-bleed banner */
  .banner {
    width: 100vw;
    margin-left: calc(50% - 50vw);
    padding: 48px 22px 52px;
    background: ${({ theme }) =>
      theme.scheme === "light" ? "#272729" : "#161617"};
    color: #ffffff;
    text-align: center;

    @media (max-width: 734px) {
      padding: 36px 20px 40px;
    }

    .eyebrow {
      margin: 0 0 6px;
      font-size: 17px;
      font-weight: 600;
      color: #a1a1a6;
    }

    h1 {
      font-family: var(--font-display);
      font-size: clamp(40px, 6vw, 64px);
      line-height: 1.05;
      font-weight: 600;
      letter-spacing: -0.04em;
    }

    .subtitle {
      margin: 14px 0 0;
      font-size: 17px;
      color: #d2d2d7;
    }
  }

  /* Centered category chips */
  .category-chips {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
    max-width: 760px;
    margin: 56px auto 24px;

    @media (max-width: 734px) {
      flex-wrap: nowrap;
      justify-content: flex-start;
      margin: 24px 0 8px;
      overflow-x: auto;
      scrollbar-width: none;

      &::-webkit-scrollbar {
        display: none;
      }
    }

    > a,
    > button {
      flex-shrink: 0;
      padding: 6px 14px;
      border-radius: 9999px;
      background: ${({ theme }) => theme.colors.gray1};
      box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.gray6};
      font-size: 14px;
      color: ${({ theme }) => theme.colors.gray11};
      white-space: nowrap;
      transition: transform 120ms ease;

      &:hover {
        box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.gray8};
      }

      &:active {
        transform: scale(0.95);
      }

      &[data-active="true"] {
        background: ${({ theme }) => theme.colors.gray12};
        box-shadow: none;
        color: ${({ theme }) => theme.colors.gray1};
      }
    }
  }

  /* List + plain sidebar */
  .layout {
    display: grid;
    gap: 48px;
    max-width: 1000px;
    margin: 0 auto;

    @media (min-width: 1024px) {
      grid-template-columns: minmax(0, 1fr) 200px;
      gap: 72px;
      align-items: start;
    }
  }

  .content-column {
    min-width: 0;
  }

  /* Tags only on wide screens; on phones they'd trail the list for pages. */
  .sidebar {
    @media (max-width: 1023px) {
      display: none;
    }

    @media (min-width: 1024px) {
      position: sticky;
      top: 76px;
      display: grid;
      gap: 32px;
      padding-top: 36px;
    }

    h2 {
      margin-bottom: 10px;
      font-size: 14px;
      font-weight: 600;
      color: ${({ theme }) => theme.colors.indigo9};
    }

    .more {
      display: block;
      margin-top: 8px;
      font-size: 14px;
      cursor: pointer;
      color: ${({ theme }) => theme.colors.indigo9};
    }

    ul {
      margin: 0;
      padding: 0;
      list-style: none;
    }

    a {
      display: block;
      padding: 4px 0;
      font-size: 14px;
      color: ${({ theme }) => theme.colors.gray11};

      &:hover,
      &[data-active="true"] {
        color: ${({ theme }) => theme.colors.gray12};
        text-decoration: underline;
        text-underline-offset: 0.2em;
      }
    }
  }
`
