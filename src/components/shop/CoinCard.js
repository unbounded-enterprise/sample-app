import { Box, Card, Typography } from "@mui/material";
import "@fontsource/chango";

export const CoinCard = ({ price, quantity, onClick, imageLink }) => {
  return (
    <Card
      onClick={onClick}
      sx={{
        border: "4px solid #1e3465",
        backgroundColor: "white",
        borderRadius: "15px",
        textAlign: "center",
        cursor: "pointer",
        boxShadow: `3px 3px 8px rgba(0, 0, 0, 0.5)`,
        position: "relative", // Set the card's position to relative
        "&:hover::before": {
          // Use the ::before pseudo-element for the overlay
          content: '""',
          position: "absolute",
          top: 0,
          right: 0,
          bottom: 0,
          left: 0,
          backgroundColor: "rgba(255, 255, 255, 0.1)", // 10% white overlay
          zIndex: 1, // Ensure the overlay is above the card content but below any interactive elements
        },
      }}
    >
      {/* Image */}
      <Box>
        <img src={imageLink} alt="Coin Image" style={{ width: "70%" }} />
      </Box>

      {/* Quantity */}
      <Box
        py={1}
        sx={{
          width: "100%", // Make the box full width
          backgroundColor: "#1e3465",
          fontFamily: "chango",
          fontSize: {
            xs: "14px",
            sm: "16px",
            md: "18px",
            lg: "18px",
            xl: "20px",
          },
          color: "white",
        }}
      >
        {parseInt(quantity).toLocaleString()} Coins
      </Box>

      {/* Price */}
      <Typography
        variant="h6"
        py={1}
        sx={{
          color: "#FF4D0D",
          fontFamily: "chango",
          fontSize: {
            xs: "14px",
            sm: "16px",
            md: "18px",
            lg: "20px",
            xl: "24px",
          },
        }}
      >
        ${price}
      </Typography>
    </Card>
  );
};
