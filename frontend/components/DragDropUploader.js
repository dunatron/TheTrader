import React, { Component } from "react"
import PropTypes from "prop-types"
import AlertMessage from "./AlertMessage"
import withStyles from "@material-ui/core/styles/withStyles"
import classNames from "classnames"
import Button from "@material-ui/core/Button"
import CloudUploadIcon from "@material-ui/icons/CloudUpload"

import fileTypesGen from "../lib/fileTypeGen"

const styles = theme => ({
  root: {
    border: `1px solid pink`,
  },
  dragging: {
    border: `1px solid black`,
  },
})

class DragDropUploader extends Component {
  state = {
    dragging: false,
  }

  render = () => {
    const { classes, title } = this.props
    const { dragging } = this.state

    return (
      <div
        onClick={this.onZoneClick}
        className={
          dragging ? classNames(classes.root, classes.dragging) : classes.root
        }
        onDrop={this.onDrop}
        onDragEnter={this.onDragEnter}
        onDragLeave={this.onDragLeave}
        onDragOver={this.onDragOver}>
        <span>{title}</span>
        <CloudUploadIcon />
        <input
          accept="image/*"
          className={classes.input}
          multiple
          type="file"
          onChange={e => this.onFileChange(e)}
        />
      </div>
    )
  }

  allowedExtensions = () => {
    const { types, extensions } = this.props
    const allowed = fileTypesGen(
      types ? types : undefined,
      extensions ? extensions : undefined
    )
    return allowed
  }

  handleFiles = files => {
    const allowedExtensions = this.allowedExtensions()
    console.log("Handle File allowedExtensions => ", allowedExtensions)
    const allowedFiles = Object.values(files)
      .map(file => file)
      // .filter(f => allowedExtensions.includes(f.type))
      .filter(f => {
        console.log("The file Type => ", f.type)
        return allowedExtensions.includes(f.type)
      })
    this.props.uploadFiles(allowedFiles)
    // return allowedFiles
  }

  onFileChange = e => {
    const files = e.target.files
    this.handleFiles(files)
  }
  onDrop = e => {
    e.stopPropagation()
    e.preventDefault()
    const files = e.dataTransfer.files
    this.handleFiles(files)
  }

  onDragEnter = e => {
    e.stopPropagation()
    e.preventDefault()
    if (!this.state.dragging) {
      this.setState({
        dragging: true,
      })
    }
  }

  onDragLeave = e => {
    e.stopPropagation()
    e.preventDefault()
    if (this.state.dragging) {
      this.setState({
        dragging: false,
      })
    }
  }

  onDragOver = e => {
    e.stopPropagation()
    e.preventDefault()
    if (!this.state.dragging) {
      this.setState({
        dragging: true,
      })
    }
  }

  onZoneClick = () => {}
}

DragDropUploader.propTypes = {
  FileType: PropTypes.string,
}

export default withStyles(styles)(DragDropUploader)
