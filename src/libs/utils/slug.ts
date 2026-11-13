// Post URLs are generated from the title, so nothing has to be typed in Notion.
//
//   "Next.js 배포 트러블슈팅" (id ...c0ba026) -> "nextjs-배포-트러블슈팅-c0ba026"
//
// The title part is cut at MAX_TITLE_LENGTH so long titles stay readable.
// The trailing id fragment keeps URLs unique and lets a URL survive a title
// change: an outdated title part still resolves through the id fragment.

const MAX_TITLE_LENGTH = 40
const ID_SUFFIX_LENGTH = 6

const idSuffix = (id: string) => id.replace(/-/g, "").slice(-ID_SUFFIX_LENGTH)

const slugifyTitle = (title: string) => {
  const slug = title
    .normalize("NFC")
    .toLowerCase()
    .replace(/[^a-z0-9ㄱ-ㆎ가-힣]+/g, "-")
    .replace(/^-+|-+$/g, "")
  if (slug.length <= MAX_TITLE_LENGTH) return slug

  const cut = slug.slice(0, MAX_TITLE_LENGTH)
  const lastBreak = cut.lastIndexOf("-")
  return lastBreak > MAX_TITLE_LENGTH / 2 ? cut.slice(0, lastBreak) : cut
}

/** URL slug for a post: readable title part + stable id fragment. */
export const makePostSlug = (title: string, id: string) => {
  const base = slugifyTitle(title)
  return base ? `${base}-${idSuffix(id)}` : idSuffix(id)
}

/** True when `slug` ends with this post's id fragment (title part may be outdated). */
export const slugMatchesId = (slug: string, id: string) =>
  slug.toLowerCase().endsWith(idSuffix(id))
