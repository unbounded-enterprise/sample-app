import dynamic from 'next/dynamic'
import React, { useEffect, useState } from 'react';
import { Box, Button, Card, FormControl, Grid, InputLabel, Typography, Select, Stack, MenuItem, 
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody, useMediaQuery, appBarClasses } from '@mui/material';
import { getExpressionValue, parseAnimations, playAnimation } from './DisplayNFT';
import AudioDisplay from './MediaTypes/AudioDisplay';

const DisplayNFTWithNoSSR = dynamic(
  () => import('src/components//DisplayNFT/DisplayNFT'),
  { ssr: false }
);

const DropdownMenu = ({ optionsArray, onChange, defaultValue }) => {
  const [value, setValue] = useState(defaultValue || 'Menu View');

  useEffect(()=>{
    if (defaultValue) {
      setValue(defaultValue);
    }
  }, [defaultValue])

  const handleChange = (event) => {
    setValue(event.target.value);
    onChange(event.target.value);
  };

  const itemsArray = optionsArray;

  return (
    <FormControl fullWidth>
      <Select
        value={value}
        onChange={handleChange}
        sx={{color: '#3361AD' }}
        displayEmpty
        inputProps={{ 'aria-label': 'Dropdown menu' }}
      >
        {itemsArray.map((item, index) => (
          <MenuItem key={index} value={item} sx={{color: '#3361AD' }}>
            {item}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

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
        ))}
    </Grid>
  );
};

export const NftPropertyDisplay = ({ nft }) => {
  const [allProperties, setAllProperties] = useState(null); 
  const [appProperties, setAppProperties] = useState(null); 
  const [selectedApp, setSelectedApp] = useState(null);
  const [apps, setApps] = useState([]);

  useEffect(()=>{
    if (nft && nft.properties) {
      setAllProperties(nft.properties);
    }
  }, [nft])

  useEffect(()=>{
    if (allProperties && selectedApp && allProperties[selectedApp]) {
      setAppProperties(Object.entries(allProperties[selectedApp]))
    }
  }, [allProperties, selectedApp])

  useEffect(()=>{
    if (allProperties) {
      setApps(Object.keys(allProperties));
    }
  }, [allProperties])

  useEffect(()=>{
    if (apps && apps.length > 0) {
      setSelectedApp(apps[0] || null)
    } else {
      setSelectedApp('No Apps found')
    }
  }, [apps])

  const handleDropdownChange = (value) => {
    setSelectedApp(value);
  };
    
  return (
    <>
    {nft?
    <Grid item key={nft.nftId} sx={{my: '1rem'}} xs={12}>
      <Typography variant="p2" sx={{ alignSelf:"end", fontWeight:'bold', fontSize: { xs: '12px', sm: '14px', md: '16px', lg: '16px', xl: '18px' }}}>
        Properties &emsp;
      </Typography>
      <Box sx={{my: '1rem', width: { xs: '12rem', sm: '16rem', md: '18rem', lg: '18rem', xl: '18rem' }}}>
        <DropdownMenu
        optionsArray={apps}
        onChange={handleDropdownChange}
        defaultValue={selectedApp}
        />
      </Box>
      <Box sx={{  }}>
        <TableContainer>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell align="left">Property</TableCell>
                <TableCell align="left">Value</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              { appProperties && appProperties.map((property) => (
                <TableRow
                  key={property[0]}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    { property[0] }
                  </TableCell>
                  <TableCell align="left">{JSON.stringify(property[1])}</TableCell>
                </TableRow>
              )) }
            </TableBody>
          </Table>
        </TableContainer>
      </Box>          
    </Grid>
    :<Typography>No Nft Selected</Typography>}
    </>
  )
}

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
  const [expressionNames, setExpressionNames] = useState([]);
  const [spine, setSpine] = useState(null);
  const [audioFile, setAudioFile] = useState(null); 
  const [animationNames, setAnimationNames] = useState(null);
  const [currentExpression, setCurrentExpression] = useState('Menu View');


  const matches900 = useMediaQuery('(max-width:900px)');
  const matches1920 = useMediaQuery('(max-width:1920px)');

  useEffect(()=>{
    setExpressionNames(parseExpressionNames(nft));
  }, [nft])

  function onLoaded(loadedSpine) {
    setSpine(loadedSpine);
    if (loadedSpine) {
      setAnimationNames(parseAnimations(loadedSpine));
    } else {
      setAnimationNames(null);
    }
  }

  function onAudioLoaded(audioPath) {
    setAudioFile(audioPath);
  }

  function animationChange(animationName) {
    if (spine) {
      playAnimation(animationName, spine, true);
    }
  }



  return (
    <>
      {nft ? (
        <Grid container key={nft.nftId} xs={12}>
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
                  assetlayerNFT={nft}
                  expression={currentExpression}
                  nftSizePercentage={75}
                  onSpineLoaded={onLoaded}
                  onAudioLoaded={onAudioLoaded}
                />
              </Card>
            </Box>
          </Grid>
          <Grid item xs={matches900 ? 12 : 6} sx={{ padding: '1rem', paddingLeft: { xs: '1rem', sm: '3rem' } }}>
           
          <Stack spacing={3}>
              <Typography variant="h5">Expressions</Typography>
              <Box sx={{ maxWidth: '15rem' }}>
                <DropdownMenu optionsArray={expressionNames} onChange={setCurrentExpression} />
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