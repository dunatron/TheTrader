// Read the documentation. I will document it well
import App, { Container } from "next/app"
import Page from "../components/Page"

// App entry point where Component is the current Next.js Page we are on
class AppEntryPointExtension extends App {
  render() {
    const { Component } = this.props

    return (
      <Container>
        <Page>
          <Component />
        </Page>
      </Container>
    )
  }
}

export default AppEntryPointExtension
