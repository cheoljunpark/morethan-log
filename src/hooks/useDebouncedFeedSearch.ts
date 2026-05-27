import { useRouter } from "next/router"
import { useCallback, useEffect, useState } from "react"

type Options = {
  resetPage?: boolean
}

const SEARCH_DEBOUNCE_MS = 220

const useDebouncedFeedSearch = ({ resetPage = false }: Options = {}) => {
  const router = useRouter()
  const q = typeof router.query.q === "string" ? router.query.q : ""
  const [searchValue, setSearchValue] = useState(q)
  const [isComposing, setIsComposing] = useState(false)

  const replaceSearch = useCallback(
    (value: string) => {
      const nextQuery = {
        ...router.query,
        q: value || undefined,
        page: resetPage ? undefined : router.query.page,
      }

      void router.replace(
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
    },
    [resetPage, router]
  )

  useEffect(() => {
    if (!isComposing) {
      setSearchValue(q)
    }
  }, [isComposing, q])

  useEffect(() => {
    if (isComposing || searchValue === q) return

    const timer = window.setTimeout(() => {
      replaceSearch(searchValue)
    }, SEARCH_DEBOUNCE_MS)

    return () => {
      window.clearTimeout(timer)
    }
  }, [isComposing, q, replaceSearch, searchValue])

  const handleChange = (value: string) => {
    setSearchValue(value)
  }

  const handleCompositionStart = () => {
    setIsComposing(true)
  }

  const handleCompositionEnd = (value: string) => {
    setIsComposing(false)
    setSearchValue(value)
    replaceSearch(value)
  }

  return {
    searchValue,
    handleChange,
    handleCompositionStart,
    handleCompositionEnd,
  }
}

export default useDebouncedFeedSearch
