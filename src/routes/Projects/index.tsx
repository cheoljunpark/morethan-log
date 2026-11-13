import styled from "@emotion/styled"
import { CONFIG } from "site.config"
import { useUiLanguage } from "src/contexts/UiLanguageContext"

/** Project list from site.config `projects`, each linking to its repository. */
const Projects: React.FC = () => {
  const { language } = useUiLanguage()
  const ko = language === "ko"

  return (
    <StyledWrapper>
      <h1>{ko ? "프로젝트" : "Projects"}</h1>
      <p className="lead">
        {ko
          ? "직접 만들고 운영해 본 프로젝트들입니다."
          : "Things I have built."}
      </p>

      <ul>
        {CONFIG.projects.map((project) => (
          <li key={project.name}>
            <a href={project.href} target="_blank" rel="noreferrer">
              <span className="name">{project.name}</span>
              <span className="host">{new URL(project.href).host} ↗</span>
            </a>
          </li>
        ))}
      </ul>
    </StyledWrapper>
  )
}

export default Projects

const StyledWrapper = styled.div`
  max-width: 760px;
  margin: 0 auto;
  padding: 56px 0 80px;

  h1 {
    font-family: var(--font-display);
    font-size: clamp(32px, 4vw, 40px);
    line-height: 1.1;
    font-weight: 600;
    letter-spacing: -0.03em;
  }

  .lead {
    margin: 12px 0 32px;
    font-size: 17px;
    color: ${({ theme }) => theme.colors.gray10};
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    border-top: 1px solid ${({ theme }) => theme.colors.gray6};
  }

  a {
    display: flex;
    justify-content: space-between;
    align-items: baseline;
    gap: 16px;
    padding: 22px 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray6};

    &:hover .name {
      color: ${({ theme }) => theme.colors.indigo9};
    }
  }

  .name {
    font-family: var(--font-display);
    font-size: 24px;
    font-weight: 600;
    letter-spacing: -0.02em;
    color: ${({ theme }) => theme.colors.gray12};
    transition: color 120ms ease;
  }

  .host {
    flex-shrink: 0;
    font-size: 14px;
    color: ${({ theme }) => theme.colors.gray9};
  }
`
