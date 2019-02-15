import React, { Component } from "react"
import styled from "styled-components"

import TextInput from "./styles/input/TextInput"

const SearchItem = styled.div`
  color: ${p => p.theme.palette.primary.main};
  .title {
    color: green;

    margin: 0;
    line-height: 1.2;
  }
  .url {
    color: blue;
    margin: 0;
    line-height: 1.2;
  }
  .description {
    margin: 0;
    color: black;
    line-height: 1.2;
  }
`

export default class PolySearch extends Component {
  state = {
    searchableData: [],
    searchString: "",
  }
  getSearchFile = () => {
    return new Promise(function(resolve, reject) {
      fetch("http://localhost:4444/tron-search")
        .then(resp => resp.json()) // Transform the data into json
        .then(function(data) {
          if (data) resolve(data)
          else reject("no data available")
        })
        .catch(function(error) {
          reject(error)
        })
    })
  }

  componentDidMount() {
    this.getSearchFile().then(
      data => {
        console.log("Promised Data => ", data)
        this.setState({ searchableData: data })
      },
      error => {
        console.log("error => ", error)
        alert(e)
      }
    )
  }

  handleChange = e => {
    const { name, type, value } = e.target
    const val = type === "number" ? parseFloat(value) : value
    this.setState({
      [name]: val,
    })
  }

  find = (items, text) => {
    text = text.toLowerCase()
    text = text.split(" ")
    return items.filter(function(item) {
      return text.every(function(el) {
        // return item.title.toLowerCase().indexOf(el) > -1
        if (item.title.toLowerCase().indexOf(el) > -1) return true
        if (item.description.toLowerCase().indexOf(el) > -1) return true
        if (item.url.toLowerCase().indexOf(el) > -1) return true
        return false
      })
    })
  }

  render() {
    const { searchableData, searchString } = this.state
    const filteredItems = this.find(searchableData, searchString)

    return (
      <div>
        <TextInput
          id="search-input"
          name="searchString"
          label="Search"
          value={searchString}
          onChange={this.handleChange}
          placeholder="Placeholder"
          fullWidth={false}
        />
        {searchableData.length >= 1 && this.renderSearchList(filteredItems)}
      </div>
    )
  }

  renderSearchList = list => {
    return list.map((item, i) => this.searchItem(item))
  }

  searchItem = item => {
    const { title, url, description, keywords } = item
    return (
      <SearchItem>
        <p className="title">{title}</p>
        <a href={url} target="__blank" className="url">
          {url}
        </a>
        <p className="description">{description}</p>
        <hr />
      </SearchItem>
    )
  }
}
