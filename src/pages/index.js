import { useEffect, useState } from "react";
import {
  Box,
  Breadcrumbs,
  Card,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { MainLayout } from "src/components/main-layout";
import React from "react";
import { styled } from "@mui/system";
import { useAssetLayer } from "src/contexts/assetlayer-context.js"; // Import the hook
import "@fontsource/chango";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import NextLink from "next/link";

const CenteredImage = styled("img")({
  display: "block",
  marginLeft: "auto",
  maxWidth: "200px",
  marginRight: "auto",
  width: "50%",
});
const slotButtonStyle = {
  color: "blue",
  border: "1px solid blue",
  fontSize: "1vw",
};

const loading = (
  <>
    {" "}
    <CenteredImage src="/static/loader.gif" alt="placeholder" />{" "}
  </>
);

// Styling for the scrollbar
const globalScrollbarStyles = `
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: transparent;
  }

  ::-webkit-scrollbar-thumb {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background-color: rgba(0, 0, 0, 0.5);
  }

  ::-webkit-scrollbar-thumb:active {
    background-color: rgba(0, 0, 0, 0.9);
  }
`;

const HomePage = () => {
  const { assetlayerClient, loggedIn, setLoggedIn } = useAssetLayer(); // Use the hook to get the client and loggedIn state
  //const [user, setUser] = useState(null);

 
  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = globalScrollbarStyles;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <main
      style={{
        backgroundImage: `url("/static/Utopia Background Landscape (1).png")`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundColor: "transparent",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Card
        sx={{
          backgroundColor: "rgb(46, 44, 44)", // Gray background
          width: "50%",
          height: "90vh",
          margin: "5vh auto 0 auto",
          overflowY: "auto",
          padding: "2rem",
          boxSizing: "border-box",
          borderRadius: "15px",
          "&::-webkit-scrollbar": {
            width: "0px",
          },
          "&:hover::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(46, 44, 44, 0.5)",
          },
        }}
      >
       {/* Updated Text Sections */}
       <Box textAlign="center" pb={4}>
          <Typography variant="h4" color="white" fontFamily="Chango" > 
            Welcome to
          </Typography>
          <Typography
            variant="h2"
            color="#FF4D0D"
            fontFamily="Chango"
            py={4}
            sx={{
              textShadow: `
                2px 2px 0 white, 
                -2px -2px 0 white, 
                2px -2px 0 white, 
                -2px 2px 0 white,
                3px 3px 8px rgba(0, 0, 0, 0.5)
              `,
            }}
          >
            Rolltopia
          </Typography>
          <Typography variant="body2" color="white" fontFamily="Chango" pb={4}>
            Casual games that let you earn while you play
          </Typography>
        </Box>

        {/* Updated Cards */}
        <Grid container spacing={4} justifyContent="center">
            <Grid item xs={12} style={{ maxWidth: "80%" }}>
            <NextLink href="/play" passHref legacyBehavior>

              <Card
                sx={{
                  border: "1px solid white",
                  borderRadius: "15px",
                  overflow: "hidden",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "0.5rem 1rem",
                    background: "linear-gradient(45deg, #045CD2 30%, #03A9F4 90%)", // Updated gradient color
                    borderBottom: "1px solid white",
                  }}
                >
                  <Typography variant="h4" fontFamily="Chango" color="white">
                    Play Runway Roller
                  </Typography>
                  <PlayArrowIcon sx={{ color: "white", fontSize: "3rem" }} />
                </Box>
                <img
                  src="/static/runwayRollerPlaceholder.png"
                  alt={`Card Image`}
                  style={{ width: "100%", display: "block" }}
                />
                </Card>
                </NextLink>
              </Grid>
              <Grid item xs={12} style={{ maxWidth: "80%" }}>
              <Card
                sx={{
                  border: "1px solid white",
                  borderRadius: "15px",
                  overflow: "hidden",
                }}
              >
                <img
                  src="/static/jumpyHelixPlaceholder.png"
                  alt={`Card Image`}
                  style={{ width: "100%", display: "block" }}
                />
                </Card>
              </Grid>
          </Grid>
        </Card>
      </main>
  );
};

HomePage.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default HomePage;
