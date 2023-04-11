import { ChangeEvent, FC, KeyboardEvent, ReactNode, useCallback } from 'react';
import { Box, InputAdornment, TextField } from '@mui/material';
import type { SxProps } from '@mui/system';
import React, { useEffect, useRef, useState } from 'react';
import SearchIcon from '@mui/icons-material/Search';
import BasicTextField, { BasicTextFieldProps } from './basic-textfield';

export const BasicSearchbar: FC<BasicTextFieldProps> = ({ placeholder='Search', ...props }) => {
  return (
    <BasicTextField
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon fontSize="small" />
          </InputAdornment>
        )
      }}
      placeholder={placeholder}
      { ...props }
    />
  );
};