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

const CREATE_BULK_FILES_MUTATION = gql`
  mutation uploadFiles($files: [Upload!]!) {
    uploadFiles(files: $files) {
      id
      filename
    }
  }
`
const Title = styled.h2`
  font-size: 2.5rem;
  color: ${p => p.theme.palette.primary.main};
`

class CreateItem extends Component {
  state = {
    files: [],
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
    let files = this.state.files
    files.push(d)
    this.setState({
      files: files,
    })
  }

  submitForm = async (e, uploadFiles) => {
    e.preventDefault()
    alert("Form submission")
    // call the mutation
    // await this.uploadFile()
    const theFiles = this.state.files.map(file => file.rawFile)
    console.log("theFiles => ", theFiles)
    const res = await uploadFiles({
      variables: {
        files: theFiles,
      },
    })
    // change them to the single item page
    console.log(res)
    // Router.push({
    //   pathname: "/item",
    //   query: { id: res.data.createItem.id },
    // })
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
          title={<Title>UPLOAD FILES</Title>}
        />
        <CardContent style={{ paddingTop: 0 }}>
          <Mutation mutation={CREATE_BULK_FILES_MUTATION}>
            {(uploadFiles, { loading, error }) => (
              <Form
                data-test="form"
                onSubmit={e => this.submitForm(e, uploadFiles)}>
                <Error error={error} />
                <FieldSet
                  disabled={loading || uploading}
                  aria-busy={loading || uploading}>
                  <FileUploader
                    processData={fileData => this.setFileInState(fileData)}
                  />
                  {this.state.files.map((file, index) => {
                    return (
                      <CardMedia
                        component="img"
                        src={file.data}
                        image={file.data}
                        title={file.name}
                      />
                    )
                  })}
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
