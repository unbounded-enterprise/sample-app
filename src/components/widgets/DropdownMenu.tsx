import React, { useState, useEffect } from 'react';
import { FormControl, Select, MenuItem, InputLabel } from '@mui/material';


/* 
  optionsArray can be an array of string 
  or
  an array of { value: string, display: string }
*/ 
const DropdownMenu = ({ optionsArray, onChange, defaultValue, label, sx={} }) => {
  const [value, setValue] = useState(defaultValue || '');

  useEffect(() => {
    if (defaultValue) {
      setValue(defaultValue);
    }
  }, [defaultValue]);

  const handleChange = (event) => {
    setValue(event.target.value);
    onChange(event.target.value);
  };

  const itemsArray = optionsArray;

  return (
    <FormControl fullWidth sx={sx}>
      <InputLabel htmlFor="dropdown-menu" sx={{ color: '#3361AD' }}>
        {label}
      </InputLabel>
      <Select
        value={value}
        onChange={handleChange}
        label={label}
        inputProps={{ 'aria-label': 'Dropdown menu', id: 'dropdown-menu' }}
        sx={{
          color: '#3361AD',
          backgroundColor: 'white',
          '&:hover': {
            backgroundColor: 'white',
          },
        }}
      >
        {itemsArray.map((item, index) => (
          <MenuItem key={index} value={item.value ? item.value : item} sx={{ color: '#3361AD' }}>
            {item.display ? item.display : item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default DropdownMenu;
