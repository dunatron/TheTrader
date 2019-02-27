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

const SINGLE_UPLOAD_MUTATION = gql`
  mutation SINGLE_UPLOAD_MUTATION($file: Upload!) {
    singleUpload(file: $file) {
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

  uploadFile = async (e, singleUpload) => {
    e.preventDefault()
    alert("Form submission")
    const res = await singleUpload({
      variables: {
        file: this.state.file.rawFile,
      },
    })
    // change them to the single item page
    console.log(res)
    // Router.push({
    //   pathname: "/item",
    //   query: { id: res.data.singleUpload.id },
    // })
  }

  render() {
    console.log("this.state ", this.state)
    const { uploading } = this.state
    return (
      <Card variant="contained" theme={{ maxWidth: 350 }}>
        <CardContent style={{ paddingTop: 0 }}>
          <Mutation mutation={SINGLE_UPLOAD_MUTATION}>
            {(singleUpload, { loading, error }) => (
              <Form
                data-test="form"
                onSubmit={e => this.uploadFile(e, singleUpload)}>
                <Error error={error} />
                <FieldSet
                  disabled={loading || uploading}
                  aria-busy={loading || uploading}>
                  <FileUploader
                    processData={fileData => this.setFileInState(fileData)}
                  />
                  {/* <input
                    type="file"
                    required
                    onChange={({
                      target: {
                        validity,
                        files: [file],
                      },
                    }) =>
                      validity.valid && singleUpload({ variables: { file } })
                    }
                  /> */}
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
