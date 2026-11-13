import Feed from "src/routes/Feed"
import { CONFIG } from "../../site.config"
import { NextPageWithLayout } from "../types"
import MetaConfig from "src/components/MetaConfig"
import { siteUrl } from "src/libs/utils"

export { default as getStaticProps } from "src/libs/react-query/getPostsStaticProps"

const FeedPage: NextPageWithLayout = () => {
  const meta = {
    title: CONFIG.blog.title,
    description: CONFIG.blog.description,
    type: "website" as const,
    url: siteUrl(),
    image: `${CONFIG.ogImageGenerateURL}/${encodeURIComponent(
      CONFIG.blog.title
    )}.png`,
  }

  return (
    <>
      <MetaConfig {...meta} />
      <Feed />
    </>
  )
}

export default FeedPage
