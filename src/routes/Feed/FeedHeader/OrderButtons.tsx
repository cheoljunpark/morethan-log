import styled from "@emotion/styled"
import { useRouter } from "next/router"
import React from "react"
import { storageKey } from "src/constants/storage"
import getFeedQuery from "src/libs/utils/router/getFeedQuery"

type TOrder = "asc" | "desc"

type Props = {}

const OrderButtons: React.FC<Props> = () => {
  const router = useRouter()

  const currentOrder = `${router.query.order || ``}` || ("desc" as TOrder)

  const handleClickOrderBy = (value: TOrder) => {
    if (typeof window !== "undefined") {
      const nextQuery = {
        ...getFeedQuery(router.query),
        order: value,
      }

      const search = new URLSearchParams()
      Object.entries(nextQuery).forEach(([key, queryValue]) => {
        if (queryValue) search.set(key, queryValue)
      })

      window.sessionStorage.removeItem(storageKey.feedActivePostId)
      window.sessionStorage.setItem(storageKey.feedScrollY, `${window.scrollY}`)
      window.sessionStorage.setItem(
        storageKey.feedQueryString,
        search.toString() ? `?${search.toString()}` : ""
      )

      router.replace(
        {
          pathname: "/",
          query: nextQuery,
        },
        undefined,
        { shallow: true, scroll: false }
      )

      return
    }

    router.replace(
      {
        pathname: "/",
        query: {
          ...getFeedQuery(router.query),
          order: value,
        },
      },
      undefined,
      { shallow: true, scroll: false }
    )
  }

  return (
    <StyledWrapper>
      <button
        data-active={currentOrder === "desc"}
        type="button"
        onClick={() => handleClickOrderBy("desc")}
      >
        최신순
      </button>
      <button
        data-active={currentOrder === "asc"}
        type="button"
        onClick={() => handleClickOrderBy("asc")}
      >
        오래된순
      </button>
    </StyledWrapper>
  )
}

export default OrderButtons

const StyledWrapper = styled.div`
  display: inline-flex;
  gap: 0.45rem;
  align-items: center;

  button {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    min-height: 1.95rem;
    padding: 0.35rem 0.75rem;
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    border-radius: 9999px;
    background-color: transparent;
    white-space: nowrap;
    cursor: pointer;
    font-size: 0.8rem;
    line-height: 1rem;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray10};
    transition: border-color 180ms ease, background-color 180ms ease,
      color 180ms ease;

    &:hover {
      border-color: ${({ theme }) => theme.colors.gray8};
      background-color: ${({ theme }) => theme.colors.gray3};
    }

    &[data-active="true"] {
      color: ${({ theme }) => theme.colors.gray12};
      background-color: ${({ theme }) => theme.colors.gray4};
    }
  }
`
