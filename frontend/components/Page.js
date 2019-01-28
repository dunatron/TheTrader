import React, { Component } from "react"
import styled, { ThemeProvider, injectGlobal } from "styled-components"
import Header from "./Header"
import Meta from "./Meta"
// Material UI
import NoSsr from "@material-ui/core/NoSsr"
import { createMuiTheme } from "@material-ui/core/styles"
import muiTheme from "./styles/_muiTheme"

const theme = createMuiTheme(muiTheme)

const StyledPage = styled.div`
  background: white;
  color: ${props => props.theme.black};
`

const Inner = styled.div`
  max-width: ${props => props.theme.maxWidth}px;
  margin: 0 auto;
  padding: 2rem;
`

injectGlobal`
  @font-face {
    font-family: ${theme.typography.fontFamily};
    src: url('./static/fonts/Gustan-Light.woff') format('woff'); /* IE9 Compat Modes */
    font-style:   normal;
    font-weight:  200;
  }
  @font-face {
    font-family: "GustanMedium";
    src: url('./static/fonts/Gustan-Medium.woff') format('woff'); /* IE9 Compat Modes */
    font-style:   normal;
    font-weight:  200;
  }
  @font-face {
    font-family: "GustanBold";
    src: url('./static/fonts/Gustan-Bold.woff') format('woff'); /* IE9 Compat Modes */
    font-style:   normal;
    font-weight:  200;
  }
  @font-face {
    font-family: "GustanExtraBlack";
    src: url('./static/fonts/Gustan-Extrablack.woff') format('woff'); /* IE9 Compat Modes */
    font-style:   normal;
    font-weight:  200;
  }
  html {
    box-sizing: border-box;
    font-size: 10px;
  }
  *, *:before, *:after {
    box-sizing: inherit;
  }
  body {
    padding: 0;
    margin: 0;
    font-size: ${theme.typography.fontSize};
    line-height: 2;
    font-family: ${theme.typography.fontFamily};
  }
  a {
    text-decoration: none;
    color: ${theme.palette.common.black};
  }
  button {  font-family: ${theme.typography.fontFamily}; }
  #nprogress {
    .bar {
      height:20px;
      background: ${props => props.theme.palette.secondary.main};
    }
    .spinner-icon {
      border-top-color: #3f51b5;
     border-left-color: #3f51b5;
    }
    .peg {
      box-shadow: 0 0 10px #3f51b5, 0 0 5px #3f51b5;
    }
  }
`

class Page extends Component {
  render() {
    return (
      <NoSsr>
        <ThemeProvider theme={theme}>
          <StyledPage>
            <Meta />
            <Header />
            <Inner>{this.props.children}</Inner>
          </StyledPage>
        </ThemeProvider>
      </NoSsr>
    )
  }
}

export default Page
