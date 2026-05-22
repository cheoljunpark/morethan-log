import styled from "@emotion/styled"
import Image from "next/image"
import React from "react"
import { CONFIG } from "site.config"

const ProfileCard: React.FC = () => {
  return (
    <StyledWrapper>
      <div className="content">
        <div className="avatar">
          <Image
            src={CONFIG.profile.image}
            fill
            alt=""
            css={{ objectFit: "contain", padding: "0.35rem" }}
          />
        </div>
        <div className="mid">
          <div className="name">{CONFIG.profile.name}</div>
          <div className="role">{CONFIG.profile.role}</div>
          <div className="bio">{CONFIG.profile.bio}</div>
        </div>
      </div>
    </StyledWrapper>
  )
}

export default ProfileCard

const StyledWrapper = styled.div`
  > .content {
    display: flex;
    margin-bottom: 0;
    width: 100%;
    padding: 1rem 1rem 1.1rem;
    flex-direction: column;
    align-items: center;
    border: 1px solid ${({ theme }) => theme.colors.gray6};
    border-radius: 1rem;
    background-color: ${({ theme }) =>
      theme.scheme === "light"
        ? "rgba(255, 255, 255, 0.84)"
        : "rgba(29, 36, 48, 0.84)"};
    backdrop-filter: blur(14px);

    .avatar {
      position: relative;
      width: 7.2rem;
      height: 7.2rem;
      margin-bottom: 0.95rem;
      border-radius: 9999px;
      overflow: hidden;
      background-color: ${({ theme }) => theme.colors.gray2};
      box-shadow: inset 0 0 0 1px ${({ theme }) => theme.colors.gray5};
    }

    .mid {
      display: flex;
      padding: 0.2rem 0.5rem 0;
      flex-direction: column;
      align-items: center;
    }

    .name {
      font-size: 1.18rem;
      line-height: 1.6rem;
      font-weight: 700;
      letter-spacing: -0.03em;
    }

    .role {
      margin-bottom: 0.8rem;
      font-size: 0.84rem;
      line-height: 1.2rem;
      color: ${({ theme }) => theme.colors.gray11};
    }

    .bio {
      margin-bottom: 0.1rem;
      font-size: 0.76rem;
      line-height: 1.42rem;
      letter-spacing: -0.01em;
      text-align: center;
      color: ${({ theme }) => theme.colors.gray10};
    }
  }
`
