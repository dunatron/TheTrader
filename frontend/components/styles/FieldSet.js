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

const FieldSet = styled.fieldset`
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  max-width: ${p => (p.maxWidth ? `${p.maxWidth}px` : "none")};
  border: 0;
  padding: 0;

  &[disabled] {
    opacity: 0.5;
  }
  &::before {
    height: 10px;
    content: "";
    display: block;
    /* background-image: linear-gradient(
      to right,
      #ff3019 0%,
      #e2b04a 50%,
      #ff3019 100%
    ); */
    background-image: ${p => `linear-gradient(
      to right,
      ${p.theme.palette.primary.light} 0%,
      ${p.theme.palette.primary.dark} 50%,
      ${p.theme.palette.primary.light} 100%
    );`};
  }
  &[aria-busy="true"]::before {
    background-size: 50% auto;
    animation: ${loading} 0.5s linear infinite;
  }
`

export default FieldSet
