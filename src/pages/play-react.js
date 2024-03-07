import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { AssetLayer } from '@assetlayer/sdk';
import {Button, CircularProgress, Stack} from '@mui/material';
import CryptoJS from "crypto-js";


const assetlayer = (typeof window !== 'undefined') ? new AssetLayer({ baseUrl: '/api' }) : undefined;

// NOTE: react-unity-webgl example is deprecated
const Play = () => {
  const [initialized, setInitialized] = useState(false);
  const [sendMessage, setSendMessage] = useState(null);
  const [unityLoaded, setUnityLoaded] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const sendMessageRef = useRef(null);
  const runOnceRef = useRef(false);

  function onInitialized() {
    setInitialized(true);
  }

  useEffect(() => {
    if (!initialized || !unityLoaded || !assetlayer.didToken ) return;

    assetlayer.users.getUser().then(user => {
          sendMessageRef.current("LoginReceiver", "SetDIDToken", assetlayer.didToken);
  })}, [initialized, unityLoaded]);


  useEffect(() => {
    if (runOnceRef.current) return;

    // assetlayer.initialize(onInitialized);

    return () => {
      runOnceRef.current = true;
    }
  }, []);

  async function logoutCLicked() {
    assetlayer.logoutUser();
    setInitialized(false);  
  }


  async function loginClicked() {
    setShowLoading(true);
    const loggedInAlready = await assetlayer.isUserLoggedIn();
    if (!loggedInAlready) {
      console.log('not logged in yet');
      assetlayer.loginUser({onSuccess: onInitialized});
    } else {
      console.log('logged in already');
      assetlayer.initialize(onInitialized);
    }
  }

  return (<Fragment>
    {!initialized ? 
    <>
      <Stack alignItems="center" justifyContent="center" sx={{height: '95vh'}}>
      {showLoading? <CircularProgress /> 
      :
      <Button variant="contained" sx={{color: 'white', width: '40%'}} onClick={loginClicked}>Login</Button>
      }
      </Stack>
    </>
    : 
    <>
      <PlayUnity sendMessageRef={sendMessageRef} setUnityLoaded={setUnityLoaded}/>
      <Button variant="contained" sx={{color: 'white'}} onClick={logoutCLicked}>Logout</Button>
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
      style={{ visibility: (isLoaded) ? "visible" : "hidden" }}
    />
  </Fragment>);
}

/*
Play.getLayout = (page) => (
  <MainLayout>
    { page }
  </MainLayout>
);
*/

export default Play;