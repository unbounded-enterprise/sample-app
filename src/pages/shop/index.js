import { useEffect, useMemo, useRef, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  Container,
  Typography,
  Grid,
  FormControl,
  InputAdornment,
  InputLabel,
  TextField,
  Select,
  Stack,
  SvgIcon,
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
import { ChangoBackArrowOrange } from 'src/icons/chango_back-arrow_orange.js';

const CenteredImage = styled("img")({
  display: "block",
  marginLeft: "auto",
  maxWidth: "200px",
  marginRight: "auto",
  width: "50%",
});
const mainStyleProps = {
  backgroundImage: `url("/static/Utopia Background Landscape (1).png")`,
  backgroundSize: "cover",
  backgroundRepeat: "no-repeat",
  backgroundColor: "transparent",
  height: "100vh", // This ensures the background image covers the entire viewport height
  overflow: "hidden", // This ensures no overflow from the main container
};
const shopCardSx = {
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
};
const slotButtonStyle = {
  color: "blue",
  border: "1px solid blue",
  fontSize: "1vw",
};
const defaultTextSx = {
  textShadow: `
    2px 2px 0 white, 
    -2px -2px 0 white, 
    2px -2px 0 white, 
    -2px 2px 0 white,
    3px 3px 8px rgba(0, 0, 0, 0.5)
  `,
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

const coinPrices = [
  { id: 0, price: 1.89, quantity: 1000 },
  { id: 1, price: 8.99, quantity: 5000 },
  { id: 2, price: 39.99, quantity: 25000 },
  { id: 3, price: 149.99, quantity: 100000 },
];

const BalanceField = ({ balance }) => {
  return (
    <Box textAlign="center" pb={2}>
      <Typography
        variant="h2"
        color="#284B9B"
        fontFamily="Chango"
        sx={defaultTextSx}
      >
        My Balance: {balance ?? '?'}
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
  );
};

const BuyCoinsHeader = () => {
  return (
    <Box textAlign="center" pb={4}>
      <Typography
        variant="h2"
        color="#FF4D0D"
        fontFamily="Chango"
        sx={defaultTextSx}
      >
        Buy Rolltopia Coins
      </Typography>
    </Box>
  );
};

const BuyCoinsGrid = ({ selectBundle }) => {
  return (
    <Grid container spacing={2} pb={4}>
      {coinPrices.map((item) => {
        function bundleSelected() { selectBundle(item); }

        return (
          <Grid item xs={12} md={3} key={item.price}>
            <CoinCard price={item.price} quantity={item.quantity} onClick={bundleSelected}/>
          </Grid>
        );
      })}
    </Grid>
  );
};

const BuyBallsHeader = () => {
  return (
    <Box
      textAlign="center"
      pb={4}
      sx={defaultTextSx}
    >
      <Typography variant="h2" color="#FF4D0D" fontFamily="Chango">
        Shop Rolltopia Balls
      </Typography>
    </Box>
  );
};

const BuyBallsSearchbar = ({ search, setSearch }) => {
  return (
    <Box textAlign="center" mb={3}>
      <TextField
        variant="outlined"
        placeholder="Search"
        fullWidth
        value={search}
        onChange={(e) => setSearch(e.target.value)}
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
  );
};

const BuyBallsGrid = ({ collections }) => {
  return (
    <Grid container spacing={2}>
      {collections.map((collection) => (
        <Grid item xs={12} sm={6} md={3} key={collection.collectionId}>
          <CollectionCard
            collection={collection}
          />
        </Grid>
      ))}
    </Grid>
  );
};

const BuyBallsContent = ({ collections }) => {
  const [search, setSearch] = useState("");
  const filteredCollections = useMemo(() => {
    return (collections.filter((collection) =>
      collection.collectionName
        .toLowerCase()
        .includes(search.toLowerCase())
    ));
  }, [collections, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSelect = (value) => {
    setSort(value);
  };

  return (<Box>
    <BuyBallsHeader/>
    <BuyBallsSearchbar search={search} setSearch={setSearch}/>
    <BuyBallsGrid collections={filteredCollections}/>
  </Box>);
};

const ShopContent = ({ user, balance, collections }) => {
  const [selectedBundle, setSelectedBundle] = useState(undefined);

  function selectBundle(bundle) {
    setSelectedBundle(bundle);
  }

  return ((selectedBundle === undefined) ? (
      <Card sx={shopCardSx}>
        <BalanceField balance={balance?.at(0)?.balance}/>
        <BuyCoinsHeader/>
        <BuyCoinsGrid selectBundle={selectBundle}/>
        <BuyBallsContent collections={collections}/>
      </Card>
    ) : (
      <Card sx={{ my: '1rem', p: '1rem', pb: '3rem', borderRadius: '15px', maxHeight: 'calc(100vh - 64px)', overflowY: 'auto' }}>
        <Stack spacing="1rem" sx={{ justifyContent: 'center', alignItems: 'center', width: '100%' }}>
          <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Box onClick={()=>selectBundle(undefined)} sx={{ width: '5rem', height: '100%', py: '0.4rem', cursor: 'pointer' }}>
              <Box sx={{ height: '3.5rem', pt: '0.5rem' }}>
                <SvgIcon component={ChangoBackArrowOrange} viewBox="0 0 42 43" sx={{ width: '100%', height: '100%' }}/>
              </Box>
            </Box>
            <Box sx={{ pb: '0.25rem', height: '100%' }}>
              <Typography
                variant="h2"
                textAlign="center"
                color="#FF4D0D"
                fontFamily="Chango"
                sx={defaultTextSx}
              >
                Purchase Coins
              </Typography>
            </Box>
            <Box sx={{ width: '100%', maxWidth: '5rem' }}/>
          </Stack>
          <Box textAlign="center" pb={2}>
            <Typography
              variant="h3"
              color="#284B9B"
              fontFamily="Chango"
              sx={defaultTextSx}
            >
              Buy {selectedBundle.quantity} Coins for
            </Typography>
            <Typography
              variant="h3"
              color="#284B9B"
              fontFamily="Chango"
              sx={defaultTextSx}
            >
              ${selectedBundle.price}
            </Typography>
          </Box>
          <Box sx={{ display: 'flex', width: '100%', height: '100%', maxWidth:'15rem' }}>
            <img
              src="/static/coinImage.png"
              alt="balance-icon"
              style={{ width: '100%', height: '100%' }}
            />
          </Box>
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: '1.5rem', sm: '2.5rem' }} sx={{ 
            justifyContent: 'center', alignItems: 'center', width: '100%' 
          }}>
            <Button sx={{ color: 'white', fontFamily: 'Chango', border: '2px solid white', borderRadius: '4px', 
              background: 'linear-gradient(180deg, #FF580F 0%, #FF440B 100%), linear-gradient(0deg, #FFFFFF, #FFFFFF)',
              boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
            }}>
              Buy with USD
            </Button>
            <Button sx={{ color: 'white', fontFamily: 'Chango', border: '2px solid white', borderRadius: '4px', 
              background: 'linear-gradient(180deg, #135322 0%, #31C052 100%), linear-gradient(0deg, #FFFFFF, #FFFFFF)',
              boxShadow: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
            }}>
              Buy with Handcash
            </Button>
          </Stack>
        </Stack>
      </Card>
    )
  );
};

const ShopPage = () => {
  const { assetlayerClient, loggedIn, handleUserLogin, user, balance } = useAssetLayer(); // Use the hook to get the client and loggedIn state
  const [collections, setCollections] = useState(undefined);
  const runOnceRef = useRef(false);

  const getCollections = async () => {
      const collectionsObject = await assetlayerClient.slots.safe.getSlotCollections({ slotId:"64dc1aec9f07eb4ceb26f03c", includeDeactivated:false });
      return collectionsObject.result;
  }

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = globalScrollbarStyles;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  useEffect(() => {
    if (runOnceRef.current) return;

    getCollections()
      .then((collections) => {
        setCollections(collections);
      })
      .catch((e) => {
        const error = parseBasicErrorClient(e);
        console.log("setting error: ", error.message);
      });
      
    return () => {
      runOnceRef.current = true;
    }
  }, []);

  //if (!loggedIn) return <LoginButton />;
  if (!(collections)) return loading;

  return (
    <main style={mainStyleProps}>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100%' }}>
        <Container maxWidth="md">
          <ShopContent user={user} balance={balance} collections={collections}/>
        </Container>
      </Box>
    </main>
  );
};

ShopPage.getLayout = (page) => (
  <MainLayout>
    { page }
  </MainLayout>
);

export default ShopPage;
