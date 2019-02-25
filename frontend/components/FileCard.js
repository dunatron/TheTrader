import React, { Component } from "react"
import PropTypes from "prop-types"
import Card from "./styles/Card"
import CardHeader from "@material-ui/core/CardHeader"
import CardMedia from "@material-ui/core/CardMedia"
import CardContent from "@material-ui/core/CardContent"
import DeleteFile from "./DeleteFile"
import RenameFile from "./RenameFile"

class FileCard extends Component {
  static propTypes = {
    file: PropTypes.shape({
      url: PropTypes.string.isRequired,
      filename: PropTypes.string.isRequired,
    }).isRequired,
  }

  render() {
    const { file } = this.props
    return (
      <Card raised={true} theme={{ maxWidth: 350 }} style={{ margin: 10 }}>
        <CardHeader
          style={{ paddingBottom: 0 }}
          avatar={<DeleteFile id={file.id}>Delete Forever</DeleteFile>}
          title={<RenameFile id={file.id} filename={file.filename} />}
        />
        {/* <RenameFile id={file.id} filename={file.filename} /> */}
        <CardContent>
          <CardMedia
            component="img"
            src={file.url}
            image={file.url}
            title={file.filename}
          />
        </CardContent>
      </Card>
    )
  }
}

export default FileCard
