import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { AssetLayer } from '@assetlayer/sdk-client';
import CryptoJS from "crypto-js";
import { Box, TextField, Button, CircularProgress, Card, CardContent, Typography, CardMedia, Stack } from "@mui/material";
import { MainLayout } from 'src/components/main-layout';
import { useAssetLayer } from 'src/contexts/assetlayer-context.js'; // Import the hook



//const assetlayer = (typeof window !== 'undefined') ? new AssetLayer({ baseUrl: '/api' }) : undefined;

const Play = () => {
  const [initialized, setInitialized] = useState(false);
  const [email, setEmail] = useState("");
  const [emailAlt, setEmailAlt] = useState("");
  const { assetlayerClient, loggedIn, setLoggedIn } = useAssetLayer(); // Use the hook to get the client and loggedIn state
  const runOnceRef = useRef(false);

  function onInitialized() {
    setLoggedIn(true);
  }

  useEffect(() => {
    if (!loggedIn || !assetlayerClient.didToken ) return;
    assetlayerClient.users.getUser().then(user => {
          contactUnityEncrypted(assetlayerClient.didToken);
          

  })}, [loggedIn]);

  async function contactUnityEncrypted(token) {
    const key = CryptoJS.enc.Utf8.parse('1234567812345678'); // 128-bit key
    const iv = CryptoJS.enc.Utf8.parse('1234567812345678');  // 128-bit IV
    
    const encrypted = CryptoJS.AES.encrypt(
      token, 
      key,
      { 
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      }
    );
  
    const encryptedToken = encrypted.toString();
  
    // Construct URL
    const url = `http://localhost:8080/loginUnity?token=${encodeURIComponent(encryptedToken)}`;
  
    try {
      const response = await fetch(url);
      const data = await response.text();
      console.log("Data:", data);
    
      // Decrypt data here if needed
      
      return data;
    } catch (error) {
      console.log("Error:", error);
      return null;
    }
  }

  useEffect(() => {
    if (runOnceRef.current) return;
    
    
    //desktopLoginHandling();
    return () => {
      runOnceRef.current = true;
    }
  }, []);

  async function desktopLoginHandling() {
    const loggedInAlready = await assetlayerClient.isUserLoggedIn();
    if (!loggedInAlready) {
      assetlayerClient.loginUser({onSuccess: onInitialized});
    } else {
      assetlayerClient.initialize(onInitialized);
    }
  }

  async function logoutCLicked() {
    assetlayerClient.logoutUser();
    setInitialized(false);  
  }


  async function loginClicked() {
    const loggedInAlready = await assetlayerClient.isUserLoggedIn();
    if (!loggedInAlready) {
      assetlayerClient.loginUser({onSuccess: onInitialized});
    }
  }

  return (
    <main
    style={{
      backgroundImage: `url("/static/Utopia Background Landscape.png")`,
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat",
      backgroundColor: "transparent",
    }}
  >
  <Fragment> 
    
      {loggedIn?
      <><Stack alignItems="center" justifyContent="center" sx={{height: '100vh'}}>
      <Card sx={{ 
        backgroundColor: 'rgba(100, 100, 100, 0.8)', // Transparent gray
        borderRadius: '15px', // Rounded edges
        width: '600px',
        textAlign: 'center'
      }}>
        <CardMedia
          component="img"
          height="140"
          image="static/Rolltopia Logo Just Text.png" // Replace with your image path
          alt="Your Image"
        />
        <CardContent>
          <Typography variant="h5" color="white" component="div">
            Success, you are now logged in!
          </Typography>
          <Typography variant="h4" color="white">
            <br />
            You can now return to your game
          </Typography>
        </CardContent>
      </Card>
    </Stack></>
      :
      <><Stack alignItems="center" justifyContent="center" sx={{height: '100vh'}}>
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
        onChange={(e) => setEmail(e.target.value)}
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
        onClick={() => assetlayerClient.loginUser({email, onSuccess: onInitialized})}
      >
        Login
      </Button>
      <Typography variant="h4" color="white" component="div" sx={{ fontWeight: 'normal', mb: 2 }}>
        New User?
      </Typography>
      <Typography variant="subtitle1" color="white" component="div" sx={{ textAlign: 'left', mb: 2, fontSize: '1.2rem' }}>
        Account Email
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
      onClick={() => assetlayerClient.loginUser({emailAlt, onSuccess: onInitialized})}
    >
        Create New Account
      </Button>
      <CardMedia
        component="img"
        alignContent= 'center'
        sx={{
          maxHeight: '40px', // or any size you want
          width: 'auto', // maintain aspect ratio
          margin: 'auto'
        }}
        image="static/Powered by AL Big.png" // Replace with your second image path
        alt="Your Second Image"
      />
    </CardContent>
  </Card>
</Stack>

</>
      }
  </Fragment></main>);
}

Play.getLayout = (page) => (
  <MainLayout>
    {page}
  </MainLayout>
);

export default Play;