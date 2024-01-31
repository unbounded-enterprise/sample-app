import React, {
  Fragment,
  useEffect,
  useRef,
  useState,
} from "react";
import { Box, Button, Stack } from "@mui/material";

const isLocal =
  typeof window !== "undefined" && window.location.host === "localhost:3000";

function sendTokenToUnity(token) {
  const iframe = document.getElementById("unity-webgl-iframe"); // Make sure to give your iframe an id
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage(
      {
        type: "SendDIDToken",
        value: token,
      },
      "*"
    );
  }
}

export const PlayUnity = ({ user, didToken, onClose }) => {
  const [frameHeight, setFrameHeight] = useState(window.innerHeight);
  const [isLoaded, setIsLoaded] = useState(false);
  const isInitialMount = useRef(true);

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
        <Box
          sx={{
            width: "100%",
            height: { xs: frameHeight + "px", lg: `${frameHeight - 42}px` },
            overflow: "hidden", // Prevent scrolling
            maxHeight: "100vh",
          }}
        >
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
          Return
        </Button>
      </Stack>
    </Fragment>
  );
};
