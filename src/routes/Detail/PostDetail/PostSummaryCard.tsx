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
      <div className="eyebrow">{language === "ko" ? "한눈에 보기" : "At a glance"}</div>
      {data.summary && <p className="summary">{data.summary}</p>}

      {(prerequisites.length > 0 || references.length > 0) && (
        <div className="supporting">
          {prerequisites.length > 0 && (
            <section className="support-card">
              <div className="support-label">{language === "ko" ? "사전 준비" : "Prerequisites"}</div>
              <ul>
                {prerequisites.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </section>
          )}

          {references.length > 0 && (
            <section className="support-card">
              <div className="support-label">{language === "ko" ? "관련 링크" : "References"}</div>
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
  margin-bottom: 1.5rem;
  padding: 1rem 1rem 1.05rem;
  border: 1px solid ${({ theme }) => theme.colors.gray6};
  border-radius: 1.2rem;
  background-color: ${({ theme }) =>
    theme.scheme === "light"
      ? "rgba(244, 247, 252, 0.82)"
      : "rgba(35, 44, 58, 0.82)"};

  .eyebrow {
    margin-bottom: 0.55rem;
    font-size: 0.76rem;
    line-height: 1rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.gray10};
  }

  .summary {
    margin: 0 0 0.9rem;
    color: ${({ theme }) => theme.colors.gray12};
    line-height: 1.75rem;
    font-weight: 500;
  }

  .supporting {
    display: grid;
    gap: 0.8rem;
    margin-bottom: 0.95rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  .support-card {
    min-width: 0;
    padding: 0.9rem 0.95rem;
    border-radius: 1rem;
    background-color: ${({ theme }) => theme.colors.gray3};
  }

  .support-label {
    margin-bottom: 0.45rem;
    font-size: 0.72rem;
    line-height: 1rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: ${({ theme }) => theme.colors.gray10};
  }

  .support-card ul {
    display: grid;
    gap: 0.4rem;
    margin: 0;
    padding-left: 1rem;
    color: ${({ theme }) => theme.colors.gray12};
  }

  .support-card li {
    line-height: 1.6rem;
    word-break: keep-all;
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
  }

  .tag {
    display: inline-flex;
    align-items: center;
    min-height: 1.75rem;
    padding: 0.25rem 0.6rem;
    border-radius: 9999px;
    background-color: ${({ theme }) => theme.colors.gray3};
    color: ${({ theme }) => theme.colors.gray10};
    font-size: 0.76rem;
    line-height: 1rem;
    font-weight: 600;
  }
`
