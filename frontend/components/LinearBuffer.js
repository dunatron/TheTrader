import React from "react"
import PropTypes from "prop-types"
import LinearProgress from "@material-ui/core/LinearProgress"

const LinearBuffer = props => {
  const { size, currentSize, color } = props
  const progress = (currentSize / size) * 100
  const bufferProgress = progress * 1.2
  return <LinearProgress variant="determinate" color={color} value={progress} />
}

LinearBuffer.propTypes = {
  classes: PropTypes.object.isRequired,
}

export default LinearBuffer
