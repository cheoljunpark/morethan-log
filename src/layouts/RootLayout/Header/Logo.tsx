import Link from "next/link"
import { CONFIG } from "site.config"
import styled from "@emotion/styled"
import { pretendard } from "src/assets"

const Logo = () => {
  return (
    <StyledWrapper href="/" aria-label={CONFIG.blog.title}>
      {CONFIG.blog.title}
    </StyledWrapper>
  )
}

export default Logo

const StyledWrapper = styled(Link)`
  font-family: ${pretendard.style.fontFamily}, sans-serif;
  font-size: 1rem;
  line-height: 1;
  font-weight: 700;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.gray12};
`
