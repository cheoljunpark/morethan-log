import styled from "@emotion/styled"
import Image from "next/image"
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
              <Image src="/project.svg" alt="" fill />
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
  margin-bottom: 0;
`

const StyledWrapper = styled.div`
  display: flex;
  padding: 0.25rem;
  margin-bottom: 0.9rem;
  flex-direction: column;
  border-radius: 1rem;
  background-color: ${({ theme }) =>
    theme.scheme === "light" ? "white" : theme.colors.gray4};

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

      :global(img) {
        object-fit: contain;
      }
    }

    .name {
      font-size: 0.875rem;
      line-height: 1.25rem;
    }
  }
`
