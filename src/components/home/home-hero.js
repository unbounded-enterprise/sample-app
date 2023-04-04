import { Bar } from 'react-chartjs-2';
import { Box, Button, Link, useTheme, Container, Typography, Grid } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import { authApi } from '../../_api_/auth-api';



export const HomeHero = (props) => {
  const theme = useTheme();
  const [redirectionUrl, setRedirectionUrl] = useState("/")
  const {app} = props;

  useEffect(() => {
    authApi.getRedirectionURL().then((url) => { if (url) setRedirectionUrl(url); });
    console.log(redirectionUrl);
  }, []);
  
  return (
    <Box
      sx={{
        pt: 2,
        pb: '2em'
      }}
      {...props}
    >    
      <Container
        maxWidth="md"
        sx={{
          mt:'6em',
          ml:'6em',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography
          align="left"
          variant="h4"
          sx={{mb:".5em"}}
        >
          Welcome to {app.appName}
        </Typography>
        <Typography
          align="left"
          variant="h5"
          sx={{ mb: '2em', mr:'5em'  }}
        >
          {app.description}
        </Typography>
        <NextLink href={redirectionUrl} legacyBehavior passHref>
                <Button startIcon={<img style={{ height: '1.5em', marginBottom: '2px', width: '1.5em' }} 
                src='/static/icons/handcash1024.png' />} 
                sx={{
                  height: '4em',
                  width: '20em',
                  backgroundColor: '#38CB7B', 
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
