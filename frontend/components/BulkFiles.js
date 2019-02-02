import React, { Component } from "react"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import styled from "styled-components"
import FileCard from "./FileCard"

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
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: 1200px;
  margin: 0 auto;
  @media (max-width: ${props => props.theme.breakpoints.values.sm}px) {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
  }
`

export default class Files extends Component {
  render() {
    return (
      <Center>
        <p>[FILES]</p>
        <Query query={ALL_FILES_QUERY}>
          {({ data, error, loading }) => {
            if (loading) return <p>loading</p>
            if (error) return <p>Error: {error.message}</p>
            console.log("Items data => ", data)
            return (
              <FilesList>
                {data.files.map(file => (
                  <FileCard file={file} />
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
