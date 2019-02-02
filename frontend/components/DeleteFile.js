import React, { Component } from "react"
import { Mutation } from "react-apollo"
import gql from "graphql-tag"
import { ALL_FILES_QUERY } from "./BulkFiles"
import AvatarStyles from "./styles/AvatarStyles"
import Button from "./styles/Button"
import DeleteForeverIcon from "@material-ui/icons/DeleteForever"
import Fab from "@material-ui/core/Fab"

const DELETE_FILE_MUTATION = gql`
  mutation DELETE_FILE_MUTATION($id: ID!) {
    deleteFile(id: $id) {
      id
    }
  }
`

class DeleteFile extends Component {
  update = (cache, payload) => {
    // manually update the cache on the client, so it matches the server
    // 1. Read the cache for the items we want
    const data = cache.readQuery({ query: ALL_FILES_QUERY })
    console.log(data, payload)
    // 2. Filter the deleted itemout of the page
    data.files = data.files.filter(
      file => file.id !== payload.data.deleteFile.id
    )
    // 3. Put the items back!
    cache.writeQuery({ query: ALL_FILES_QUERY, data })
  }
  render() {
    return (
      <Mutation
        mutation={DELETE_FILE_MUTATION}
        variables={{ id: this.props.id }}
        update={this.update}>
        {(deleteItem, { error }) => (
          <Fab
            size="small"
            color="secondary"
            aria-label="Delete"
            style={{ cursor: "pointer" }}
            onClick={() => {
              if (confirm("Are you sure you want to delete this File?")) {
                deleteItem().catch(err => {
                  alert(err.message)
                })
              }
            }}>
            <DeleteForeverIcon />
          </Fab>
        )}
      </Mutation>
    )
  }
}

export default DeleteFile
