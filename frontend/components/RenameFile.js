import React, { Component } from "react"
import { Mutation } from "react-apollo"
import gql from "graphql-tag"

const RENAME_FILE_MUTATION = gql`
  mutation renameFile($id: ID!, $filename: String!) {
    renameFile(id: $id, filename: $filename) {
      id
      filename
    }
  }
`

class RenameFile extends Component {
  state = {
    filename: this.props.filename,
  }
  // update = (cache, payload) => {
  //   // manually update the cache on the client, so it matches the server
  //   // 1. Read the cache for the items we want
  //   const data = cache.readQuery({ query: ALL_FILES_QUERY })
  //   console.log(data, payload)
  //   // 2. Filter the deleted itemout of the page
  //   data.files = data.files.filter(
  //     file => file.id !== payload.data.deleteFile.id
  //   )
  //   // 3. Put the items back!
  //   cache.writeQuery({ query: ALL_FILES_QUERY, data })
  // }
  render() {
    return (
      <Mutation
        mutation={RENAME_FILE_MUTATION}
        variables={{ id: this.props.id, filename: this.state.filename }}
        // update={this.update}
      >
        {(renameFile, { error }) => (
          <input
            value={this.state.filename}
            onChange={e => this.setState({ filename: e.target.value })}
            onBlur={() => {
              if (confirm("Are you sure you want to rename this file?")) {
                renameFile().catch(err => {
                  alert(err.message)
                })
              }
            }}
          />
        )}
      </Mutation>
    )
  }
}

export default RenameFile
