import { useState } from "react";
import {
  Box,
  Button,
  Card,
  CardMedia,
  CardContent,
  TextField,
  Typography,
  Stack,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import React from "react";

export const LoginContent = ({
  assetlayerClient,
  handleUserLogin,
  onLogin,
  cardRef,
  cardWidth,
}) => {
  const [email, setEmail] = useState("");
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));

  function onInitialized() {
    handleUserLogin(true);
    if (onLogin) onLogin();
  }
  function handleGetStartedClick() {
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
  }
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      sx={{ height: "93vh" }}
    >
      <Card
        ref={cardRef}
        sx={{
          background: "rgba(0,0,0,0.5)",
          borderRadius: "5px",
          width: {
            xs: "95%",
            sm: "60%",
            md: "50%",
            lg: "40%",
            xl: "30%",
            xxl: "30%",
          },
          textAlign: "center",
          pt: 4,
          px: {xs:0,sm:2},
          pb: 2,
        }}
      >
        <CardContent sx={{ pt: 3 }}>
          <Typography
            variant="h4"
            color="white"
            component="div"
            fontFamily={"Chango"}
            fontSize={{
              xs: "20px",
              sm: "24px",
              md: "22px",
              lg: "28px",
              xl: "36px",
            }}
            sx={{
              fontWeight: "normal",
              mb: 2,
              position: "relative",
              display: "inline-flex",
              alignItems: "center",
              "&::before, &::after": {
                content: '""',
                flexShrink: 0,
                height: "2px",
                width: {
                  xs: "32px",
                  sm: "32px",
                  md: "40px",
                  lg: "64px",
                  xl: "84px",
                },
                backgroundColor: "white",
                margin: "0 10px",
              },
            }}
          >
            Sign Up / Sign In
          </Typography>
          <Typography
            variant="subtitle2"
            color="white"
            fontFamily={"Chango"}
            component="div"
            sx={{
              textAlign: "left",
              mb: 1,
              fontSize: {
                xs: "16px",
                sm: "16px",
                md: "16px",
                lg: "18px",
                xl: "20px",
              },
            }}
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
              width: "100%",
              mt: 1,
              mb: 3,
              backgroundColor: "#FBFBFB",
              color: "black",
              borderRadius: "5px",
              border: "4px solid #AAAAAA",
              "& .MuiInputBase-input": {
                height: "60px",
                padding: "0 8px",
                boxSizing: "border-box",
                fontSize: {
                  xs: "14px",
                  sm: "14px",
                  md: "16px",
                  lg: "18px",
                  xl: "20px",
                },
                fontFamily: "Chango",
              },
            }}
            placeholder="Your Email Address"
            InputProps={{
              disableUnderline: true,
              style: { color: "black" },
              name: "email",
            }}
          />
          <Button
            onClick={handleGetStartedClick}
            sx={{
              width: "100%",
              py: 2,
              mb: 2,
              background: "blue",
              "&:hover": {
                background: "rgba(255, 255, 255, 0.6)",
              },
            }}
          >
            <Typography
              variant="body1"
              color="white"
              fontFamily="Chango"
              sx={{
                textAlign: "center",
                fontSize: {
                  xs: "4vw",
                  sm: "3vw",
                  md: "2.2vw",
                  lg: "1.8vw",
                  xl: "1.4vw",
                  xxl: "20px",
                },
              }}
            >
              GET STARTED
            </Typography>
          </Button>
          <CardMedia
            component="img"
            alignContent="center"
            sx={{
              maxHeight: "30px",
              width: "auto",
              margin: "auto",
            }}
            image="static/Powered by AL Big.png"
            alt="Your Second Image"
          />
        </CardContent>
      </Card>
    </Box>
  );
};
