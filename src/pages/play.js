import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { AssetLayer } from '@assetlayer/sdk-client';

const assetlayer = (typeof window !== 'undefined') ? new AssetLayer({ baseUrl: '/api' }) : undefined;

const Play = () => {
  const [initialized, setInitialized] = useState(false);
  const runOnceRef = useRef(false);

  function onInitialized() {
    setInitialized(true);
  }

  useEffect(() => {
    console.log('initialized!', initialized);
    if (!initialized) return;

    assetlayer.users.getUser().then(user => console.log('user!', user));
  }, [initialized]);

  useEffect(() => {
    if (runOnceRef.current) return;

    assetlayer.initialize(onInitialized);

    return () => {
      runOnceRef.current = true;
    }
  }, []);

  return (<Fragment>
    <PlayUnity/>
  </Fragment>);
}

const PlayUnity = () => {
  const { unityProvider, loadingProgression, isLoaded, sendMessage, addEventListener, removeEventListener } = useUnityContext({
    loaderUrl: "unity/Build/magic-test-build.loader.js",
    dataUrl: "unity/Build/magic-test-build.data",
    frameworkUrl: "unity/Build/magic-test-build.framework.js",
    codeUrl: "unity/Build/magic-test-build.wasm",
  });
  // const [isGameOver, setIsGameOver] = useState(false);
  // const [userName, setUserName] = useState();
  // const [score, setScore] = useState();

  const handleGameOver = useCallback((userName, score) => {
    // setIsGameOver(true);
    // setUserName(userName);
    // setScore(score);
  }, []);

  function handleClickSpawnEnemies() {
    // sendMessage("GameController", "SpawnEnemies", 100);
  }

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