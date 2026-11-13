import { GetServerSideProps } from "next"
import { getServerSideSitemap, ISitemapField } from "next-sitemap"
import { getPosts } from "src/apis/notion-client/getPosts"
import { getPostDate, siteUrl } from "src/libs/utils"
import { filterPosts } from "src/libs/utils/notion"

const toIsoDate = (value?: string) => {
  const date = value ? new Date(value) : new Date()
  return Number.isNaN(date.getTime())
    ? new Date().toISOString()
    : date.toISOString()
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  // Only public posts: drafts and private posts must not be advertised.
  const posts = filterPosts(await getPosts())
  const latest = posts[0]?.updatedAt?.start_date || posts[0]?.date?.start_date

  const fields: ISitemapField[] = [
    {
      loc: siteUrl(),
      lastmod: toIsoDate(latest),
      priority: 1.0,
      changefreq: "daily",
    },
    {
      loc: siteUrl("/about"),
      lastmod: toIsoDate(latest),
      priority: 0.5,
      changefreq: "monthly",
    },
    ...posts.map((post) => ({
      loc: siteUrl(post.slug),
      lastmod: toIsoDate(post.updatedAt?.start_date || getPostDate(post)),
      priority: 0.7,
      changefreq: "weekly" as const,
    })),
  ]

  return getServerSideSitemap(ctx, fields)
}

// The XML is sent from getServerSideProps; Next.js still needs a page component.
const Sitemap = () => null

export default Sitemap
