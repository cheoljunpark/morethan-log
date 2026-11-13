import MetaConfig from "src/components/MetaConfig"
import { siteUrl } from "src/libs/utils"
import Projects from "src/routes/Projects"
import { NextPageWithLayout } from "src/types"
import { CONFIG } from "../../site.config"

// Posts are prefetched so the mobile drawer can list categories here too.
export { default as getStaticProps } from "src/libs/react-query/getPostsStaticProps"

const ProjectsPage: NextPageWithLayout = () => (
  <>
    <MetaConfig
      title={`프로젝트 | ${CONFIG.blog.title}`}
      description={`${CONFIG.profile.name}이 만든 프로젝트 목록입니다.`}
      type="website"
      url={siteUrl("/projects")}
    />
    <Projects />
  </>
)

export default ProjectsPage
