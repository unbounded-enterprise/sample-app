import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { AssetLayer } from '@assetlayer/sdk-client';
import { Box, TextField, Button, CircularProgress, Card, CardContent, Typography, CardMedia, Stack } from "@mui/material";
import CryptoJS from "crypto-js";
import { MainLayout } from 'src/components/main-layout';

import { useAssetLayer } from 'src/contexts/assetlayer-context.js'; // Import the hook



//const assetlayer = (typeof window !== 'undefined') ? new AssetLayer({ baseUrl: '/api' }) : undefined;

const Play = () => {
  const [initialized, setInitialized] = useState(false);
  const [sendMessage, setSendMessage] = useState(null);
  const [email, setEmail] = useState("");
  const [emailAlt, setEmailAlt] = useState("");
  const [newUser, setNewUser] = useState(false);
  const [unityLoaded, setUnityLoaded] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const { assetlayerClient, loggedIn, setLoggedIn } = useAssetLayer(); // Use the hook to get the client and loggedIn state

  const sendMessageRef = useRef(null);
  const runOnceRef = useRef(false);

  function onInitialized() {
    setLoggedIn(true);
    setInitialized(true);
  }

  useEffect(() => {
    if (!loggedIn || !unityLoaded || !assetlayerClient.didToken ) return;

    assetlayerClient.users.getUser().then(user => {
          sendMessageRef.current("LoginReceiver", "SetDIDToken", assetlayerClient.didToken);
  })}, [initialized, unityLoaded]);

  useEffect(() => {
    if (!loggedIn){
      setEmail("");
      setEmailAlt("");
    };

  }, [loggedIn]);
  
  useEffect(() => {
    if (runOnceRef.current) return;

    // assetlayer.initialize(onInitialized);

    return () => {
      runOnceRef.current = true;
    }
  }, []);

  async function logoutCLicked() {
    assetlayerClient.logoutUser();
    setLoggedIn(false);
    setInitialized(false);  
  }


  async function loginClicked() {
    setShowLoading(true);
    const loggedInAlready = await assetlayerClient.isUserLoggedIn();
    if (!loggedInAlready) {
      console.log('not logged in yet');
      assetlayerClient.loginUser({onSuccess: onInitialized});
    } else {
      console.log('logged in already');
      assetlayerClient.initialize(onInitialized);
    }
  }

  return (<Fragment>
    {!loggedIn ? 
    <>
      <Stack alignItems="center" justifyContent="center" sx={{height: '95vh'}}>
      {showLoading? <CircularProgress /> 
      :
      <>{newUser? <Stack alignItems="center" justifyContent="center" sx={{height: '100vh'}}>
      <Card sx={{ 
        backgroundColor: 'rgba(50, 50, 50, 0.9)', // Transparent gray
        borderRadius: '15px', // Rounded edges
        width: '600px',
        textAlign: 'center',
        p: 3 // Padding for more spacing
      }}>
        <CardMedia
          component="img"
          height="140"
          image="static/Rolltopia Logo Just Text.png" // Replace with your image path
          alt="Your Image"
        />
        <CardContent sx={{ pt: 3 }}>
          <Typography variant="subtitle1" color="white" component="div" sx={{ textAlign: 'left', mb: 2, fontSize: '1.2rem' }}>
            Enter your Email Address to get Started
          </Typography>
          <TextField
            variant="standard"
            value={emailAlt}
            onChange={(e) => setEmailAlt(e.target.value)}
            sx={{ 
              marginBottom: '2em', 
              width: '100%', 
              height: '50px', 
              backgroundColor: 'white', 
              color: 'black',
              borderRadius: '5px',
              pl: 2 // padding-left
            }}
            placeholder="user@assetlayer.com"
            InputProps={{
              disableUnderline: true,
              style: { color: 'black', lineHeight: '50px' } // Vertically center the text
            }}
          />
          <Button 
          variant="contained" 
          color="primary" 
          sx={{
            backgroundColor: '#045CD2', // Set the background color
            '&:hover': {
              backgroundColor: '#045CD2', // Set hover color
            },
            width: '100%', 
            mb: 5,
            boxShadow: '0px 3px 5px 2px rgba(0, 0, 0, .3)', // Add drop shadow
            fontWeight: 'bold' // Bold font
          }}
          onClick={() => {assetlayerClient.loginUser({email: emailAlt, onSuccess: onInitialized}); setEmail(""); setEmailAlt("");}}
        >
            Sign Up
          </Button>
          <Button 
  variant="text" 
  sx={{
    backgroundColor: 'transparent', // No background color
    color: 'white', // Text color
    textDecoration: 'underline', // Underlined text
    textTransform: 'none', // Keep the text as-is (don't uppercase)
    '&:hover': {
      backgroundColor: 'transparent', // No background color on hover
      textDecoration: 'underline', // Keep the underline on hover
    },
    width: 'auto', // Auto width
    mb: 5, // Margin bottom
    fontWeight: 'normal' // Normal font weight
  }}
  onClick={() => setNewUser(false)}
>
  Returning User?
</Button>

          <CardMedia
            component="img"
            alignContent= 'center'
            sx={{
              maxHeight: '30px', // or any size you want
              width: 'auto', // maintain aspect ratio
              margin: 'auto'
            }}
            image="static/Powered by AL Big.png" // Replace with your second image path
            alt="Your Second Image"
          />
        </CardContent>
      </Card>
    </Stack>
     :
      <Stack alignItems="center" justifyContent="center" sx={{height: '100vh'}}>
  <Card sx={{ 
    backgroundColor: 'rgba(50, 50, 50, 0.9)', // Transparent gray
    borderRadius: '15px', // Rounded edges
    width: '600px',
    textAlign: 'center',
    p: 3 // Padding for more spacing
  }}>
    <CardMedia
      component="img"
      height="140"
      image="static/Rolltopia Logo Just Text.png" // Replace with your image path
      alt="Your Image"
    />
    <CardContent sx={{ pt: 3 }}>
      <Typography variant="h4" color="white" component="div" sx={{ fontWeight: 'normal', mb: 2 }}>
        Returning User?
      </Typography>
      <Typography variant="subtitle1" color="white" component="div" sx={{ textAlign: 'left', mb: 2, fontSize: '1.2rem' }}>
        Account Email
      </Typography>
      <TextField
        variant="standard"
        value={email}
        onChange={(e) => {e.preventDefault(); setEmail(e.target.value);
        console.log("email: ", email);}}
        sx={{ 
          marginBottom: '2em', 
          width: '100%', 
          height: '50px', 
          backgroundColor: 'white', 
          color: 'black',
          borderRadius: '5px',
          pl: 2 // padding-left
        }}
        placeholder="user@assetlayer.com"
        InputProps={{
          disableUnderline: true,
          style: { color: 'gray', lineHeight: '50px' } // Vertically center the text
        }}
      />
      <Button 
        variant="contained" 
        color="primary" 
        sx={{
          backgroundColor: '#045CD2', // Set the background color
          '&:hover': {
            backgroundColor: '#045CD2', // Set hover color
          },
          width: '100%', 
          mb: 5,
          boxShadow: '0px 3px 5px 2px rgba(0, 0, 0, .3)', // Add drop shadow
          fontWeight: 'bold' // Bold font
        }}
        onClick={() => {assetlayerClient.loginUser({email, onSuccess: onInitialized}); setEmail(""); setEmailAlt("");}}
      >
        Sign In
      </Button>
      <Typography variant="h4" color="white" component="div" sx={{ fontWeight: 'normal', mb: 2 }}>
        New User?
      </Typography>
      <Button 
      variant="contained" 
      color="primary" 
      sx={{
        backgroundColor: '#045CD2', // Set the background color
        '&:hover': {
          backgroundColor: '#045CD2', // Set hover color
        },
        width: '100%', 
        mb: 5,
        boxShadow: '0px 3px 5px 2px rgba(0, 0, 0, .3)', // Add drop shadow
        fontWeight: 'bold' // Bold font
      }}
      onClick={() => setNewUser(true)}
    >
        Create an Account
      </Button>
      <CardMedia
        component="img"
        alignContent= 'center'
        sx={{
          maxHeight: '30px', // or any size you want
          width: 'auto', // maintain aspect ratio
          margin: 'auto'
        }}
        image="static/Powered by AL Big.png" // Replace with your second image path
        alt="Your Second Image"
      />
    </CardContent>
  </Card>
</Stack>}</>
      }
      </Stack>
    </>
    : 
    <>
      <Stack alignItems="center"  sx={{height: '100vh'}}>

      <PlayUnity sendMessageRef={sendMessageRef} setUnityLoaded={setUnityLoaded}/>
      </Stack>
    </>
    }
  </Fragment>);
}

const PlayUnity = ({ sendMessageRef, setUnityLoaded }) => {
  const { unityProvider, loadingProgression, isLoaded, sendMessage, addEventListener, removeEventListener } = useUnityContext({
    loaderUrl: "unity/Build/WEBGL.loader.js",
    dataUrl: "unity/Build/WEBGL.data",
    frameworkUrl: "unity/Build/WEBGL.framework.js",
    codeUrl: "unity/Build/WEBGL.wasm",
  });

  const handleGameOver = useCallback((userName, score) => {
  }, []);


  useEffect(()=>{
    setUnityLoaded(isLoaded);
  },[isLoaded, setUnityLoaded])

  useEffect(()=>{
    if (sendMessage) {
      sendMessageRef.current = sendMessage;
    }
  }, [sendMessage, sendMessageRef])

  useEffect(() => {
    // addEventListener("GameOver", handleGameOver);

    // return () => (removeEventListener("GameOver", handleGameOver));
  }, [addEventListener, removeEventListener, handleGameOver]);

  return (<Fragment>
    { !isLoaded && (
      <p>Loading Application... {Math.round(loadingProgression * 100)}%</p>
    ) }
    <Unity unityProvider={unityProvider}
      style={{ visibility: (isLoaded) ? "visible" : "hidden",
      width: '93%', 
      height: '93%'  }}
    />
  </Fragment>);
}


Play.getLayout = (page) => (
  <MainLayout>
    { page }
  </MainLayout>
);


export default Play;