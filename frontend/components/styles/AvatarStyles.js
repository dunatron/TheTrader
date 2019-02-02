import styled from "styled-components"
import Avatar from "@material-ui/core/Avatar"

const AvatarStyles = styled(Avatar)`
  && {
    /* margin: 10px; */
    margin: 0;
    color: #fff;
    background-color: ${p => p.theme.palette.primary.main};
  }
`

export default AvatarStyles
