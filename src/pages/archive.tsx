import { dehydrate } from "@tanstack/react-query"
import { GetStaticProps } from "next"
import MetaConfig from "src/components/MetaConfig"
import { queryKey } from "src/constants/queryKey"
import { queryClient } from "src/libs/react-query"
import { filterPosts } from "src/libs/utils/notion"
import Archive from "src/routes/Archive"
import { NextPageWithLayout } from "../types"
import { CONFIG } from "../../site.config"
import { getPosts } from "../apis"

export const getStaticProps: GetStaticProps = async () => {
  const posts = filterPosts(await getPosts())
  await queryClient.prefetchQuery(queryKey.posts(), () => posts)

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: CONFIG.revalidateTime,
  }
}

const ArchivePage: NextPageWithLayout = () => {
  const meta = {
    title: `아카이브 | ${CONFIG.blog.title}`,
    description: "연도와 메뉴 기준으로 블로그 글을 다시 찾아보는 아카이브 페이지입니다.",
    type: "website",
    url: `${CONFIG.link.replace(/\/$/, "")}/archive`,
  }

  return (
    <>
      <MetaConfig {...meta} />
      <Archive />
    </>
  )
}

export default ArchivePage
