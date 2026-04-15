import styled from "@emotion/styled"
import Link from "next/link"
import { useRouter } from "next/router"
import React from "react"
import useAdjacentPosts from "src/hooks/useAdjacentPosts"

type Props = {}

const Footer: React.FC<Props> = () => {
  const router = useRouter()
  const { previousPost, nextPost } = useAdjacentPosts()

  const handleBack = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back()
      return
    }

    router.push("/")
  }

  return (
    <StyledWrapper>
      <div className="actions">
        <a onClick={handleBack}>Back</a>
        <a onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
          Top
        </a>
      </div>
      <div className="adjacent">
        {previousPost && (
          <Link href={`/${previousPost.slug}`} className="card prev">
            <div className="label">Previous</div>
            <div className="title">{previousPost.title}</div>
          </Link>
        )}
        {nextPost && (
          <Link href={`/${nextPost.slug}`} className="card next">
            <div className="label">Next</div>
            <div className="title">{nextPost.title}</div>
          </Link>
        )}
      </div>
    </StyledWrapper>
  )
}

export default Footer

const StyledWrapper = styled.div`
  margin-top: 2rem;

  .actions {
    display: flex;
    justify-content: space-between;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.gray10};

    a {
      margin-top: 0.5rem;
      cursor: pointer;

      :hover {
        color: ${({ theme }) => theme.colors.gray12};
      }
    }
  }

  .adjacent {
    display: grid;
    gap: 0.75rem;
    margin-top: 1.5rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  .card {
    display: block;
    padding: 1rem;
    border-radius: 1rem;
    background-color: ${({ theme }) => theme.colors.gray3};

    &:hover {
      background-color: ${({ theme }) => theme.colors.gray4};
    }
  }

  .label {
    margin-bottom: 0.4rem;
    font-size: 0.75rem;
    line-height: 1rem;
    color: ${({ theme }) => theme.colors.gray10};
    text-transform: uppercase;
    letter-spacing: 0.04em;
  }

  .title {
    line-height: 1.6;
    font-weight: 600;
  }
`
