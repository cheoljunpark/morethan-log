import styled from "@emotion/styled"
import Image from "next/image"
import React from "react"
import { CONFIG } from "site.config"

type Props = {
  className?: string
}

const MobileProfileCard: React.FC<Props> = ({ className }) => {
  return (
    <StyledWrapper className={className}>
      <div className="mid">
        <div className="wrapper">
          <div className="avatar">
            <Image
              src={CONFIG.profile.image}
              fill
              unoptimized
              css={{
                position: "relative",
                objectFit: "cover",
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
    > .wrapper {
      display: flex;
      gap: 0.85rem;
      align-items: center;
    }

    .avatar {
      position: relative;
      flex-shrink: 0;
      width: 2.75rem;
      height: 2.75rem;
      border-radius: 9999px;
      overflow: hidden;
      background-color: ${({ theme }) => theme.colors.gray4};
    }

    > .wrapper > .wrapper {
      min-width: 0;
    }

    > .wrapper > .wrapper > .top {
      font-size: 0.95rem;
      font-weight: 600;
      letter-spacing: -0.02em;
      color: ${({ theme }) => theme.colors.gray12};
    }

    > .wrapper > .wrapper > .mid {
      font-size: 0.7rem;
      color: ${({ theme }) => theme.colors.gray9};
    }

    > .wrapper > .wrapper > .btm {
      margin-top: 0.3rem;
      font-size: 0.8rem;
      line-height: 1.5;
      color: ${({ theme }) => theme.colors.gray10};
    }
  }
`
