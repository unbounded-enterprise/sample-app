import { useState } from "react";
import {
  Button,
  Card,
  CardMedia,
  CardContent,
  TextField,
  Typography,
  Stack,
} from "@mui/material";
import React from "react";

export const LoginContent = ({ assetlayerClient, handleUserLogin }) => {
  const [email, setEmail] = useState("");
  function onInitialized() {
    handleUserLogin(true);
  }
  return (
    <Stack alignItems="center" justifyContent="center" sx={{ height: "80vh" }}>
      <Card
        sx={{
          backgroundColor: "rgba(50, 50, 50, 0.9)", // Transparent gray
          borderRadius: "15px", // Rounded edges
          width: {
            xs: "90%",
            sm: "350px",
            md: "450px",
            lg: "600px",
            xl: "600px",
          },
          textAlign: "center",
          p: 2, // Padding for more spacing
        }}
      >
        <Typography
          variant="h2"
          fontSize={{
            xs: "40px",
            sm: "48px",
            md: "48px",
            lg: "60px",
            xl: "60px",
          }}
          color="#FF4D0D"
          fontFamily="Chango"
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
        <CardContent sx={{ pt: 3 }}>
          <Typography
            variant="h4"
            color="white"
            component="div"
            fontSize={{
              xs: "20px",
              sm: "24px",
              md: "32px",
              lg: "40px",
              xl: "40px",
            }}
            sx={{
              fontWeight: "normal",
              mb: 2,
              position: "relative", // Needed for positioning pseudo-elements
              display: "inline-flex", // To align the text and lines
              alignItems: "center", // Vertically center align
              "&::before, &::after": {
                content: '""',
                flexShrink: 0, // Prevent shrinking
                height: "1px", // Height of the line
                width: {
                  xs: "32px",
                  sm: "32px",
                  md: "40px",
                  lg: "72px",
                  xl: "84px",
                },
                backgroundColor: "white", // Color of the line
                margin: "0 10px", // Space between the line and text
              },
            }}
          >
            Sign Up / Sign In
          </Typography>
          <Typography
            variant="subtitle2"
            color="white"
            component="div"
            sx={{
              textAlign: "left",
              mb: 2,
              fontSize: {
                xs: "16px",
                sm: "20px",
                md: "24px",
                lg: "32px",
                xl: "32px",
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
  );S
};
