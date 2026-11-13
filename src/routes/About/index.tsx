import styled from "@emotion/styled"
import { ExtendedRecordMap } from "notion-types"
import { CONFIG } from "site.config"
import { useUiLanguage } from "src/contexts/UiLanguageContext"
import NotionRenderer from "src/routes/Detail/components/NotionRenderer"

type Props = {
  title: string | null
  recordMap: ExtendedRecordMap | null
}

/** About page: the Notion row set as `aboutPageId` in site.config. */
const About: React.FC<Props> = ({ title, recordMap }) => {
  const ko = useUiLanguage().language === "ko"

  return (
    <StyledWrapper>
      <h1>{title || (ko ? "소개" : "About")}</h1>
      {recordMap ? (
        <div id="post-content">
          <NotionRenderer recordMap={recordMap} />
        </div>
      ) : (
        <p className="empty">
          {CONFIG.profile.name} · {CONFIG.profile.role}
        </p>
      )}
    </StyledWrapper>
  )
}

export default About

const StyledWrapper = styled.div`
  width: 100%;
  max-width: 760px;
  margin: 0 auto;
  padding: 56px 0 80px;

  h1 {
    margin-bottom: 32px;
    font-family: var(--font-display);
    font-size: clamp(32px, 4vw, 40px);
    line-height: 1.1;
    font-weight: 600;
    letter-spacing: -0.03em;
  }

  .empty {
    color: ${({ theme }) => theme.colors.gray10};
  }
`
