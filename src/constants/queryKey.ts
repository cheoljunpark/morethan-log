export const queryKey = {
  scheme: () => ["scheme"],
  posts: () => ["posts"],
  tags: () => ["tags"],
  categories: () => ["categories"],
  utterancesComments: () => ["utterances-comments"],
  post: (slug: string) => ["post", slug],
}
