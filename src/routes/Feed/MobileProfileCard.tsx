import styled from "@emotion/styled"
import Image from "next/image"
import React from "react"
import { CONFIG } from "site.config"

type Props = {
  className?: string
}

const MobileProfileCard: React.FC<Props> = () => {
  return (
    <StyledWrapper>
      <div className="mid">
        <div className="wrapper">
          <div className="avatar">
            <Image
              src={CONFIG.profile.image}
              fill
              css={{
                position: "relative",
                objectFit: "contain",
                padding: "0.2rem",
              }}
              alt="profile_image"
            />
          </div>
          <div className="wrapper">
            <div className="top">{CONFIG.profile.name}</div>
            <div className="mid">{CONFIG.profile.role}</div>
            <div className="btm">{CONFIG.profile.bio}</div>
          </div>
        </div>
      </div>
    </StyledWrapper>
  )
}

export default MobileProfileCard

const StyledWrapper = styled.div`
  display: block;

  @media (min-width: 1024px) {
    display: none;
  }

  > .mid {
    padding: 0.65rem 0.8rem;
    margin-bottom: 1rem;
    border-radius: 1rem;
    background-color: ${({ theme }) =>
      theme.scheme === "light"
        ? "rgba(255, 255, 255, 0.84)"
        : "rgba(29, 36, 48, 0.84)"};
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    backdrop-filter: blur(14px);

    > .wrapper {
      display: flex;
      gap: 0.7rem;
      align-items: center;
    }

    .avatar {
      position: relative;
      flex-shrink: 0;
      width: 4.35rem;
      height: 4.35rem;
      border-radius: 9999px;
      overflow: hidden;
      background-color: ${({ theme }) => theme.colors.gray2};
      box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.gray5};
    }

    > .wrapper > .wrapper {
      height: fit-content;
      min-width: 0;
    }

    > .wrapper > .wrapper > .top {
      font-size: 1.12rem;
      line-height: 1.5rem;
      font-weight: 700;
      letter-spacing: -0.03em;
    }

    > .wrapper > .wrapper > .mid {
      margin-bottom: 0.35rem;
      font-size: 0.84rem;
      line-height: 1.18rem;
      color: ${({ theme }) => theme.colors.gray11};
    }

    > .wrapper > .wrapper > .btm {
      font-size: 0.8rem;
      line-height: 1.3rem;
      color: ${({ theme }) => theme.colors.gray10};
    }
  }
`
