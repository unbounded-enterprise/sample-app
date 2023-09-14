import { useEffect, useMemo, useRef, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/router";
import {
  Box,
  Breadcrumbs,
  Button,
  Card,
  CircularProgress,
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
  LinearProgress,
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
import { ChangoBackArrowOrange } from "src/icons/chango_back-arrow_orange.js";
import { authApi } from "../../_api_/auth-api";
import createBasicContext from "src/components/widgets/basic/basic-context";
import { BasicTextField } from "src/components/widgets/basic/basic-textfield";
import { basicClone } from "src/utils/basic/basic-format.ts";
import { loadStripe } from "@stripe/stripe-js";
import {
  AddressElement,
  CardElement,
  Elements,
  LinkAuthenticationElement,
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { StripeWordMark } from "src/icons/Stripe wordmark - blurple.js";

export const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY
);

export const defaultPaymentFormState = {
  cardName: "",
  line1: "",
  line2: "",
  city: "",
  state: "",
  postal_code: "",
  email: "",
};

export const {
  BasicProvider: PaymentFormProvider,
  useBasicStore: usePaymentFormProvider,
} = createBasicContext(basicClone(defaultPaymentFormState));

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
const creditCardFieldSx = {
  height: "2.5rem",
  padding: "10px",
  fontSize: "16px",
  border: "1px solid #aaaaaa",
  borderRadius: "8px",
  "&:hover": {
    border: "1px solid #045CD2",
  },
  "&:focus": {
    border: "2px solid #045CD2",
  },
};
const stripeElementsOptions = {
  appearance: {
    theme: "stripe",
    labels: "floating",
    /*
    variables: {
      colorPrimary: '#ffffff',
      colorBackground: '#aaaaaa',
      colorText: '#ffffff',
      colorDanger: '#ffffff',
      fontFamily: 'Ideal Sans, system-ui, sans-serif',
      spacingUnit: '2px',
      borderRadius: '4px',
      // See all possible variables below
    }
    */
    rules: {
      ".Label": { color: "#929394" },
      ".Input": { borderRadius: "8px" },
      ".Input::placeholder": { color: "#929394" },
    },
  },
};
const cardElementOptions = {
  style: { base: { "::placeholder": { color: "#929394" } } },
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
  {
    id: 0,
    price: 1.89,
    quantity: 5000,
    imageLink: "/static/Coins 1.png",
  },
  {
    id: 1,
    price: 8.99,
    quantity: 25000,
    imageLink: "/static/Coins 2.png",
  },
  {
    id: 2,
    price: 39.99,
    quantity: 100000,
    imageLink: "/static/Coins 3.png",
  },
  {
    id: 3,
    price: 149.99,
    quantity: 500000,
    imageLink: "/static/Coins 4.png",
  },
];

export async function createPaymentIntent(bundle) {
  try {
    const paymentIntent = await authApi.createStripePaymentIntent({ bundle });
    return { result: paymentIntent };
  } catch (error) {
    console.warn(error.message);
    return { error };
  }
}

const BalanceField = ({ balance }) => {
  return (
    <Box textAlign="center" pb={2}>
      <Typography
        variant="h2"
        fontSize={{
          xs: "20px",
          sm: "32px",
          md: "32px",
          lg: "50px",
          xl: "50px",
        }}
        color="#284B9B"
        fontFamily="Chango"
        sx={defaultTextSx}
      >
        My Balance: {balance ?? "?"}
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
        fontSize={{
          xs: "20px",
          sm: "32px",
          md: "32px",
          lg: "50px",
          xl: "50px",
        }}
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
        function bundleSelected() {
          selectBundle(item);
        }

        return (
          <Grid item xs={6} sm={4} md={3} key={item.price}>
            <CoinCard
              price={item.price}
              quantity={item.quantity}
              onClick={bundleSelected}
              imageLink={item.imageLink}
            />
          </Grid>
        );
      })}
    </Grid>
  );
};

const BuyBallsHeader = () => {
  return (
    <Box textAlign="center" pb={4} sx={defaultTextSx}>
      <Typography
        variant="h2"
        color="#FF4D0D"
        fontFamily="Chango"
        fontSize={{
          xs: "20px",
          sm: "32px",
          md: "32px",
          lg: "50px",
          xl: "50px",
        }}
      >
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
        <Grid item xs={6} sm={4} md={3} key={collection.collectionId}>
          <CollectionCard collection={collection} />
        </Grid>
      ))}
    </Grid>
  );
};

const BuyBallsContent = ({ collections }) => {
  const [search, setSearch] = useState("");
  const filteredCollections = useMemo(() => {
    return collections.filter((collection) =>
      collection.collectionName.toLowerCase().includes(search.toLowerCase())
    );
  }, [collections, search]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSelect = (value) => {
    setSort(value);
  };

  return (
    <Box>
      <BuyBallsHeader />
      <BuyBallsSearchbar search={search} setSearch={setSearch} />
      <BuyBallsGrid collections={filteredCollections} />
    </Box>
  );
};

const PurchaseCoinsHeader = ({ text, onBack }) => {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      sx={{
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Box
        onClick={onBack}
        sx={{ width: "5rem", height: "100%", py: "0.4rem", cursor: "pointer" }}
      >
        <Box sx={{ height: "3.5rem", pt: "0.5rem" }}>
          <SvgIcon
            component={ChangoBackArrowOrange}
            viewBox="0 0 42 43"
            sx={{ width: "100%", height: "100%" }}
          />
        </Box>
      </Box>
      <Box sx={{ pb: "0.25rem", height: "100%" }}>
        {text && (
          <Typography
            variant="h2"
            textAlign="center"
            color="#FF4D0D"
            fontFamily="Chango"
            sx={defaultTextSx}
          >
            {text}
          </Typography>
        )}
      </Box>
      <Box sx={{ width: "100%", maxWidth: "5rem" }} />
    </Stack>
  );
};

const PurchaseCoinsBody = ({ bundle }) => {
  return (
    <>
      <Box textAlign="center" pb={2}>
        <Typography
          variant="h3"
          color="#284B9B"
          fontFamily="Chango"
          sx={defaultTextSx}
        >
          Buy {bundle.quantity} Coins for
        </Typography>
        <Typography
          variant="h3"
          color="#284B9B"
          fontFamily="Chango"
          sx={defaultTextSx}
        >
          ${bundle.price}
        </Typography>
      </Box>
      <Box
        sx={{
          display: "flex",
          width: "100%",
          height: "100%",
          maxWidth: "15rem",
        }}
      >
        <img
          src="/static/coinImage.png"
          alt="balance-icon"
          style={{ width: "100%", height: "100%" }}
        />
      </Box>
    </>
  );
};

const PurchaseCoinsCurrencyButtons = ({ setCurrency }) => {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={{ xs: "1.5rem", sm: "2.5rem" }}
      sx={{
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
      }}
    >
      <Button
        onClick={() => setCurrency("USD")}
        sx={{
          color: "white",
          fontFamily: "Chango",
          border: "2px solid white",
          borderRadius: "4px",
          background:
            "linear-gradient(180deg, #FF580F 0%, #FF440B 100%), linear-gradient(0deg, #FFFFFF, #FFFFFF)",
          boxShadow: `3px 3px 8px rgba(0, 0, 0, 0.5)`,
          cursor: "pointer",
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
          "&:hover": {
            boxShadow: `3px 3px 8px rgba(0, 0, 0, 0.5)`,
          },
        }}
      >
        Buy with USD
      </Button>
      <Button
        onClick={() => setCurrency("BSV")}
        sx={{
          color: "white",
          fontFamily: "Chango",
          border: "2px solid white",
          borderRadius: "4px",
          background:
            "linear-gradient(180deg, #135322 0%, #31C052 100%), linear-gradient(0deg, #FFFFFF, #FFFFFF)",
          boxShadow: `3px 3px 8px rgba(0, 0, 0, 0.5)`,
          cursor: "pointer",
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
          "&:hover": {
            boxShadow: `3px 3px 8px rgba(0, 0, 0, 0.5)`,
          },
        }}
      >
        Buy with Handcash
      </Button>
    </Stack>
  );
};

const StripeCheckoutForm = ({ user }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      // Make sure to disable form submission until Stripe.js has loaded.
      return;
    }

    setIsLoading(true);

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
      confirmParams: {
        // Make sure to change this to your payment completion page
        // return_url: "http://localhost:3000",
      },
    });

    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error) {
      if (error.type === "card_error" || error.type === "validation_error") {
        setErrorMessage(error.message);
      } else {
        setErrorMessage("An unexpected error occurred.");
      }
    }

    setIsLoading(false);
  };

  return (
    <Stack sx={{ maxWidth: { md: "50%" } }}>
      <PaymentElement
        options={{
          paymentMethodOrder: ["card", "link", "google_pay", "apple_pay"],
          defaultValues: { billingDetails: { email: user.email } },
        }}
      />
      <Box sx={{ height: "0.8rem" }} />
      <AddressElement options={{ mode: "billing" }} />
      <Typography variant="subtitle2" sx={{ my: "1rem", fontSize: "14px" }}>
        {`You'll have a chance to review your order before it's placed.`}
      </Typography>
      {isLoading ? (
        <LinearProgress sx={{ my: "1rem", width: "100%" }} />
      ) : (
        <>
          {errorMessage && (
            <Typography sx={{ color: "red" }}>{errorMessage}</Typography>
          )}
          <Button
            onClick={handleSubmit}
            disabled={isLoading}
            sx={{ color: "white", backgroundColor: "#045CD2" }}
          >
            Next
          </Button>
        </>
      )}
    </Stack>
  );
};

const ShopContent = ({ user, balance, collections }) => {
  const [selectedBundle, setSelectedBundle] = useState(undefined);
  const [selectedCurrency, setSelectedCurrency] = useState("");
  const [paymentQR, setPaymentQR] = useState("");
  const [paymentIntent, setPaymentIntent] = useState(undefined);

  function selectBundle(bundle) {
    if (!bundle || user) setSelectedBundle(bundle);
  }

  async function createHandcashPayment(bundle) {
    try {
      const payment = await authApi.createHandcashPayment({
        userId: user.userId,
        bundleId: bundle.id,
        price: bundle.price,
      });
      console.log("payment response!", payment);
      setPaymentQR(payment.paymentRequestQrCodeUrl);
    } catch (e) {}
  }

  async function createStripePayment(bundle) {
    const { result, error } = await createPaymentIntent(bundle);
    console.log("result:", result, result?.client_secret);
    if (result?.client_secret) {
      setPaymentIntent(result);
    }
  }

  useEffect(() => {
    if (selectedCurrency === "BSV") {
      createHandcashPayment(selectedBundle);
      if (paymentIntent) {
        setPaymentIntent(undefined);
      }
    } else if (selectedCurrency === "USD") {
      createStripePayment(selectedBundle);
      if (paymentQR) setPaymentQR("");
    }
  }, [selectedCurrency]);

  return selectedBundle === undefined ? (
    <Card sx={shopCardSx}>
      <BalanceField balance={balance?.at(0)?.balance} />
      <BuyCoinsHeader />
      <BuyCoinsGrid selectBundle={selectBundle} />
      <BuyBallsContent collections={collections} />
    </Card>
  ) : !selectedCurrency ? (
    <Card
      sx={{
        my: "1rem",
        p: "1rem",
        pb: "3rem",
        borderRadius: "15px",
        maxHeight: "calc(100vh - 64px)",
        overflowY: "auto",
      }}
    >
      <Stack
        spacing="1rem"
        sx={{ justifyContent: "center", alignItems: "center", width: "100%" }}
      >
        <PurchaseCoinsHeader
          text="Purchase Coins"
          onBack={() => setSelectedBundle(undefined)}
        />
        <Box sx={{ width: "100%", maxWidth: "5rem" }} />
        <PurchaseCoinsBody bundle={selectedBundle} />
        <PurchaseCoinsCurrencyButtons setCurrency={setSelectedCurrency} />
      </Stack>
    </Card>
  ) : (
    <Card
      sx={{
        my: "1rem",
        p: "1rem",
        pb: "3rem",
        borderRadius: "15px",
        maxHeight: "calc(100vh - 64px)",
        overflowY: "auto",
      }}
    >
      {selectedCurrency === "USD" && (
        <Stack
          sx={{ justifyContent: "center", alignItems: "center", width: "100%" }}
        >
          <PurchaseCoinsHeader text="" onBack={() => setSelectedCurrency("")} />
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing="1rem"
            sx={{
              justifyContent: "space-between",
              width: "100%",
              px: { sm: "5rem" },
            }}
          >
            <Stack sx={{ justifyContent: "space-between" }}>
              <Stack>
                <Typography
                  variant="h6"
                  color="#284B9B"
                  fontFamily="Chango"
                  sx={defaultTextSx}
                >
                  Purchase {selectedBundle.quantity} Coins for:
                </Typography>
                <Typography
                  variant="h5"
                  color="#FF4D0D"
                  fontFamily="Chango"
                  sx={defaultTextSx}
                >
                  ${selectedBundle.price}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mt: { xs: "2.5rem", md: "4rem" },
                    width: "100%",
                  }}
                >
                  <img
                    src="/static/coinImage.png"
                    alt=""
                    style={{
                      width: "12rem",
                      height: "12rem",
                    }}
                  />
                </Box>
              </Stack>
              <Stack>
                <Box sx={{ minHeight: { xs: "4rem", md: "12rem" } }} />
                <Typography sx={{ fontSize: "16px" }}>Powered by</Typography>
                <Stack
                  direction="row"
                  spacing="1rem"
                  sx={{ alignItems: "center" }}
                >
                  <SvgIcon
                    component={StripeWordMark}
                    viewBox="0 0 368 222.5"
                    sx={{ width: "auto", height: "2.25rem" }}
                  />
                  <Typography sx={{ color: "#6B7280", fontSize: "14px" }}>
                    |
                  </Typography>
                  <Typography sx={{ color: "#6B7280", fontSize: "14px" }}>
                    Terms
                  </Typography>
                  <Typography sx={{ color: "#6B7280", fontSize: "14px" }}>
                    Privacy
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
            {paymentIntent && (
              <Elements
                stripe={stripePromise}
                options={{
                  clientSecret: paymentIntent?.client_secret,
                  ...stripeElementsOptions,
                }}
              >
                <PaymentFormProvider>
                  <StripeCheckoutForm user={user} />
                </PaymentFormProvider>
              </Elements>
            )}
          </Stack>
        </Stack>
      )}
      {selectedCurrency === "BSV" && (
        <Stack
          spacing="1rem"
          sx={{ justifyContent: "center", alignItems: "center", width: "100%" }}
        >
          <PurchaseCoinsHeader
            text="Pay with Handcash"
            onBack={() => setSelectedCurrency("")}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              width: "100%",
              maxWidth: "15rem",
            }}
          >
            {paymentQR ? (
              <img
                src={paymentQR}
                alt=""
                style={{ width: "100%", height: "100%" }}
              />
            ) : (
              <CircularProgress sx={{ width: "5rem", height: "5rem" }} />
            )}
          </Box>
        </Stack>
      )}
    </Card>
  );
};

const ShopPage = () => {
  const { assetlayerClient, loggedIn, handleUserLogin, user, balance } =
    useAssetLayer(); // Use the hook to get the client and loggedIn state
  const [collections, setCollections] = useState(undefined);
  const runOnceRef = useRef(false);

  const getCollections = async () => {
    const collectionsObject =
      await assetlayerClient.slots.safe.getSlotCollections({
        slotId: "64dc1aec9f07eb4ceb26f03c",
        includeDeactivated: false,
      });
    return collectionsObject.result;
  };

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
    };
  }, []);

  //if (!loggedIn) return <LoginButton />;
  //if (!(collections)) return loading;

  return (
    <main style={mainStyleProps}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "100%",
        }}
      >
        <Container maxWidth="md">
          {collections ? (
            <ShopContent
              user={user}
              balance={balance}
              collections={collections}
            />
          ) : (
            <CenteredImage src="/static/loader.gif" alt="placeholder" />
          )}
        </Container>
      </Box>
    </main>
  );
};

ShopPage.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default ShopPage;
