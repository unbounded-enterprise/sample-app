import { useEffect } from "react";
import { Box, Card, Typography, Grid } from "@mui/material";
import { MainLayout } from "src/components/main-layout";
import React from "react";
import "@fontsource/chango";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import NextLink from "next/link";

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
          width: {
            xs: "90%",
            sm: "80%",
            md: "70%",
            lg: "70%",
            xl: "60%",
          },
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
        {/*Text Sections */}
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
          textAlign="center"
          pb={2}
        >
          <Typography
            variant="h4"
            color="white"
            fontFamily="Chango"
            fontSize={{
              xs: "28px",
              sm: "32px",
              md: "32px",
              lg: "40px",
              xl: "40px",
            }}
            style={{ margin: 0 }}
          >
            Welcome to
          </Typography>
          <Typography
            variant="h2"
            color="#FF4D0D"
            fontFamily="Chango"
            py={4}
            style={{ margin: 0 }}
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
          <Typography
            variant="p1"
            color="white"
            fontFamily="Chango"
            pb={4}
            style={{ margin: 0 }}
          >
            A creator driven hyper-casual gaming universe for web and mobile.
          </Typography>
        </Box>

        {/* Cards */}
        <Grid container spacing={4} justifyContent="center">
          <Grid
            item
            xs={12}
            sx={{
              maxWidth: {
                xs: "95%",
                sm: "85%",
                md: "80%",
                lg: "80%",
                xl: "80%",
              },
            }}
          >
            <NextLink href="/play" passHref legacyBehavior>
              <Card
                sx={{
                  border: "1px solid white",
                  borderRadius: {
                    xs: "5px",
                    sm: "5px",
                    md: "10px",
                    lg: "15px",
                    xl: "15px",
                  },
                  overflow: "hidden",
                  cursor: "pointer",
                  position: "relative",
                  "&:hover::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    right: 0,
                    bottom: 0,
                    left: 0,
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                    zIndex: 1,
                  },
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0.5rem 1rem",
                    background:
                      "linear-gradient(45deg, #045CD2 30%, #03A9F4 90%)",
                    borderBottom: "1px solid white",
                  }}
                >
                  <Typography
                    variant="h4"
                    fontFamily="Chango"
                    color="white"
                    fontSize={{
                      xs: "16px",
                      sm: "24px",
                      md: "32px",
                      lg: "40px",
                      xl: "40px",
                    }}
                  >
                    Play Runway Roller
                  </Typography>
                  <PlayArrowIcon
                    sx={{
                      color: "white",
                      fontSize: {
                        xs: "1.5rem",
                        sm: "3rem",
                        md: "3rem",
                        lg: "3rem",
                        xl: "3rem",
                      },
                    }}
                  />
                </Box>
                <img
                  src="/static/runwayRollerPlaceholder.png"
                  alt={`Card Image`}
                  style={{ width: "100%", display: "block" }}
                />
              </Card>
            </NextLink>
          </Grid>

          <Grid
            item
            xs={12}
            sx={{
              maxWidth: {
                xs: "95%",
                sm: "85%",
                md: "80%",
                lg: "80%",
                xl: "80%",
              },
            }}
          >
            <Card
              sx={{
                border: "1px solid white",
                borderRadius: {
                  xs: "5px",
                  sm: "5px",
                  md: "10px",
                  lg: "15px",
                  xl: "15px",
                },
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
