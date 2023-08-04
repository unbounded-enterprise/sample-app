import React, { Fragment, useCallback, useEffect, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";

const Play = () => {
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
  function handleClickMagicLogin() {
    
  }

  useEffect(() => {
    // addEventListener("GameOver", handleGameOver);

    // return () => (removeEventListener("GameOver", handleGameOver));
  }, [addEventListener, removeEventListener, handleGameOver]);

  return (<Fragment>
    { !isLoaded && (
      <p>Loading Application... {Math.round(loadingProgression * 100)}%</p>
    ) }
    <button onClick={handleClickMagicLogin}>
        Login with Magic
    </button>
    <Unity unityProvider={unityProvider}
      style={{ visibility: isLoaded ? "visible" : "hidden" }}
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