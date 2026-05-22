import styled from "@emotion/styled"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { DEFAULT_CATEGORY } from "src/constants"

import ContactCard from "./ContactCard"
import { FeedHeader } from "./FeedHeader"
import Footer from "./Footer"
import HomeLanding from "./HomeLanding"
import MenuList from "./MenuList"
import MobileProfileCard from "./MobileProfileCard"
import PostList from "./PostList"
import ProfileCard from "./ProfileCard"
import SearchInput from "./SearchInput"
import ServiceCard from "./ServiceCard"

const HEADER_HEIGHT = 73

const Feed: React.FC = () => {
  const router = useRouter()
  const q = typeof router.query.q === "string" ? router.query.q : ""
  const currentTag = typeof router.query.tag === "string" ? router.query.tag : ""
  const currentMenu = typeof router.query.menu === "string" ? router.query.menu : ""
  const currentSubmenu =
    typeof router.query.submenu === "string" ? router.query.submenu : ""
  const currentCategory =
    typeof router.query.category === "string"
      ? router.query.category
      : DEFAULT_CATEGORY
  const currentOrder =
    typeof router.query.order === "string" ? router.query.order : "desc"
  const showCurated =
    !q &&
    !currentTag &&
    !currentMenu &&
    !currentSubmenu &&
    currentCategory === DEFAULT_CATEGORY &&
    currentOrder === "desc"

  const [searchValue, setSearchValue] = useState(q)
  const [isComposing, setIsComposing] = useState(false)

  useEffect(() => {
    if (!isComposing) {
      setSearchValue(q)
    }
  }, [isComposing, q])

  const handleSearchChange = (value: string) => {
    const nextQuery = {
      ...router.query,
      q: value || undefined,
    }

    router.replace(
      {
        pathname: "/",
        query: nextQuery,
      },
      undefined,
      {
        shallow: true,
        scroll: false,
      }
    )
  }

  const handleSearchInputChange = (value: string) => {
    setSearchValue(value)

    if (!isComposing) {
      handleSearchChange(value)
    }
  }

  return (
    <StyledWrapper>
      <aside
        className="left-rail"
        css={{
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
        }}
      >
        <div className="rail-stack">
          <ProfileCard />
          <div className="menu-panel">
            <MenuList />
          </div>
          <ServiceCard />
          <ContactCard />
          <div className="footer">
            <Footer />
          </div>
        </div>
      </aside>

      <main className="content-column">
        <MobileProfileCard />

        <section className="toolbar">
          <div className="toolbar-top">
            <FeedHeader />
          </div>
          <div className="toolbar-search">
            <SearchInput
              value={searchValue}
              onChange={(e) => handleSearchInputChange(e.target.value)}
              onCompositionStart={() => setIsComposing(true)}
              onCompositionEnd={(e) => {
                const value = e.currentTarget.value
                setIsComposing(false)
                setSearchValue(value)
                handleSearchChange(value)
              }}
            />
          </div>
        </section>

        <div className="mobile-menu">
          <MenuList />
        </div>

        {showCurated ? <HomeLanding /> : <PostList q={q} />}

        <div className="mobile-footer">
          <Footer />
        </div>
      </main>
    </StyledWrapper>
  )
}

export default Feed

const StyledWrapper = styled.div`
  display: grid;
  gap: 1.35rem;
  padding: 1.4rem 0 2rem;

  @media (max-width: 768px) {
    display: block;
    padding: 0.5rem 0 1.2rem;
  }

  @media (min-width: 1024px) {
    grid-template-columns: minmax(212px, 0.76fr) minmax(0, 2.84fr);
  }

  .left-rail {
    display: none;
    overflow-y: auto;
    overflow-x: hidden;
    position: sticky;
    top: ${HEADER_HEIGHT - 10}px;
    grid-column: 1;
    padding-right: 0.3rem;
    scrollbar-width: none;
    -ms-overflow-style: none;

    &::-webkit-scrollbar {
      display: none;
    }

    @media (min-width: 1024px) {
      display: block;
    }
  }

  .rail-stack {
    display: grid;
    gap: 1rem;
  }

  .menu-panel {
    padding: 1rem;
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    border-radius: 1.35rem;
    background:
      linear-gradient(180deg, rgba(59, 130, 246, 0.04), transparent),
      ${({ theme }) =>
        theme.scheme === "light"
          ? "rgba(255, 255, 255, 0.84)"
          : "rgba(29, 36, 48, 0.84)"};
  }

  .content-column {
    grid-column: 1 / -1;

    @media (min-width: 1024px) {
      grid-column: 2;
    }
  }

  .toolbar {
    display: grid;
    gap: 0.85rem;
    margin-bottom: 1.1rem;
    padding: 1rem 1.1rem;
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    border-radius: 1.4rem;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0.3), transparent),
      ${({ theme }) =>
        theme.scheme === "light"
          ? "rgba(255, 255, 255, 0.84)"
          : "rgba(29, 36, 48, 0.84)"};

    @media (min-width: 1024px) {
      display: none;
    }
  }

  .toolbar-top {
    display: grid;
    gap: 0.75rem;

    @media (min-width: 768px) {
      justify-content: end;
    }
  }

  .toolbar-search {
    display: block;

    @media (min-width: 1024px) {
      display: none;
    }
  }

  .mobile-menu {
    display: block;
    margin-bottom: 1rem;

    @media (min-width: 1024px) {
      display: none;
    }
  }

  .mobile-footer {
    padding-bottom: 2rem;

    @media (min-width: 1024px) {
      display: none;
    }
  }
`
