import Head from 'next/head';
import axios from 'axios';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Divider, Card, CardMedia, Grid, Paper } from '@mui/material';
import { useAuthContext } from '../contexts/auth-context';
import { NewLayout } from '../components/new-layout';
import { HomeHero } from '../components/home/home-hero';
import { HomeHandcash } from '../components/home/home-handcash';
import { HomeDurodogs } from '../components/home/home-durodogs';

// NOTE: must enable SSR for app here for SEO (unimplemented)

const Page = () => {
  const [app, setApp] = useState(null);

  useEffect(() => {
    getApp().then((app) => {
      setApp(app)
    })
      .catch(e => { console.log('setting error: ', e.message) });
  }, []);

  return (
    <>
      {app ? <>
        <Head>
          <title>
            {app.appName}
          </title>
        </Head>
        <main>
          <Grid container spacing={2}>
            <Grid item sm={12} md={7} lg={6} sx={{
            }}>
              <HomeHero app={app} />
            </Grid>
            <Grid item sm={12} md={5} lg={6} sx={{ mt: {xs:'.5em', md:'2em'}, alignItems: 'center', display: 'flex', flexDirection: {xs:'column', md:'row' }}}>
              <Card  sx={{
                backgroundColor: '#ffffff',
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                borderRadius: '32px',
                border: 32,
                borderColor: "background.paper"
              }}><CardMedia
              component="img"
              alt="app image"
              image={app.appImage}
            /></Card></Grid>
          </Grid>
        </main>
      </> : <></>}</>
  );
};

Page.getLayout = (page) => (
  <NewLayout>
    {page}
  </NewLayout>
);

export default Page;

const getApp = async () => {
  const appObject = (await axios.post('/api/app/info', {}));
  return appObject.data.app;
}