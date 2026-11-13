import styled from "@emotion/styled"
import React from "react"
import { useUiLanguage } from "src/contexts/UiLanguageContext"
import { PostDetail } from "src/types"

type Props = {
  data: PostDetail
}

const splitTextList = (value?: string) => {
  if (!value) return []

  return value
    .split(/\r?\n|,/)
    .map((item) => item.trim())
    .filter(Boolean)
}

const PostSummaryCard: React.FC<Props> = ({ data }) => {
  const { language } = useUiLanguage()
  const tags = data.tags?.slice(0, 4) || []
  const prerequisites = splitTextList(data.prerequisites)
  const references = splitTextList(data.references)

  if (
    !data.summary &&
    tags.length === 0 &&
    prerequisites.length === 0 &&
    references.length === 0
  ) {
    return null
  }

  return (
    <StyledWrapper>
      <div className="eyebrow">
        {language === "ko" ? "한눈에 보기" : "At a glance"}
      </div>
      {data.summary && <p className="summary">{data.summary}</p>}

      {(prerequisites.length > 0 || references.length > 0) && (
        <div className="supporting">
          {prerequisites.length > 0 && (
            <section className="support-card">
              <div className="support-label">
                {language === "ko" ? "사전 준비" : "Prerequisites"}
              </div>
              <ul>
                {prerequisites.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {references.length > 0 && (
            <section className="support-card">
              <div className="support-label">
                {language === "ko" ? "관련 링크" : "References"}
              </div>
              <ul>
                {references.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}

      {!!tags.length && (
        <div className="tags">
          {tags.map((tag) => (
            <span key={tag} className="tag">
              #{tag}
            </span>
          ))}
        </div>
      )}
    </StyledWrapper>
  )
}

export default PostSummaryCard

const StyledWrapper = styled.section`
  display: grid;
  gap: 1rem;
  margin: 0 0 2.75rem;
  padding: 24px;
  border-radius: 18px;
  background: ${({ theme }) => theme.colors.gray1};
  box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.gray6};

  .eyebrow,
  .support-label {
    font-size: 0.68rem;
    letter-spacing: -0.01em;
    color: ${({ theme }) => theme.colors.gray9};
  }

  .summary {
    margin: 0;
    font-size: 1.05rem;
    line-height: 1.7;
    color: ${({ theme }) => theme.colors.gray11};
  }

  .supporting {
    display: grid;
    gap: 1rem 2rem;

    @media (min-width: 640px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  .support-card {
    display: grid;
    gap: 0.4rem;
    min-width: 0;
  }

  .support-card ul {
    display: grid;
    gap: 0.2rem;
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .support-card li {
    overflow-wrap: anywhere;
    font-size: 0.9rem;
    line-height: 1.55;
    color: ${({ theme }) => theme.colors.gray11};

    &::before {
      content: "– ";
      color: ${({ theme }) => theme.colors.gray9};
    }
  }

  .tags {
    display: none;
  }
`
