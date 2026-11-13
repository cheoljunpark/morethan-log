import { storageKey } from "src/constants/storage"

// Remembers where the reader was in the feed so useFeedScrollRestoration can
// bring them back after visiting a post.

const session = () =>
  typeof window === "undefined" ? null : window.sessionStorage

/** Save the current scroll position, anchored to a post when one is given. */
export const saveFeedPosition = (postId?: string) => {
  const storage = session()
  if (!storage) return

  storage.setItem(storageKey.feedScrollY, String(window.scrollY))
  if (postId) storage.setItem(storageKey.feedActivePostId, postId)
  else storage.removeItem(storageKey.feedActivePostId)
}

/** Forget the saved position, e.g. when the feed filter changes. */
export const clearFeedPosition = () => {
  const storage = session()
  if (!storage) return

  storage.removeItem(storageKey.feedScrollY)
  storage.removeItem(storageKey.feedActivePostId)
}
