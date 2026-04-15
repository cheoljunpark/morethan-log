import Image from "next/image"
import React, { useState } from "react"
import styled from "@emotion/styled"

type Props = {
  src: string
  alt: string
  className?: string
  sizes?: string
}

const AdaptiveThumbnail: React.FC<Props> = ({ src, alt, className, sizes }) => {
  const [isPortrait, setIsPortrait] = useState(false)

  return (
    <StyledWrapper className={className} data-portrait={isPortrait}>
      <Image
        src={src}
        fill
        alt=""
        aria-hidden="true"
        className="thumbnail-bg"
        sizes={sizes}
        css={{ objectFit: "cover" }}
      />
      <Image
        src={src}
        fill
        alt={alt}
        className="thumbnail-image"
        sizes={sizes}
        css={{ objectFit: isPortrait ? "contain" : "cover" }}
        onLoadingComplete={(img) => {
          setIsPortrait(img.naturalHeight > img.naturalWidth * 1.08)
        }}
      />
    </StyledWrapper>
  )
}

export default AdaptiveThumbnail

const StyledWrapper = styled.div`
  position: absolute;
  inset: 0;
  overflow: hidden;
  width: 100%;
  height: 100%;
  background-color: ${({ theme }) => theme.colors.gray3};

  .thumbnail-bg {
    transform: scale(1.14);
    filter: blur(28px);
    opacity: 0.5;
  }

  .thumbnail-image {
    transition: transform 300ms ease;
    object-position: center center;
  }

  &[data-portrait="true"] {
    .thumbnail-image {
      transform: scale(0.96);
    }
  }
`
