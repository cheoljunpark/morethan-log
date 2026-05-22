import { dehydrate } from "@tanstack/react-query"
import { GetStaticProps } from "next"
import MetaConfig from "src/components/MetaConfig"
import { queryKey } from "src/constants/queryKey"
import { queryClient } from "src/libs/react-query"
import { filterPosts } from "src/libs/utils/notion"
import Series from "src/routes/Series"
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

const SeriesPage: NextPageWithLayout = () => {
  const meta = {
    title: `시리즈 | ${CONFIG.blog.title}`,
    description: "시리즈 단위로 글을 이어 읽을 수 있게 정리한 탐색 페이지입니다.",
    type: "website",
    url: `${CONFIG.link.replace(/\/$/, "")}/series`,
  }

  return (
    <>
      <MetaConfig {...meta} />
      <Series />
    </>
  )
}

export default SeriesPage
