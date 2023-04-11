import React from 'react';
import { Box } from '@mui/material';

const DisplayImage = ({ src, onLoaded, maxSize = { width: '100%', height: '100%' } }) => {
  const handleImageLoad = (e) => {
    if (onLoaded) {
      onLoaded(e.target);
    }
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        maxWidth: maxSize.width,
        maxHeight: maxSize.height,
      }}
    >
      <img
        src={src}
        alt="NFT"
        onLoad={handleImageLoad}
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
