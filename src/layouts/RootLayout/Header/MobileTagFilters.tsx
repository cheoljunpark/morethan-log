import styled from "@emotion/styled"
import { useRouter } from "next/router"
import { useMemo, useState } from "react"
import { DEFAULT_CATEGORY } from "src/constants"
import { useUiLanguage } from "src/contexts/UiLanguageContext"
import usePostsQuery from "src/hooks/usePostsQuery"
import { filterPosts } from "src/libs/utils/notion"

const DEFAULT_TAG = "전체 태그"
const VISIBLE_COUNT = 5

const MobileTagFilters: React.FC = () => {
  const router = useRouter()
  const posts = usePostsQuery()
  const { language } = useUiLanguage()
  const [showAllTags, setShowAllTags] = useState(false)
  const [showAllMenus, setShowAllMenus] = useState(false)

  const currentTag =
    typeof router.query.tag === "string" && router.query.tag.length > 0
      ? router.query.tag
      : DEFAULT_TAG
  const currentMenu =
    typeof router.query.category === "string" && router.query.category.length > 0
      ? router.query.category
      : DEFAULT_CATEGORY

  const { tags, menus } = useMemo(() => {
    const publicPosts = filterPosts(posts)
    const tagMap = new Map<string, number>()
    const menuMap = new Map<string, number>()

    publicPosts.forEach((post) => {
      post.tags?.forEach((tag) => {
        tagMap.set(tag, (tagMap.get(tag) || 0) + 1)
      })

      const menu = post.menu?.[0]
      if (menu) {
        menuMap.set(menu, (menuMap.get(menu) || 0) + 1)
      }
    })

    return {
      tags: [
        { name: DEFAULT_TAG, count: publicPosts.length },
        ...Array.from(tagMap.entries())
          .sort((a, b) => b[1] - a[1])
          .map(([name, count]) => ({ name, count })),
      ],
      menus: [
        { name: DEFAULT_CATEGORY, count: publicPosts.length },
        ...Array.from(menuMap.entries())
          .sort((a, b) => b[1] - a[1])
          .map(([name, count]) => ({ name, count })),
      ],
    }
  }, [posts])

  const visibleTags = showAllTags ? tags : tags.slice(0, VISIBLE_COUNT)
  const visibleMenus = showAllMenus ? menus : menus.slice(0, VISIBLE_COUNT)

  const updateQuery = (next: { tag?: string; category?: string }) => {
    router.replace(
      {
        pathname: "/tags",
        query: {
          tag: next.tag && next.tag !== DEFAULT_TAG ? next.tag : undefined,
          category:
            next.category && next.category !== DEFAULT_CATEGORY
              ? next.category
              : undefined,
        },
      },
      undefined,
      { shallow: true, scroll: false }
    )
  }

  return (
    <StyledWrapper>
      <FilterGroup
        title={language === "ko" ? "태그" : "Tags"}
        items={visibleTags.map((tag) => ({
          key: tag.name,
          label: tag.name === DEFAULT_TAG ? tag.name : `#${tag.name}`,
          count: tag.count,
          active: currentTag === tag.name,
          onClick: () => updateQuery({ tag: tag.name, category: currentMenu }),
        }))}
      />
      {tags.length > VISIBLE_COUNT && (
        <MoreButton
          isExpanded={showAllTags}
          hiddenCount={tags.length - VISIBLE_COUNT}
          onClick={() => setShowAllTags((value) => !value)}
        />
      )}

      <FilterGroup
        title={language === "ko" ? "메뉴" : "Menu"}
        items={visibleMenus.map((menu) => ({
          key: menu.name,
          label: menu.name,
          count: menu.count,
          active: currentMenu === menu.name,
          onClick: () => updateQuery({ tag: currentTag, category: menu.name }),
        }))}
      />
      {menus.length > VISIBLE_COUNT && (
        <MoreButton
          isExpanded={showAllMenus}
          hiddenCount={menus.length - VISIBLE_COUNT}
          onClick={() => setShowAllMenus((value) => !value)}
        />
      )}
    </StyledWrapper>
  )
}

export default MobileTagFilters

type FilterItem = {
  key: string
  label: string
  count?: number
  active: boolean
  onClick: () => void
}

const FilterGroup: React.FC<{ title: string; items: FilterItem[] }> = ({ title, items }) => (
  <div className="filter-group">
    <div className="filter-title">{title}</div>
    <div className="filter-list">
      {items.map((item) => (
        <button
          key={item.key}
          type="button"
          className="filter-item"
          data-active={item.active}
          onClick={item.onClick}
        >
          <span>{item.label}</span>
          {typeof item.count === "number" && <span className="count">{item.count}</span>}
        </button>
      ))}
    </div>
  </div>
)

const MoreButton: React.FC<{
  isExpanded: boolean
  hiddenCount: number
  onClick: () => void
}> = ({ isExpanded, hiddenCount, onClick }) => {
  const { language } = useUiLanguage()

  return (
    <button type="button" className="show-more" onClick={onClick}>
      {isExpanded
        ? language === "ko"
          ? "접기"
          : "Collapse"
        : language === "ko"
          ? `전체 ${hiddenCount}개 더 보기`
          : `Show ${hiddenCount} more`}
    </button>
  )
}

const StyledWrapper = styled.div`
  display: grid;
  gap: 0.7rem;
  min-width: 0;

  .filter-group {
    display: grid;
    gap: 0.5rem;
    min-width: 0;
  }

  .filter-title {
    color: ${({ theme }) => theme.colors.gray10};
    font-size: 0.72rem;
    line-height: 1rem;
    font-weight: 800;
    letter-spacing: 0.08em;
    text-transform: uppercase;
  }

  .filter-list {
    display: grid;
    gap: 0.45rem;
    min-width: 0;
  }

  .filter-item,
  .show-more {
    display: flex;
    align-items: center;
    width: 100%;
    max-width: 100%;
    min-width: 0;
    box-sizing: border-box;
    overflow: hidden;
    border-radius: 0.95rem;
    font-size: 0.8rem;
    line-height: 1rem;
    font-weight: 700;
    cursor: pointer;
  }

  .filter-item {
    justify-content: space-between;
    gap: 0.55rem;
    min-height: 2.35rem;
    padding: 0.55rem 0.72rem;
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    background-color: ${({ theme }) => theme.colors.gray2};
    color: ${({ theme }) => theme.colors.gray11};

    &[data-active="true"] {
      border-color: rgba(59, 130, 246, 0.28);
      color: ${({ theme }) => theme.colors.gray12};
      background-color: ${({ theme }) => theme.colors.gray3};
    }
  }

  .count {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    min-width: 1.45rem;
    height: 1.45rem;
    padding: 0 0.32rem;
    border-radius: 9999px;
    background-color: ${({ theme }) => theme.colors.gray4};
    color: ${({ theme }) => theme.colors.gray10};
    font-size: 0.66rem;
    line-height: 0.85rem;
    font-weight: 800;
  }

  .show-more {
    justify-content: center;
    min-height: 2.1rem;
    padding: 0.45rem 0.7rem;
    border: 1px dashed ${({ theme }) => theme.colors.gray6};
    background-color: transparent;
    color: ${({ theme }) => theme.colors.gray10};
    text-align: center;
    white-space: nowrap;
  }
`
