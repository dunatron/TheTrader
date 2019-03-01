import React, { Component, PureComponent } from "react"
import styled from "styled-components"

import TextInput from "./styles/input/TextInput"
import TronsVirtualizedList from "./VirtualList"
import { sort, sortBy, toLower, prop, compose, negate, countBy } from "ramda"
import DelayInput from "./inputs/DelayInput"
import { endpoint, prodEndpoint } from "../config"

const serverEndpoint =
  process.env.NODE_ENV === "development" ? endpoint : prodEndpoint

String.prototype.splice = function(
  index,
  howManyToDelete,
  stringToInsert /* [, ... N-1, N] */
) {
  // Create a character array out of the current string
  // by splitting it. In the context of this prototype
  // method, THIS refers to the current string value
  // being spliced.
  var characterArray = this.split("")
  // Now, let's splice the given strings (stringToInsert)
  // into this character array. It won't matter that we
  // are mix-n-matching character data and string data as
  // it will utlimately be joined back into one value.
  //
  // NOTE: Because splice() mutates the actual array (and
  // returns the removed values), we need to apply it to
  // an existing array to which we have an existing
  // reference.
  Array.prototype.splice.apply(characterArray, arguments)
  // To return the new string, join the character array
  // back into a single string value.
  return characterArray.join("")
}

const spliceString = result => {
  const searchText = result[0]
  const searchTextLength = searchText.length
  const inputText = result.input
  const foundIndex = result.index

  var querystr = searchText
  var result = inputText
  var reg = new RegExp(querystr, "gi")
  var final_str = result.replace(reg, function(str) {
    // return "<span>" + str + "</b>"
    return `<span class="highlight">${str}</span>`
  })
  return final_str
}

const testData = [
  {
    id: 1,
    title: `heath William heath Dunlop heath`,
    url: "heath William heath Dunlop heath",
    mainContent: "heath dunlop",
    secondaryContent: "asdd",
    description: "",
  },
  {
    id: 2,
    title: "Dane",
    url: "Dane",
    mainContent: "Joseph Dunlop",
    secondaryContent: "asdd",
    description: "",
  },
  {
    id: 3,
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
  .highlight {
    color: pink;
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
      fetch(`${serverEndpoint}/tron-search`)
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

  splitValue = (string, indexStart, indexEnd) => {
    const highlightPart = string.substring(indexStart, indexEnd)

    return highlightPart
  }

  injectHighlightSpan = result => {
    const searchText = result[0]
    const searchTextLength = searchText.length
    const inputText = result.input
    const foundIndex = result.index
    const myRealRes = spliceString(result)
    console.group("injectHighlightSpan")
    console.groupEnd()
    return `${myRealRes}`
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
      let injectURLSpan = item.url
      let injectTitleSpan = item.title
      let injectDescSpan = item.description
      let injectKeywordsSpan = item.keywords
      let injectMainContentSpan = item.mainContent
      let injectSecondaryContentSpan = item.secondaryContent
      let fullTextResult
      let fullRegExp = new RegExp(searchString, "gi")
      for (const keyword of keywords) {
        let regexp = new RegExp(keyword, "gi")
        let result
        // ToDo: any full sentances should have high weight
        // url
        while ((result = regexp.exec(item.url))) {
          injectURLSpan = this.injectHighlightSpan(result)
          itemWeight = itemWeight + 1.5
        }
        // title
        while ((result = regexp.exec(item.title))) {
          itemWeight = itemWeight + 2
          injectTitleSpan = this.injectHighlightSpan(result)
        }
        // description
        while ((result = regexp.exec(item.description))) {
          itemWeight = itemWeight + 5
          injectDescSpan = this.injectHighlightSpan(result)
        }
        // keywords
        while ((result = regexp.exec(item.keywords))) {
          itemWeight = itemWeight + 5
          injectKeywordsSpan = this.injectHighlightSpan(result)
          // alert(`Found ${result[0]} at ${result.index}`)
        }
        // ToDo: take main content and secondary out of here.
        // Just do a single fulltext
        // mainContent
        // while ((result = regexp.exec(item.mainContent))) {
        //   itemWeight = itemWeight + 0.2
        //   injectMainContentSpan = this.injectHighlightSpan(result)
        //   // alert(`Found ${result[0]} at ${result.index}`)
        // }
        // // secondaryContent
        // while ((result = regexp.exec(item.secondaryContent))) {
        //   itemWeight = itemWeight + 0.1
        //   injectSecondaryContentSpan = this.injectHighlightSpan(result)
        // }
      }
      while ((fullTextResult = fullRegExp.exec(item.mainContent))) {
        itemWeight = itemWeight + searchString.length * 0.1
        injectMainContentSpan = this.injectHighlightSpan(fullTextResult)
        // alert(`Found ${result[0]} at ${result.index}`)
      }
      // secondaryContent
      // while ((fullTextResult = fullRegExp.exec(item.secondaryContent))) {
      //   itemWeight = itemWeight + 1
      //   injectSecondaryContentSpan = this.injectHighlightSpan(fullTextResult)
      // }
      // Inject span for highlighting
      return {
        ...item,
        weight: itemWeight,
        url: injectURLSpan,
        title: "test Title here",
        description: injectDescSpan,
        keywords: injectKeywordsSpan,
        mainContent: injectMainContentSpan,
        secondaryContent: injectSecondaryContentSpan,
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
