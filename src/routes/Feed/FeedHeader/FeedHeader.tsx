import React from "react"
import OrderButtons from "./OrderButtons"
import styled from "@emotion/styled"

type Props = {}

const FeedHeader: React.FC<Props> = () => {
  return (
    <StyledWrapper>
      <OrderButtons />
    </StyledWrapper>
  )
}

export default FeedHeader

const StyledWrapper = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
`
