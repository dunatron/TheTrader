import React, { Component } from "react"
import { Mutation } from "react-apollo"
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
// https://github.com/exchangeratesapi/exchangeratesapi
var fx = require("money")

// const CREATE_ITEM_MUTATION = gql`
//   mutation CREATE_ITEM_MUTATION(
//     $title: String!
//     $description: String!
//     $price: Float!
//     $image: String
//     $largeImage: String
//     $currency: CURRENCY_CODES!
//   ) {
//     createItem(
//       title: $title
//       description: $description
//       price: $price
//       image: $image
//       largeImage: $largeImage
//       currency: $currency
//     ) {
//       id
//     }
//   }
// `
const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION($data: ItemCreateInput!, $file: Upload) {
    createItem(data: $data, file: $file) {
      id
    }
  }
`
const Title = styled.h2`
  font-size: 2.5rem;
  color: ${p => p.theme.palette.primary.main};
`

class CreateItem extends Component {
  state = {
    title: "",
    description: "",
    image: "",
    largeImage: "",
    price: 0.0,
    currency: "NZD",
    file: null,
    uploading: false,
  }

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

  someFunc() {
    fx.base = "USD"
    fx.rates = {
      EUR: 0.745101, // eg. 1 USD === 0.745101 EUR
      GBP: 0.64771, // etc...
      USD: 1, // always include the base rate (1:1)
      /* etc */
    }
    const pounds = fx(1.99)
      .from("USD")
      .to("GBP")
    return pounds
  }

  // submitForm = async (e, createItem) => {
  //   e.preventDefault()
  //   alert("Form submission")
  //   // call the mutation
  //   await this.uploadFile()
  //   const res = await createItem()
  //   // change them to the single item page
  //   console.log(res)
  //   Router.push({
  //     pathname: "/item",
  //     query: { id: res.data.createItem.id },
  //   })
  // }

  // _getQueryVariables = () => {
  //   const data = {
  //     title: this.state.title,
  //     description: this.state.description,
  //     price: parseFloat(this.state.price),
  //     image: this.state.image,
  //     largeImage: this.state.largeImage,
  //     currency: this.state.currency,
  //   }
  //   const file =
  //   return { ...data }
  // }

  submitForm = async (e, createItem) => {
    e.preventDefault()
    alert("Form submission")
    // call the mutation
    // await this.uploadFile()
    const res = await createItem({
      variables: {
        data: {
          title: this.state.title,
          description: this.state.description,
          price: this.state.price,
          currency: this.state.currency,
        },
        file: this.state.file.rawFile,
      },
    })
    // change them to the single item page
    console.log(res)
    Router.push({
      pathname: "/item",
      query: { id: res.data.createItem.id },
    })
  }

  render() {
    console.log("this.state ", this.state)
    const { uploading } = this.state
    return (
      <Card raised={true} theme={{ maxWidth: 350 }}>
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
          <Mutation mutation={CREATE_ITEM_MUTATION}>
            {(createItem, { loading, error }) => (
              <Form
                data-test="form"
                onSubmit={e => this.submitForm(e, createItem)}>
                <Error error={error} />
                <FieldSet
                  disabled={loading || uploading}
                  aria-busy={loading || uploading}>
                  <TextInput
                    id="create-item-title"
                    name="title"
                    label="Title"
                    value={this.state.title}
                    onChange={this.handleChange}
                    placeholder="Placeholder"
                    fullWidth={false}
                  />
                  <CurrencyCodesSelect
                    id="select-currency"
                    name="currency"
                    value={this.state.currency}
                    onChange={this.handleChange}
                  />
                  <TextInput
                    id="create-item-title"
                    name="price"
                    label="Price"
                    type="number"
                    value={this.state.price}
                    onChange={this.handleChange}
                    placeholder="Placeholder"
                    fullWidth={false}
                    margin="normal"
                    InputLabelProps={{
                      shrink: true,
                    }}
                  />
                  <FileUploader
                    processData={fileData => this.setFileInState(fileData)}
                  />
                  {this.state.file && (
                    <CardMedia
                      component="img"
                      src={this.state.file.data}
                      image={this.state.file.data}
                      title={this.state.file.name}
                    />
                  )}
                  <Button
                    size="large"
                    type="submit"
                    component="button"
                    variant="contained"
                    color="primary">
                    Submit
                  </Button>
                </FieldSet>
              </Form>
            )}
          </Mutation>
        </CardContent>
      </Card>
    )
  }
}

export default CreateItem
