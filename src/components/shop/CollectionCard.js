import {
  Box,
  Card,
  Grid,
  Tooltip,
  Typography,
  ButtonBase,
  Popper,
} from "@mui/material";
import { useState, useRef } from "react";
import "@fontsource/inter";

var collectionImage;

export const CollectionCard = ({ collection, onClick }) => {
  collectionImage = "/static/collectionImage.png";

  const [isHovered, setIsHovered] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const anchorRef = useRef(null);

  if (collection.collectionImage) {
    if (collection.collectionImage.includes("http")) {
      collectionImage = collection.collectionImage;
    }
  }
  return (
    <Box position="relative">
      <Card
        sx={{
          border: "4px solid #1e3465",
          backgroundColor: "white",
          borderRadius: "15px",
          textAlign: "center",
          cursor: "pointer",
          position: "relative",
          boxShadow: `3px 3px 8px rgba(0, 0, 0, 0.5)`,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        {/* Overlay */}
        {isHovered && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              bottom: 0,
              left: 0,
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              zIndex: 1,
            }}
          />
        )}
        {/* Image */}
        <Box mb={0}>
          <img
            src={collectionImage}
            alt="Coin Image"
            style={{ width: "100%", display: "block", marginBottom: "0" }}
          />
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
          <Typography
            variant="h6"
            py={0.5}
            sx={{
              color: "white",
              fontFamily: "chango",
              fontWeight: "normal",
              fontSize: {
                xs: "14px",
                sm: "16px",
                md: "18px",
                lg: "18px",
                xl: "20px",
              },
            }}
          >
            {collection.collectionName}
          </Typography>
          <ButtonBase
            sx={{ zIndex: 2 }}
            ref={anchorRef}
            onMouseEnter={() => setTooltipOpen(true)}
            onMouseLeave={() => setTooltipOpen(false)}
          >
            <Typography
              variant="h6"
              py={0.5}
              sx={{
                color: "white",
                fontFamily: "chango",
                fontWeight: "normal",
                fontSize: {
                  xs: "14px",
                  sm: "16px",
                  md: "18px",
                  lg: "18px",
                  xl: "20px",
                },
              }}
            >
              {collection.maximum - collection.minted} / {collection.maximum}
            </Typography>
          </ButtonBase>
        </Box>

        {/* Minted and Maximum */}

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
              lg: "18px",
              xl: "20px",
            },
          }}
        >
          50{" "}
          <img
            src="/static/Coin With Outline.png"
            alt="price-icon"
            style={{ height: "1.2rem", verticalAlign: "middle" }}
          />
        </Typography>
      </Card>
      <Popper
        open={tooltipOpen}
        anchorEl={anchorRef.current}
        placement="bottom"
      >
        <Box
          sx={{
            borderRadius: "10px",
            padding: 2,
            backgroundColor: "white",
            boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
            zIndex: 3,
          }}
        >
          <Typography color="#273c6b" fontFamily="inter" variant="body1">
            <strong>The first number</strong> refers to the <br /> remaining
            supply of this item <br /> that can be purchased before <br /> it is
            out of stock.
          </Typography>
          <Typography color="#273c6b" fontFamily="inter" variant="body1">
            <br />
            <strong>The second number</strong> refers to <br /> the max supply
            of this item <br /> that will ever be created.
          </Typography>
        </Box>
      </Popper>
    </Box>
  );
};
