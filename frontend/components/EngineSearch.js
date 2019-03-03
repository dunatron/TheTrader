import React, { Component } from "react"
import PropTypes from "prop-types"
import { withStyles } from "@material-ui/core/styles"
import { graphql, withApollo, compose } from "react-apollo"
import gql from "graphql-tag"
import Button from "@material-ui/core/Button"

// components
import ExpansionPanel from "@material-ui/core/ExpansionPanel"
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary"
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails"
import Typography from "@material-ui/core/Typography"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import Search from "./Search"
// import ResultsList from "./ResultsList"
// import SearchResult from "./SearchResult"
import EngineResult from "./EngineResult"
import SelectOption from "./inputs/SelectOption"
import { Column, Table, AutoSizer, List } from "react-virtualized"

// queries
const ENGINE_FULL_TEXT_SEARCH_QUERY = gql`
  query engineFullTextSearch($search: String!) {
    engineFullTextSearch(search: $search) {
      id
      title
      url
      keywords
      description
      mainContent
      secondaryContent
    }
  }
`

const ENGINE_CONTAINS_SEARCH_QUERY = gql`
  query polySearch($search: String!) {
    polySearch(search: $search) {
      id
      title
      url
      keywords
      description
      mainContent
      secondaryContent
    }
  }
`

const searchOptionTypes = [
  { name: "Full Text Search", value: ENGINE_FULL_TEXT_SEARCH_QUERY },
  { name: "PolyEdge Search", value: ENGINE_CONTAINS_SEARCH_QUERY },
]

const styles = theme => ({
  root: {},
  searchBar: {
    display: "flex",
    flexWrap: "wrap",
  },
  searchBox: {
    flex: "4 1 0",
    minWidth: 330,
    fontSize: 22,
    // outline: "none",
    outline: "0 0 5px rgba(81, 203, 238, 1)",
    padding: theme.spacing.unit * 3,
    color: theme.palette.primary.main,
    "&:focus": {
      outline: `2px solid ${theme.palette.secondary.main}`,
      border: "none",
    },
  },
  searchBtn: {
    flex: "1 1 0",
    borderRadius: 0,
    minWidth: 130,
    width: "100%",
  },
})

class ResultsList extends Component {
  render() {
    const { results } = this.props
    return (
      <div>
        {results.map((result, i) => (
          <EngineResult key={i} item={result} />
        ))}
      </div>
    )
  }
}

class EngineSearch extends Component {
  state = {
    search: "",
    searching: false,
    searchType: ENGINE_FULL_TEXT_SEARCH_QUERY,
    items: [],
  }
  render() {
    const { searchType, search, searching, items } = this.state
    const { classes } = this.props
    return (
      <div>
        <Search executeSearch={searchVal => this._searchQuestions(searchVal)} />
        <ExpansionPanel>
          <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
            <Typography className={classes.heading}>Search Options</Typography>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <SelectOption
              value={searchType}
              options={searchOptionTypes}
              handleChange={v =>
                this.setState({
                  searchType: v,
                })
              }
            />
          </ExpansionPanelDetails>
        </ExpansionPanel>

        {searching ? "Searching" : <ResultsList results={items} />}
      </div>
    )
  }

  _searchQuestions = async search => {
    this.setState({
      searching: true,
    })
    const items = await this.props.client.query({
      query: this.state.searchType,
      variables: {
        search: search,
      },
    })
    if (this.state.searchType === ENGINE_FULL_TEXT_SEARCH_QUERY) {
      this.setState({
        items: items.data.engineFullTextSearch,
      })
    }
    if (this.state.searchType === ENGINE_CONTAINS_SEARCH_QUERY) {
      this.setState({
        items: items.data.polySearch,
      })
    }
    this.setState({
      searching: false,
    })
    return
  }
}

EngineSearch.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default compose(
  withStyles(styles),
  withApollo
)(EngineSearch)
