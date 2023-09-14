import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Stack,
} from "@mui/material";
import { BasicSearchbar } from "src/components/widgets/basic/basic-searchbar";
import { MainLayout } from "src/components/main-layout";
import { CollectionCard } from "src/components/assets/CollectionCard";
import { AssetCard } from "src/components/assets/AssetCard";
import React from "react";
import {
  collectionSortMethods,
} from "src/pages/explorer/slot/[id]/index";
import { parseBasicErrorClient } from "src/_api_/auth-api";
import { styled } from "@mui/system";
import { useAssetLayer } from "src/contexts/assetlayer-context.js"; // Import the hook
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import IconButton from "@mui/material/IconButton";
import { LoginContent } from "src/components/login-content";

const CenteredImage = styled("img")({
  display: "block",
  marginLeft: "auto",
  maxWidth: "200px",
  marginRight: "auto",
  width: "50%",
});

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

  const getCollections = async (activeCollections) => {
    if (activeCollections) {
      const collections = Object.keys(activeCollections);
      if (!(collections.length > 0)) return [];
      const collectionsObject =
        await assetlayerClient.collections.safe.getCollections({
          collectionIds: collections,
          idOnly: false,
        });
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
              setAssets={setAssets}
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

const MainCardContent = ({
  search,
  collections,
  activeCollections,
  handleSearch,
  setChosenCollection,
}) => {
  return (
    <Box sx={{ backgroundColor: "none", py: 5 }}>
      <Box
        sx={{
          width: "95%",
          alignSelf: "stretch",
          marginLeft: "auto",
          marginRight: "auto",
          py: 1,
          px: { xs: 0, sm: 0, md: 1, lg: 1, xl: 2 },
          backgroundColor: "none",
        }}
      >
        <Box textAlign="center" pb={4}>
          <Typography
            variant="h2"
            fontSize={{
              xs: "24px",
              sm: "32px",
              md: "32px",
              lg: "40px",
              xl: "40px",
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
                color: "black",
              }}
            />
          </Box>
        </Grid>
        {collections ? (
          <Grid item xs={12}>
            <Grid container spacing={1} sx={{ p: 1 }}>
              {collections.map((collection) => (
                <Grid item xs={6} md={4} lg={3} key={collection.collectionId}>
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
        ) : (
          <CenteredImage src="/static/loader.gif" alt="placeholder" />
        )}
      </Box>
    </Box>
  );
};

const CollectionSelectedContent = ({
  searchSerial,
  assets,
  setAssets,
  handleSearchSerial,
  collection,
  setChosenAsset,
  setChosenCollection,
}) => {
  return (
    <Box sx={{ backgroundColor: "none", py: 5 }}>
      <Box
        sx={{
          width: "95%",
          alignSelf: "stretch",
          marginLeft: "auto",
          marginRight: "auto",
          py: 1,
          px: { xs: 0, sm: 0, md: 1, lg: 1, xl: 2 },
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
            onClick={() => {
              setChosenCollection(null);
              setAssets(null);
            }}
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
            fontSize={{
              xs: "24px",
              sm: "32px",
              md: "32px",
              lg: "40px",
              xl: "40px",
            }}
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
        {assets ? (
          <Grid item xs={12}>
            <Grid container spacing={1} sx={{ p: 1 }}>
              {assets.map((asset) => (
                <Grid item xs={6} md={4} lg={3} key={asset.assetId}>
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
        ) : (
          <CenteredImage src="/static/loader.gif" alt="placeholder" />
        )}
      </Box>
    </Box>
  );
};

const AssetSelectedContent = ({
  asset,
  collection,
  setChosenAsset,
  menuViewExpressionValue,
  setMenuViewExpressionValue,
}) => {
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
          px: { xs: 0, sm: 0, md: 1, lg: 1, xl: 2 },
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
            onClick={() => {
              setChosenAsset(null);
              setMenuViewExpressionValue(null);
            }}
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
            fontSize={{
              xs: "24px",
              sm: "28px",
              md: "32px",
              lg: "36px",
              xl: "40px",
            }}
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
              overflow: "hidden", // Hide overflow
              textOverflow: "ellipsis", // Add ellipsis if the text is too long
              maxWidth: "calc(100% - 60px)", // Deducting the approximate width of the IconButton
              margin: 0,
            }}
          >
            {collection.collectionName} #{asset.serial}
          </Typography>
        </Box>
        <Stack alignItems="center" display="flex" py={2}>
          <img
            src={menuViewExpressionValue}
            alt="Asset Image"
            style={{ width: "60%", display: "block", marginBottom: "0" }}
          />

          <Typography
            variant="h4"
            color="#1D2D59"
            fontFamily="Chango"
            fontSize={{
              xs: "24px",
              sm: "28px",
              md: "32px",
              lg: "40px",
              xl: "40px",
            }}
            py={2}
          >
            Max Supply: {collection.maximum}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};
