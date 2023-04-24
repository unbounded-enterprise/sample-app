import Head from 'next/head';
import axios from 'axios';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import { Button, Grid, Typography } from '@mui/material';
import { MainLayout } from 'src/components/main-layout';
import { parseBasicErrorClient } from 'src/_api_/auth-api';
import { styled } from '@mui/system';


// NOTE: must enable SSR for app here to enable SEO for page (unimplemented)

const CenteredImage = styled('img')({
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    width: '50%',
  });

const slotButtonStyle = { color: 'blue', border: '1px solid blue', display: 'block', marginLeft: 'auto', marginRight: 'auto' };

const Page = () => {
  const [app, setApp] = useState(null);

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

  if (!app) return <></>;

  return (<>
    <Head>
      <title>
        { app.appName }
      </title>
    </Head>
    <main>
      <Grid container direction="column" justifyContent="center" alignItems="center" spacing={3} mt={"2em"} mb={"2em"}>
        <Grid item>
          <Typography variant="h4" align="center">
            Marketplace (Coming Soon!)
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1" align="center" maxWidth="40em">
            The marketplace will enable your users to buy and sell NFTs by displaying active listings from your app and will allow your users to create new listings.
          </Typography>
        </Grid>
        <Grid item>
          <CenteredImage src="/static/marketplaceImage.png" alt="placeholder" />
        </Grid>
        <Grid item>
          <NextLink href="/" passHref legacyBehavior>
            <Button sx={slotButtonStyle} onClick={"/"}>
              Back to Dashboard
            </Button>
          </NextLink>
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

const getApp = async () => {
  const appObject = (await axios.post('/api/app/info', {}));
  return appObject.data.app;
}