import React, { Component } from "react"
import { Mutation } from "react-apollo"
import CardHeader from "@material-ui/core/CardHeader"
import CardContent from "@material-ui/core/CardContent"
import gql from "graphql-tag"
import styled from "styled-components"
import MoneyIcon from "@material-ui/icons/AttachMoney"
import AvatarStyles from "./styles/AvatarStyles"
import Card from "./styles/Card"
import Form from "./styles/Form"
import FieldSet from "./styles/FieldSet"
import Button from "./styles/Button"
import Error from "./ErrorMessage"
import DragDropUploader from "./DragDropUploader"
import ImageGridList from "./ImageGridList"
import encodeImage from "../lib/encodeImage"

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

const CardsWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: start;
  .card {
    margin: 8px;
  }
`

const ImageList = styled.div`
  display: flex;
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
    const theFiles = this.state.files.map(file => file.raw)
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

  getRandomInt = max => {
    return Math.floor(Math.random() * Math.floor(max))
  }

  getNextGridSize = index => {
    if (index & 1) {
      console.log("Is an odd number ", index)
      return 2
    } else return 3
  }

  render() {
    console.log("this.state ", this.state)
    const { uploading } = this.state
    return (
      <CardsWrapper>
        <Card className="card" raised={true}>
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
                    <DragDropUploader
                      disabled={loading}
                      types={["image"]}
                      extensions={[".jpg", ".png"]}
                      receiveFile={file => {
                        console.log("received File => ", file)
                        this.setFileInState(file)
                      }}
                    />

                    <Button
                      disabled={loading}
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
        {this.state.files.length >= 1 && (
          <Card className="card" raised={true}>
            <ImageGridList
              tileData={this.state.files.map((file, idx) => {
                const src = "data:image/png;base64," + encodeImage(file.content)
                return {
                  src,
                  name: file.name,
                  // cols: this.getRandomInt(3),
                  cols: this.getNextGridSize(idx),
                }
              })}
            />
          </Card>
        )}
      </CardsWrapper>
    )
  }
}

export default CreateItem
