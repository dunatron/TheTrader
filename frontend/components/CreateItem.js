import React, { Component, PureComponent } from "react"
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
import DragDropUploader from "./DragDropUploader"
import encodeImage from "../lib/encodeImage"
import { openSnackbar } from "../components/Notifier"
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
// Note this Image is being rendered again everytime. Stopit from doing this I guess
// const renderFileImage = file => {
//   const src = "data:image/png;base64," + encodeImage(file.content)
//   return <CardMedia component="img" src={src} image={src} title={file.name} />
// }

const RenderFileImage = file => {
  const src = "data:image/png;base64," + encodeImage(file.content)
  return <CardMedia component="img" src={src} image={src} title={file.name} />
}

const ImageComponent = React.memo(function ImageComponent(props) {
  /* render using props */
  const file = props.image
  const src = "data:image/png;base64," + encodeImage(file.content)
  return <CardMedia component="img" src={src} image={src} title={file.name} />
})

class CreateItem extends Component {
  file = null
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

  // shouldComponentUpdate(nextProps, nextState) {
  //   // if (this.props.title !== nextProps.color) {
  //   //   return true
  //   // }
  //   if (this.state.title !== nextState.title) {
  //     return true
  //   }
  //   return false
  // }

  handleChange = e => {
    const { name, type, value } = e.target
    const val = type === "number" ? parseFloat(value) : value
    this.setState({
      [name]: val,
    })
  }
  setFileInState = file => {
    this.setState({
      file: file,
    })
  }
  uploadFile = async e => {
    this.setState({ uploading: true })
    const file = this.state.file.raw
    const data = new FormData()
    console.log("his.state.file => ", this.state.file)
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
    console.log("cloudinaryFile => ", cloudinaryFile)
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

  submitForm = async (e, createItem) => {
    e.preventDefault()
    // upload file to cloudinary
    await this.uploadFile()
    // createItem in the database via mutation
    const res = await createItem({
      variables: {
        data: {
          title: this.state.title,
          description: this.state.description,
          price: this.state.price,
          currency: this.state.currency,
        },
        file: this.state.file.raw,
      },
    })
    // display notification to the user
    openSnackbar({
      message: `<h4>New Item created</h4><p>${res.data.createItem.id}</p><p>${
        this.state.title
      }</p><p>${this.state.price} ${this.state.currency}</p>`,
      duration: 6000,
    })
    // change them to the single item page
    Router.push({
      pathname: "/item",
      query: { id: res.data.createItem.id },
    })
  }

  render() {
    const { uploading } = this.state
    console.log(this.state)
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
                  <DragDropUploader
                    disabled={loading}
                    types={["image"]}
                    extensions={[".jpg", ".png"]}
                    receiveFile={file => this.setFileInState(file)}
                  />
                  {this.state.file && (
                    <ImageComponent image={this.state.file} />
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
