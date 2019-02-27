import styled from "styled-components"
import TextField from "@material-ui/core/TextField"

const TextInput = styled(TextField)`
  && {
    margin: ${p => p.theme.spacing.unit}px;
    margin-top: ${p => p.theme.form.fields.marginTop};
    /* font-size: ${p => p.theme.form.fields.fontSize}; */
    min-width: ${p => p.theme.form.fields.minWidth};
    max-width: ${p => p.theme.form.fields.maxWidth};
  }
`

export default TextInput
