import styled, { keyframes } from "styled-components"

const loading = keyframes`
  from {
    background-position: 0 0;
    /* rotate: 0; */
  }

  to {
    background-position: 100% 100%;
    /* rotate: 360deg; */
  }
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  max-width: ${p => (p.maxWidth ? `${p.maxWidth}px` : "none")};
`

export default Form
