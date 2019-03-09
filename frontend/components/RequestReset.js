import React, { Component } from "react"
import { Mutation } from "react-apollo"
import gql from "graphql-tag"
import Form from "./styles/Form"
import Error from "./ErrorMessage"
import FabButton from "./styles/FabButton"
import NavigationIcon from "@material-ui/icons/Navigation"

const REQUEST_RESET_MUTATION = gql`
  mutation REQUEST_RESET_MUTATION($email: String!) {
    requestReset(email: $email) {
      message
    }
  }
`

class RequestReset extends Component {
  state = {
    email: "",
  }
  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value })
  }
  render() {
    return (
      <Mutation mutation={REQUEST_RESET_MUTATION} variables={this.state}>
        {(reset, { error, loading, called }) => (
          <Form
            method="post"
            data-test="form"
            onSubmit={async e => {
              e.preventDefault()
              await reset()
              this.setState({ email: "" })
            }}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Request a password reset</h2>
              <Error error={error} />
              {!error && !loading && called && (
                <p>Success! Check your email for a reset link!</p>
              )}
              <label htmlFor="email">
                Email
                <input
                  type="email"
                  name="email"
                  placeholder="email"
                  value={this.state.email}
                  onChange={this.saveToState}
                />
              </label>

              <FabButton
                type="submit"
                variant="extended"
                color="primary"
                aria-label="Add"
                style={{ minWidth: 160 }}>
                <NavigationIcon style={{ marginRight: 5 }} />
                Request Reset
              </FabButton>
            </fieldset>
          </Form>
        )}
      </Mutation>
    )
  }
}

export default RequestReset
export { REQUEST_RESET_MUTATION }
