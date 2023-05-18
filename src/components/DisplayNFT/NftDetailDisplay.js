import dynamic from 'next/dynamic'
import React, { useEffect, useState, useCallback } from 'react';
import { Box, Button, Card, FormControl, Grid, InputLabel, Typography, Select, Stack, MenuItem, 
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody, useMediaQuery, appBarClasses } from '@mui/material';
import { getExpressionValue, parseAnimations, playAnimation } from './DisplayNFT';
import AudioDisplay from './MediaTypes/AudioDisplay';
import DropdownMenu from '../widgets/DropdownMenu';
import { NftPropertyDisplay } from './NftPropertyDisplay';

const DisplayNFTWithNoSSR = dynamic(
  () => import('src/components//DisplayNFT/DisplayNFT'),
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

export function parseExpressionNames(nft) {
  const expressionNames = [];
  if (nft.expressionValues) {
    nft.expressionValues.forEach((element) => {
      if (!expressionNames.includes(element.expression.expressionName)) {
        expressionNames.push(element.expression.expressionName);
      }
    });
  }
  return expressionNames;
}

export const NftDetailDisplay = ({ nft }) => {
  slotButtonStyle = { color: 'white', border: '1px solid white', fontSize: '4vw' };
  const [expressionNames, setExpressionNames] = useState(['Menu View']);
  const [spine, setSpine] = useState(null);
  const [app, setApp] = useState(null);
  const [audioFile, setAudioFile] = useState(null); 
  const [nfts, setNfts] = useState([]);
  const [animationNames, setAnimationNames] = useState(null);
  const [currentExpression, setCurrentExpression] = useState('Menu View');


  const matches900 = useMediaQuery('(max-width:900px)');
  const matches1920 = useMediaQuery('(max-width:1920px)');

  useEffect(()=>{
    if (nft) {
      setExpressionNames(parseExpressionNames(nft));
      setNfts([nft]);
    }
  }, [nft])

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
      {nft ? (
        <Grid container item key={nft.nftId} xs={12}>
          <Grid item xs={matches900 ? 12 : "auto"}>
            <Box display="flex" justifyContent={matches900 ? "center" : "flex-start"}>
              <Card
                variant="outlined"
                sx={{
                  boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
                  p: 1,
                  m: 1,
                  width: matches900 ? '90vw' : '35vw',
                  height: matches900 ? '90vw' : '35vw',
                  maxWidth: '40vh',
                  maxHeight: '40vh',
                  position: 'relative',
                }}
              >
                <DisplayNFTWithNoSSR
                  assetlayerNFTs={nfts}
                  expression={currentExpression}
                  nftSizePercentage={75}
                  onSpineLoaded={onLoaded}
                  onAudioLoaded={onAudioLoaded}
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
              <NftPropertyDisplay nft={nft} />
            </Grid>
          )}
        </Grid>
      ) : (
        <Grid item>
          <Typography>No Nft Loaded</Typography>
        </Grid>
      )}
      {!matches900 && (
        <Grid item xs={12} md={12} lg={12} xl={12} sx={{ backgroundColor: 'none' }}>
          <NftPropertyDisplay nft={nft} />
        </Grid>
      )}
    </>
  );
};