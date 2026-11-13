import { CONFIG } from "../../site.config"
import { NextPageWithLayout } from "../types"
import CustomError from "../routes/Error"
import MetaConfig from "src/components/MetaConfig"
import { siteUrl } from "src/libs/utils"

const NotFoundPage: NextPageWithLayout = () => {
  return <CustomError />
}

NotFoundPage.getLayout = (page) => {
  return (
    <>
      <MetaConfig
        {...{
          title: CONFIG.blog.title,
          description: CONFIG.blog.description,
          type: "website",
          url: siteUrl(),
        }}
      />
      {page}
    </>
  )
}

export default NotFoundPage
