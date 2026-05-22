import styled from "@emotion/styled"
import Link from "next/link"
import { useRouter } from "next/router"
import { useUiLanguage } from "src/contexts/UiLanguageContext"

const NavBar: React.FC = () => {
  const router = useRouter()
  const { language } = useUiLanguage()

  const links = [
    { id: 1, name: language === "ko" ? "아카이브" : "Archive", to: "/archive" },
    { id: 2, name: language === "ko" ? "태그" : "Tags", to: "/tags" },
    { id: 3, name: language === "ko" ? "시리즈" : "Series", to: "/series" },
    { id: 4, name: language === "ko" ? "소개" : "About", to: "/about" },
  ]

  return (
    <StyledWrapper>
      <ul>
        {links.map((link) => {
          const active =
            link.to === "/about"
              ? router.pathname === "/about"
              : router.pathname === link.to

          return (
            <li key={link.id}>
              <Link href={link.to} data-active={active}>
                {link.name}
              </Link>
            </li>
          )
        })}
      </ul>
    </StyledWrapper>
  )
}

export default NavBar

const StyledWrapper = styled.div`
  flex-shrink: 0;

  ul {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.02rem;

    @media (max-width: 768px) {
      gap: 0;
    }
  }

  li {
    display: block;
  }

  a {
    position: relative;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 3.75rem;
    min-width: 3.75rem;
    min-height: 2rem;
    padding: 0.28rem 0.2rem;
    border-radius: 9999px;
    color: ${({ theme }) => theme.colors.gray11};
    font-size: 0.86rem;
    line-height: 1rem;
    font-weight: 600;
    text-align: center;
    white-space: nowrap;
    transform: translateY(0);
    transition:
      transform 180ms ease,
      color 180ms ease,
      background-color 180ms ease;

    &:hover {
      transform: translateY(-1px);
      color: ${({ theme }) => theme.colors.gray12};
      background-color: ${({ theme }) => theme.colors.gray2};
    }

    &:active {
      transform: translateY(0);
    }

    &[data-active="true"] {
      color: ${({ theme }) => theme.colors.gray12};
      background-color: ${({ theme }) => theme.colors.gray2};
    }

    @media (max-width: 768px) {
      width: 2.75rem;
      min-width: 2.75rem;
      min-height: 1.8rem;
      padding: 0.22rem 0.1rem;
      font-size: 0.72rem;
      line-height: 0.9rem;
    }
  }
`
