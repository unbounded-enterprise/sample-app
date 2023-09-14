import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { AssetLayer } from "@assetlayer/sdk-client";
import {
  Box,
  TextField,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Typography,
  CardMedia,
  Stack,
} from "@mui/material";
import CryptoJS from "crypto-js";
import { MainLayout } from "src/components/main-layout";
import { useRouter } from "next/router";
import { useAssetLayer } from "src/contexts/assetlayer-context.js"; // Import the hook

//const assetlayer = (typeof window !== 'undefined') ? new AssetLayer({ baseUrl: '/api' }) : undefined;

const Play = () => {
  const [initialized, setInitialized] = useState(false);
  const [sendMessage, setSendMessage] = useState(null);
  const [email, setEmail] = useState("");
  const [unityLoaded, setUnityLoaded] = useState(false);
  const [showLoading, setShowLoading] = useState(false);
  const {
    assetlayerClient,
    loggedIn,
    handleUserLogin,
    unityOn,
    setUnityOn,
    gameEnded,
    setGameEnded,
  } = useAssetLayer(); // Use the hook to get the client and loggedIn state
  const router = useRouter();

  const sendMessageRef = useRef(null);
  const runOnceRef = useRef(false);
  function onInitialized() {
    handleUserLogin(true);
    setInitialized(true);
  }

  useEffect(() => {
    if (!loggedIn || !unityLoaded || !assetlayerClient.didToken) return;

    assetlayerClient.users.getUser().then((user) => {
      sendMessageRef.current(
        "LoginReceiver",
        "SetDIDToken",
        assetlayerClient.didToken
      );
    });
  }, [initialized, unityLoaded]);

  useEffect(() => {
    if (!loggedIn) {
      setEmail("");
    }
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

    // assetlayer.initialize(onInitialized);

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
        backgroundImage: `url("/static/fakeRunwayRoller.png")`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundColor: "transparent",
        height: "100vh", // This ensures the background image covers the entire viewport height
        overflow: "hidden", // This ensures no overflow from the main container
      }}
    >
      <Fragment>
        {!loggedIn ? (
          <>
            <Stack
              alignItems="center"
              justifyContent="center"
              sx={{ height: "95vh" }}
            >
              {showLoading ? (
                <CircularProgress />
              ) : (
                <>
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    sx={{ height: "100vh" }}
                  >
                    <Card
                      sx={{
                        backgroundColor: "rgba(50, 50, 50, 0.9)", // Transparent gray
                        borderRadius: "15px", // Rounded edges
                        width: "600px",
                        textAlign: "center",
                        p: 3, // Padding for more spacing
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="140"
                        image="static/Rolltopia Logo Just Text.png" // Replace with your image path
                        alt="Your Image"
                      />
                      <CardContent sx={{ pt: 3 }}>
                        <Typography
                          variant="h4"
                          color="white"
                          component="div"
                          sx={{ fontWeight: "normal", mb: 2 }}
                        >
                          Sign Up / Sign In
                        </Typography>
                        <Typography
                          variant="subtitle2"
                          color="white"
                          component="div"
                          sx={{ textAlign: "left", mb: 2, fontSize: "1.2rem" }}
                        >
                          Account Email
                        </Typography>
                        <TextField
                          variant="standard"
                          value={email}
                          onChange={(e) => {
                            e.preventDefault();
                            setEmail(e.target.value);
                          }}
                          sx={{
                            marginBottom: "2em",
                            width: "100%",
                            backgroundColor: "white",
                            color: "black",
                            borderRadius: "5px",
                            "& .MuiInputBase-input": {
                              height: "50px",
                              padding: "0 8px", // 0 top/bottom padding, 8px left/right padding
                              boxSizing: "border-box",
                            },
                          }}
                          placeholder="Your Email Address"
                          InputProps={{
                            disableUnderline: true,
                            style: { color: "gray" },
                          }}
                        />
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{
                            backgroundColor: "#045CD2", // Set the background color
                            "&:hover": {
                              backgroundColor: "#045CD2", // Keep the background color consistent when hovered
                              boxShadow: `3px 3px 8px rgba(0, 0, 0, 0.5)`,
                            },
                            width: "100%",
                            mb: 5,
                            cursor: "pointer",
                            boxShadow: `3px 3px 8px rgba(0, 0, 0, 0.5)`,
                            position: "relative", // Set the card's position to relative
                            "&:hover::before": {
                              // Use the ::before pseudo-element for the overlay
                              content: '""',
                              position: "absolute",
                              borderRadius: "5px",
                              top: 0,
                              right: 0,
                              bottom: 0,
                              left: 0,
                              backgroundColor: "rgba(255, 255, 255, 0.1)", // 10% white overlay
                              zIndex: 1, // Ensure the overlay is above the card content but below any interactive elements
                            },
                            fontWeight: "bold", // Bold font,
                          }}
                          onClick={() => {
                            if (email.length > 0) {
                              assetlayerClient.loginUser({
                                email,
                                onSuccess: onInitialized,
                              });
                              setEmail("");
                            } else {
                              assetlayerClient.loginUser({
                                email: "abc",
                                onSuccess: onInitialized,
                              });
                              setEmail("");
                            }
                          }}
                        >
                          Get Started
                        </Button>
                        <CardMedia
                          component="img"
                          alignContent="center"
                          sx={{
                            maxHeight: "30px", // or any size you want
                            width: "auto", // maintain aspect ratio
                            margin: "auto",
                          }}
                          image="static/Powered by AL Big.png" // Replace with your second image path
                          alt="Your Second Image"
                        />
                      </CardContent>
                    </Card>
                  </Stack>
                </>
              )}
            </Stack>
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
          <iframe id="applixir_parent" allowed="autoplay"></iframe>
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