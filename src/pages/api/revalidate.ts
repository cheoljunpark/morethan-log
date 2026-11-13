import { NextApiRequest, NextApiResponse } from "next"
import { getPosts } from "src/apis"
import { filterPosts } from "src/libs/utils/notion"

// Regenerate cached pages after editing Notion, without waiting for ISR.
//   all pages:     /api/revalidate?secret=<TOKEN_FOR_REVALIDATE>
//   a single page: /api/revalidate?secret=<TOKEN_FOR_REVALIDATE>&path=/my-post
const STATIC_PATHS = ["/", "/about"]

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = process.env.TOKEN_FOR_REVALIDATE
  const { secret, path } = req.query

  // Without a configured token the endpoint must stay closed; otherwise
  // `undefined === undefined` would let any request through.
  if (!token) {
    return res.status(503).json({ message: "Revalidation is not configured" })
  }
  if (secret !== token) {
    return res.status(401).json({ message: "Invalid token" })
  }

  try {
    if (typeof path === "string" && path.length > 0) {
      await res.revalidate(path.startsWith("/") ? path : `/${path}`)
    } else {
      const posts = filterPosts(await getPosts())
      const paths = [...STATIC_PATHS, ...posts.map((post) => `/${post.slug}`)]
      await Promise.all(paths.map((p) => res.revalidate(p)))
    }

    return res.json({ revalidated: true })
  } catch {
    return res.status(500).send("Error revalidating")
  }
}
