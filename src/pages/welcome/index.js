import Head from 'next/head';
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Box, Card, CardMedia, Grid, Typography } from '@mui/material';
import { MainLayout } from 'src/components/main-layout';
import { parseBasicErrorClient } from 'src/_api_/auth-api';
import { useAuth } from 'src/hooks/use-auth';
import NextLink from 'next/link';


// NOTE: must enable SSR for app here to enable SEO for page (unimplemented)

const Page = () => {
  const [app, setApp] = useState(null);
  const { user } = useAuth();


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
      { (!user) ? (<></>) : (
        <Box sx={{ backgroundColor: 'none', py: 5 }}>
          <Box sx={{
            width: '95%',
            alignSelf: 'stretch',
            marginLeft: "auto",
            marginRight: "auto",
            py: 1,
            px: {xs:2, sm:5},
            backgroundColor: 'none'
          }}>
            <Grid container spacing={2} mb={"1em"}>
              <Grid item xs={12} sx={{ display: 'flex', flexDirection: { xs:'column', md:'row' }, alignItems: 'center', mt: { xs: '.5em' , md: '2em' } }}>
                <Typography variant="h3">
                  Welcome {user.handle}
                </Typography>
              </Grid>
              <Grid item xs={12} sx={{ display: 'flex', flexDirection: { xs:'column', md:'row' }, alignItems: 'center'}}>
                <Typography variant="p2">
                  Welcome to {app.appName}! From here, you can browse collections, view your inventory, buy NFTs in the shop or trade NFTs in the marketplace.
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={4} xl={3} onClick={()=>{}}>
                <NextLink href={"/explorer"} passHref legacyBehavior>
                  <Card variant="outlined" sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    p: 1,
                    m: 1,
                    minWidth: "320px",
                    maxWidth: "400px"
                  }}> 
                    <img src={"/static/explorerImage.png"} alt={'Collection Image'} style={{ maxHeight: '300px', maxWidth: '300px', placeSelf: 'center' }} />
                    <Typography variant="p2" sx={{ padding: 1, fontWeight: "bold" }}>
                      Collection Explorer
                    </Typography>
                  </Card>
                </NextLink>
              </Grid>
              <Grid item xs={12} md={6} lg={4} xl={3} onClick={()=>{}}>
                <NextLink href={"/inventory"} passHref legacyBehavior>
                  <Card variant="outlined" sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    p: 1,
                    m: 1,
                    minWidth: "320px",
                    maxWidth: "400px"
                  }}> 
                    <img src={"/static/inventoryImage.png"} alt={'Collection Image'} style={{ maxHeight: '300px', maxWidth: '300px', placeSelf: 'center' }} />
                    <Typography variant="p2" sx={{ padding: 1, fontWeight: "bold" }}>
                      My NFTs
                    </Typography>
                  </Card>
                </NextLink>
              </Grid>        
              <Grid item xs={12} md={6} lg={4} xl={3} onClick={()=>{}}>
                <NextLink href={"/marketplace"} passHref legacyBehavior>
                  <Card variant="outlined" sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    p: 1,
                    m: 1,
                    minWidth: "320px",
                    maxWidth: "400px"
                  }}> 
                    <img src={"/static/marketImage.png"} alt={'Collection Image'} style={{ maxHeight: '300px', maxWidth: '300px', placeSelf: 'center' }} />
                    <Typography variant="p2" sx={{ padding: 1, fontWeight: "bold" }}>
                      Marketplace
                    </Typography>
                  </Card>
                </NextLink>
              </Grid>
              <Grid item xs={12} md={6} lg={4} xl={3} onClick={()=>{}}>
                <NextLink href={"/store"} passHref legacyBehavior>
                  <Card variant="outlined" sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    p: 1,
                    m: 1,
                    minWidth: "320px",
                    maxWidth: "400px"
                  }}> 
                    <img src={"/static/storeImage.png"} alt={'Collection Image'} style={{ maxHeight: '300px', maxWidth: '300px', placeSelf: 'center' }} />
                    <Typography variant="p2" sx={{ padding: 1, fontWeight: "bold" }}>
                      Store
                    </Typography>
                  </Card>
                </NextLink>
              </Grid>
            </Grid>
          </Box>
        </Box>
      ) }
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