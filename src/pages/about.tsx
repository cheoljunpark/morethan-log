import MetaConfig from "src/components/MetaConfig"
import About from "src/routes/About"
import { NextPageWithLayout } from "src/types"
import { CONFIG } from "../../site.config"

const AboutPage: NextPageWithLayout = () => {
  const meta = {
    title: `소개 | ${CONFIG.blog.title}`,
    description:
      "블로그를 운영하는 사람과 글의 방향, 다루는 주제를 간단히 소개하는 페이지입니다.",
    type: "website",
    url: `${CONFIG.link.replace(/\/$/, "")}/about`,
  }

  return (
    <>
      <MetaConfig {...meta} />
      <About />
    </>
  )
}

export default AboutPage
