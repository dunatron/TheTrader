import React, { Component } from "react"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import styled from "styled-components"
import ItemComponent from "./Item"
import Pagination from "./Pagination"
import { itemsPerPage } from "../config"

const ALL_ITEMS_QUERY = gql`
  query ALL_ITEMS_QUERY {
    items {
      id
      title
      price
      description
      image {
        id
        filename
        url
      }
      currency
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
  @media (max-width: ${props => props.theme.breakpoints.values.sm}px) {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
  }
`

export default class Items extends Component {
  render() {
    return (
      <Center>
        <p>Items</p>
        <Pagination page={this.props.page} />
        {/* <Query query={ALL_ITEMS_QUERY}>
          {({ data, error, loading }) => {
            if (loading) return <p>loading</p>
            if (error) return <p>Error: {error.message}</p>
            console.log("Items data => ", data)
            return (
              <ItemsList>
                {data.items.map(item => (
                  <ItemComponent item={item} key={item.id} />
                ))}
              </ItemsList>
            )
          }}
        </Query> */}
        <Query
          query={ALL_ITEMS_QUERY}
          // fetchPolicy="network-only"
          variables={{
            skip: this.props.page * itemsPerPage - itemsPerPage,
          }}>
          {({ data, error, loading }) => {
            if (loading) return <p>Loading...</p>
            if (error) return <p>Error: {error.message}</p>
            return (
              <ItemsList>
                {data.items.map(item => (
                  <ItemComponent item={item} key={item.id} />
                ))}
              </ItemsList>
            )
          }}
        </Query>
        <Pagination page={this.props.page} />
      </Center>
    )
  }
}

export { ALL_ITEMS_QUERY }
