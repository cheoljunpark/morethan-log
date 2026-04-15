# Blog Upgrade Roadmap

## Goal

Turn this Notion-powered blog into a more polished personal publishing platform with:

- better reading experience
- better discoverability
- better 운영 편의성
- safer Notion integration

## Recently Added

- Notion response normalization for newer API shapes
- safer post collection parsing and fallback handling
- detail page reading time
- previous / next post navigation
- feed scroll restoration after returning from a post
- feed search and filters persisted in URL

## Next Best Upgrades

These now have the best payoff for this repo.

### A. Share and Metadata

- Add copy link / share button on post detail
- Add canonical URL and article keywords
- Add structured data for posts

Why:

- Makes posts easier to share
- Improves search understanding of the page
- Pairs well with the new detail-page upgrades

## 1. High Priority

These are the best next upgrades because they improve user experience quickly.

### 1. Improve Post Detail UX

- Add previous / next post navigation
- Add estimated reading time
- Add copy link button
- Add heading anchor copy
- Add better mobile typography spacing

Why:

- Readers stay longer
- Long posts become easier to scan
- Sharing gets easier

### 2. Strengthen SEO / Social Preview

- Improve dynamic OG image generation
- Add article keywords from tags/category
- Add structured data for blog posts
- Improve canonical URL handling
- Add RSS feed page if not already exposed cleanly

Why:

- Better search indexing
- Better link previews on social and messengers

### 3. Safer Notion Data Layer

- Normalize all Notion response shapes in one place
- Add fallback handling for missing icon, cover, author, date
- Add small cache/retry utilities around Notion calls
- Add logging around failed page parsing

Why:

- This project already hit Notion response compatibility issues
- Centralizing this will make future debugging much easier

## 2. Medium Priority

### 4. Better Feed Experience

- Add featured posts section
- Add pinned posts support from a Notion property
- Add sort by latest / popular / updated
- Add better empty states for search and category filters

### 5. Content Metadata Expansion

Recommended extra Notion properties:

- `series`
- `pinned`
- `draftNote`
- `hideFromHome`
- `hideFromSitemap`
- `updatedAt`

Why:

- Gives more control without changing publishing flow

### 6. About / Resume Expansion

- Turn `/about` into a stronger profile page
- Add career timeline
- Add project highlights
- Add speaking / writing / contact section

Why:

- Makes the blog stronger as a portfolio

## 3. Nice to Have

### 7. Analytics Dashboard

- Add page view analytics
- Track top posts
- Track search keywords used on site
- Track outbound link clicks

### 8. Newsletter / Subscription

- Add simple email subscribe CTA
- Add RSS subscribe UI
- Add follow buttons near post footer

### 9. Performance Work

- Reduce page data size for large posts
- Lazy-load more third-party blocks
- Reduce duplicated feed data in detail page hydration
- Optimize image handling for Notion-hosted assets

## Suggested Execution Order

1. Stabilize data layer
2. Improve post detail page
3. Improve SEO and metadata
4. Expand feed and filtering
5. Add analytics

## Recommended File-Based Planning Style

Yes, keeping this in Markdown is a good idea.

Recommended docs:

- `BLOG_UPGRADE_ROADMAP.md`
- `CHANGELOG.md`
- `CONTENT_MODEL.md`
- `TODO.md`

Suggested purpose:

- `BLOG_UPGRADE_ROADMAP.md`: bigger direction and priorities
- `CHANGELOG.md`: what changed over time
- `CONTENT_MODEL.md`: Notion property schema and publishing rules
- `TODO.md`: short actionable next tasks

## Concrete Next Tasks

If we continue from here, the best next implementation candidates are:

1. Add `copy link / share` on post detail
2. Add `structured data` for posts
3. Add `pinned` property support from Notion
4. Add `series` support
5. Add stronger SEO meta and canonical handling

## Notes For This Repo

- This repo is no longer just "theme setup"; it now needs a compatibility layer for changing Notion responses
- Keep Notion parsing logic isolated in `src/apis/notion-client`
- Prefer adding small defensive helpers over spreading null checks everywhere
- For future upgrades, test both home and detail pages against real Notion data before deploy
