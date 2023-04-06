import dynamic from 'next/dynamic'
import React, { useState } from 'react';
import { Box, Button, Card, FormControl, Grid, InputLabel, Typography, Select, Stack, MenuItem, 
  TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import { parseAnimations, playAnimation } from '../DisplayNFT';

const DisplayNFTWithNoSSR = dynamic(
  () => import('src/components/DisplayNFT'),
  { ssr: false }
);

const DropdownMenu = ({ optionsArray, onChange, defaultValue }) => {
  const [value, setValue] = useState(defaultValue || 'Menu View');

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
  console.log('buttons: ', buttonTexts);
  return (
    <Grid container spacing={2}>
      {buttonTexts && buttonTexts.map((text, index) => (
        <React.Fragment  key={index}>
        <Grid item xs={4}>
          <Box display="flex" justifyContent="center">
            <Button variant="contained"
            sx={{
              width: '100%',
              whiteSpace: 'nowrap', 
              textOverflow: 'ellipsis',
              overflow: 'hidden',
              backgroundColor: '#1c6cf9',
              color: 'white',
              boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
              borderRadius: '8px',
            }}
            onClick={() => handleClick(text)}>
              {text}
            </Button>
          </Box>
        </Grid>
        </React.Fragment>
      ))}
    </Grid>
  );
};


var apps;
var select;

export const NftPropertyDisplay = ({ nft, properties, setProperties }) => {
  apps = [""];
  select = (e) => {
    if (nft.properties[e.target.value]) {
      setProperties(Object.entries(nft.properties[e.target.value]));
    } else {
      setProperties(null);
    }
  }

  if (nft.properties) {
    apps = apps.concat(Object.keys(nft.properties));
  } else {
    apps = ["none found"];
  }
    
  if (!nft) {
    nft = { nftId: 1 };
  }
    
  return (
    <Grid item key={nft.nftId} xs={12}>
      <Typography variant="p2" sx={{ alignSelf:"end", fontWeight:'bold', fontSize: { xs: '12px', sm: '14px', md: '16px', lg: '16px', xl: '18px' }}}>
        Properties &emsp;
      </Typography>
      <FormControl sx={{ width: "20%", right: 0, p: 1 }}>
        <InputLabel id="demo-simple-select-label">
          Select App
        </InputLabel>
        <Select
          defaultValue={apps[0]}
          value={apps[0]}
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="Select App"
          onChange={select}
        >
          { apps.map((app) => (
            <MenuItem key={app} value={app}>
              { app }
            </MenuItem>  
          )) }
        </Select>
      </FormControl>
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
              { properties && properties.map((property) => (
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
  )
}

var slotButtonStyle;
var propertyString;
var expressionNames;

export const NftDetailDisplay = ({ nft, setCurrentExpression, currentExpression }) => {
  slotButtonStyle = { color: 'white', border: '1px solid white', fontSize: '4vw' };
  propertyString = "No Properties Set";
  expressionNames = [];
  const [spine, setSpine] = useState(null);
  const [animationNames, setAnimationNames] = useState(null);

  function onLoaded(loadedSpine) {
    if (loadedSpine) {
      setSpine(loadedSpine);
      setAnimationNames(parseAnimations(loadedSpine.spineData));
    }
  }

  function animationChange(animationName) {
    if (spine) {
      playAnimation(animationName, spine, true);
    }
  }

  if (nft.properties) {
    propertyString = JSON.stringify(nft.properties, 2, null);
  }

  if (nft.expressionValues) {
    nft.expressionValues.forEach((element) => {
      if (!expressionNames.includes(element.expression.expressionName)) {
        expressionNames.push(element.expression.expressionName);
      }
    });
  }

  return (
    <Grid item container key={nft.nftId} xs={12}  onClick={() => { /*setChosenNFT(nft);*/ }}>
      <Grid item>
        <Card variant="outlined" sx={{
        boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
        p: 1,
        m: 1,
        width: '25vw', 
        height: '25vw',
      }}>
          <DisplayNFTWithNoSSR 
            assetlayerNFT={nft}
            expression={currentExpression}
            // defaultAnimation={'durodog_idle_1'} // this would need to be abstracted. maybe look for idle or just go alphabetical?
            // defaultAnimation={defaultAnimation}
            showAnimations={false}
            // animationAlign={ (isMobileDevice) ? 'top' : 'right' }
            nftSizePercentage={75}
            onLoaded={onLoaded}
            />
        </Card>
      </Grid>
      <Grid item xs={8} sx={{padding: '1rem', paddingLeft: '3rem'}}>
        <Stack spacing={3}>
          <Typography variant='h5'>Expressions</Typography>
          <Box sx={{maxWidth: '15rem'}}><DropdownMenu optionsArray={expressionNames} onChange={setCurrentExpression} /></Box>
          <Typography variant='h5'>Animations</Typography>
          <Box sx={{width: '50%', maxHeight: '40vh', overflow: 'auto'}}><ButtonGrid buttonTexts={animationNames} onChange={animationChange} /></Box>
        </Stack>
      </Grid>
    </Grid>
  )
}