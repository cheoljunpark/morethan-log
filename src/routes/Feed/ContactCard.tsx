import styled from "@emotion/styled"
import React from "react"
import {
  AiFillLinkedin,
  AiOutlineGithub,
  AiOutlineInstagram,
  AiOutlineMail,
} from "react-icons/ai"
import { BiBrain } from "react-icons/bi"
import { useUiLanguage } from "src/contexts/UiLanguageContext"
import { CONFIG } from "site.config"

const ContactCard: React.FC = () => {
  const { language } = useUiLanguage()

  return (
    <>
      <StyledTitle>{language === "ko" ? "문의" : "Contact"}</StyledTitle>
      <StyledWrapper>
        {CONFIG.profile.github && (
          <a
            href={`https://github.com/${CONFIG.profile.github}`}
            rel="noreferrer"
            target="_blank"
          >
            <AiOutlineGithub className="icon" />
            <div className="name">github</div>
          </a>
        )}
        {CONFIG.profile.instagram && (
          <a
            href={`https://www.instagram.com/${CONFIG.profile.instagram}`}
            rel="noreferrer"
            target="_blank"
          >
            <AiOutlineInstagram className="icon" />
            <div className="name">instagram</div>
          </a>
        )}
        {CONFIG.profile.email && (
          <a
            href={`mailto:${CONFIG.profile.email}`}
            rel="noreferrer"
            target="_blank"
            css={{ overflow: "hidden" }}
          >
            <AiOutlineMail className="icon" />
            <div className="name">email</div>
          </a>
        )}
        {CONFIG.profile.linkedin && (
          <a
            href={`https://www.linkedin.com/in/${CONFIG.profile.linkedin}`}
            rel="noreferrer"
            target="_blank"
          >
            <AiFillLinkedin className="icon" />
            <div className="name">linkedin</div>
          </a>
        )}
        {CONFIG.profile.solved_ac && (
          <a
            href={`https://solved.ac/profile/${CONFIG.profile.solved_ac}`}
            rel="noreferrer"
            target="_blank"
          >
            <BiBrain className="icon" />
            <div className="name">solved.ac</div>
          </a>
        )}
      </StyledWrapper>
    </>
  )
}

export default ContactCard

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
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.colors.gray6};
  border-radius: 1.25rem;
  background-color: ${({ theme }) =>
    theme.scheme === "light" ? "rgba(255, 255, 255, 0.84)" : "rgba(29, 36, 48, 0.84)"};
  backdrop-filter: blur(12px);
  box-shadow: 0 18px 34px -28px rgba(15, 23, 42, 0.18);

  a {
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
      font-size: 1.5rem;
      line-height: 2rem;
    }

    .name {
      font-size: 0.875rem;
      line-height: 1.25rem;
    }
  }
`
