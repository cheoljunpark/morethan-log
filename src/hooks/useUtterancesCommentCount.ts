import { useMemo } from "react"
import { useQuery } from "@tanstack/react-query"
import { CONFIG } from "site.config"
import { queryKey } from "src/constants/queryKey"

type GitHubIssue = {
  title: string
  comments: number
  pull_request?: unknown
}

type CommentCounts = Record<string, number>

const getUtterancesRepo = () => {
  const repo = CONFIG.utterances.config.repo

  if (!repo || !repo.includes("/")) {
    return null
  }

  return repo
}

const fetchUtterancesCommentCounts = async (): Promise<CommentCounts> => {
  const repo = getUtterancesRepo()

  if (!repo || !CONFIG.utterances.enable) {
    return {}
  }

  const counts: CommentCounts = {}
  let page = 1

  while (page <= 5) {
    const response = await fetch(
      `https://api.github.com/repos/${repo}/issues?state=open&per_page=100&page=${page}`
    )

    if (!response.ok) {
      return counts
    }

    const issues = (await response.json()) as GitHubIssue[]

    issues.forEach((issue) => {
      if (issue.pull_request) {
        return
      }

      counts[issue.title] = issue.comments
    })

    if (issues.length < 100) {
      break
    }

    page += 1
  }

  return counts
}

const useUtterancesCommentCount = (title: string) => {
  const { data } = useQuery({
    queryKey: queryKey.utterancesComments(),
    queryFn: fetchUtterancesCommentCounts,
    staleTime: 1000 * 60 * 5,
    cacheTime: 1000 * 60 * 30,
    enabled: CONFIG.utterances.enable,
  })

  return useMemo(() => {
    if (!data) {
      return undefined
    }

    return data[title] ?? 0
  }, [data, title])
}

export default useUtterancesCommentCount
