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
        padding: '10%',
        width: maxSize.width,
        height: maxSize.height,
      }}
    >
      <img
        src={src}
        alt="NFT"
        style={{
          width: '100%',
          boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
          height: '100%',
          objectFit: 'contain',
        }}
      />
    </Box>
  );
};

export default DisplayImage;
