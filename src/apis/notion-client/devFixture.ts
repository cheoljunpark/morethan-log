// Dev-only: when NOTION_FIXTURE_DIR is set (never in production), read
// posts.json / recordmap.json from that folder instead of calling Notion.
import fs from "fs"
import path from "path"

export const readDevFixture = (name: string): any | null => {
  const dir = process.env.NOTION_FIXTURE_DIR
  if (!dir || process.env.NODE_ENV === "production") return null
  return JSON.parse(fs.readFileSync(path.join(dir, name), "utf8"))
}
