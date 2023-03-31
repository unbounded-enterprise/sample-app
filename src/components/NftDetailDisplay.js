import { Box, Button, Card, FormControl, Grid, InputLabel, Typography, Select, MenuItem, TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from '@mui/material';
import dynamic from 'next/dynamic'
import React from 'react';

const DisplayNFTWithNoSSR = dynamic(
  () => import('src/components/DisplayNFT'),
  { ssr: false }
)

const slotButtonStyle = { color: 'white', border: '1px solid white', fontSize: '4vw' };
var propertyString = "No Properties Set";
var expressionNames = [];
var apps = [""];
var select = (e) => {};

export const NftPropertyDisplay = ({ nft, properties, setProperties }) => {
  apps = [""];
  select = (e) => {
    if (nft.properties[e.target.value]) {
      setProperties(Object.entries(nft.properties[e.target.value]));
    }
    else {
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
    <Grid
      item
      key={nft.nftId}
      xs={12}
    >
      <Typography variant="p2" sx={{ alignSelf:"end", fontWeight:'bold',fontSize:{ xs: '12px', sm: '14px', md: '16px', lg: '16px', xl: '18px'}}}>
        Properties &emsp;
      </Typography>
      <FormControl sx={{ width:"20%", right:0, p:1 }}>
        <InputLabel id="demo-simple-select-label">Select App</InputLabel>
        <Select
          defaultValue={""}
          value={apps}
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
      <Box sx={{ width: 650 }}>
        <TableContainer>
          <Table aria-label="simple table" sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell>Property</TableCell>
                <TableCell align="right">Value</TableCell>
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
                  <TableCell align="right">
                    { JSON.stringify(property[1]) }
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>          
    </Grid>
  )
}

export const NftDetailDisplay = ({ nft, setCurrentExpression, currentExpression }) => {
  propertyString = "No Properties Set";
  expressionNames = [];

  if (nft.properties) {
    propertyString = JSON.stringify(nft.properties, 2, null);
  }
  
  if (nft.expressionValues) {
    nft.expressionValues.forEach(element => {
      if(!expressionNames.includes(element.expression.expressionName)){
        expressionNames.push(element.expression.expressionName);
      }
    });
  }

  return (
    <Grid
      item
      key={nft.nftId}
      xs={12}
      onClick={()=>{
        //setChosenNFT(nft);
      }}
    >
      <Card
        variant="outlined"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          p: 1,
          m: 1,
        }}
      >
        <DisplayNFTWithNoSSR 
          assetlayerNFT={nft}
          expression={currentExpression}
          //defaultAnimation={'durodog_idle_1'} // this would need to be abstracted. maybe look for idle or just go alphabetical?
          // defaultAnimation={defaultAnimation}
          showAnimations={true}
          // animationAlign={isMobileDevice?'top':'right'}
          nftSizePercentage={65}
          // onLoaded={onLoaded}
        />
      </Card>
      { expressionNames.map((name) => (
        <React.Fragment key={name}>
          <Button onClick={()=>{ setCurrentExpression(name); }}>
            { name }
          </Button>          
        </React.Fragment>
      )) }
    </Grid>
  )
}