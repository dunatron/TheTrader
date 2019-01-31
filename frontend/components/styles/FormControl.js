import styled from "styled-components"
import FormControl from "@material-ui/core/FormControl"

const FormControlStyle = styled(FormControl)`
  && {
    margin: ${p => p.theme.spacing.unit}px;
    margin-top: ${p => p.theme.form.fields.marginTop};
    min-width: ${p => p.theme.form.fields.minWidth};
    max-width: ${p => p.theme.form.fields.maxWidth};
    font-size: ${p => p.theme.form.fields.fontSize};
  }
`

export default FormControlStyle
