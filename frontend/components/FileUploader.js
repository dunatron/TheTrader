import React, { Component } from "react"
import PropTypes from "prop-types"
import AlertMessage from "./AlertMessage"
import withStyles from "@material-ui/core/styles/withStyles"
import classNames from "classnames"
import Button from "@material-ui/core/Button"
import CloudUploadIcon from "@material-ui/icons/CloudUpload"
import fileTypesGen from "../lib/fileTypeGen"

const styles = theme => ({
  dropZone: {
    border: `1px dashed ${theme.palette.primary.main}`,
    //height: '333px',
    //width: '300px',
    // width: theme.spacing.unit * 30,
    height: theme.spacing.unit * 30 * 1.618,
    display: "flex",
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "space-evenly",
    boxSizing: "border-box",
    margin: theme.spacing.unit,
  },
  dropHover: {
    border: `3px dashed ${theme.palette.secondary.main}`,
    backgroundColor: theme.palette.primary.main,
  },
  dropTitle: {
    fontSize: "18px",
  },
  dropSubTitle: {
    fontSize: "14px",
  },
  cloudUploadIcon: {
    height: "5em",
    width: "5em",
  },
  input: {
    display: "none",
  },
  button: {
    margin: theme.spacing.unit,
  },
})

const readFileIntoMemory = (file, callback) => {
  var reader = new FileReader()
  reader.onload = function() {
    callback({
      name: file.name,
      size: file.size,
      type: file.type,
      content: new Uint8Array(this.result),
      raw: file,
    })
  }
  reader.readAsArrayBuffer(file)
}

class DnDFileReader extends Component {
  constructor(props) {
    super(props)
    this.state = {
      stage: 0,
      dragStatus: "",
      uploading: false,
      uploadPercent: 0,
      fileSrc: null,
      rawFile: null,
      type: null,
      error: null,
      alertText: "",
    }
  }

  render = () => {
    let { error, alertText } = this.state
    let components = []
    let barStyle = {
      width: this.state.uploadPercent + "%",
    }

    if (error) {
      return (
        <AlertMessage
          open={true}
          alertText={alertText}
          dismissAlert={() => this.resetUploader()}
        />
      )
    }

    switch (this.state.stage) {
      case 0:
        this.renderUploadForm(components, barStyle)
        break
      case 1:
        this.renderWait(components, barStyle)
        break
      default:
        this.renderUploadForm(components, barStyle)
    }

    return (
      <div>
        <div className={"dropZoneFileWrap"}>{components}</div>
      </div>
    )
  }

  resetUploader = () => {
    this.setState({
      stage: 0,
      dragStatus: "",
      uploading: false,
      uploadPercent: 0,
      DisplayFile: null,
      type: null,
      size: null,
      name: null,
      lastModified: null,
      CSVColumns: null,
      error: null,
      alertText: "",
    })
  }

  renderUploadForm = (components, barStyle) => {
    const { classes } = this.props
    components.push(
      <div>
        <div
          key={"uploadForm"}
          onClick={this.onZoneClick}
          className={
            this.state.dragStatus === "dropHover"
              ? classNames(classes.dropZone, classes.dropHover)
              : classes.dropZone
          }
          onDrop={this.onDrop}
          onDragEnter={this.onDragEnter}
          onDragLeave={this.onDragLeave}
          onDragOver={this.onDragOver}>
          <span className={classes.dropTitle}>{"Drag and drop image"}</span>

          <CloudUploadIcon className={classes.cloudUploadIcon} />
          <input
            key={"uploadInput"}
            ref={"uploadInput"}
            accept="image/*"
            className={classes.input}
            id="raised-button-file"
            multiple
            type="file"
            onChange={this.onFileChange}
          />
          <span className={classes.dropSubTitle}>{"or click to browse"}</span>
          <label htmlFor="raised-button-file">
            <Button
              variant="raised"
              component="span"
              className={classes.button}>
              Browse Files
            </Button>
          </label>
          {/*<input*/}
          {/*key={"uploadInput"}*/}
          {/*ref={"uploadInput"}*/}
          {/*className={classes.uploadButton}*/}
          {/*type={"file"}*/}
          {/*onChange={this.onFileChange}*/}
          {/*/>*/}
          <div key={"progressContainer"} className={"progress"}>
            <div style={barStyle} className={"progressBar"} />
          </div>
        </div>
      </div>
    )
  }

  renderWait = (components, barStyle) => {
    components.push(
      <div key={"dropKey"} className={"dropZone " + this.state.dragStatus}>
        <span className={"dropMessage"}>{"Please wait..."}</span>
        <div key={"progressContainer"} className={"progress"}>
          <div style={barStyle} className={"progressBar"} />
        </div>
      </div>
    )
  }

  pushDataUp = gLCodesArray => {
    this.props.recieveData(gLCodesArray, this.state.importOption)
  }

  processFile = file => {
    let { size, name, lastModified, type } = file
    let fileType = this.getFileType(type)
    let check = this.checkValidFile(fileType, type)
    if (check === false) {
      return // Stop running things
    }

    this.setState({
      type: fileType,
      size: size,
      name: name,
      lastModified: lastModified,
    })
    switch (fileType) {
      case "img":
        this.processImage(file)
        break
      default:
        this.unKownError(
          "Unkown Error ",
          "trying to process an unkown file please contact 'https://github.com/dunatron'"
        )
    }
  }

  processFileData = data => {
    const { type, size, rawFile, name, lastModified } = this.state
    this.props.processData({
      data: data,
      rawFile: rawFile,
      type: type,
      name: name,
      size: size,
      lastModified: lastModified,
    })
    this.setState({ stage: 0 })
    // this.props.processData(data, rawFile, type, name, size, lastModified)
  }

  processImage = async file => {
    let reader = new FileReader()
    let imgSrc
    await this.setState({
      type: "img",
      rawFile: file,
    })
    reader.readAsDataURL(file)
    reader.onload = () => {
      imgSrc = reader.result
    }
    reader.onloadend = () => {
      this.processFileData(imgSrc)
    }
  }

  unKownError = (header, message) => {
    this.setState({
      error: true,
      alertText: header + "\n" + message,
    })
  }

  checkValidFile = (type, extension) => {
    if (type === "invalidType") {
      // reset everything and throw an error
      this.setState({
        error: true,
        alertText: "Invalid File Type \n" + extension,
      })
      return false
    }
    return true
  }

  getFileType = type => {
    // Type expressions
    let imageExpression = /image.*/
    let textExpression = /text.*/
    let csvExpression = /\.csv$/
    let msCSVExpression = /application\/vnd\.ms-excel$/i
    let xlxsExpression =
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    let videoExpression = /video.*/

    if (type.match(imageExpression)) {
      return "img"
    } else if (type.match(textExpression)) {
      return "text"
    } else if (type.match(csvExpression)) {
      return "csv"
    } else if (type.match(videoExpression)) {
      return "video"
    } else if (type.match(xlxsExpression)) {
      return "xlxs"
    } else {
      return "invalidType"
    }
  }

  onFileChange = e => {
    e.stopPropagation()
    let file = this.extractSingleFile(this.refs.uploadInput.files)
    this.refs.uploadInput.click()

    this.processFile(file)
  }

  extractSingleFile = files => {
    this.setState({ stage: 1 })

    return files[0]
  }

  extractFiles = files => {
    this.setState({ stage: 1 })

    return files
  }

  allowedExtensions = () => {
    const { types, extensions } = this.props
    const allowed = fileTypesGen(
      types ? types : undefined,
      extensions ? extensions : undefined
    )
    return allowed
  }

  handleFiles = async files => {
    const allowedExtensions = this.allowedExtensions()
    const allowedFiles = Object.values(files)
      .map(file => file)
      .filter(f => allowedExtensions.includes(f.type))
    allowedFiles.map(file => readFileIntoMemory(file, this.processedFile))
    // this.setState({ processing: false })
  }

  processedFile = fileInfo => {
    const { receiveFile } = this.props

    receiveFile(fileInfo)
    this.setState({ stage: 0 })
  }

  onDrop = e => {
    e.stopPropagation()
    e.preventDefault()
    this.setState({
      dragStatus: "",
    })
    const files = this.extractFiles(e.dataTransfer.files)
    this.handleFiles(files)

    // let file = this.extractSingleFile(e.dataTransfer.files)

    // this.processFile(file)
  }

  onDragEnter = e => {
    e.stopPropagation()
    e.preventDefault()
    if (this.state.dragStatus !== "dropHover") {
      this.setState({
        dragStatus: "dropHover",
      })
    }
  }

  onDragLeave = e => {
    e.stopPropagation()
    e.preventDefault()
    if (this.state.dragStatus !== "") {
      this.setState({
        dragStatus: "",
      })
    }
  }

  onDragOver = e => {
    e.stopPropagation()
    e.preventDefault()
    if (this.state.dragStatus !== "dropHover") {
      this.setState({
        dragStatus: "dropHover",
      })
    }
  }

  onZoneClick = e => {
    e.stopPropagation()
    // e.preventDefault()
    // this.refs.uploadInput.click()
  }
}

DnDFileReader.propTypes = {
  FileType: PropTypes.string,
}

export default withStyles(styles)(DnDFileReader)
