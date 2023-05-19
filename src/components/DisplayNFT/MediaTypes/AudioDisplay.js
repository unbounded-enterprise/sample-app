/* eslint-disable @next/next/no-img-element */
/** @jsxImportSource @emotion/react */
import React, { useRef } from 'react';
import { Box } from '@mui/material';
import { css } from '@emotion/react';

/**
 * AudioDisplay Component
 *
 * This component is designed to handle and display an audio file using the HTML5 audio element. It offers
 * the following functionalities:
 *
 * 1. Dynamic Audio Source: The component can dynamically load the audio source provided via the 'src' prop.
 *
 * 2. AutoPlay: The component can automatically start playing the audio as soon as it's ready, based on the 'autoPlay' prop.
 *
 * 3. Audio Controls: The component can optionally display the audio controls, based on the 'displayAudioControls' prop.
 *
 * 4. Background Image: The component can display a background image with a pan & zoom effect behind the audio player, provided via the 'backgroundImage' prop. 
 * 
 * 5. Play Icon: The component can display a custom play icon, provided via the 'playIcon' prop. This icon can be clicked to play or pause the audio.
 *
 * Callbacks:
 *
 * 6. onLoaded: This is a callback function that is triggered after the audio metadata is loaded. It allows the parent
 *    component to access and interact with the loaded audio element directly. This could be used for extending the
 *    functionality of the AudioDisplay component, or for any operations that require direct access to the audio element.
 *
 * @param {object} props The properties object.
 * @param {string} props.src The source of the audio file.
 * @param {boolean} [props.autoPlay=false] Whether the audio should start playing as soon as it's ready.
 * @param {function | undefined} [props.onLoaded] Callback function triggered after the audio metadata is loaded. It receives the loaded audio element as an argument.
 * @param {boolean} [props.displayAudioControls=false] Whether to display the audio controls.
 * @param {string | null} [props.backgroundImage=null] The background image of the audio player.
 * @param {string} [props.playIcon='/static/audioIcon.png'] The icon to display for the play button.
 */
const AudioDisplay = ({
  src,
  autoPlay = false,
  onLoaded,
  displayAudioControls = false,
  backgroundImage = null,
  playIcon = '/static/audioIcon.png',
}) => {
  const audioRef = useRef(); // A reference to the audio element.

  // This function is called when the audio metadata is loaded.
  const handleAudioLoad = (e) => {
    if (onLoaded) {
      onLoaded(e.target);
    }
  };

  // This function is called when the play icon is clicked.
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
        width: '80%',
        height: '80%',
        display: 'flex',
        alignItems: 'flex-end',
        margin: '10%',
        borderRadius: '8px',
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
            opacity: 0.5,
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
          position: (backgroundImage || playIcon) ? 'absolute' : 'relative',
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
