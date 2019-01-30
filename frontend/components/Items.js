import React, { Component } from "react"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import styled from "styled-components"
import ItemComponent from "./Item"

const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY {
    items {
      id
      title
      price
      description
      image
      largeImage
    }
  }
`

const Center = styled.div`
  text-align: center;
`

const ItemsList = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-gap: 60px;
  max-width: 1200px;
  margin: 0 auto;
`

export default class Items extends Component {
  render() {
    return (
      <Center>
        <p>Items</p>
        <Query query={ALL_ITEMS_QUERY}>
          {({ data, error, loading }) => {
            if (loading) return <p>loading</p>
            if (error) return <p>Error: {error.message}</p>
            return (
              <ItemsList>
                <ItemComponent
                  item={{
                    title: "Test",
                    price: 30,
                  }}
                />
                <ItemComponent item={{ title: "yes", price: 30 }} />
                <ItemComponent item={{ title: "yes", price: 30 }} />
                <ItemComponent item={{ title: "yes", price: 30 }} />
              </ItemsList>
            )
          }}
        </Query>
      </Center>
    )
  }
}
