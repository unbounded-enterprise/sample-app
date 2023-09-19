import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { Button, Stack } from "@mui/material";
import { MainLayout } from "src/components/main-layout";
import { useAssetLayer } from "src/contexts/assetlayer-context.js"; // Import the hook
import { LoginContent } from "src/components/login-content";

const Play = () => {
  const [unityLoaded, setUnityLoaded] = useState(false);
  const {
    assetlayerClient,
    loggedIn,
    handleUserLogin,
    unityOn,
    setUnityOn,
    gameEnded,
    setGameEnded,
  } = useAssetLayer(); // Use the hook to get the client and loggedIn state

  const sendMessageRef = useRef(null);
  const runOnceRef = useRef(false);

  useEffect(() => {
    if (!loggedIn || !unityLoaded || !assetlayerClient.didToken) return;

    assetlayerClient.users.getUser().then((user) => {
      sendMessageRef.current(
        "LoginReceiver",
        "SetDIDToken",
        assetlayerClient.didToken
      );
    });
  }, [unityLoaded]);

  useEffect(() => {
    if (loggedIn && !gameEnded) {
      setUnityOn(true);
    }
  }, [loggedIn]);

  useEffect(() => {
    console.log("in this gameEnded useeffect, ", gameEnded);
    if (gameEnded) {
      setUnityOn(false);
    }
  }, [gameEnded]);

  useEffect(() => {
    if (runOnceRef.current) return;
    return () => {
      runOnceRef.current = true;
    };
  }, []);

  useEffect(() => {
    if (!document.querySelector(`script[src="https://cdn.applixir.com/applixir.sdk3.0m.js"]`)) {
      const script = document.createElement('script');
      script.src = "https://cdn.applixir.com/applixir.sdk3.0m.js";
      document.body.appendChild(script);
    }
  }, []);

  async function logoutClicked() {
    assetlayerClient.logoutUser();
    handleUserLogin(false);
    setInitialized(false);
  }

  async function loginClicked() {
    setShowLoading(true);
    const loggedInAlready = await assetlayerClient.isUserLoggedIn();
    if (!loggedInAlready) {
      console.log("not logged in yet");
      assetlayerClient.loginUser({ onSuccess: onInitialized });
    } else {
      console.log("logged in already");
      assetlayerClient.initialize(onInitialized);
    }
  }

  return (
    <main
      style={{
        backgroundImage: `url("/static/Rotating Menu.gif")`,
        backgroundSize: "auto 100vh",
        backgroundRepeat: "no-repeat",
        backgroundColor: "transparent",
        height: "100vh", // This ensures the background image covers the entire viewport height
        overflow: "hidden", // This ensures no overflow from the main container
        backgroundPosition: "center", // This centers the image horizontally
      }}
    >
      <Fragment>
        {!loggedIn ? (
          <>
            <LoginContent
              assetlayerClient={assetlayerClient}
              handleUserLogin={handleUserLogin}
            />
          </>
        ) : (
          <>
            {!unityOn ? (
              <>
                <Button
                  variant="contained"
                  color="primary"
                  sx={{
                    backgroundColor: "#045CD2", // Set the background color
                    width: "100%",
                    mb: 5,
                    boxShadow: "0px 3px 5px 2px rgba(0, 0, 0, .3)", // Add drop shadow
                    fontWeight: "bold", // Bold font
                    "&:hover::before": {
                      // Use the ::before pseudo-element for the overlay
                      content: '""',
                      position: "absolute",
                      top: 0,
                      borderRadius: "5px",
                      right: 0,
                      bottom: 0,
                      left: 0,
                      backgroundColor: "rgba(255, 255, 255, 0.1)", // 10% white overlay
                      zIndex: 1, // Ensure the overlay is above the card content but below any interactive elements
                    },
                    "&:hover": {
                      backgroundColor: "#045CD2", // Keep the background color consistent when hovered
                      boxShadow: "0px 3px 5px 2px rgba(0, 0, 0, .3)", // Add drop shadow
                    },
                  }}
                  onClick={() => {
                    setGameEnded(false);
                    setUnityOn(true);
                  }}
                >
                  Play Again
                </Button>
              </>
            ) : (
              <PlayUnity
                sendMessageRef={sendMessageRef}
                setUnityLoaded={setUnityLoaded}
                gameEnded={gameEnded}
                setGameEnded={setGameEnded}
              />
            )}
          </>
        )}
      </Fragment>
        <div id="applixir_vanishing_div" style={{ position: 'absolute', hidden: true, zIndex: 2000 }}>
          <iframe id="applixir_parent" allowed="autoplay" style={{ border: 'none' }}></iframe>
        </div>
    </main>
  );
};

const PlayUnity = ({
  sendMessageRef,
  setUnityLoaded,
  gameEnded,
  setGameEnded,
}) => {
  const {
    unityProvider,
    loadingProgression,
    isLoaded,
    unload,
    sendMessage,
    addEventListener,
    removeEventListener,
  } = useUnityContext({
    loaderUrl: "unity/Build/WebGL.loader.js",
    dataUrl: "unity/Build/WebGL.data",
    frameworkUrl: "unity/Build/WebGL.framework.js",
    codeUrl: "unity/Build/WebGL.wasm",
  });

  const handleGameOver = useCallback((userName, score) => {}, []);

  async function handleClickBack() {
    await removeEventListener();
    await unload();
    setGameEnded(true);
  }

  useEffect(() => {
    // Add event listeners
    addEventListener("GameOver", handleGameOver);

    // Cleanup function
    return () => {
      removeEventListener("GameOver", handleGameOver);
      sendMessage.current = null;
      const unityCanvas = document.querySelector("#unity-canvas");
      if (unityCanvas) {
        unityCanvas.remove();
      }
    };
  }, [addEventListener, removeEventListener, handleGameOver]);

  useEffect(() => {
    // Add event listeners
    addEventListener("GameOver", handleGameOver);

    // Cleanup function
    return () => {
      removeEventListener("GameOver", handleGameOver);
      sendMessage.current = null;
      const unityCanvas = document.querySelector("#unity-canvas");
      if (unityCanvas) {
        unityCanvas.remove();
      }
    };
  }, []);

  useEffect(() => {
    setUnityLoaded(isLoaded);
  }, [isLoaded, setUnityLoaded]);

  useEffect(() => {
    if (sendMessage) {
      sendMessageRef.current = sendMessage;
    }
  }, [sendMessage, sendMessageRef]);

  useEffect(() => {
    // addEventListener("GameOver", handleGameOver);
    // return () => (removeEventListener("GameOver", handleGameOver));
  }, [addEventListener, removeEventListener, handleGameOver]);

  return (
    <Fragment>
      {!isLoaded && (
        <p>Loading Application... {Math.round(loadingProgression * 100)}%</p>
      )}
      <Stack>
        <Unity
          unityProvider={unityProvider}
          style={{
            position: "relative", // or 'absolute'
            top: 0,
            left: 0,
            zIndex: 1000, // any value higher than the z-index of your navbar
            visibility: isLoaded ? "visible" : "hidden",
            width: "100%",
            height: "96.5vh",
          }}
        />
        <Button
          variant="contained"
          color="primary"
          sx={{
            backgroundColor: "#045CD2", // Set the background color
            width: "100%",
            mb: 5,
            boxShadow: "0px 3px 5px 2px rgba(0, 0, 0, .3)", // Add drop shadow
            fontWeight: "bold", // Bold font
            "&:hover::before": {
              // Use the ::before pseudo-element for the overlay
              content: '""',
              position: "absolute",
              top: 0,
              borderRadius: "5px",
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: "rgba(255, 255, 255, 0.1)", // 10% white overlay
              zIndex: 1, // Ensure the overlay is above the card content but below any interactive elements
            },
            "&:hover": {
              backgroundColor: "#045CD2", // Keep the background color consistent when hovered
              boxShadow: "0px 3px 5px 2px rgba(0, 0, 0, .3)", // Add drop shadow
            },
          }}
          onClick={handleClickBack}
        >
          Back
        </Button>
      </Stack>
    </Fragment>
  );
};

Play.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default Play;
