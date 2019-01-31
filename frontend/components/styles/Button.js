import styled from "styled-components"
import Button from "@material-ui/core/Button"

const MuiButton = styled(Button)`
  && {
    margin: ${p => p.theme.spacing.unit}px;
    margin-top: ${p => p.theme.form.fields.marginTop};
  }
`

export default MuiButton
