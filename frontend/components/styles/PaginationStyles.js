import styled from "styled-components"

const PaginationStyles = styled.div`
  text-align: center;

  margin: 2rem 0;
  border: 1px solid ${props => props.theme.lightgrey};
  border-radius: 10px;
  & > * {
    margin: 0;
    padding: 15px 30px;
    border-right: 1px solid ${props => props.theme.lightgrey};
    &:last-child {
      border-right: 0;
    }
  }
  a[aria-disabled="true"] {
    color: grey;
    pointer-events: none;
  }
  @media (min-width: ${props => props.theme.breakpoints.values.md}px) {
    /* margin: 60px 0 0 0; */
    display: inline-grid;
    grid-template-columns: repeat(4, auto);
    align-items: stretch;
    justify-content: center;
    align-content: center;
  }
`

export default PaginationStyles
