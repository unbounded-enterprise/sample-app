import { Box, Card, Grid, Typography } from "@mui/material";

var collectionImage;

export const CollectionCard = ({
  search,
  collection,
  assetCount,
  onCardClick,
}) => {
  collectionImage = "/static/collectionImage.png";

  if (collection.collectionImage) {
    if (collection.collectionImage.includes("http")) {
      collectionImage = collection.collectionImage;
    }
  }

  if (collection.collectionName.toLowerCase().includes(search.toLowerCase())) {
    return (
      <div onClick={onCardClick}>
        <Card
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
          <Box mb={0}>
            <img
              src={collectionImage}
              alt="Coin Image"
              style={{ width: "100%", display: "block", marginBottom: "0" }}
            />
          </Box>

          {/* Asset Count Box */}
          <Box
            sx={{
              position: "absolute", // Absolute positioning
              bottom: 50, // Padding from the bottom
              right: 8, // Padding from the right
              backgroundColor: "#1E3465",
              color: "white",
              fontFamily: "Chango",
              padding: "0.2rem 0.5rem", // Some padding for the box
              borderRadius: "5px", // Slight rounded corners
            }}
          >
            {assetCount}
          </Box>

          {/* Quantity */}
          <Box
            py={1}
            sx={{
              width: "100%", // Make the box full width
              backgroundColor: "#1e3465",
              fontFamily: "chango",
              fontSize: "1rem",
              color: "white",
            }}
          >
            {collection.collectionName}
          </Box>
        </Card>
      </div>
    );
  }
};
