# Content Model

## Goal

Keep the Notion database predictable so the blog can publish safely.

## Required Properties

These should exist on every post row.

- `title`: post title shown on feed, detail, and SEO meta
- `slug`: unique URL path segment
- `status`: publishing state
- `type`: content type
- `date`: published date
- `summary`: short feed and SEO description

## Recommended Properties

These are not strictly required, but they make the blog much better.

- `tags`: search, filtering, and keywords
- `menu`: feed grouping and navigation
- `menuIcon`: optional menu icon shown in the left navigation
- `thumbnail`: feed card and social preview image
- `author`: post author metadata
- `updatedAt`: show when a post was last revised
- `prerequisites`: short setup or background knowledge items
- `references`: useful links, docs, or companion resources

## Supported Values

### `status`

- `Public`: visible on feed and detail
- `PublicOnDetail`: hidden from feed, visible by direct link
- `Private`: hidden

### `type`

- `Post`: normal article
- `Paper`: research-style content
- `Page`: standalone static-like page

## Publishing Rules

- `slug` should be unique across all public content
- `summary` should stay short enough for cards and previews
- `thumbnail` should be optional, not required
- `date` should not be in the future unless intentionally scheduled
- posts without `title`, `slug`, `status`, or `type` may be filtered out

## Suggested Workflow

1. Write in Notion
2. Fill in `title`, `slug`, `summary`, `status`, `type`, and `date`
3. Add `tags`, `menu`, and `thumbnail` if available
4. Add `prerequisites` and `references` when the post benefits from setup notes or follow-up links
5. Change `status` to `Public`
6. Verify the detail page and feed after deploy

## Notes

- This repo relies on Notion response parsing, so schema consistency matters
- If something disappears from the feed, check `status`, `type`, and `slug` first
- If a detail page fails, check whether the Notion page is still public
- `prerequisites` and `references` are optional and only affect the detail summary card
