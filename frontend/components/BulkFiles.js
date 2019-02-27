import React, { Component } from "react"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import styled from "styled-components"
import FileCard from "./FileCard"
import { TransitionGroup } from "react-transition-group-v2"

const ALL_FILES_QUERY = gql`
  query files {
    files {
      id
      filename
      url
      createdAt
    }
  }
`

const Center = styled.div`
  text-align: center;
`

const FilesList = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
`

export default class Files extends Component {
  render() {
    return (
      <Center>
        <Query query={ALL_FILES_QUERY}>
          {({ data, error, loading }) => {
            if (loading) return <p>loading files please wait...</p>
            if (error) return <p>Error: {error.message}</p>
            console.log("Items data => ", data)
            return (
              <FilesList>
                {data.files.map((file, i) => (
                  <TransitionGroup key={i}>
                    <FileCard file={file} />
                  </TransitionGroup>
                ))}
              </FilesList>
            )
          }}
        </Query>
      </Center>
    )
  }
}

export { ALL_FILES_QUERY }
