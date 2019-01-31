import React, { Component } from "react"
import { Query } from "react-apollo"
import gql from "graphql-tag"
import styled from "styled-components"
import SelectInput from "./inputs/SelectInput"

const CURRENCY_CODES = gql`
  query currencyCodesEnum {
    __type(name: "CURRENCY_CODES") {
      name
      enumValues {
        name
      }
    }
  }
`

class SelectCurrencyCode extends Component {
  render() {
    return (
      <Query query={CURRENCY_CODES}>
        {({ data, error, loading }) => {
          if (loading) return <p>loading</p>
          if (error) return <p>Error: {error.message}</p>
          const currencyCodeList = data.__type.enumValues.map(code => ({
            name: code.name,
            value: code.name,
          }))
          return (
            <SelectInput
              {...this.props}
              // value={this.props.value}
              // name={this.props.name}
              // id={this.props.id}
              options={currencyCodeList}
              label={this.props.label}
              onChange={this.props.onChange}
            />
          )
        }}
      </Query>
    )
  }
}

export default SelectCurrencyCode
