import React, { Component } from "react"
import { withStyles } from "@material-ui/core/styles"
import Button from "@material-ui/core/Button"
import SearchIcon from "@material-ui/icons/Search"

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

class Search extends Component {
  state = { search: "" }
  handleSearchChange(e) {
    this.setState({
      search: e.target.value,
    })
  }
  render() {
    const { search } = this.state
    const { classes, executeSearch } = this.props
    return (
      <div className={classes.searchBar}>
        <input
          placeholder="search stock questions"
          className={classes.searchBox}
          value={search}
          onChange={e => this.handleSearchChange(e)}
        />
        <Button
          onClick={() => executeSearch(this.state.search)}
          variant="outlined"
          color="secondary"
          className={classes.searchBtn}>
          <SearchIcon />
          Search
        </Button>
      </div>
    )
  }
}

export default withStyles(styles)(Search)
