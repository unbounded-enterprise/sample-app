import React, { useEffect } from 'react';
import Box from '@mui/material/Box';

const VideoDisplay = ({ url, autoplay = false }) => {

  const videoRef = useRef();

  useEffect(() => {
    if (autoplay && videoRef.current) {
      videoRef.current.play();
    }
  }, [autoplay]);

  return (
      <Box component="div" sx={{my: '5px', mx: '10px'}}>
        <video
          ref={videoRef}
          src={url}
          controls
          style={{ 
            width: "100%",
            borderRadius: "10px" 
          }}
          autoPlay={autoplay}
        />
      </Box>
  );
};

export default VideoDisplay;
