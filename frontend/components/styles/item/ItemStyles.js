import styled from "styled-components"

const Item = styled.div`
  background: white;
  border: 1px solid ${props => props.theme.offWhite};
  box-shadow: ${props => props.theme.bs};
  position: relative;
  display: flex;
  flex-direction: column;
  @media (max-width: ${props => props.theme.breakpoints.values.md}px) {
    margin: 60px 0 0 0;
  }
  img {
    width: 100%;
    height: 400px;
    object-fit: cover;
  }
  p {
    /* font-size: 12px; */
    line-height: 2;
    font-weight: 300;
    flex-grow: 1;
    padding: 0 3rem;
    /* font-size: 1.5rem; */
    padding: 0 1rem;
    font-size: 1rem;
  }
  .buttonList {
    display: grid;
    width: 100%;
    border-top: 1px solid ${props => props.theme.lightgrey};
    grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
    grid-gap: 1px;
    background: ${props => props.theme.lightgrey};
    & > * {
      background: white;
      border: 0;
      font-size: 0.8rem;
      padding: 0.5rem;
    }
  }
`

export default Item
