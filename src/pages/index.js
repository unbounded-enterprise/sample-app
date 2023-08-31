import Head from 'next/head';
import axios from 'axios';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import { Button, Card, CardMedia, Grid } from '@mui/material';
import { MainLayout } from '../components/main-layout';
import { HomeHero } from '../components/home/home-hero';
import { parseBasicErrorClient } from 'src/_api_/auth-api';
//import { AssetLayer } from '@assetlayer/sdk-client';
import { useAssetLayer } from 'src/contexts/assetlayer-context.js'; // Import the hook


// NOTE: must enable SSR for app here to enable SEO for page (unimplemented)

const loginUser = () => {
  assetlayerClient.loginUser({ onSuccess: async () => console.log("success!") });
};

//const assetlayerClient = new AssetLayer({baseUrl: "/api"});

const Page = () => {
  const { assetlayerClient, loggedIn, setLoggedIn } = useAssetLayer(); // Use the hook to get the client and loggedIn state

  const [app, setApp] = useState(null);
  const [user, setUser] = useState(null);

  const getApp = async () => {
    const appObject = (await axios.post('/api/app/info', {}));
    return appObject.data.body.app;
  }
  
  const getIsLoggedIn = async () => {
    const loggedIn = await assetlayerClient.initialize();
    return loggedIn;
  }
  
  const getUser = async () => {
    const {result: user} = await assetlayerClient.users.safe.getUser();
    return user;
  }

  useEffect(() => {
    getApp()
      .then((app) => {
        setApp(app)
      })
      .catch(e => { 
        const error = parseBasicErrorClient(e);
        console.log('setting error: ', error.message);
      });
  }, []);

  useEffect(() => {
    getIsLoggedIn()
      .then((isLoggedIn) => {
        setLoggedIn(isLoggedIn)
      })
      .catch(e => { 
        const error = parseBasicErrorClient(e);
        console.log('setting error: ', error.message);
      });
  }, []);

  useEffect(() => {
    if(loggedIn){
      getUser()
      .then((user) => {
        setUser(user)
      })
      .catch(e => { 
        const error = parseBasicErrorClient(e);
        console.log('setting error: ', error.message);
      });
    }
  }, [loggedIn]);

  if (!app) return <></>;

  return (<>
    <Head>
      <title>
        { app.appName }
      </title>
    </Head>
    <main>
      <Grid container spacing={2} mb={"1em"}>
        <Grid item sm={12} md={7} lg={6}>
          <HomeHero app={app} />
        </Grid>
        <Grid item sm={12} md={5} lg={6} sx={{ display: 'flex', flexDirection: { xs:'column', md:'row' }, alignItems: 'center', mt: { xs: '.5em' , md: '2em' } }}>
          <Card sx={{
            backgroundColor: '#ffffff',
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column',
            borderRadius: '32px',
            border: 32,
            borderColor: "background.paper"
          }}>
            <CardMedia
              component="img"
              alt="app image"
              image={app.appImage}
            />
          </Card>
        </Grid>
      </Grid>
    </main>
  </>);
};

Page.getLayout = (page) => (
  <MainLayout>
    { page }
  </MainLayout>
);

export default Page;

