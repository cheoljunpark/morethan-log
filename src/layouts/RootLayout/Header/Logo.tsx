import Link from "next/link"
import { CONFIG } from "site.config"
import styled from "@emotion/styled"
import { roboto } from "src/assets"

const Logo = () => {
  return (
    <StyledWrapper href="/" aria-label={CONFIG.blog.title}>
      {CONFIG.blog.title}
    </StyledWrapper>
  )
}

export default Logo

const StyledWrapper = styled(Link)`
  font-family: ${roboto.style.fontFamily}, sans-serif;
  font-size: 1.05rem;
  line-height: 1;
  font-weight: 900;
  letter-spacing: -0.04em;
  color: ${({ theme }) => theme.colors.gray12};
`
