import styled from "styled-components"
import Card from "@material-ui/core/Card"

const CardStyle = styled(Card)`
  max-width: ${p => (p.theme.maxWidth ? `${p.theme.maxWidth}px` : "none")};
`

export default CardStyle
