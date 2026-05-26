import styled from "@emotion/styled"
import React from "react"
import { useUiLanguage } from "src/contexts/UiLanguageContext"
import { CONFIG } from "site.config"

const ServiceCard: React.FC = () => {
  const { language } = useUiLanguage()
  if (!CONFIG.projects) return null

  return (
    <>
      <StyledTitle>{language === "ko" ? "프로젝트" : "Projects"}</StyledTitle>
      <StyledWrapper>
        {CONFIG.projects.map((project, idx) => (
          <a key={idx} href={project.href} rel="noreferrer" target="_blank">
            <span className="icon">
              <span className="project-mark" aria-hidden="true" />
            </span>
            <div className="name">{project.name}</div>
          </a>
        ))}
      </StyledWrapper>
    </>
  )
}

export default ServiceCard

const StyledTitle = styled.div`
  padding: 0;
  margin-bottom: 0.45rem;
  font-size: 0.74rem;
  line-height: 1rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ theme }) => theme.colors.gray10};
`

const StyledWrapper = styled.div`
  display: flex;
  padding: 0.35rem;
  margin-bottom: 0.9rem;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.colors.gray6};
  border-radius: 1.25rem;
  background-color: ${({ theme }) =>
    theme.scheme === "light" ? "rgba(255, 255, 255, 0.84)" : "rgba(29, 36, 48, 0.84)"};
  backdrop-filter: blur(12px);
  box-shadow: 0 18px 34px -28px rgba(15, 23, 42, 0.18);

  > a {
    display: flex;
    padding: 0.75rem;
    gap: 0.75rem;
    align-items: center;
    border-radius: 1rem;
    color: ${({ theme }) => theme.colors.gray11};
    cursor: pointer;

    :hover {
      color: ${({ theme }) => theme.colors.gray12};
      background-color: ${({ theme }) => theme.colors.gray5};
    }

    .icon {
      position: relative;
      flex-shrink: 0;
      width: 1.35rem;
      height: 1.35rem;

      .project-mark {
        display: block;
        width: 100%;
        height: 100%;
        background-color: ${({ theme }) =>
          theme.scheme === "light" ? theme.colors.gray12 : "#ffffff"};
        mask: url("/project.svg") center / contain no-repeat;
        -webkit-mask: url("/project.svg") center / contain no-repeat;
      }
    }

    .name {
      font-size: 0.875rem;
      line-height: 1.25rem;
    }
  }
`
