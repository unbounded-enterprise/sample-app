import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import { Box, Button, Link, useTheme, Container, Typography, Grid } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { authApi } from '../../_api_/auth-api';
import { useAuth } from 'src/hooks/use-auth';

export const HomeHero = (props) => {
  const [redirectionUrl, setRedirectionUrl] = useState("/");
  const { app } = props;
  const { user } = useAuth();
  const theme = useTheme();

  useEffect(() => {
    authApi.getRedirectionURL().then((url) => { 
      if (url) setRedirectionUrl(url); 
    });
  }, []);
  
  return (
    <Box 
      sx={{ pt: 2, pb: '2em' }}
      {...props}
    >    
      <Container
        maxWidth="md"
        sx={{
          mt:{ xs: '1em', md: '6em' },
          ml:{ xs: '.5em', md: '3em' },
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography
          align="left"
          variant="h4"
          sx={{ 
            mb: ".5em",
            mr:{ xs: '1em', md: '3em' } 
          }}
        >
          Welcome to {app.appName}
        </Typography>
        <Typography
          align="left"
          variant="h5"
          sx={{ 
            mb: '1em', 
            mr:{ xs: '1em', md: '3em' } 
          }}
        >
          { app.description }
        </Typography>
        { (!user) ? (
          <NextLink href={redirectionUrl} legacyBehavior passHref>
            <Button 
              startIcon={<img src='/static/icons/handcash1024.png' style={{ marginBottom: '2px', width: '1.5em' , height: '1.5em' }}/>} 
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
              }}
            >
              Login with HandCash
            </Button>
          </NextLink>
        ) : (
          <Typography
            align="left"
            variant="h5"
            sx={{ 
              mb: { xs: '.5em', md: '2em' }, 
              mr: { xs: '1em', md: '3em' } 
            }}
          >
            Greetings ${user.handle}!
          </Typography>
        ) }
      </Container>
    </Box>
  );
};
