import { TPost } from "src/types"
import { CONFIG } from "site.config"
import dynamic from "next/dynamic"
import styled from "@emotion/styled"

const UtterancesComponent = dynamic(
  () => {
    return import("./Utterances")
  },
  { ssr: false }
)
const CusdisComponent = dynamic(
  () => {
    return import("./Cusdis")
  },
  { ssr: false }
)

type Props = {
  data: TPost
}

const CommentBox: React.FC<Props> = ({ data }) => {
  return (
    <StyledWrapper>
      {CONFIG.utterances.enable && <UtterancesComponent issueTerm={data.id} />}
      {CONFIG.cusdis.enable && (
        <CusdisComponent id={data.id} slug={data.slug} title={data.title} />
      )}
    </StyledWrapper>
  )
}

export default CommentBox

const StyledWrapper = styled.div`
  margin-top: 2rem;
  width: 100%;
`
