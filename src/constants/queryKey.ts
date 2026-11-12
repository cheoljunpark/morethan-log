export const queryKey = {
  scheme: () => ["scheme"],
  posts: () => ["posts"],
  post: (slug: string) => ["post", slug],
}
