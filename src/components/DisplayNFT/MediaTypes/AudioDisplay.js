/* eslint-disable @next/next/no-img-element */
/** @jsxImportSource @emotion/react */
import React, { useRef } from 'react';
import { Box } from '@mui/material';
import { css } from '@emotion/react';

const AudioDisplay = ({
  src,
  autoPlay = false,
  onLoaded,
  displayAudioControls = false,
  backgroundImage = null,
  playIcon = '/static/audioIcon.png',
}) => {
  const audioRef = useRef();

  const handleAudioLoad = (e) => {
    if (onLoaded) {
      onLoaded(e.target);
    }
  };

  const handlePlayIconClick = () => {
    const audio = audioRef.current;
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        cursor: 'default',
        paddingBottom: displayAudioControls ? '16px' : '0',
        overflow: 'hidden',
      }}
    >
      {backgroundImage && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
          css={css`
            background-image: url(${backgroundImage});
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            animation: zoomAndPan 20s linear infinite;
            transform-origin: center;

            &:after {
              content: '';
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              background-color: rgba(0, 0, 0, 0.4);
            }

            @keyframes zoomAndPan {
              0% {
                transform: scale(1) translateX(0);
              }
              50% {
                transform: scale(1.1) translateX(-5%);
              }
              100% {
                transform: scale(1) translateX(0);
              }
            }
          `}
        />
      )}
      {playIcon && (
        <img
          src={playIcon}
          alt="Play"
          onClick={handlePlayIconClick}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '100%',
            transform: 'translate(-50%, -50%)',
            opacity: 0.7,
            cursor: 'pointer',
            zIndex: 1,
          }}
        />
      )}
      <audio
        ref={audioRef}
        controls={displayAudioControls}
        src={src}
        autoPlay={autoPlay}
        onLoadedMetadata={handleAudioLoad}
        style={{
          position: (backgroundImage || playIcon)?'absolute':'relative',
          bottom: 0,
          zIndex: 1,
        }}
      >
        Your browser does not support the audio element.
      </audio>
    </Box>
  );
};

export default AudioDisplay;
