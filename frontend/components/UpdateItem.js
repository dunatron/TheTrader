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
import Form from "./styles/Form"
import FieldSet from "./styles/FieldSet"
import CurrencyCodesSelect from "./SelectCurrencyCode"
import Button from "./styles/Button"
import Error from "./ErrorMessage"
import FileUploader from "./FileUploader"

const SINGLE_ITEM_QUERY = gql`
  query SINGLE_ITEM_QUERY($id: ID!) {
    item(where: { id: $id }) {
      id
      title
      description
      price
      currency
      image
      largeImage
    }
  }
`

const UPDATE_ITEM_MUTATION = gql`
  mutation UPDATE_ITEM_MUTATION(
    $id: ID!
    $title: String
    $description: String
    $price: Float
    $image: String
    $largeImage: String
    $currency: CURRENCY_CODES
  ) {
    updateItem(
      id: $id
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
      currency: $currency
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
  uploadFile = async e => {
    this.setState({ uploading: true })
    const file = this.state.file.rawFile
    const data = new FormData()
    data.append("file", file)
    data.append("upload_preset", "thetrader") // needed by cloudinary
    const res = await fetch(
      "https://api.cloudinary.com/v1_1/dkhe0hx1r/image/upload",
      {
        method: "POST",
        body: data,
      }
    )
    const cloudinaryFile = await res.json()
    this.setState({
      image: cloudinaryFile.secure_url,
      largeImage: cloudinaryFile.eager[0].secure_url,
      uploading: false,
    })
  }

  _updateItem = async (e, updateItem, oldData) => {
    e.preventDefault()
    const variables = this._getQueryVariables()
    console.log(" _updateItem Variables => ", variables)
    if (this.state.file) {
      // we have uploaded a new file and should delete and upload a new one
      await this.uploadFile()
    }

    const res = await updateItem({ variables: variables })
    // change them to the single item page
    console.log(res)
    Router.push({
      pathname: "/item",
      query: { id: res.data.updateItem.id },
    })
  }

  _getQueryVariables = () => {
    const updatedData = this.state
    delete updatedData.file
    const data = {
      id: this.props.id,
      ...updatedData,
    }
    return { ...data }
  }

  render() {
    console.log("this.state ", this.state)
    const { uploading } = this.state
    return (
      <Query query={SINGLE_ITEM_QUERY} variables={{ id: this.props.id }}>
        {({ data, loading, error }) => {
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
                <Mutation mutation={UPDATE_ITEM_MUTATION}>
                  {(updateItem, { loading, error }) => (
                    <Form
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
                          id="create-item-title"
                          name="price"
                          label="Price"
                          type="number"
                          // value={this.state.price}
                          defaultValue={data.item.price}
                          onChange={this.handleChange}
                          placeholder="Placeholder"
                          fullWidth={false}
                          margin="normal"
                          InputLabelProps={{
                            shrink: true,
                          }}
                        />
                        <FileUploader
                          processData={fileData =>
                            this.setFileInState(fileData)
                          }
                        />
                        {data.item.image && (
                          <CardMedia
                            component="img"
                            src={data.item.image}
                            // image={this.state.file.data}
                            title={data.item.image}
                          />
                        )}
                        <Button
                          size="large"
                          type="submit"
                          component="button"
                          variant="contained"
                          color="primary">
                          Sav{loading ? "ing" : "e"} Changes
                        </Button>
                      </FieldSet>
                    </Form>
                  )}
                </Mutation>
              </CardContent>
            </Card>
          )
        }}
      </Query>
    )
  }
}

export default UpdateItem
export { UPDATE_ITEM_MUTATION }
