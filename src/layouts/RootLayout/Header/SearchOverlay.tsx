import styled from "@emotion/styled"
import { useRouter } from "next/router"
import { FormEvent, useEffect, useRef, useState } from "react"
import { createPortal } from "react-dom"
import { FiSearch } from "react-icons/fi"
import { useUiLanguage } from "src/contexts/UiLanguageContext"
import { zIndexes } from "src/styles/zIndexes"

type Props = {
  open: boolean
  onClose: () => void
}

// Full-screen search. Rendered into <body> because the header uses
// backdrop-filter, which would otherwise trap position: fixed children.
const SearchOverlay: React.FC<Props> = ({ open, onClose }) => {
  const router = useRouter()
  const { language } = useUiLanguage()
  const ko = language === "ko"
  const inputRef = useRef<HTMLInputElement>(null)
  const [value, setValue] = useState("")

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

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const q = value.trim()
    onClose()
    void router.push(q ? { pathname: "/", query: { q } } : "/")
  }

  if (!open || typeof document === "undefined") return null

  return createPortal(
    <StyledWrapper role="dialog" aria-modal="true" aria-label={ko ? "검색" : "Search"}>
      <form onSubmit={handleSubmit}>
        <div className="field">
          <input
            ref={inputRef}
            type="search"
            value={value}
            onChange={(event) => setValue(event.target.value)}
            placeholder={ko ? "검색어를 입력해주세요." : "Search posts"}
            aria-label={ko ? "검색어" : "Search query"}
          />
          <button type="submit" className="submit" aria-label={ko ? "검색" : "Search"}>
            <FiSearch aria-hidden="true" />
          </button>
        </div>
        <button type="button" className="back" onClick={onClose}>
          {ko ? "돌아가기" : "Go back"}
        </button>
      </form>
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
  align-items: center;
  justify-content: center;
  padding: 0 24px;
  background: ${({ theme }) =>
    theme.scheme === "light" ? "rgba(245, 245, 247, 0.94)" : "rgba(22, 22, 23, 0.96)"};
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  animation: search-fade 160ms ease-out;

  @keyframes search-fade {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;
    width: min(100%, 440px);
  }

  .field {
    display: flex;
    align-items: center;
    width: 100%;
    border-bottom: 2px solid ${({ theme }) => theme.colors.gray12};
  }

  input {
    flex: 1;
    min-width: 0;
    padding: 10px 0;
    font-size: 26px;
    letter-spacing: -0.02em;
    color: ${({ theme }) => theme.colors.gray12};

    &::placeholder {
      color: ${({ theme }) => theme.colors.gray9};
    }

    &::-webkit-search-cancel-button {
      display: none;
    }

    @media (max-width: 734px) {
      font-size: 21px;
    }
  }

  .submit {
    display: inline-flex;
    padding: 8px;
    color: ${({ theme }) => theme.colors.gray12};
    cursor: pointer;

    svg {
      width: 24px;
      height: 24px;
      stroke-width: 2.5;
    }

    &:active {
      transform: scale(0.95);
    }
  }

  .back {
    font-size: 15px;
    color: ${({ theme }) => theme.colors.gray12};
    text-decoration: underline;
    text-underline-offset: 0.25em;
    cursor: pointer;

    &:hover {
      color: ${({ theme }) => theme.colors.indigo9};
    }
  }
`
