import styled from "@emotion/styled"
import { useRouter } from "next/router"
import React from "react"
import { useUiLanguage } from "src/contexts/UiLanguageContext"
import { storageKey } from "src/constants/storage"
import getFeedQuery from "src/libs/utils/router/getFeedQuery"

type TOrder = "asc" | "desc"

const OrderButtons: React.FC = () => {
  const router = useRouter()
  const { language } = useUiLanguage()
  const currentOrder = `${router.query.order || ""}` || ("desc" as TOrder)

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
        {language === "ko" ? "최신순" : "Newest"}
      </button>
      <button
        data-active={currentOrder === "asc"}
        type="button"
        onClick={() => handleClickOrderBy("asc")}
      >
        {language === "ko" ? "오래된순" : "Oldest"}
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
    width: 5.1rem;
    min-width: 5.1rem;
    min-height: 2rem;
    padding: 0.35rem 0.7rem;
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    border-radius: 9999px;
    background-color: transparent;
    white-space: nowrap;
    cursor: pointer;
    font-size: 0.78rem;
    line-height: 1rem;
    font-weight: 600;
    text-align: center;
    color: ${({ theme }) => theme.colors.gray10};
    transition:
      transform 180ms ease,
      border-color 180ms ease,
      background-color 180ms ease,
      color 180ms ease,
      box-shadow 180ms ease;

    &:hover {
      transform: translateY(-1px);
      border-color: ${({ theme }) => theme.colors.gray8};
      background-color: ${({ theme }) => theme.colors.gray3};
    }

    &:active {
      transform: translateY(0) scale(0.97);
    }

    &[data-active="true"] {
      color: ${({ theme }) => theme.colors.gray12};
      background-color: ${({ theme }) => theme.colors.gray4};
      box-shadow: 0 8px 16px -14px rgba(15, 23, 42, 0.42);
    }
  }
`
