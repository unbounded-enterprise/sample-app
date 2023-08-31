import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import { Box, Button, Link, useTheme, Container, Typography, Grid } from '@mui/material';
import { Bar } from 'react-chartjs-2';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import { authApi } from '../../_api_/auth-api';
import { useAuth } from 'src/hooks/use-auth';
import { useAssetLayer } from 'src/contexts/assetlayer-context.js'; // Import the hook
import LoginButton from 'src/components/home/login-button';



export const HomeHero = (props) => {
  const [redirectionUrl, setRedirectionUrl] = useState("/");
  const { app } = props;
  const [user, setUser] = useState(null);
  const { assetlayerClient, loggedIn, setLoggedIn } = useAssetLayer(); // Use the hook to get the client and loggedIn state

  const theme = useTheme();

  const getUser = async () => {
    const {result: user} = await assetlayerClient.users.safe.getUser();
    return user;
  }

  useEffect(() => {
    authApi.getRedirectionURL().then((url) => { 
      if (url) setRedirectionUrl(url); 
    });
  }, []);

  useEffect(() => {
    if(loggedIn){
    getUser()
      .then((user) => {
        setUser(user)
      })
      .catch(e => { 
        const error = parseBasicErrorClient(e);
        console.log('setting error: ', error.message);
      });}
  }, [loggedIn]);

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
        { (!loggedIn) ? (
          <LoginButton />
        ) : <></>}
        { (loggedIn && user) ? (
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
        ) : <></>}
      </Container>
    </Box>
  );
};
