import styled from "@emotion/styled"
import Link from "next/link"
import React from "react"
import { useUiLanguage } from "src/contexts/UiLanguageContext"

const CustomError: React.FC = () => {
  const { language } = useUiLanguage()
  const ko = language === "ko"

  return (
    <StyledWrapper>
      <p className="code">404</p>
      <h1>{ko ? "페이지를 찾을 수 없어요" : "Page not found"}</h1>
      <p className="description">
        {ko
          ? "주소가 바뀌었거나 삭제된 글일 수 있어요."
          : "The address may have changed, or the post was removed."}
      </p>
      <Link href="/" className="home">
        {ko ? "홈으로 가기" : "Go home"}
      </Link>
    </StyledWrapper>
  )
}

export default CustomError

const StyledWrapper = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 40rem;
  margin: 0 auto;
  padding: 120px 22px;
  text-align: center;

  @media (max-width: 734px) {
    padding: 80px 20px;
  }

  .code {
    margin: 0 0 8px;
    font-size: 17px;
    font-weight: 600;
    color: ${({ theme }) => theme.colors.gray10};
  }

  h1 {
    font-family: var(--font-display);
    font-size: clamp(32px, 5vw, 48px);
    line-height: 1.1;
    font-weight: 600;
    letter-spacing: -0.035em;
  }

  .description {
    margin: 16px 0 0;
    font-size: 17px;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.gray11};
  }

  .home {
    display: inline-flex;
    align-items: center;
    min-height: 44px;
    margin-top: 32px;
    padding: 0 22px;
    border-radius: 9999px;
    background: ${({ theme }) => theme.colors.indigo9};
    color: #ffffff;
    font-size: 17px;
    transition: transform 120ms ease, background-color 120ms ease;

    &:hover {
      background: ${({ theme }) => theme.colors.indigo10};
    }

    &:active {
      transform: scale(0.95);
    }
  }
`
