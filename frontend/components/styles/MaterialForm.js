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
  fieldset {
    border: 0;
    padding: 0;

    &[disabled] {
      opacity: 0.5;
    }
    &::before {
      height: 10px;
      content: "";
      display: block;
      background-image: ${props => `linear-gradient(
        to right,
        ${props.theme.palette.secondary.light} 0%,
        ${props.theme.palette.secondary.main} 50%,
        ${props.theme.palette.secondary.light} 100%
      )`};
    }
    &[aria-busy="true"]::before {
      background-size: 50% auto;
      animation: ${loading} 0.5s linear infinite;
    }
  }
`

export default Form