/* eslint-disable @next/next/no-img-element */
/** @jsxImportSource @emotion/react */
import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
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
 * Arguments:
 * - props: The properties object.
 *   - src: The source of the audio file.
 *   - autoPlay (optional, default = false): Whether the audio should start playing as soon as it's ready.
 *   - onLoaded (optional): Callback function triggered after the audio metadata is loaded. It receives the loaded audio element as an argument.
 *   - displayAudioControls (optional, default = false): Whether to display the audio controls.
 *   - backgroundImage (optional, default = null): The background image of the audio player.
 *   - playIcon (optional, default = '/static/audioIcon.png'): The icon to display for the play button.
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
  const [imageSize, setImageSize] = useState({width: '100%', height: '100%'});
  const [boxWidth, setBoxWidth] = useState(0);

  const boxRef = useRef();
  const resizeObserver = useRef(null);

  useLayoutEffect(() => {
    const box = boxRef.current;

    // Create a new ResizeObserver instance that updates the state
    // with the element's new width whenever it changes.
    resizeObserver.current = new ResizeObserver(entries => {
      for (let entry of entries) {
        setBoxWidth(entry.contentRect.width);
      }
    });

    // start observing the box for resize changes
    if (box) {
      resizeObserver.current.observe(box);
    }

    // Clean up function to stop observing the box when the component is unmounted.
    return () => {
      if (box) {
        resizeObserver.current.unobserve(box);
      }
    };
  }, []);

  useEffect(() => {
    if (backgroundImage) {
      // Create a new Image instance and set its source.
      // This is done to calculate the image's aspect ratio for sizing.
      const img = new Image();
      img.onload = () => {
        const aspectRatio = img.height / img.width;
        setImageSize({ 
          height: boxWidth * aspectRatio,
          width: boxWidth,
        });
      };
      img.src = backgroundImage;
    }
  }, [backgroundImage, boxWidth]);

  // Callback function for the audio element's onLoadedMetadata event.
  const handleAudioLoad = (e) => {
    if (onLoaded) {
      // Pass the audio element to the onLoaded callback.
      onLoaded(e.target);
    }
  };

  // Event handler for the play icon's onClick event.
  const handlePlayIconClick = () => {
    const audio = audioRef.current;
    // Toggle between play and pause states.
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  return (
    <Box
      ref={boxRef}
      sx={{
        width: '80%',
        height: imageSize.height,
        display: 'flex',
        alignItems: 'center',
        margin: '10%',
        borderRadius: '8px',
        justifyContent: 'center',
        paddingBottom: displayAudioControls ? '16px' : '0',
        overflow: 'hidden',
      }}
    >
      {backgroundImage && (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            position: 'relative',
          }}
        >
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
        </Box>
      )}
      {playIcon && (
        <img
          src={playIcon}
          alt="Play"
          onClick={handlePlayIconClick}
          style={{
            position: 'absolute',
            width: imageSize.width*1, // Adjust this value to change the size of the icon.
            maxHeight: imageSize.height*1,
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
          position: (backgroundImage || playIcon) ? 'relative' : 'relative',
          bottom: 'auto',
          zIndex: 1,
        }}
      >
        Your browser does not support the audio element.
      </audio>
    </Box>
  );
};

export default AudioDisplay;
