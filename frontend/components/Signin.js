import React, { Component } from "react"
import { Mutation } from "react-apollo"
import gql from "graphql-tag"
import Form from "./styles/Form"
import Error from "./ErrorMessage"
import { CURRENT_USER_QUERY } from "./User"
import { openSnackbar } from "../components/Notifier"
import FabButton from "./styles/FabButton"
import NavigationIcon from "@material-ui/icons/Navigation"

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION($email: String!, $password: String!) {
    signin(email: $email, password: $password) {
      id
      email
      name
    }
  }
`

class Signin extends Component {
  state = {
    name: "",
    password: "",
    email: "",
  }
  saveToState = e => {
    this.setState({ [e.target.name]: e.target.value })
  }
  _signIn = async signin => {
    const res = await signin()
    openSnackbar({
      message: `Welcome: ${res.data.signin.name}`,
      duration: 6000,
    })
    this.setState({ name: "", email: "", password: "" })
  }
  render() {
    return (
      <Mutation
        mutation={SIGNIN_MUTATION}
        variables={this.state}
        refetchQueries={[{ query: CURRENT_USER_QUERY }]}>
        {(signin, { error, loading }) => (
          <Form
            method="post"
            onSubmit={e => {
              e.preventDefault()
              // await signin()
              this._signIn(signin)
            }}>
            <fieldset disabled={loading} aria-busy={loading}>
              <h2>Sign into your account</h2>
              <Error error={error} />
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
              <label htmlFor="password">
                Password
                <input
                  type="password"
                  name="password"
                  placeholder="password"
                  value={this.state.password}
                  onChange={this.saveToState}
                />
              </label>

              <FabButton
                variant="extended"
                color="primary"
                aria-label="Add"
                style={{ minWidth: 160 }}>
                <NavigationIcon style={{ marginRight: 5 }} />
                Sign In
              </FabButton>
            </fieldset>
          </Form>
        )}
      </Mutation>
    )
  }
}

export default Signin
