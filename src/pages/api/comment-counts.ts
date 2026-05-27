import { NextApiRequest, NextApiResponse } from "next"
import { CONFIG } from "site.config"

type GitHubIssue = {
  title: string
  comments: number
  pull_request?: unknown
}

type CommentCountsResponse = {
  counts: Record<string, number>
}

const MAX_PAGES = 5

const getUtterancesRepo = () => {
  const repo = CONFIG.utterances.config.repo

  if (!repo || !repo.includes("/")) {
    return null
  }

  return repo
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CommentCountsResponse>
) {
  res.setHeader("Cache-Control", "s-maxage=300, stale-while-revalidate=1800")

  const repo = getUtterancesRepo()

  if (!CONFIG.utterances.enable || !repo) {
    return res.status(200).json({ counts: {} })
  }

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "morethan-log",
  }

  if (process.env.GITHUB_TOKEN) {
    headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`
  }

  const counts: Record<string, number> = {}

  for (let page = 1; page <= MAX_PAGES; page += 1) {
    const response = await fetch(
      `https://api.github.com/repos/${repo}/issues?state=open&per_page=100&page=${page}`,
      { headers }
    )

    if (!response.ok) {
      break
    }

    const issues = (await response.json()) as GitHubIssue[]

    issues.forEach((issue) => {
      if (!issue.pull_request) {
        counts[issue.title] = issue.comments
      }
    })

    if (issues.length < 100) {
      break
    }
  }

  return res.status(200).json({ counts })
}
