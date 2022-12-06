import styled from '@emotion/styled';
import { Typography, Box, Container } from '@mui/material';

export const Footer = () => {

  return (
    <Container 
        maxWidth="lg"
        sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            pt: 3
          }}
    >
            Powered By
            <img style={{width: '15%'}} src='/static/assetlayer_logo.png' alt='' />
        <Box
            sx={{
            backgroundColor: 'background.default',
            borderTopWidth: 1,
            pb: 6,
            pt: 3
            }}
        >
                <Typography
                    color="textSecondary"
                    variant="caption"
                >
                    NFT Sample App.  All Rights Reserved.
                </Typography>
        </Box>
    </Container>
  );
};
