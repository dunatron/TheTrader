import React, { Component, PureComponent } from "react"
import styled from "styled-components"

import TextInput from "./styles/input/TextInput"
import TronsVirtualizedList from "./VirtualList"
import { sort, sortBy, toLower, prop, compose, negate, countBy } from "ramda"
import DelayInput from "./inputs/DelayInput"

const testData = [
  {
    id: "heath",
    title: "heath",
    url: "heath",
    mainContent: "heath dunlop",
    secondaryContent: "asdd",
    description: "",
  },
  {
    id: "dane",
    title: "Dane",
    url: "Dane",
    mainContent: "Joseph Dunlop",
    secondaryContent: "asdd",
    description: "",
  },
  {
    id: "brenna",
    title: "Brenna",
    url: "Dane",
    mainContent: "Dunlop Dunlop Dunlop",
    secondaryContent: "asdd",
    description: "",
  },
]

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
  .main__content {
    margin: 0;
    color: grey;
    line-height: 1;
  }
  .secondary__content {
    margin: 0;
    color: lightgrey;
    line-height: 1;
  }
`

class SearchItemComponent extends PureComponent {
  render() {
    if (!this.props.item) {
      return <p>No Item</p>
    }
    const {
      id,
      title,
      url,
      description,
      keywords,
      mainContent,
      secondaryContent,
    } = this.props.item
    return (
      <SearchItem key={id}>
        <p className="title">{title}</p>
        <a href={url} target="__blank" className="url">
          {url}
        </a>
        <p className="description">{description}</p>
        <p className="main__content">{mainContent}</p>
        <p className="secondary__content">{secondaryContent}</p>
        <hr />
      </SearchItem>
    )
  }
}

let filteredList = []
const sortByWeight = sortBy(
  compose(
    negate,
    prop("weight")
  )
)

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
        this.setState({ searchableData: data })
        // this.setState({ searchableData: testData })
      },
      error => {
        this.setState({ searchableData: [] })
        // alert(e)
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
        if (item.mainContent.toLowerCase().indexOf(el) > -1) return true
        if (item.secondaryContent.toLowerCase().indexOf(el) > -1) return true
        return false
      })
    })
  }

  findWithWeight = (items, searchString) => {
    const keywords = searchString
      .trim()
      .split(" ")
      .filter(k => k !== "")
      .filter(k => k.length > 2)

    // return items
    if (searchString.length < 2) {
      return items
    }

    const weightedItems = items.map(item => {
      let itemWeight = 0
      for (const keyword of keywords) {
        let regexp = new RegExp(keyword, "gi")
        let result
        // url
        while ((result = regexp.exec(item.url))) {
          itemWeight = itemWeight + 1.5
          // alert(`Found ${result[0]} at ${result.index}`)
        }
        // keywords
        while ((result = regexp.exec(item.keywords))) {
          itemWeight = itemWeight + 5
          // alert(`Found ${result[0]} at ${result.index}`)
        }
        // description
        while ((result = regexp.exec(item.description))) {
          itemWeight = itemWeight + 5
          // alert(`Found ${result[0]} at ${result.index}`)
          console.log(`FOund: ${result[0]} at ${result.index}`)
        }
        // title
        while ((result = regexp.exec(item.title))) {
          itemWeight = itemWeight + 2
          // alert(`Found ${result[0]} at ${result.index}`)
        }

        // mainContent
        while ((result = regexp.exec(item.mainContent))) {
          itemWeight = itemWeight + 1
          // alert(`Found ${result[0]} at ${result.index}`)
        }
        // secondaryContent
        while ((result = regexp.exec(item.secondaryContent))) {
          itemWeight = itemWeight + 0.5
          // alert(`Found ${result[0]} at ${result.index}`)
        }
      }
      // Inject span for highlighting
      return {
        ...item,
        weight: itemWeight,
        title: "test Title here",
      }
    })

    const filteredItems = weightedItems.filter(i => i.weight >= 1)
    return filteredItems
  }

  render() {
    const { searchableData, searchString } = this.state
    const weightedItems = this.findWithWeight(searchableData, searchString)
    const filteredItems = sortByWeight(weightedItems)

    filteredList = filteredItems

    return (
      <div>
        <DelayInput
          name="searchString"
          label="Search"
          handleChange={v => this.updateSearch(v)}
          waitLength={1000}
          fullWidth={true}
        />
        {filteredItems.length}
        {filteredItems.length >= 1 && (
          <div style={{ height: 600 }}>
            <TronsVirtualizedList
              data={filteredItems}
              uniqueStamp={searchString}
            />
          </div>
        )}
      </div>
    )
  }

  renderSearchList = list => {
    return list.map((item, i) => (
      <SearchItemComponent key={item.id} item={item} />
    ))
  }

  getDatum = index => {
    const { list } = this.context
    return list.get(index % list.size)
  }

  rowRenderer = ({
    key, // Unique key within array of rows
    index, // Index of row within collection
    isScrolling, // The List is currently being scrolled
    isVisible, // This row is visible within the List (eg it is not an overscanned row)
    style, // Style object to be applied to row (to position it)
  }) => {
    console.log("{filteredList[index]} => ", `${filteredList[index]}`)
    return (
      <div key={key} style={style}>
        {/* {filteredList[index]} */}
        <SearchItemComponent item={filteredList[index]} />
      </div>
    )
  }

  _getRowHeight = ({ index }) => {
    // return this._getDatum(index).size
    // return 400
    return this.getDatum(index).size
  }

  updateSearch = v => {
    this.setState({
      searchString: v,
    })
  }
}
