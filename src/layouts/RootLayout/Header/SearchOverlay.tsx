import styled from "@emotion/styled"
import Link from "next/link"
import { useRouter } from "next/router"
import { FormEvent, useEffect, useMemo, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { FiSearch, FiX } from "react-icons/fi"
import usePostsQuery from "src/hooks/usePostsQuery"
import { formatIndexDate, getPostDate } from "src/libs/utils"
import { filterFeedPosts } from "src/routes/Feed/PostList/filterFeedPosts"
import { zIndexes } from "src/styles/zIndexes"

type Props = {
  open: boolean
  onClose: () => void
}

const MAX_RESULTS = 8

// Full-screen search with results as you type. Rendered into <body> because
// the header uses backdrop-filter, which would otherwise trap fixed children.
const SearchOverlay: React.FC<Props> = ({ open, onClose }) => {
  const router = useRouter()
  const posts = usePostsQuery()
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState("")
  const q = value.trim()

  const results = useMemo(
    () => (q ? filterFeedPosts(posts, { q }) : []),
    [posts, q]
  )

  useEffect(() => {
    if (!open) return

    setValue(typeof router.query.q === "string" ? router.query.q : "")
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 30)

    document.body.style.overflow = "hidden"

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", handleKeyDown)

    return () => {
      window.clearTimeout(focusTimer)
      // Always unlock: restoring a saved value can re-lock if two opens overlap.
      document.body.style.overflow = ""
      window.removeEventListener("keydown", handleKeyDown)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // Enter shows every match on the home feed.
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    onClose()
    void router.push(q ? { pathname: "/", query: { q } } : "/")
  }

  if (!open || typeof document === "undefined") return null

  return createPortal(
    <StyledWrapper role="dialog" aria-modal="true" aria-label="검색">
      <div className="panel">
        <form onSubmit={handleSubmit} className="field">
          <FiSearch className="icon" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder="글 제목, 내용, 태그로 검색"
            aria-label="검색어"
            autoComplete="off"
          />
          <button
            type="button"
            className="close"
            onClick={onClose}
            aria-label="검색 닫기"
          >
            <FiX aria-hidden="true" />
          </button>
        </form>

        {q && (
          <div className="results" aria-live="polite">
            {results.length === 0 ? (
              <p className="empty">‘{q}’에 맞는 글이 없어요.</p>
            ) : (
              <>
                <ul>
                  {results.slice(0, MAX_RESULTS).map((post) => (
                    <li key={post.id}>
                      <Link href={`/${post.slug}`} onClick={onClose}>
                        <span className="title">{post.title}</span>
                        <span className="meta">
                          {formatIndexDate(getPostDate(post))}
                          {post.menu?.[0] && ` · ${post.menu[0]}`}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
                {results.length > MAX_RESULTS && (
                  <button type="button" className="all" onClick={handleSubmit}>
                    검색 결과 {results.length}개 모두 보기
                  </button>
                )}
              </>
            )}
          </div>
        )}
      </div>
      {/* Clicking the dimmed area closes the search. */}
      <div className="scrim" onClick={onClose} aria-hidden="true" />
    </StyledWrapper>,
    document.body
  )
}

export default SearchOverlay

const StyledWrapper = styled.div`
  position: fixed;
  inset: 0;
  z-index: ${zIndexes.header + 10};
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 12vh 16px 16px;
  animation: search-fade 160ms ease-out;

  @keyframes search-fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @media (max-width: 734px) {
    padding-top: 12px;
  }

  .scrim {
    position: absolute;
    inset: 0;
    z-index: 0;
    background: rgba(0, 0, 0, 0.55);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
  }

  .panel {
    position: relative;
    z-index: 1;
    width: min(100%, 600px);
    max-height: 76vh;
    overflow: hidden auto;
    border-radius: 16px;
    background: ${({ theme }) => theme.colors.gray1};
    box-shadow: 0 24px 64px rgba(0, 0, 0, 0.3);
  }

  .field {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 0 8px 0 18px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray6};

    .icon {
      flex-shrink: 0;
      width: 20px;
      height: 20px;
      color: ${({ theme }) => theme.colors.gray9};
    }
  }

  input {
    flex: 1;
    min-width: 0;
    padding: 18px 0;
    outline: none;
    font-size: 18px;
    color: ${({ theme }) => theme.colors.gray12};

    &::placeholder {
      color: ${({ theme }) => theme.colors.gray9};
    }

    &::-webkit-search-cancel-button {
      display: none;
    }
  }

  .close {
    display: inline-flex;
    justify-content: center;
    align-items: center;
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    border-radius: 10px;
    color: ${({ theme }) => theme.colors.gray10};
    cursor: pointer;

    svg {
      width: 20px;
      height: 20px;
    }

    &:hover {
      background: ${({ theme }) => theme.colors.gray4};
      color: ${({ theme }) => theme.colors.gray12};
    }
  }

  .results {
    padding: 8px;
  }

  ul {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  li a {
    display: grid;
    gap: 2px;
    padding: 12px 12px;
    border-radius: 10px;

    &:hover,
    &:focus-visible {
      background: ${({ theme }) => theme.colors.gray4};
    }
  }

  .title {
    font-size: 16px;
    font-weight: 600;
    line-height: 1.4;
    color: ${({ theme }) => theme.colors.gray12};
  }

  .meta {
    font-size: 13px;
    color: ${({ theme }) => theme.colors.gray9};
  }

  .empty {
    margin: 0;
    padding: 20px 12px;
    font-size: 15px;
    color: ${({ theme }) => theme.colors.gray10};
  }

  .all {
    width: 100%;
    margin-top: 4px;
    padding: 12px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.indigo9};
    cursor: pointer;

    &:hover {
      background: ${({ theme }) => theme.colors.gray4};
    }
  }
`
