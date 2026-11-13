import { dehydrate, QueryClient } from "@tanstack/react-query"
import { GetStaticProps } from "next"
import { CONFIG } from "site.config"
import { getPosts } from "src/apis"
import { queryKey } from "src/constants/queryKey"
import { filterPosts } from "src/libs/utils/notion"

/**
 * Prefetches the public post list. Any page with the header needs it,
 * because the mobile drawer lists categories from it.
 */
const getPostsStaticProps: GetStaticProps = async () => {
  // Fresh client per build: a shared one would carry every page's data along.
  const queryClient = new QueryClient()
  const posts = filterPosts(await getPosts())
  await queryClient.prefetchQuery(queryKey.posts(), () => posts)

  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
    revalidate: CONFIG.revalidateTime,
  }
}

export default getPostsStaticProps
