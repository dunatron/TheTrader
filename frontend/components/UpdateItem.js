import React, { Component } from "react"
import { Mutation, Query } from "react-apollo"
import CardHeader from "@material-ui/core/CardHeader"
import CardMedia from "@material-ui/core/CardMedia"
import CardContent from "@material-ui/core/CardContent"
import gql from "graphql-tag"
import Router from "next/router"
import styled from "styled-components"
import MoneyIcon from "@material-ui/icons/AttachMoney"
import AvatarStyles from "./styles/AvatarStyles"
import TextInput from "./styles/input/TextInput"
import Card from "./styles/Card"
import MaterialForm from "./styles/MaterialForm"
import FieldSet from "./styles/FieldSet"
import CurrencyCodesSelect from "./SelectCurrencyCode"
import Button from "./styles/Button"
import Error from "./ErrorMessage"
import DragDropUploader from "./DragDropUploader"
import PureImage from "./PureImage"

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
      currency
      image {
        id
        createdAt
        updatedAt
        filename
        mimetype
        encoding
        url
      }
    }
  }
`

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Float
    $currency: CURRENCY_CODES
    $file: Upload
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
      currency: $currency
      file: $file
    ) {
      id
    }
  }
`

const Title = styled.h2`
  font-size: 2.5rem;
  color: ${p => p.theme.palette.primary.main};
`

class UpdateItem extends Component {
  // state will be a blank object as we will only put things in that have changed
  state = {}

  handleChange = e => {
    const { name, type, value } = e.target
    const val = type === "number" ? parseFloat(value) : value
    this.setState({
      [name]: val,
    })
  }
  setFileInState = d => {
    this.setState({
      file: d,
    })
  }

  _updateItem = async (e, updateItem, oldData) => {
    e.preventDefault()
    const variables = this._getQueryVariables()
    const res = await updateItem({ variables: variables })
    // change them to the single item page
    Router.push({
      pathname: "/item",
      query: { id: res.data.updateItem.id },
    })
  }

  _getQueryVariables = () => {
    const updatedData = this.state
    const file = this.state.file ? this.state.file.raw : undefined
    delete updatedData.file
    const data = {
      id: this.props.id,
      ...updatedData,
      file: file,
    }
    return { ...data }
  }

  render() {
    console.log("this.state ", this.state)
    const { uploading } = this.state
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
        {({ data, loading, error, refetch }) => {
          console.log("data => ", data)
          if (loading) return <p>Loading...</p>
          if (!data.item) return <p>No Item found for ID {this.props.id}</p>
          return (
            <Card variant="contained" theme={{ maxWidth: 350 }}>
              <CardHeader
                style={{ paddingBottom: 0 }}
                avatar={
                  <AvatarStyles aria-label="Sell">
                    <MoneyIcon />
                  </AvatarStyles>
                }
                title={<Title>Sell an Item</Title>}
              />
              <CardContent style={{ paddingTop: 0 }}>
                <Mutation
                  mutation={UPDATE_ITEM_MUTATION}
                  refetchQueries={[
                    {
                      query: SINGLE_ITEM_QUERY,
                      variables: { id: this.props.id },
                    },
                  ]}
                  update={this.updateCache}>
                  {(updateItem, { loading, error }) => (
                    <MaterialForm
                      data-test="form"
                      onSubmit={e => this._updateItem(e, updateItem, data)}>
                      <Error error={error} />
                      <FieldSet
                        disabled={loading || uploading}
                        aria-busy={loading || uploading}>
                        <TextInput
                          id="create-item-title"
                          name="title"
                          label="Title"
                          defaultValue={data.item.title}
                          // value={this.state.title}
                          onChange={this.handleChange}
                          placeholder="Placeholder"
                          fullWidth={false}
                        />
                        <CurrencyCodesSelect
                          id="select-currency"
                          name="currency"
                          value={
                            this.state.currency
                              ? this.state.currency
                              : data.item.currency
                          }
                          // defaultValue={data.item.currency}
                          onChange={this.handleChange}
                        />
                        <TextInput
                          multiline={true}
                          id="create-item-title"
                          name="description"
                          label="Description"
                          defaultValue={data.item.description}
                          onChange={this.handleChange}
                          placeholder="enter description"
                          fullWidth={false}
                          margin="normal"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                        <TextInput
                          id="create-item-title"
                          name="price"
                          label="Price"
                          type="number"
                          defaultValue={data.item.price}
                          onChange={this.handleChange}
                          placeholder="Placeholder"
                          fullWidth={false}
                          margin="normal"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                        <DragDropUploader
                          disabled={loading}
                          types={["image"]}
                          extensions={[".jpg", ".png"]}
                          receiveFile={file => this.setFileInState(file)}
                        />
                        {this.renderImage(data.item.image)}
                        <Button
                          size="large"
                          type="submit"
                          component="button"
                          variant="contained"
                          color="primary">
                          Sav{loading ? "ing" : "e"} Changes
                        </Button>
                      </FieldSet>
                    </MaterialForm>
                  )}
                </Mutation>
              </CardContent>
            </Card>
          )
        }}
      </Query>
    )
  }
  renderImage = originalImage => {
    if (!this.state.file && !originalImage) {
      return null
    }
    return (
      <PureImage file={this.state.file ? this.state.file : originalImage} />
    )
  }
}

export default UpdateItem
export { UPDATE_ITEM_MUTATION }
