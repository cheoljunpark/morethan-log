import { dehydrate, QueryClient } from "@tanstack/react-query"
import { GetStaticProps } from "next"
import { ExtendedRecordMap } from "notion-types"
import { getPosts, getRecordMap } from "src/apis"
import MetaConfig from "src/components/MetaConfig"
import { queryKey } from "src/constants/queryKey"
import { siteUrl } from "src/libs/utils"
import { filterPosts } from "src/libs/utils/notion"
import About from "src/routes/About"
import { NextPageWithLayout } from "src/types"
import { CONFIG } from "../../site.config"

type Props = {
  title: string | null
  summary: string | null
  recordMap: ExtendedRecordMap | null
}

export const getStaticProps: GetStaticProps<Props> = async () => {
  // Fresh client per build; the header's category menu needs the post list.
  const queryClient = new QueryClient()
  const posts = await getPosts()
  await queryClient.prefetchQuery(queryKey.posts(), () => filterPosts(posts))

  // The about row is found by its ID number regardless of status.
  const page = posts.find((post) => post.slug === CONFIG.aboutPageId)
  const recordMap = page ? await getRecordMap(page.id) : null

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
      title: page?.title ?? null,
      summary: page?.summary ?? null,
      recordMap,
    },
    revalidate: CONFIG.revalidateTime,
  }
}

const AboutPage: NextPageWithLayout<Props> = ({
  title,
  summary,
  recordMap,
}) => {
  const meta = {
    title: `${title || "소개"} | ${CONFIG.blog.title}`,
    description:
      summary ||
      "블로그를 운영하는 사람과 글의 방향, 다루는 주제를 간단히 소개하는 페이지입니다.",
    type: "website" as const,
    url: siteUrl("/about"),
  }

  return (
    <>
      <MetaConfig {...meta} />
      <About title={title} recordMap={recordMap} />
    </>
  )
}

export default AboutPage
