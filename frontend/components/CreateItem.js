import React, { Component } from "react"
import Card from "@material-ui/core/Card"
import CardHeader from "@material-ui/core/CardHeader"
import CardMedia from "@material-ui/core/CardMedia"
import CardContent from "@material-ui/core/CardContent"
import Typography from "@material-ui/core/Typography"
import IconButton from "@material-ui/core/IconButton"
import styled from "styled-components"
import MoneyIcon from "@material-ui/icons/AttachMoney"
import AvatarStyles from "./styles/AvatarStyles"
import TextInput from "./styles/input/TextInput"
// import fetch from "fetch"
// https://github.com/exchangeratesapi/exchangeratesapi
var fx = require("money")

const Title = styled.h2`
  font-size: 2.5rem;
  color: ${p => p.theme.palette.primary.main};
`

const Form = styled.form``

// // Practical example
// fetch("https://jsonplaceholder.typicode.com/todos")
//   .then(response => response.json())
//   .then(data => console.log(JSON.stringify(data)))

// Practical example
// fetch("https://api.exchangeratesapi.io/latest")
//   .then(response => console.log(response))
//   .then(data => console.log(JSON.stringify(data)))

let demo = () => {
  let rate = fx(1)
    .from("GBP")
    .to("USD")
  alert("£1 = $" + rate.toFixed(4))
}

// fetch("https://api.exchangeratesapi.io/latest")
//   .then(resp => resp.json())
//   .then(data => (fx.rates = data.rates))
//   .then(demo)

async function getFxData() {
  const data = await fetch("https://api.exchangeratesapi.io/latest").then(
    resp => resp.json()
  )
  // .then(data => (fx.rates = data.rates))
  // .then(demo)
  console.log(data)
}

getFxData()

class CreateItem extends Component {
  state = {
    title: "",
    description: "",
    image: "",
    largeImage: "",
    price: 0.0,
  }

  handleChange = event => {
    const { name, type, value } = event.target
    const val = type === "number" ? parseFloat(value).toFixed(2) : value
    console.log("val => ", val)
    this.setState({
      [name]: val,
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

  render() {
    return (
      <Card raised={true}>
        <CardHeader
          avatar={
            <AvatarStyles aria-label="Sell">
              <MoneyIcon />
            </AvatarStyles>
          }
          title={<Title>Sell an Item</Title>}
        />
        <CardMedia
          // image="/static/images/cards/paella.jpg"
          title="Paella dish"
        />
        <CardContent>
          <Form>
            {/* <h1>{fx.convert(1000, { from: "GBP", to: "HKD" })}</h1> */}
            {this.someFunc()}
            <TextInput
              id="create-item-title"
              name="title"
              label="Title"
              value={this.state.title}
              onChange={this.handleChange}
              style={{ margin: 8 }}
              placeholder="Placeholder"
              helperText="Title or name of the item"
              fullWidth
              variant="outlined"
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
              inputProps={{ step: "0.20" }}
              value={this.state.price}
              onChange={this.handleChange}
              style={{ margin: 8 }}
              placeholder="Placeholder"
              helperText="Title or name of the item"
              fullWidth
              variant="outlined"
              margin="normal"
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Form>
        </CardContent>
      </Card>
    )
  }
}

export default CreateItem
