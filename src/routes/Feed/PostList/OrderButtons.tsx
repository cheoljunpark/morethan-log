import styled from "@emotion/styled"
import { useRouter } from "next/router"
import React from "react"
import { useUiLanguage } from "src/contexts/UiLanguageContext"
import { saveFeedPosition } from "src/libs/utils/feedScroll"
import getFeedQuery, { compactQuery } from "src/libs/utils/router/getFeedQuery"

type TOrder = "asc" | "desc"

const OrderButtons: React.FC = () => {
  const router = useRouter()
  const { language } = useUiLanguage()
  const currentOrder = `${router.query.order || ""}` || ("desc" as TOrder)

  const handleClickOrderBy = (value: TOrder) => {
    saveFeedPosition()
    void router.replace(
      {
        pathname: "/",
        // desc is the default, so it is left out of the URL.
        query: compactQuery({
          ...getFeedQuery(router.query),
          order: value === "desc" ? undefined : value,
        }),
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
  align-items: center;
  font-size: 0.72rem;

  .thumb {
    display: none;
  }

  button + button::before {
    content: "/";
    margin: 0 0.35rem;
    color: ${({ theme }) => theme.colors.gray7};
  }

  button {
    display: inline-flex;
    align-items: center;
    padding: 0.25rem 0;
    color: ${({ theme }) => theme.colors.gray9};
    text-transform: none;
    letter-spacing: 0;
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
`
