import React, { useState } from 'react';
import { Box, Grid, Typography, Link, Button, useMediaQuery, useTheme } from '@mui/material';

const CollectionDetailsInfos = ({ creator, appName, slotName, totalSupply, collectionName, type }) => {
  const [showDetails, setShowDetails] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <Box>
      {isMobile && (
        <Button size="large" sx={{ fontSize:20, color: '#6B7280' }} onClick={() => setShowDetails(!showDetails)}>
          Details {showDetails ? '▲' : '▼'}
        </Button>
      )}
      {(showDetails || !isMobile) && (
        <Box>
          <Grid sx={{ my: '0.2rem' }} container spacing={2}>
            <Grid item xs={12} sm="auto">
              <Typography variant="p2" sx={{ lineHeight: '25px', marginBottom: "40px" }}>
                <b>Creator:</b> {creator}
              </Typography>
            </Grid>
            <Grid item xs={12} sm="auto">
              <Typography variant="p2" sx={{ lineHeight: '25px', marginBottom: "40px" }}>
                <b>App:</b> {appName}
              </Typography>
            </Grid>
            <Grid item xs={12} sm="auto">
              <Typography variant="p2" sx={{ lineHeight: '25px', marginBottom: "40px" }}>
                <b>Slot:</b> {slotName}
              </Typography>
            </Grid>
          </Grid>
          <Grid sx={{ my: '0.2rem' }} container spacing={2}>
            <Grid item xs={12} sm="auto">
              <Typography variant="p2" sx={{ lineHeight: '25px', marginBottom: "40px" }}>
                <b>Total Supply:</b> {totalSupply}
              </Typography>
            </Grid>
            <Grid item xs={12} sm="auto">
              <Typography variant="p2" sx={{ lineHeight: '25px', marginBottom: "40px" }}>
                <b>Collection:</b> {collectionName}
              </Typography>
            </Grid>
            <Grid item xs={12} sm="auto">
              <Typography variant="p2" sx={{ lineHeight: '25px', marginBottom: "40px" }}>
                <b>Type:</b> {type}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
};

export default CollectionDetailsInfos;
