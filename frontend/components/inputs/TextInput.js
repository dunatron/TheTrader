import React from "react"
import PropTypes from "prop-types"
import TextInput from "../styles/input/TextInput"

const PureTextInput = ({
  value,
  name,
  label,
  color,
  id,
  helperText,
  onChange,
  ...props
}) => {
  return (
    <TextInput
      id={id}
      name={name}
      color={color ? color : "secondary"}
      label={label}
      value={value}
      onChange={onChange}
      helperText={helperText}
      margin="normal"
      {...props}
    />
  )
}

PureTextInput.propTypes = {
  id: PropTypes.any.isRequired,
  name: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  label: PropTypes.string,
  color: PropTypes.oneOf(["primary", "secondary"]),
  onChange: PropTypes.func.isRequired,
  helperText: PropTypes.string,
}

export default PureTextInput
