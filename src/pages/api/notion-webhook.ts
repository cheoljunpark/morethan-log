import { createHmac, timingSafeEqual } from "crypto"
import { NextApiRequest, NextApiResponse } from "next"
import { getPosts } from "src/apis"
import { filterPosts } from "src/libs/utils/notion"

/**
 * Notion webhook → regenerate the affected pages, so edits in Notion appear
 * on the site within about a minute without calling /api/revalidate by hand.
 *
 * Setup (see README):
 * 1. Create a Notion connection, give it access to the posts database, and
 *    add a webhook subscription pointing at /api/notion-webhook.
 * 2. Notion POSTs {"verification_token": "..."} once. It is printed to the
 *    Vercel function log; save it as NOTION_WEBHOOK_SECRET and paste it into
 *    Notion's Verify dialog.
 * 3. Every later event is signed: X-Notion-Signature = "sha256=" +
 *    HMAC-SHA256(raw body, verification_token).
 */

// The signature is computed over the exact bytes Notion sent.
export const config = { api: { bodyParser: false } }

const SITE_PATHS = ["/", "/about"]

type NotionEvent = {
  type?: string
  entity?: { id?: string; type?: string }
  verification_token?: string
}

const readRawBody = async (req: NextApiRequest) => {
  const chunks: Uint8Array[] = []
  for await (const chunk of req) {
    chunks.push(
      typeof chunk === "string" ? new TextEncoder().encode(chunk) : chunk
    )
  }
  return Buffer.concat(chunks)
}

export const isValidSignature = (
  rawBody: Buffer,
  header: unknown,
  secret: string
) => {
  if (typeof header !== "string" || !header.startsWith("sha256=")) return false
  const expected = Buffer.from(
    "sha256=" + createHmac("sha256", secret).update(rawBody).digest("hex")
  )
  const received = Buffer.from(header)
  return (
    expected.length === received.length && timingSafeEqual(expected, received)
  )
}

const normalizeId = (id = "") => id.replace(/-/g, "").toLowerCase()

/** Pages to regenerate for an event on Notion page `pageId`. */
export const pathsForPage = async (pageId?: string) => {
  const posts = filterPosts(await getPosts())
  const post =
    pageId && posts.find((p) => normalizeId(p.id) === normalizeId(pageId))
  // Home and about list posts (feed, categories), so they always refresh.
  // An unknown page (deleted, unpublished, or not a post) only affects lists.
  return post ? [...SITE_PATHS, `/${post.slug}`] : SITE_PATHS
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST")
    return res.status(405).json({ message: "Method not allowed" })
  }

  const rawBody = await readRawBody(req)
  let event: NotionEvent
  try {
    event = JSON.parse(rawBody.toString("utf8"))
  } catch {
    return res.status(400).json({ message: "Invalid JSON" })
  }

  // One-time subscription verification: no signature yet. Surface the token
  // in the function log so the owner can copy it into Notion and Vercel.
  if (event.verification_token && !event.type) {
    console.log(
      `[notion-webhook] verification_token: ${event.verification_token}`
    )
    return res.status(200).json({ received: true })
  }

  const secret = process.env.NOTION_WEBHOOK_SECRET
  if (!secret) {
    return res.status(503).json({ message: "Webhook is not configured" })
  }
  if (!isValidSignature(rawBody, req.headers["x-notion-signature"], secret)) {
    return res.status(401).json({ message: "Invalid signature" })
  }

  // Only page events change what the blog shows (posts are database pages).
  if (!event.type?.startsWith("page.")) {
    return res.status(200).json({ ignored: event.type ?? "unknown" })
  }

  try {
    const paths = await pathsForPage(event.entity?.id)
    await Promise.all(paths.map((path) => res.revalidate(path)))
    return res.status(200).json({ revalidated: paths })
  } catch (error) {
    console.error("[notion-webhook] revalidation failed", error)
    // A non-2xx makes Notion retry the delivery later.
    return res.status(500).json({ message: "Revalidation failed" })
  }
}
