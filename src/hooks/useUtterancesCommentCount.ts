import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { queryKey } from "src/constants/queryKey"

type CommentCounts = Record<string, number>

type CommentCountsResponse = {
  counts: CommentCounts
}

const fetchUtterancesCommentCounts = async (): Promise<CommentCounts> => {
  const response = await fetch("/api/comment-counts")

  if (!response.ok) {
    return {}
  }

  const data = (await response.json()) as CommentCountsResponse

  return data.counts ?? {}
}

const useUtterancesCommentCount = (title: string) => {
  const { data } = useQuery({
    queryKey: queryKey.utterancesComments(),
    queryFn: fetchUtterancesCommentCounts,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    refetchOnWindowFocus: false,
  })

  return useMemo(() => {
    if (!data) {
      return undefined
    }

    return data[title] ?? 0
  }, [data, title])
}

export default useUtterancesCommentCount
