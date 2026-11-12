import Link from "next/link"
import { CONFIG } from "site.config"
import styled from "@emotion/styled"

const Logo = () => {
  const [name, ...rest] = CONFIG.blog.title.split(".")

  return (
    <StyledWrapper href="/" aria-label={CONFIG.blog.title}>
      {name}
      {rest.length > 0 && (
        <>
          <span className="dot">.</span>
          {rest.join(".")}
        </>
      )}
    </StyledWrapper>
  )
}

export default Logo

const StyledWrapper = styled(Link)`
  font-family: var(--font-display);
  font-size: 15px;
  line-height: 1;
  font-weight: 600;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.gray12};
  white-space: nowrap;

  .dot {
    opacity: 0.5;
  }

  @media (max-width: 1023px) {
    display: inline-flex;
    align-items: center;
    min-width: 0;
    min-height: 1.9rem;
  }
`
