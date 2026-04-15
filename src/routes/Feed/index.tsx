import { useRouter } from "next/router"
import { useEffect, useState } from "react"

import SearchInput from "./SearchInput"
import { FeedHeader } from "./FeedHeader"
import Footer from "./Footer"
import styled from "@emotion/styled"
import MobileProfileCard from "./MobileProfileCard"
import ProfileCard from "./ProfileCard"
import ServiceCard from "./ServiceCard"
import ContactCard from "./ContactCard"
import PostList from "./PostList"
import PinnedPosts from "./PostList/PinnedPosts"
import FeaturedPosts from "./FeaturedPosts"
import { DEFAULT_CATEGORY } from "src/constants"
import CategorySelect from "./FeedHeader/CategorySelect"

const HEADER_HEIGHT = 73

type Props = {}

const Feed: React.FC<Props> = () => {
  const router = useRouter()
  const q = typeof router.query.q === "string" ? router.query.q : ""
  const [searchValue, setSearchValue] = useState(q)
  const [isComposing, setIsComposing] = useState(false)
  const currentTag = typeof router.query.tag === "string" ? router.query.tag : ""
  const currentCategory =
    typeof router.query.category === "string"
      ? router.query.category
      : DEFAULT_CATEGORY
  const currentOrder =
    typeof router.query.order === "string" ? router.query.order : "desc"
  const showFeatured =
    !q && !currentTag && currentCategory === DEFAULT_CATEGORY && currentOrder === "desc"

  useEffect(() => {
    if (!isComposing) {
      setSearchValue(q)
    }
  }, [q, isComposing])

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
      <div
        className="lt"
        css={{
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
        }}
      >
        <CategorySelect />
      </div>
      <div className="mid">
        <MobileProfileCard />
        <FeaturedPosts enabled={showFeatured} />
        <PinnedPosts q={q} />
        <div className="sticky-tools">
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
          <FeedHeader />
        </div>
        <div className="category">
          <CategorySelect />
        </div>
        <PostList q={q} />
        <div className="footer">
          <Footer />
        </div>
      </div>
      <div
        className="rt"
        css={{
          height: `calc(100vh - ${HEADER_HEIGHT}px)`,
        }}
      >
        <ProfileCard />
        <ServiceCard />
        <ContactCard />
        <div className="footer">
          <Footer />
        </div>
      </div>
    </StyledWrapper>
  )
}

export default Feed

const StyledWrapper = styled.div`
  grid-template-columns: repeat(12, minmax(0, 1fr));

  padding: 2rem 0;
  display: grid;
  gap: 1.5rem;

  @media (max-width: 768px) {
    display: block;
    padding: 0.5rem 0;
  }

  > .lt {
    display: none;
    overflow: scroll;
    position: sticky;
    grid-column: span 2 / span 2;
    top: ${HEADER_HEIGHT - 10}px;
    min-width: 0;
    overflow-x: hidden;

    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }

    @media (min-width: 1024px) {
      display: block;
    }
  }

  > .mid {
    grid-column: span 12 / span 12;

    @media (min-width: 1024px) {
      grid-column: span 7 / span 7;
    }

    > .sticky-tools {
      display: grid;
      gap: 0.6rem;
      margin-bottom: 1rem;
      padding: 0;

      @media (min-width: 768px) {
        grid-template-columns: minmax(0, 1fr) auto;
        align-items: center;
      }
    }

    > .category {
      display: block;
      margin-bottom: 1.15rem;

      @media (min-width: 1024px) {
        display: none;
      }
    }

    > .footer {
      padding-bottom: 2rem;
      @media (min-width: 1024px) {
        display: none;
      }
    }
  }

  > .rt {
    scrollbar-width: none;
    -ms-overflow-style: none;
    &::-webkit-scrollbar {
      display: none;
    }

    display: none;
    overflow: scroll;
    position: sticky;
    top: ${HEADER_HEIGHT - 10}px;

    @media (min-width: 1024px) {
      display: block;
      grid-column: span 3 / span 3;
    }

    .footer {
      padding-top: 1rem;
    }
  }
`
