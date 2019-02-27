import React from "react"
import MenuItem from "@material-ui/core/MenuItem/MenuItem"
import InputLabel from "@material-ui/core/InputLabel"
import Select from "@material-ui/core/Select/Select"
import FormControl from "../styles/FormControl"
import SelectOption from "../styles/input/SelectOption"

const SelectInput = ({
  classes,
  value,
  name,
  options,
  label,
  id,
  helperText,
  onChange,
}) => {
  // Note initial value should be of same type of the list values e.g int, string
  return (
    <FormControl>
      {label && <InputLabel htmlFor={id}>{label}</InputLabel>}
      <Select
        name={name}
        value={value}
        onChange={onChange}
        inputProps={{
          name: name,
          id: id,
        }}>
        {options.map((d, i) => {
          return (
            // subheading in themes controls this 
            <SelectOption key={i} value={d.value} component="li">
              {d.name}
            </SelectOption>
          )
        })}
      </Select>
    </FormControl>
  )
}

export default SelectInput
