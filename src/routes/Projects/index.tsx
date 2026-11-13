import styled from "@emotion/styled"
import { SiGithub, SiYoutube } from "react-icons/si"
import { CONFIG } from "site.config"
import { useUiLanguage } from "src/contexts/UiLanguageContext"

type Localized = { ko: string; en: string }
type ProjectGroup = Localized & { id: string; note?: string }
type Project = {
  /** Main name, shown large. */
  name: string
  /** Secondary name, shown after it in a lighter style. */
  alias?: string
  group: string
  type?: Localized
  github?: string
  youtube?: string[]
}

const groups: ProjectGroup[] = CONFIG.projectGroups
const projects: Project[] = CONFIG.projects

/**
 * Projects from site.config, in sections by where they were made
 * (`projectGroups` order). Sections without projects are skipped.
 */
const Projects: React.FC = () => {
  const { language } = useUiLanguage()
  const ko = language === "ko"

  const sections = groups
    .map((group) => ({
      group,
      items: projects.filter((project) => project.group === group.id),
    }))
    .filter((section) => section.items.length > 0)

  return (
    <StyledWrapper>
      <h1>{ko ? "프로젝트" : "Projects"}</h1>
      <p className="lead">
        {ko
          ? "직접 만들고 운영해 본 프로젝트들입니다."
          : "Things I have built."}
      </p>

      {sections.map(({ group, items }) => (
        <section key={group.id}>
          <h2>
            {ko ? group.ko : group.en}
            {group.note && <span className="note">{group.note}</span>}
          </h2>
          <ul>
            {items.map((project) => (
              <li key={project.name}>
                <span className="title">
                  <span className="heading">
                    <span className="name">{project.name}</span>
                    {project.alias && (
                      <span className="alias">{project.alias}</span>
                    )}
                  </span>
                  {project.type && (
                    <span className="type">
                      {ko ? project.type.ko : project.type.en}
                    </span>
                  )}
                </span>
                <span className="links">
                  {project.github && (
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${project.name} GitHub`}
                      title="GitHub"
                    >
                      <SiGithub aria-hidden="true" />
                    </a>
                  )}
                  {project.youtube?.map((url, index, all) => {
                    // Several videos get a small number so they can be told apart.
                    const number = all.length > 1 ? index + 1 : undefined
                    const label = number ? `YouTube ${number}` : "YouTube"
                    return (
                      <a
                        key={url}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`${project.name} ${label}`}
                        title={label}
                        className="youtube"
                      >
                        <SiYoutube aria-hidden="true" />
                        {number && <span className="num">{number}</span>}
                      </a>
                    )
                  })}
                </span>
              </li>
            ))}
          </ul>
        </section>
      ))}
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
    margin: 12px 0 0;
    font-size: 17px;
    color: ${({ theme }) => theme.colors.gray10};
  }

  section {
    margin-top: 64px;
  }

  h2 {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 4px 10px;
    margin-bottom: 16px;
    font-family: var(--font-display);
    font-size: 26px;
    font-weight: 600;
    letter-spacing: -0.025em;
    color: ${({ theme }) => theme.colors.gray12};
  }

  .note {
    font-size: 15px;
    font-weight: 400;
    color: ${({ theme }) => theme.colors.gray9};
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
    border-top: 1px solid ${({ theme }) => theme.colors.gray12};
  }

  li {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    padding: 16px 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray6};
  }

  .title {
    display: grid;
    gap: 6px;
    min-width: 0;
  }

  .heading {
    display: flex;
    flex-wrap: wrap;
    align-items: baseline;
    gap: 2px 8px;
  }

  .name {
    font-size: 18px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: ${({ theme }) => theme.colors.gray12};
  }

  /* Secondary name: reads as part of the title, just quieter. */
  .alias {
    font-size: 15px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.gray10};
  }

  /* Project type: a small tag, so it doesn't read as another name. */
  .type {
    justify-self: start;
    padding: 2px 8px;
    border-radius: 9999px;
    font-size: 12px;
    line-height: 1.5;
    color: ${({ theme }) => theme.colors.gray11};
    background-color: ${({ theme }) => theme.colors.gray4};
  }

  .links {
    display: flex;
    flex-shrink: 0;
    gap: 2px;

    a {
      position: relative;
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 36px;
      height: 36px;
      border-radius: 9999px;
      color: ${({ theme }) => theme.colors.gray10};
      transition: color 120ms ease, background-color 120ms ease;

      svg {
        width: 18px;
        height: 18px;
      }

      &:hover {
        color: ${({ theme }) => theme.colors.gray12};
        background-color: ${({ theme }) => theme.colors.gray4};
      }

      &.youtube:hover {
        color: #ff0000;
      }
    }

    .num {
      position: absolute;
      right: 3px;
      bottom: 3px;
      font-size: 9px;
      font-weight: 600;
      line-height: 1;
      color: ${({ theme }) => theme.colors.gray11};
    }
  }
`
