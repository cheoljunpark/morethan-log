import styled from "@emotion/styled"
import { IconType } from "react-icons"
import { BiBrain } from "react-icons/bi"
import { FiMail } from "react-icons/fi"
import { SiGithub, SiLinkedin } from "react-icons/si"
import { CONFIG } from "site.config"
import { useUiLanguage } from "src/contexts/UiLanguageContext"

const contactLinks = [
  CONFIG.profile.github && {
    name: "GitHub",
    icon: SiGithub,
    href: `https://github.com/${CONFIG.profile.github}`,
  },
  CONFIG.profile.linkedin && {
    name: "LinkedIn",
    icon: SiLinkedin,
    href: `https://www.linkedin.com/in/${CONFIG.profile.linkedin}`,
  },
  CONFIG.profile.solved_ac && {
    name: "solved.ac",
    icon: BiBrain,
    href: `https://solved.ac/profile/${CONFIG.profile.solved_ac}`,
  },
  CONFIG.profile.email && {
    name: "Email",
    icon: FiMail,
    href: `mailto:${CONFIG.profile.email}`,
  },
].filter(Boolean) as { name: string; icon: IconType; href: string }[]

const SiteFooter: React.FC = () => {
  const { language } = useUiLanguage()
  const ko = language === "ko"
  const year = new Date().getFullYear()
  const since = Number(CONFIG.since) || year

  return (
    <StyledWrapper>
      <div className="inner">
        <div className="columns">
          {CONFIG.projects?.length > 0 && (
            <div>
              <h3>{ko ? "프로젝트" : "Projects"}</h3>
              {CONFIG.projects.map((project) => (
                <a
                  key={project.name}
                  href={project.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {project.name}
                </a>
              ))}
            </div>
          )}
          <div>
            <h3>{ko ? "연락" : "Contact"}</h3>
            <div className="contact-icons">
              {contactLinks.map(({ name, icon: Icon, href }) => (
                <a
                  key={name}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={name}
                  title={name}
                >
                  <Icon aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <p className="legal">
          Copyright © {since === year ? year : `${since}–${year}`}{" "}
          {CONFIG.profile.name}.
        </p>
      </div>
    </StyledWrapper>
  )
}

export default SiteFooter

const StyledWrapper = styled.footer`
  border-top: 1px solid ${({ theme }) => theme.colors.gray6};
  background: ${({ theme }) => theme.colors.gray2};
  color: ${({ theme }) => theme.colors.gray11};

  .inner {
    max-width: 1180px;
    margin: 0 auto;
    padding: 40px 1.5rem 24px;

    @media (max-width: 768px) {
      padding: 32px 1.1rem 24px;
    }
  }

  .columns {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 24px;
  }

  h3 {
    margin-bottom: 6px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: ${({ theme }) => theme.colors.gray12};
  }

  a {
    display: block;
    font-size: 12px;
    line-height: 2.2;
    color: ${({ theme }) => theme.colors.gray10};

    &:hover {
      color: ${({ theme }) => theme.colors.gray12};
      text-decoration: underline;
    }
  }

  .contact-icons {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    margin-top: 4px;

    a {
      display: inline-flex;
      justify-content: center;
      align-items: center;
      width: 36px;
      height: 36px;
      border-radius: 9999px;
      background: ${({ theme }) => theme.colors.gray1};
      box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.gray6};
      color: ${({ theme }) => theme.colors.gray11};
      line-height: 1;
      transition: transform 120ms ease, color 120ms ease;

      svg {
        width: 17px;
        height: 17px;
      }

      &:hover {
        color: ${({ theme }) => theme.colors.indigo9};
        text-decoration: none;
      }

      &:active {
        transform: scale(0.95);
      }
    }
  }

  .legal {
    margin: 28px 0 0;
    padding-top: 16px;
    border-top: 1px solid ${({ theme }) => theme.colors.gray6};
    font-size: 12px;
    color: ${({ theme }) => theme.colors.gray9};
  }
`
