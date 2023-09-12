import { useEffect, useState } from "react";
import NextLink from "next/link";
import {
  Box,
  Button,
  Breadcrumbs,
  Card,
  CardMedia,
  CardContent,
  TextField,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  Stack,
  MenuItem,
} from "@mui/material";
import { BasicSearchbar } from "src/components/widgets/basic/basic-searchbar";
import { MainLayout } from "src/components/main-layout";
import { CollectionCard } from "src/components/assets/CollectionCard";
import { AssetCard } from "src/components/assets/AssetCard";
import axios from "axios";
import React from "react";
import {
  sortCollections,
  collectionSortMethods,
} from "src/pages/explorer/slot/[id]/index";
import DropdownMenu from "src/components/widgets/DropdownMenu";
import { parseBasicErrorClient } from "src/_api_/auth-api";
import { styled } from "@mui/system";
import { useAuth } from "src/hooks/use-auth";
import LoginButton from "src/components/home/login-button";
import { useAssetLayer } from "src/contexts/assetlayer-context.js"; // Import the hook
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";

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

const MyAssetsPage = () => {
  const [collections, setCollections] = useState(null);
  const [assets, setAssets] = useState(null);
  const [search, setSearch] = useState("");
  const [searchSerial, setSearchSerial] = useState("");
  const [totalNfts, setTotalNfts] = useState(0);
  const [collectionCounts, setCollectionCounts] = useState({});
  const [activeCollections, setActiveCollections] = useState(null);
  const [chosenCollection, setChosenCollection] = useState(null);
  const [chosenAsset, setChosenAsset] = useState(null);
  const [menuViewExpressionValue, setMenuViewExpressionValue] = useState(null);
  const { assetlayerClient, loggedIn, handleUserLogin } = useAssetLayer(); // Use the hook to get the client and loggedIn state

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchSerial = (e) => {
    console.log(e);
    setSearchSerial(e.target.value);
  };

  const countNfts = async (collectionCounts) => {
    let nftCount = 0;
    for (const key in collectionCounts) {
      if (collectionCounts.hasOwnProperty(key)) {
        nftCount += collectionCounts[key];
      }
    }
    return nftCount;
  };

  const getCollections = async (activeCollections) => {
    if (activeCollections) {
      const collections = Object.keys(activeCollections);
      if (!(collections.length > 0)) return [];
      const collectionsObject =
        await assetlayerClient.collections.safe.getCollections({
          collectionIds: collections,
          idOnly: false,
        });
      //(await axios.post('/api/collection/info', { collectionIds: collections, idOnly: false, includeDeactivated: false }));
      return collectionsObject.result.sort(collectionSortMethods.maximum);
    }
  };

  const getActiveCollections = async () => {
    const { result: activeCollectionsObject } =
      await assetlayerClient.assets.safe.getUserSlotsAssets({
        slotIds: ["64dc1aec9f07eb4ceb26f03c"],
        countsOnly: true,
      });
    return activeCollectionsObject;
  };

  const getAssets = async (collectionId) => {
    if (collectionId) {
      const { result: assetsObject } =
        await assetlayerClient.assets.safe.getUserCollectionsAssets({
          collectionIds: [collectionId],
        });
      console.log(assetsObject);
      return assetsObject[collectionId];
    }
  };

  useEffect(() => {
    if (loggedIn) {
      getActiveCollections()
        .then((collections) => {
          setActiveCollections(collections);
        })
        .catch((e) => {
          const error = parseBasicErrorClient(e);
          console.log("setting error: ", error.message);
        });
    }
  }, [loggedIn]);

  useEffect(() => {
    if (activeCollections) {
      getCollections(activeCollections)
        .then((collections) => {
          setCollections(collections);
        })
        .catch((e) => {
          const error = parseBasicErrorClient(e);
          console.log("setting error: ", error.message);
        });
    }
  }, [activeCollections]);

  useEffect(() => {
    countNfts(activeCollections)
      .then((count) => {
        setTotalNfts(count);
      })
      .catch((e) => {
        const error = parseBasicErrorClient(e);
        console.log("setting error: ", error.message);
      });
  }, [activeCollections]);

  useEffect(() => {
    if (chosenCollection) {
      getAssets(chosenCollection.collectionId)
        .then((assets) => {
          setAssets(assets);
        })
        .catch((e) => {
          const error = parseBasicErrorClient(e);
          console.log("setting error: ", error.message);
        });
    }
  }, [chosenCollection]);

  useEffect(() => {
    if (chosenAsset) {
        chosenAsset.expressionValues.forEach((element) => {
            if (element.expression.expressionName === "Menu View") {
              setMenuViewExpressionValue(element.value);
            }
          });
    }
  }, [chosenAsset]);

  const sharedSx = {
    font: "nunito",
    lineHeight: "40px",
    fontSize: { xs: "12px", sm: "12px", md: "14px", lg: "16px", xl: "18px" },
  };
  const sharedSxBold = {
    fontWeight: "bold",
    font: "nunito",
    lineHeight: "40px",
    fontSize: { xs: "12px", sm: "12px", md: "14px", lg: "16px", xl: "18px" },
  };

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
          width: "50%",
          height: "90vh",
          margin: "5vh auto 0 auto",
          overflowY: "auto",
          padding: "1rem",
          boxSizing: "border-box",
          borderRadius: "25px",
          "&::-webkit-scrollbar": {
            width: "0px",
          },
          "&:hover::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          },
        }}
      >
        {loggedIn ? (
          chosenAsset ? (
            <AssetSelectedContent
              asset={chosenAsset}
              collection={chosenCollection}
              setChosenAsset={setChosenAsset}
              menuViewExpressionValue={menuViewExpressionValue}
              setMenuViewExpressionValue={setMenuViewExpressionValue}
            />
          ) : chosenCollection ? (
            <CollectionSelectedContent
              searchSerial={searchSerial}
              assets={assets}
              collection={chosenCollection}
              handleSearchSerial={handleSearchSerial}
              setChosenAsset={setChosenAsset}
              setChosenCollection={setChosenCollection}
            />
          ) : (
            <MainCardContent
              search={search}
              collections={collections}
              activeCollections={activeCollections}
              handleSearch={handleSearch}
              collectionCounts={collectionCounts}
              setChosenCollection={setChosenCollection}
            />
          )
        ) : (
          <LoginContent
            assetlayerClient={assetlayerClient}
            handleUserLogin={handleUserLogin}
          />
        )}
      </Card>
    </main>
  );
};

MyAssetsPage.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default MyAssetsPage;

const LoginContent = ({ assetlayerClient, handleUserLogin }) => {
  const [email, setEmail] = useState("");
  function onInitialized() {
    handleUserLogin(true);
  }
  return (
    <Stack alignItems="center" justifyContent="center" sx={{ height: "100vh" }}>
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
              height: "50px",
              backgroundColor: "white",
              color: "black",
              borderRadius: "5px",
              pl: 2, // padding-left
            }}
            placeholder="Your Email Address"
            InputProps={{
              disableUnderline: true,
              style: { color: "gray", lineHeight: "50px" }, // Vertically center the text
            }}
          />
          <Button
            variant="contained"
            color="primary"
            sx={{
              backgroundColor: "#045CD2", // Set the background color
              "&:hover": {
                backgroundColor: "#045CD2", // Set hover color
              },
              width: "100%",
              mb: 5,
              boxShadow: "0px 3px 5px 2px rgba(0, 0, 0, .3)", // Add drop shadow
              fontWeight: "bold", // Bold font
            }}
            onClick={() => {
              assetlayerClient.loginUser({ email, onSuccess: onInitialized });
              setEmail("");
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
  );
};

const MainCardContent = ({
  search,
  collections,
  activeCollections,
  handleSearch,
  collectionCounts,
  setChosenCollection,
}) => {
  if (!(collections && collectionCounts)) return loading;

  return (
    <Box sx={{ backgroundColor: "none", py: 5 }}>
      <Box
        sx={{
          width: "95%",
          alignSelf: "stretch",
          marginLeft: "auto",
          marginRight: "auto",
          py: 1,
          px: { xs: 2, sm: 2 },
          backgroundColor: "none",
        }}
      >
        <Box textAlign="center" pb={4}>
          <Typography
            variant="h2"
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
            My Assets
          </Typography>
        </Box>
        <Grid item xs={12} sx={{ backgroundColor: "none" }}>
          <Box sx={{ left: 0, width: "100%" }}>
            <BasicSearchbar
              onChange={handleSearch}
              sx={{
                left: 0,
                width: "100%",
                p: 1,
                borderColor: "black", // Black outline
                color: "black",
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1} sx={{ p: 1 }}>
            {collections.map((collection) => (
              <Grid item xs={12} md={4} xl={3} key={collection.collectionId}>
                {" "}
                {/* Adjusted this line */}
                <CollectionCard
                  search={search}
                  collection={collection}
                  assetCount={activeCollections[collection.collectionId]}
                  onCardClick={() => {
                    setChosenCollection(collection);
                  }} // Pass the callback here
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

const CollectionSelectedContent = ({
  searchSerial,
  assets,
  handleSearchSerial,
  collection,
  setChosenAsset,
  setChosenCollection,
}) => {
  if (!assets) return loading;

  return (
    <Box sx={{ backgroundColor: "none", py: 5 }}>
      <Box
        sx={{
          width: "95%",
          alignSelf: "stretch",
          marginLeft: "auto",
          marginRight: "auto",
          py: 1,
          px: { xs: 2, sm: 2 },
          backgroundColor: "none",
        }}
      >
        <Box
          pb={3}
          display="flex"
          alignItems="center"
          justifyContent="space-between" // This will push the icon to the left and keep the title centered
          sx={{ position: "relative", width: "100%", margin: 0 }} // Ensure full width and no padding/margin
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={() => setChosenCollection(null)}
            sx={{
              color: "#FF4D0D",
              border: "2px solid white", // White outline
              boxShadow: "0px 3px 5px 2px rgba(0, 0, 0, .3)", // Drop shadow
              "& svg": {
                // Target the ArrowBackIcon specifically
                fontSize: "2rem", // Increase the size of the icon
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h2"
            color="#FF4D0D"
            fontFamily="Chango"
            py={2}
            sx={{
              textShadow: `
        2px 2px 0 white, 
        -2px -2px 0 white, 
        2px -2px 0 white, 
        -2px 2px 0 white,
        3px 3px 8px rgba(0, 0, 0, 0.5)
      `,
              position: "absolute", // Absolute positioning to keep the title centered
              left: "50%",
              transform: "translateX(-50%)",
              whiteSpace: "nowrap", // Prevent wrapping onto the next line
              overflow: "hidden", // Hide overflow
              textOverflow: "ellipsis", // Add ellipsis if the text is too long
              maxWidth: "calc(100% - 60px)", // Deducting the approximate width of the IconButton
              margin: 0,
            }}
          >
            {collection.collectionName}
          </Typography>
        </Box>

        <Grid item xs={12} sx={{ backgroundColor: "none" }}>
          <Box sx={{ left: 0, width: "100%" }}>
            <BasicSearchbar
              onChange={handleSearchSerial}
              sx={{
                left: 0,
                width: "100%",
                p: 1,
                borderColor: "black", // Black outline
                color: "black",
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Grid container spacing={1} sx={{ p: 1 }}>
            {assets.map((asset) => (
              <Grid item xs={12} md={4} xl={3} key={asset.assetId}>
                {" "}
                {/* Adjusted this line */}
                <AssetCard
                  search={searchSerial}
                  collection={collection}
                  asset={asset}
                  onCardClick={() => {
                    setChosenAsset(asset);
                  }} // Pass the callback here
                />
              </Grid>
            ))}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

const AssetSelectedContent = ({ asset, collection, setChosenAsset, menuViewExpressionValue, setMenuViewExpressionValue }) => {
  if (!asset && menuViewExpressionValue) return loading;

  return (
    <Box sx={{ backgroundColor: "none", py: 5 }}>
      <Box
        sx={{
          width: "95%",
          alignSelf: "stretch",
          marginLeft: "auto",
          marginRight: "auto",
          py: 1,
          px: { xs: 2, sm: 2 },
          backgroundColor: "none",
        }}
      >
        <Box
          pb={3}
          display="flex"
          alignItems="center"
          justifyContent="space-between" // This will push the icon to the left and keep the title centered
          sx={{ position: "relative", width: "100%", margin: 0 }} // Ensure full width and no padding/margin
        >
          <IconButton
            edge="start"
            color="inherit"
            aria-label="back"
            onClick={() => {setChosenAsset(null); setMenuViewExpressionValue(null)}}
            sx={{
              color: "#FF4D0D",
              border: "2px solid white", // White outline
              boxShadow: "0px 3px 5px 2px rgba(0, 0, 0, .3)", // Drop shadow
              "& svg": {
                // Target the ArrowBackIcon specifically
                fontSize: "2rem", // Increase the size of the icon
              },
            }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography
            variant="h2"
            color="#FF4D0D"
            fontFamily="Chango"
            py={2}
            sx={{
              textShadow: `
        2px 2px 0 white, 
        -2px -2px 0 white, 
        2px -2px 0 white, 
        -2px 2px 0 white,
        3px 3px 8px rgba(0, 0, 0, 0.5)
      `,
              position: "absolute", // Absolute positioning to keep the title centered
              left: "50%",
              transform: "translateX(-50%)",
              whiteSpace: "nowrap", // Prevent wrapping onto the next line
              overflow: "hidden", // Hide overflow
              textOverflow: "ellipsis", // Add ellipsis if the text is too long
              maxWidth: "calc(100% - 60px)", // Deducting the approximate width of the IconButton
              margin: 0,
            }}
          >
            {collection.collectionName} #{asset.serial}
          </Typography>
        </Box>
        <Stack alignItems='center' display="flex" py={2}>
          <img
            src={menuViewExpressionValue}
            alt="Asset Image"
            style={{ width: "60%", display: "block", marginBottom: "0" }}
          />

        <Typography variant="h4" color="#1D2D59" fontFamily="Chango" py={2}>
          Max Supply: {collection.maximum}
        </Typography>
        </Stack>

      </Box>
    </Box>
  );
};
