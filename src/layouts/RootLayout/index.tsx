import { ReactNode } from "react"
import { ThemeProvider } from "./ThemeProvider"
import useScheme from "src/hooks/useScheme"
import Header from "./Header"
import SiteFooter from "./SiteFooter"
import styled from "@emotion/styled"
import { useRouter } from "next/router"
import Scripts from "src/layouts/RootLayout/Scripts"
import useGtagEffect from "./useGtagEffect"
import { UiLanguageProvider } from "src/contexts/UiLanguageContext"

type Props = {
  children: ReactNode
}

const RootLayout = ({ children }: Props) => {
  const router = useRouter()
  const [scheme] = useScheme()
  useGtagEffect()

  const isDetailPage = router.pathname === "/[slug]"
  const isWidePage = ["/", "/about"].includes(router.pathname)

  return (
    <ThemeProvider scheme={scheme}>
      <UiLanguageProvider>
        <Scripts />
        {/* // TODO: replace react query */}
        {/* {metaConfig.type !== "Paper" && <Header />} */}
        <Header />
        <StyledMain data-detail-page={isDetailPage} data-wide-page={isWidePage}>
          {children}
        </StyledMain>
        <SiteFooter />
      </UiLanguageProvider>
    </ThemeProvider>
  )
}

export default RootLayout

const StyledMain = styled.main`
  margin: 0 auto;
  width: 100%;
  max-width: 1120px;
  padding: 0 1rem;

  &[data-detail-page="true"] {
    max-width: none;
    padding: 0;
  }

  &[data-wide-page="true"] {
    max-width: 1180px;
    padding: 0 1.5rem;

    @media (max-width: 768px) {
      padding: 0 1.1rem;
    }
  }
`
