import type { FC } from 'react';
import type { StandardTextFieldProps, FilledTextFieldProps, OutlinedTextFieldProps } from '@mui/material';
import { TextField } from '@mui/material';

export const textfieldStyleEnabled = {
  backgroundColor: '#FFFFFF',
  color: '#666666',
  '& fieldset': {
    borderColor: '#AAAAAA',
  },
  input: {
    "&::placeholder": {
      color: '#999999',
    }
  },
  textarea: {
    "&::placeholder": {
      color: '#999999',
    }
  },
}

export const textfieldStyleDisabled = {
  backgroundColor: '#FBFBFB',
  input: {
    "&::placeholder": {
      color: '#AAAAAA !important',
      'WebkitTextFillColor': '#AAAAAA !important',
    }
  },
  textarea: {
    "&::placeholder": {
      color: '#AAAAAA !important',
      'WebkitTextFillColor': '#AAAAAA !important',
    }
  },
}

export type BasicTextFieldProps = StandardTextFieldProps | FilledTextFieldProps | OutlinedTextFieldProps;

// note likely lacking support for non-outlined input styling
export const BasicTextField: FC<BasicTextFieldProps> = ({ sx={}, ...props }) => {

  return (
    <TextField 
      InputLabelProps={{ sx: { color: "#555555" } }} 
      sx={{ '& .MuiOutlinedInput-root': (props.disabled) ? textfieldStyleDisabled : textfieldStyleEnabled, ...sx }}
      { ...props } 
    />
  );
};

export default BasicTextField;