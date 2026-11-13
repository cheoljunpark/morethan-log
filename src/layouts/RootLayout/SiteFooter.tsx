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
        <p className="legal">
          Copyright © {since === year ? year : `${since}–${year}`}{" "}
          {CONFIG.profile.name}.
        </p>
        <nav className="contact-icons" aria-label={ko ? "연락처" : "Contact"}>
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
        </nav>
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
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    max-width: 1180px;
    margin: 0 auto;
    padding: 28px 1.5rem;

    @media (max-width: 768px) {
      flex-direction: column-reverse;
      align-items: flex-start;
      padding: 24px 1.1rem;
    }
  }

  .contact-icons {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;

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
    margin: 0;
    font-size: 12px;
    color: ${({ theme }) => theme.colors.gray9};
  }
`
