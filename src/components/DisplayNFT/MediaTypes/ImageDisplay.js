/* eslint-disable @next/next/no-img-element */
import React from 'react';
import { Box } from '@mui/material';

const DisplayImage = ({ src, maxSize = { width: '100%', height: '100%' } }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        width: maxSize.width,
        height: maxSize.height,
      }}
    >
      <img
        src={src}
        alt="NFT"
        style={{
          maxWidth: '100%',
          maxHeight: '100%',
          objectFit: 'contain',
        }}
      />
    </Box>
  );
};

export default DisplayImage;
