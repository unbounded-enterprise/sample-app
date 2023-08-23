import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { AssetLayer } from '@assetlayer/sdk-client';
import CryptoJS from "crypto-js";
import { CircularProgress, Stack } from "@mui/material";

const assetlayer = (typeof window !== 'undefined') ? new AssetLayer({ baseUrl: '/api' }) : undefined;

const Play = () => {
  const [initialized, setInitialized] = useState(false);
  const runOnceRef = useRef(false);

  function onInitialized() {
    setInitialized(true);
  }

  useEffect(() => {
    if (!initialized || !assetlayer.didToken ) return;

    assetlayer.users.getUser().then(user => {
          contactUnityEncrypted(assetlayer.didToken);
          

  })}, [initialized]);

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
    
      // Decrypt data here if needed
      
      return data;
    } catch (error) {
      console.log("Error:", error);
      return null;
    }
  }

  useEffect(() => {
    if (runOnceRef.current) return;
    
    
    desktopLoginHandling();
    return () => {
      runOnceRef.current = true;
    }
  }, []);

  async function desktopLoginHandling() {
    const loggedInAlready = await assetlayer.isUserLoggedIn();
    if (!loggedInAlready) {
      assetlayer.loginUser({onSuccess: onInitialized});
    } else {
      assetlayer.initialize(onInitialized);
    }
  }

  async function logoutCLicked() {
    assetlayer.logoutUser();
    setInitialized(false);  
  }


  async function loginClicked() {
    const loggedInAlready = await assetlayer.isUserLoggedIn();
    if (!loggedInAlready) {
      assetlayer.loginUser({onSuccess: onInitialized});
    }
  }

  return (<Fragment> 
    <>
      {initialized?
      <><Stack alignItems="center" justifyContent="center" sx={{height: '95vh'}}>You can return to your app now </Stack></>
      :
      <><Stack alignItems="center" justifyContent="center" sx={{height: '95vh'}}>Please follow the login instructions <CircularProgress /></Stack></>
      }
       
    </>
  </Fragment>);
}

export default Play;