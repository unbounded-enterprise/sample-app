import React, {
  Fragment,
  useEffect,
  useRef,
  useState,
} from "react";
import { CircularProgress } from "@mui/material";
import { MainLayout } from "src/components/main-layout";
import { useAssetLayer } from "src/contexts/assetlayer-context.js";
import { LoginContent } from "src/components/login-content";
import Head from "next/head";
import { getMainPageStyle } from "../theme/styles";
import { useRouter } from "next/router";
import { PlayUnity } from "src/components/play-unity";

const backgroundWidth = 1920;
const backgroundHeight = 1080;
const imageAspectRatio = backgroundWidth / backgroundHeight;

const PlayGamePage = () => {
  const {
    assetlayerClient,
    loggedIn,
    handleUserLogin,
    user,
    unityOn,
    setUnityOn,
    retrievingSession,
  } = useAssetLayer(); // Use the hook to get the client and loggedIn state

  const [cardWidth, setCardWidth] = useState(0);
  const [portrait, setPortrait] = useState(null);
  const router = useRouter();
  const cardRef = useRef(false);

  useEffect(() => {
    const handleResize = () => {
      setPortrait(window.innerWidth / window.innerHeight <= imageAspectRatio);
      if (cardRef.current) {
        // Measure the width of the card and set it to state
        setCardWidth(cardRef.current.offsetWidth);
      }
    };
    handleResize();

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (unityOn) {
      // When the Unity game is active, prevent scrolling
      document.body.style.overflow = "hidden";
    } else {
      // When the Unity game is not active, allow scrolling
      document.body.style.overflow = "";
    }

    return () => {
      // Clean up by resetting the overflow property
      document.body.style.overflow = "";
    };
  }, [unityOn]);

  useEffect(() => {
    if (loggedIn && !unityOn) {
      setUnityOn(true);
    }
  }, [loggedIn]);

  async function handleClose() {
    setUnityOn(false);
    router.push("/");
  }

  return (
    <>
      <Head>
        <title>Rolltopia - Runway Roller</title>
        {/* Other head tags */}
      </Head>
      <main style={getMainPageStyle(portrait)}>
        {retrievingSession ? (
          <CircularProgress />
        ) : (
          <Fragment>
            {!loggedIn ? (
              <LoginContent
                assetlayerClient={assetlayerClient}
                handleUserLogin={handleUserLogin}
                cardRef={cardRef}
                cardWidth={cardWidth}
              />
            ) : !unityOn ? (
              <></>
            ) : (
              <PlayUnity
                user={user}
                didToken={assetlayerClient.didToken}
                onClose={handleClose}
              />
            ) }
          </Fragment>
        )}
      </main>
    </>
  );
};

PlayGamePage.getLayout = (page) => <MainLayout>{page}</MainLayout>;

export default PlayGamePage;
