import { dehydrate } from "@tanstack/react-query"
import { GetStaticProps } from "next"
import MetaConfig from "src/components/MetaConfig"
import { queryKey } from "src/constants/queryKey"
import { queryClient } from "src/libs/react-query"
import { filterPosts } from "src/libs/utils/notion"
import Tags from "src/routes/Tags"
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

const TagsPage: NextPageWithLayout = () => {
  const meta = {
    title: `태그 | ${CONFIG.blog.title}`,
    description: "기술 태그와 메뉴 기준으로 글을 다시 탐색하는 페이지입니다.",
    type: "website",
    url: `${CONFIG.link.replace(/\/$/, "")}/tags`,
  }

  return (
    <>
      <MetaConfig {...meta} />
      <Tags />
    </>
  )
}

export default TagsPage
