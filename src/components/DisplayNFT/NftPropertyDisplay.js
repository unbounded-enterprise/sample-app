import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography, Grid, Box } from '@mui/material';
import DropdownMenu from '../widgets/DropdownMenu';

const PropertyRow = ({ property, depth }) => {
  const key = property[0];
  const value = property[1];
  const isObject = typeof value === 'object' && value !== null;
  const isTopLevel = depth === 0;
  const smallSize = Math.round((8 / depth)) + 'px';
  const commonPadding = {
    paddingTop: isTopLevel ? '16px' : smallSize,
    paddingBottom: isTopLevel ? '16px' : smallSize,
  };

  return (
    <>
      <TableRow key={key}>
        <TableCell
          component="th"
          scope="row"
          sx={{
            paddingLeft: depth * 4,
            fontWeight: isTopLevel ? 'bold' : 'normal',
            ...commonPadding,
          }}
        >
          {key}
        </TableCell>
        <TableCell
          align="left"
          sx={{
            ...commonPadding,
          }}
        >
          {isObject ? null : JSON.stringify(value)}
        </TableCell>
      </TableRow>
      {isObject &&
        Object.entries(value).map(subProperty => (
          <PropertyRow key={subProperty[0]} property={subProperty} depth={depth + 1} />
        ))
      }
    </>
  );
};

export const NftPropertyDisplay = ({ nft }) => {
  const [allProperties, setAllProperties] = useState(null);
  const [appProperties, setAppProperties] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [apps, setApps] = useState([]);

  useEffect(() => {
    if (nft && nft.properties) {
      setAllProperties(nft.properties);
    }
  }, [nft]);

  useEffect(() => {
    if (allProperties && selectedApp && allProperties[selectedApp]) {
      setAppProperties(Object.entries(allProperties[selectedApp]));
    }
  }, [allProperties, selectedApp]);

  useEffect(() => {
    if (allProperties) {
      setApps(Object.keys(allProperties));
    }
  }, [allProperties]);

  useEffect(() => {
    if (apps && apps.length > 0) {
      setSelectedApp(apps[0] || null);
    } else {
      setSelectedApp('');
    }
  }, [apps]);

  const handleDropdownChange = (value) => {
    setSelectedApp(value);
  };

  return (
    <>
      {nft ? (
        <Grid item key={nft.nftId} sx={{ my: '1rem' }} xs={12}>
          <Typography variant="p2" sx={{ alignSelf: 'end', fontWeight: 'bold', fontSize: { xs: '12px', sm: '14px', md: '16px', lg: '16px', xl: '18px' } }}>
            Properties &emsp;
          </Typography>
          <Box sx={{ my: '1rem', width: { xs: '12rem', sm: '16rem', md: '18rem', lg: '18rem', xl: '18rem' } }}>
            <DropdownMenu optionsArray={apps} onChange={handleDropdownChange} defaultValue={selectedApp} />
          </Box>
          <Box sx={{}}>
            <TableContainer>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell align="left">Property</TableCell>
                    <TableCell align="left">Value</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {appProperties && appProperties.map(property => (
                    <PropertyRow key={property[0]} property={property} depth={0} />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Grid>
      ) : (
        <Typography>No NFT Selected</Typography>
      )}
    </>
  );
};