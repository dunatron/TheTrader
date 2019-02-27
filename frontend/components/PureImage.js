import React from "react"
import CardMedia from "@material-ui/core/CardMedia"
import encodeImage from "../lib/encodeImage"

const ImageComponent = React.memo(function ImageComponent(props) {
  console.log("ImageComponent => ", props)
  /* render using props */
  const file = props.file
  const src = file.url
    ? file.url
    : "data:image/png;base64," + encodeImage(file.content)
  return <CardMedia component="img" src={src} image={src} title={file.name} />
})

export default ImageComponent
