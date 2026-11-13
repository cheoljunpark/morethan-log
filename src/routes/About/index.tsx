import styled from "@emotion/styled"
import { CONFIG } from "site.config"
import { useUiLanguage } from "src/contexts/UiLanguageContext"

const About: React.FC = () => {
  const { language } = useUiLanguage()

  const intro = {
    eyebrow: language === "ko" ? "소개" : "About",
    title: CONFIG.profile.name,
    role: CONFIG.profile.role,
    lead:
      language === "ko"
        ? "구현 과정과 문제 해결을 오래 남는 기록으로 바꾸는 개발 블로그입니다."
        : "A development blog that turns implementation and problem solving into lasting notes.",
    body:
      language === "ko"
        ? "cheoljun.dev는 제품을 만들면서 마주친 문제, 직접 구현한 과정, 그리고 다시 찾아볼 가치가 있는 배운 점들을 정리하는 공간입니다. 단순히 결과만 적기보다 왜 그렇게 풀었는지, 어떤 선택지를 비교했고 무엇을 기준으로 결정했는지까지 함께 남기려고 합니다."
        : "cheoljun.dev is where I document implementation notes, troubleshooting stories, and ideas worth revisiting while building products.",
  }

  const extraParagraphs =
    language === "ko"
      ? [
          "주로 프론트엔드와 백엔드를 함께 다루며, 실제로 서비스가 동작하는 과정에서 생기는 문제들을 기록합니다. 에러를 해결한 과정, 구현을 정리한 메모, 나중에 다시 읽었을 때 바로 도움이 되는 기술 글을 남기는 데 관심이 있습니다.",
          "이 블로그의 글들은 단순한 요약보다 실제 맥락을 중요하게 생각합니다. 어떤 문제가 있었는지, 왜 그 방식으로 풀었는지, 비슷한 상황에서 무엇을 먼저 확인해야 하는지를 함께 적어두면 시간이 지나도 훨씬 유용하다고 느끼기 때문입니다.",
          "결국 이 공간은 결과만 보여주는 포트폴리오보다는, 만들어 가는 과정과 판단의 흔적을 차분하게 정리해두는 작업 노트에 더 가깝습니다. 비슷한 문제를 만난 사람에게도 도움이 되고, 미래의 저에게도 다시 참고할 수 있는 기록이 되었으면 합니다.",
        ]
      : [
          "I mostly work across frontend and backend, and I use this blog to document the problems that appear while real products are being built and maintained.",
          "Instead of writing only conclusions, I try to preserve the context behind each decision: what broke, what I compared, and what actually worked in practice.",
          "In that sense, this space is closer to a long-term working notebook than a polished portfolio. I want it to stay useful both for future readers and for myself.",
        ]

  const focusItems =
    language === "ko"
      ? [
          "프론트엔드와 백엔드를 넘나들며 제품을 완성하는 과정",
          "실제 구현 중에 부딪힌 트러블슈팅과 정리 메모",
          "다시 읽기 쉬운 구조로 남기는 기술 글쓰기",
          "작은 구현 선택이 실제 서비스에 어떤 차이를 만드는지에 대한 기록",
        ]
      : [
          "Shipping products across frontend and backend",
          "Troubleshooting notes from real implementation work",
          "Technical writing structured to be easy to revisit",
          "Notes about how small implementation choices affect real products",
        ]

  const styleItems =
    language === "ko"
      ? [
          "큰 리팩터링보다 작은 변화로 안정적으로 개선하는 편입니다.",
          "화려한 답보다 실제 서비스에서 오래 버티는 구현을 선호합니다.",
          "기술을 설명할 때는 맥락과 이유를 함께 남기려고 합니다.",
        ]
      : [
          "I prefer stable improvements through small changes over broad refactors.",
          "I usually value production-safe solutions over flashy answers.",
          "When I explain technology, I try to keep the context and the why together.",
        ]

  const focusTitle =
    language === "ko" ? "이 블로그에서 다루는 것" : "What I write about"
  const styleTitle = language === "ko" ? "작업 방식" : "How I work"
  return (
    <StyledWrapper>
      <section className="hero">
        <div className="hero-copy">
          <div className="eyebrow">{intro.eyebrow}</div>
          <h1>{intro.title}</h1>
          <div className="role">{intro.role}</div>
          <p className="lead">{intro.lead}</p>
          <p className="body">{intro.body}</p>
          <div className="long-copy">
            {extraParagraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      <section className="content-grid">
        <article className="panel large">
          <div className="section-title">{focusTitle}</div>
          <ul className="bullet-list">
            {focusItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="panel large muted">
          <div className="section-title">{styleTitle}</div>
          <ul className="bullet-list">
            {styleItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>
      </section>
    </StyledWrapper>
  )
}

export default About

const StyledWrapper = styled.div`
  max-width: 46rem;
  margin: 0 auto;
  padding: 3rem 0 5rem;

  @media (max-width: 1023px) {
    padding: 1.75rem 0 3rem;
  }

  .eyebrow,
  .section-title {
    font-size: 0.72rem;
    letter-spacing: -0.01em;
    color: ${({ theme }) => theme.colors.indigo9};
  }

  .hero-copy {
    display: grid;
    gap: 0.9rem;

    h1 {
      font-size: clamp(2.4rem, 6vw, 4rem);
      line-height: 1.05;
      font-weight: 600;
      letter-spacing: -0.05em;
    }
  }

  .role {
    font-size: 0.85rem;
    color: ${({ theme }) => theme.colors.gray9};
  }

  .lead {
    margin: 1.5rem 0 0;
    padding-top: 1.5rem;
    border-top: 1px solid ${({ theme }) => theme.colors.gray6};
    font-size: 1.4rem;
    line-height: 1.5;
    font-weight: 600;
    letter-spacing: -0.03em;
  }

  .body,
  .long-copy p {
    margin: 0;
    font-size: 1.02rem;
    line-height: 1.85;
    color: ${({ theme }) => theme.colors.gray11};
  }

  .long-copy {
    display: grid;
    gap: 1rem;
  }

  .content-grid {
    display: grid;
    gap: 2.5rem;
    margin-top: 3.5rem;

    @media (min-width: 768px) {
      grid-template-columns: repeat(2, minmax(0, 1fr));
    }
  }

  .panel .section-title {
    padding-bottom: 0.6rem;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray6};
    color: ${({ theme }) => theme.colors.gray12};
  }

  .bullet-list {
    margin: 0;
    padding: 0;
    list-style: none;
    counter-reset: item;
  }

  .bullet-list li {
    display: grid;
    grid-template-columns: 2rem minmax(0, 1fr);
    padding: 0.8rem 0;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray6};
    font-size: 0.95rem;
    line-height: 1.6;
    counter-increment: item;

    &::before {
      content: counter(item, decimal-leading-zero);
      font-size: 0.72rem;
      line-height: 1.6rem;
      color: ${({ theme }) => theme.colors.gray9};
    }
  }
`
