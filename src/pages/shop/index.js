import { useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { InputAdornment } from "@mui/material";
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
import { CollectionCard } from "src/components/shop/CollectionCard";
import { CoinCard } from "src/components/shop/CoinCard";
import React from "react";
import {
  sortCollections,
  collectionSortMethods,
} from "src/pages/explorer/slot/[id]/index";
import { parseBasicErrorClient } from "src/_api_/auth-api";
import { styled } from "@mui/system";
import { useAuth } from "src/hooks/use-auth";
import LoginButton from "src/components/home/login-button";
import { useAssetLayer } from "src/contexts/assetlayer-context.js"; // Import the hook
import "@fontsource/chango";
import SearchIcon from "@mui/icons-material/Search";

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

const ShopPage = () => {
  const [collections, setCollections] = useState(null);
  const [balance, setBalance] = useState("?");
  const [searchTerm, setSearchTerm] = useState("");
  const { assetlayerClient, loggedIn, setLoggedIn } = useAssetLayer(); // Use the hook to get the client and loggedIn state
  const [user, setUser] = useState(null);

  const coinPrices = [
    { price: 1.89, quantity: 1000 },
    { price: 8.99, quantity: 5000 },
    { price: 39.99, quantity: 25000 },
    { price: 149.99, quantity: 100000 },
  ];

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSelect = (value) => {
    setSort(value);
  };


  const getCollections = async () => {
      const collectionsObject = await assetlayerClient.slots.safe.getSlotCollections({slotId:"64dc1aec9f07eb4ceb26f03c", includeDeactivated:false});
      return collectionsObject.result;
  }

  const getCurrencyBalance = async () => {
    const { result: balance } =
      await assetlayerClient.currencies.safe.getCurrencyBalance();
    return balance;
  }

  const getUser = async () => {
    const { result: user } = await assetlayerClient.users.safe.getUser();
    return user;
  };

  const filteredCollections = collections
    ? collections.filter((collection) =>
        collection.collectionName
          .toLowerCase()
          .includes(searchTerm.toLowerCase())
      )
    : [];

  useEffect(() => {
    if (loggedIn) {
      getUser()
        .then((user) => {
          setUser(user);
        })
        .catch((e) => {
          const error = parseBasicErrorClient(e);
          console.log("setting error: ", error.message);
        });
    }
  }, [loggedIn]);

  useEffect(() => {
    if (loggedIn) {
      getCurrencyBalance()
        .then((currencyBalance) => {
          setBalance(currencyBalance[0].balance);
        })
        .catch((e) => {
          const error = parseBasicErrorClient(e);
          console.log("setting error: ", error.message);
        });
    }
  }, [loggedIn]);

  useEffect(() => {
      getCollections()
        .then((collections) => {
          setCollections(collections);
        })
        .catch((e) => {
          const error = parseBasicErrorClient(e);
          console.log("setting error: ", error.message);
        });
    
  }, []);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = globalScrollbarStyles;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  //if (!loggedIn) return <LoginButton />;
  if (!(collections)) return loading;

  return (
    <main
      style={{
        backgroundImage: `url("/static/Utopia Background Landscape (1).png")`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundColor: "transparent",
        height: "100vh", // This ensures the background image covers the entire viewport height
        overflow: "hidden", // This ensures no overflow from the main container
      }}
    >
      <Card
        sx={{
          width: "50%",
          height: "90vh", // Adjust this to your desired height
          margin: "5vh auto 0 auto", // Top margin is 5vh, right and left are auto, bottom is 0
          overflowY: "auto",
          padding: "2rem",
          boxSizing: "border-box",
          borderRadius: "15px", // Rounded corners
          "&::-webkit-scrollbar": {
            width: "0px", // Hide scrollbar by default
          },
          "&:hover::-webkit-scrollbar-thumb": {
            backgroundColor: "rgba(0, 0, 0, 0.5)", // Show scrollbar thumb on hover
          },
        }}
      >
        {/* Section One */}
        <Box textAlign="center" pb={2}>
          <Typography
            variant="h2"
            color="#284B9B"
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
            My Balance: {balance}
            <img
              src="/static/coinImage.png"
              alt="balance-icon"
              style={{
                marginLeft: "10px",
                verticalAlign: "middle",
                height: "2em", // Adjust this value to match the height of your text
              }}
            />
          </Typography>
        </Box>

        {/* Section Two */}
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
            Buy Rolltopia Coins
          </Typography>
        </Box>

        {/* Section Three */}
        <Grid container spacing={2} pb={4}>
          {coinPrices.map((item) => (
            <Grid item xs={12} md={3} key={item.price}>
              <CoinCard price={item.price} quantity={item.quantity} />
            </Grid>
          ))}
        </Grid>

        {/* Section Four */}
        <Box
          textAlign="center"
          pb={4}
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
          <Typography variant="h2" color="#FF4D0D" fontFamily="Chango">
            Shop Rolltopia Balls
          </Typography>
        </Box>

        {/* Section Five */}
        <Box textAlign="center" mb={3}>
          <TextField
            variant="outlined"
            placeholder="Search"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              style: { fontFamily: "Inter" },
            }}
          />
        </Box>

        {/* Section Six */}
        <Grid container spacing={2}>
          {filteredCollections.map((collection) => (
            <Grid item xs={12} sm={6} md={3} key={collection.collectionId}>
              <CollectionCard
                collection={collection}
              />
            </Grid>
          ))}
        </Grid>
      </Card>
    </main>
  );
};

ShopPage.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default ShopPage;
