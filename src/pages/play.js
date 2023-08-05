import React, { Fragment, useCallback, useEffect, useRef, useState } from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { BasicTextField } from "../components/widgets/basic/basic-textfield";
import { Dialog } from "@mui/material";

const Play = () => {
  const [email, setEmail] = useState('');
  const runOncePleaseRef = useRef(false);

  function handleClickMagicLogin() {
    console.log('click!')
  }
  function handleEmailChange(e) {
    console.log('e!')
    console.log(e.target.value)
  }

  useEffect(() => {
    if (runOncePleaseRef.current) return;

    var iframe = document.createElement('iframe');
    iframe.src = '/unity/index.html';
    iframe.style.position = 'absolute';
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    document.body.appendChild(iframe);

    return () => {
      runOncePleaseRef.current = true;
    }
  }, []);

  return (<Fragment>
    <input value={email} onChange={handleEmailChange}/>
    <button onClick={handleClickMagicLogin}>
        Login with Magic
    </button>
  </Fragment>);
}

const UnityIFrame = () => {
  return <iframe src="/unity/index.html" style="width: 800px; height: 600px;"></iframe>
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