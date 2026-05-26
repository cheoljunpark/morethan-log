import styled from "@emotion/styled"
import Link from "next/link"
import { useRouter } from "next/router"
import { useUiLanguage } from "src/contexts/UiLanguageContext"

type Props = {
  className?: string
}

const NavBar: React.FC<Props> = ({ className }) => {
  const router = useRouter()
  const { language } = useUiLanguage()

  const links = [
    { id: 1, name: language === "ko" ? "아카이브" : "Archive", to: "/archive" },
    { id: 2, name: language === "ko" ? "태그" : "Tags", to: "/tags" },
    { id: 3, name: language === "ko" ? "소개" : "About", to: "/about" },
  ]

  return (
    <StyledWrapper className={className}>
      <ul>
        {links.map((link) => {
          const active = router.pathname === link.to

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
      overflow-x: auto;
      scrollbar-width: none;
      -ms-overflow-style: none;

      &::-webkit-scrollbar {
        display: none;
      }
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
    font-size: 0.84rem;
    line-height: 1rem;
    font-weight: 600;
    text-decoration: none;
    transition:
      background-color 180ms ease,
      color 180ms ease,
      transform 180ms ease,
      box-shadow 180ms ease;

    &:hover {
      background-color: ${({ theme }) => theme.colors.gray3};
      color: ${({ theme }) => theme.colors.gray12};
      transform: translateY(-1px);
      box-shadow: 0 6px 16px -14px rgba(15, 23, 42, 0.3);
    }

    &[data-active="true"] {
      background-color: ${({ theme }) =>
        theme.scheme === "light"
          ? "rgba(59, 130, 246, 0.08)"
          : "rgba(59, 130, 246, 0.12)"};
      color: ${({ theme }) => theme.colors.gray12};
    }

    @media (max-width: 768px) {
      width: auto;
      min-width: 3.4rem;
      min-height: 1.8rem;
      padding: 0.24rem 0.6rem;
      font-size: 0.77rem;
    }
  }
`
