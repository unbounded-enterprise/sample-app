import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Unity, useUnityContext } from "react-unity-webgl";
import { Box, Button, Stack } from "@mui/material";
import { MainLayout } from "src/components/main-layout";
import { useAssetLayer } from "src/contexts/assetlayer-context.js"; // Import the hook
import { useEffectOnce } from "src/hooks/use-effect-once";
import { LoginContent } from "src/components/login-content";

const isLocal = (typeof window !== 'undefined') && window.location.host === "localhost:3000";

function sendTokenToUnity(token) {
  const iframe = document.getElementById('unity-webgl-iframe');  // Make sure to give your iframe an id
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage({
        type: "SendDIDToken",
        value: token,
    }, "*");
  }
}

const Play = () => {
  const {
    assetlayerClient,
    loggedIn,
    handleUserLogin,
    user,
    unityOn,
    setUnityOn,
  } = useAssetLayer(); // Use the hook to get the client and loggedIn state

  const runOnceRef = useRef(false);

  useEffect(() => {
    if (loggedIn && !unityOn) {
      setUnityOn(true);
    }
  }, [loggedIn]);

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

  async function handleClose() {
    setUnityOn(false);
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
                    setUnityOn(true);
                  }}
                >
                  Play Again
                </Button>
              </>
            ) : (
              <PlayUnity
                user={user}
                didToken={assetlayerClient.didToken}
                onClose={handleClose}
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
  user,
  didToken,
  onClose,
}) => {
  const [frameHeight, setFrameHeight] = useState(window.innerHeight);
  const [isLoaded, setIsLoaded] = useState(false);
  const isInitialMount = useRef(true);

  /*
  useEffectOnce(() => {

    return () => onClose();
  }, []);
  */

  useEffect(() => {
    if (isLocal && isInitialMount.current) {
      isInitialMount.current = false;
    } else {
      function updateFrameHeight() {
        setFrameHeight(window.innerHeight);
      }
      function handleUnityMessage(event) {
        if (event.data === "unity-webgl-loaded") {
          setIsLoaded(true);
        }
      }

      window.addEventListener("resize", updateFrameHeight);
      window.addEventListener("message", handleUnityMessage);

      return () => {
        window.removeEventListener("resize", updateFrameHeight);
        window.removeEventListener("message", handleUnityMessage);

        onClose();
      };
    }
  }, []);

  useEffect(() => {
    if (!user || !isLoaded || !didToken) return;
    
    sendTokenToUnity(didToken);
  }, [isLoaded, user]);

  return (
    <Fragment>
      <Stack>
        <Box sx={{ width: '100%', height: { xs: frameHeight + 'px', lg: `${(frameHeight - 42)}px` } }}>
          <iframe
            id="unity-webgl-iframe"
            src="unity/index.html"
            style={{
              position: "relative",
              top: 0,
              left: 0,
              zIndex: 999,
              width: "100%",
              height: "100%",
              border: "none",
            }}
            title="Unity WebGL Content"
            allowFullScreen
          />
        </Box>
        <Button
          variant="contained"
          color="primary"
          sx={{
            backgroundColor: "#045CD2", // Set the background color
            width: "100%",
            height: "42px",
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
          onClick={onClose}
        >
          Back
        </Button>
      </Stack>
    </Fragment>
  );
};

Play.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default Play;
