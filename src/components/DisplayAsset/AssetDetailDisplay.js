import dynamic from 'next/dynamic'
import React, { useEffect, useState, useCallback } from 'react';
import { Box, Button, Card, FormControl, Grid, InputLabel, Typography, Select, Stack, MenuItem, 
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody, useMediaQuery, appBarClasses } from '@mui/material';
import { getExpressionValue, parseAnimations, playAnimation } from './DisplayAsset';
import AudioDisplay from './MediaTypes/AudioDisplay';
import DropdownMenu from '../widgets/DropdownMenu';
import { AssetPropertyDisplay } from './AssetPropertyDisplay';

const DisplayAssetWithNoSSR = dynamic(
  () => import('src/components//DisplayAsset/DisplayAsset'),
  { ssr: false }
);

const ButtonGrid = ({ buttonTexts, onChange }) => {
  const handleClick = (text) => {
    onChange(text);
  };

  return (
    <Grid container spacing={2}>
      {buttonTexts &&
        buttonTexts.map((text, index) => (
          <React.Fragment key={index}>
            <Grid item xs={6} sm={4}>
              <Box display="flex" justifyContent="flex-start">
                <Button
                  variant="contained"
                  sx={{
                    width: '100%',
                    whiteSpace: 'nowrap',
                    textOverflow: 'ellipsis',
                    overflow: 'hidden',
                    backgroundColor: '#1c6cf9',
                    color: 'white',
                    boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                    borderRadius: '8px',
                    fontSize: { xs: '10px', sm: '12px', md: '14px', lg: '16px', xl: '18px' },
                  }}
                  onClick={() => handleClick(text)}
                >
                  {text}
                </Button>
              </Box>
            </Grid>
          </React.Fragment>
        ))
      }
    </Grid>
  );
};

var slotButtonStyle;

export function parseExpressionNames(asset) {
  const expressionNames = [];
  if (asset.expressionValues) {
    asset.expressionValues.forEach((element) => {
      if (!expressionNames.includes(element.expression.expressionName)) {
        expressionNames.push(element.expression.expressionName);
      }
    });
  }
  return expressionNames;
}

export const AssetDetailDisplay = ({ asset }) => {
  slotButtonStyle = { color: 'white', border: '1px solid white', fontSize: '4vw' };
  const [expressionNames, setExpressionNames] = useState(['Menu View']);
  const [spine, setSpine] = useState(null);
  const [app, setApp] = useState(null);
  const [audioFile, setAudioFile] = useState(null); 
  const [videoFile, setVideoFile] = useState(null);
  const [assets, setAssets] = useState([]);
  const [animationNames, setAnimationNames] = useState(null);
  const [currentExpression, setCurrentExpression] = useState('Menu View');
  


  const matches900 = useMediaQuery('(max-width:900px)');
  const matches1920 = useMediaQuery('(max-width:1920px)');

  const [frameHeight, setFrameHeight] = useState(matches900 ? '90vw' : '35vw');

  useEffect(()=>{
    if (asset) {
      setExpressionNames(parseExpressionNames(asset));
      setAssets([asset]);
    }
  }, [asset])

  const onLoaded = useCallback((loadedSpine) => {
    setSpine(loadedSpine);
    if (loadedSpine) {
      setAnimationNames(parseAnimations(loadedSpine));
    } else {
      setAnimationNames(null);
    }
  }, []);

  const onAudioLoaded = useCallback((audioPath) => {
    setAudioFile(audioPath);
  }, []);

  const onVideoLoaded = useCallback((videoPath) => {
    setVideoFile(videoPath);
  }, [])

  // this useEffect removes the fixed height if the content is video or audio files.
  // the height will depend on the background image (menu view) or video file aspect ratio.
  useEffect(() => {
    if (!spine && (audioFile || videoFile)) {
      setFrameHeight(undefined); 
    } else {
      setFrameHeight(matches900 ? '90vw' : '35vw');
    }
  }, [spine, matches900, audioFile, videoFile]);

  const onAppLoaded = useCallback((app) => {
    setApp(app);
    console.log('pixi app created: ', app);
  }, [])

  function animationChange(animationName) {
    if (spine) {
      playAnimation(animationName, spine, true);
    }
  }

  return (
    <>
      {asset ? (
        <Grid container item key={asset.assetId} xs={12}>
          <Grid item xs={matches900 ? 12 : "auto"}>
            <Box display="flex" justifyContent={matches900 ? "center" : "flex-start"}>
              <Card
                variant="outlined"
                sx={{
                  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                  p: 1,
                  m: 1,
                  width: matches900 ? '90vw' : '35vw',
                  height: frameHeight,
                  maxWidth: '40vh',
                  maxHeight: '40vh',
                  position: 'relative',
                }}
              >
                <DisplayAssetWithNoSSR
                  assetlayerAssets={assets}
                  expression={currentExpression}
                  assetSizePercentage={75}
                  onSpineLoaded={onLoaded}
                  onAudioLoaded={onAudioLoaded}
                  onVideoLoaded={onVideoLoaded}
                  onAppLoaded={onAppLoaded}
                />
              </Card>
            </Box>
          </Grid>
          <Grid item xs={matches900 ? 12 : 6} sx={{ padding: '1rem', paddingLeft: { xs: '1rem', sm: '3rem' } }}>
            <Stack spacing={3}>
              <Typography variant="h5">Expressions</Typography>
              <Box sx={{ maxWidth: '15rem' }}>
                <DropdownMenu optionsArray={expressionNames} onChange={setCurrentExpression} defaultValue={'Menu View'} />
              </Box>
              {animationNames && animationNames.length > 0 && (
                <>
                  <Typography variant="h5">Animations</Typography>
                  <Box sx={{ width: '100%', maxHeight: '40vh', overflow: 'auto' }}>
                    <ButtonGrid buttonTexts={animationNames} onChange={animationChange} />
                  </Box>
                </>
              )}
              {audioFile && (
                <>
                  <Stack alignItems="flex-start" justifyContent="flex-start">
                    <Box sx={{ width: '20rem' }}>
                      <AudioDisplay
                        src={audioFile}
                        backgroundImage={null}
                        playIcon={null}
                        displayAudioControls={true}
                      />
                    </Box>
                  </Stack>
                </>
              )}
            </Stack>
          </Grid>
          {matches900 && (
            <Grid item xs={12} md={12} lg={12} xl={12} sx={{ backgroundColor: 'none' }}>
              <AssetPropertyDisplay asset={asset} />
            </Grid>
          )}
        </Grid>
      ) : (
        <Grid item>
          <Typography>No Asset Loaded</Typography>
        </Grid>
      )}
      {!matches900 && (
        <Grid item xs={12} md={12} lg={12} xl={12} sx={{ backgroundColor: 'none' }}>
          <AssetPropertyDisplay asset={asset} />
        </Grid>
      )}
    </>
  );
};