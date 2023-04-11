import { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Box, Button, Card, CardContent, CardHeader, Divider, useTheme, Container, Typography, Grid } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import NextLink from 'next/link';
import { createEmotionCache } from '../../utils/create-emotion-cache';
import { authApi } from '../../_api_/auth-api';
// import HandCashService from "../../utils/HandCashService";

export const HomeHandcash = (props) => {
  const theme = useTheme();
  const [redirectionUrl, setRedirectionUrl] = useState("/")

  useEffect(() => {
    authApi.getRedirectionURL().then((url) => { if (url) setRedirectionUrl(url); });
  }, []);

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        pt: 6,
        pb: '8em'
      }}
      {...props}
    >    
      <Container
        maxWidth="md"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Typography
          align="center"
          variant="h4"
          sx={{ py: 4 }}
        >
          Connect to HandCash
        </Typography>
          <NextLink href={redirectionUrl} legacyBehavior passHref>
                <Button startIcon={<img style={{ height: '1.5em', marginBottom: '2px', width: '1.5em' }} src='/static/icons/handcash1024.png' />} sx={{
                  height: '4em',
                  backgroundColor: '#38CB7B', marginLeft: 'auto', marginRight: 'auto',
                  color: 'white',
                  fontSize: '1em',
                  px: '1em',
                  textTransform: 'none',
                  '&:hover': {
                      backgroundColor: '#38CB7B',
                      transform: 'scale(1.01)',
                  }
                      }}>
                        Login with HandCash
                </Button>
        </NextLink>
      </Container>
    </Box>
  );
};
