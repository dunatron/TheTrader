import React, { Component } from "react"
import gql from "graphql-tag"
import { Query } from "react-apollo"
import Error from "./ErrorMessage"
import styled from "styled-components"
import Head from "next/head"

const SingleItemStyles = styled.div`
  max-width: 1200px;
  margin: 2rem auto;
  box-shadow: ${props => props.theme.bs};
  box-sizing: border-box;
  display: grid;
  grid-auto-columns: 1fr;
  grid-auto-flow: column;
  min-height: 800px;
  img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
  .details {
    box-sizing: border-box;
    margin: 3rem;
    font-size: 2rem;
  }
  @media (max-width: ${props => props.theme.breakpoints.values.sm}px) {
    display: flex;
    flex-wrap: wrap;
    .details {
      box-sizing: border-box;
      margin: 0 1rem;
      font-size: 1.2rem;
    }
  }
`

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      image {
        id
        createdAt
        updatedAt
        filename
        mimetype
        encoding
        url
      }
      # largeImage
    }
  }
`
class SingleItem extends Component {
  render() {
    return (
      <Query
        query={SINGLE_ITEM_QUERY}
        variables={{
          id: this.props.id,
        }}>
        {({ error, loading, data }) => {
          if (error) return <Error error={error} />
          if (loading) return <p>Loading...</p>
          if (!data.item) return <p>No Item Found for {this.props.id}</p>
          const item = data.item
          return (
            <SingleItemStyles>
              <Head>
                <title>The Trader | {item.title}</title>
              </Head>
              {item.image && (
                <div>
                  <img src={item.image.url} alt={item.title} />
                </div>
              )}

              <div className="details">
                <h2>Viewing {item.title}</h2>
                <p>{item.description}</p>
              </div>
            </SingleItemStyles>
          )
        }}
      </Query>
    )
  }
}

export default SingleItem
export { SINGLE_ITEM_QUERY }
