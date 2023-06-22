import { Fragment, useEffect, useState } from 'react';
import Head from 'next/head';
import { SessionProvider } from "next-auth/react"
import { CacheProvider } from '@emotion/react';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { CssBaseline } from '@mui/material';
import { ThemeProvider } from '@mui/material/styles';
import { AuthConsumer, AuthProvider } from '../contexts/auth-context';
import { createEmotionCache } from '../utils/create-emotion-cache';
import { parseBasicErrorClient } from 'src/_api_/auth-api';
import axios from 'axios';
import {useRouter} from 'next/router';
import { theme } from '../theme';

const clientSideEmotionCache = createEmotionCache();

const App = (props) => {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props;

  const getLayout = Component.getLayout ?? ((page) => page);

  const router = useRouter();
  const [app, setApp] = useState(null);

  useEffect(() => {
    getApp()
      .then((app) => {
        setApp(app);
      })
      .catch((e) => {
        const error = parseBasicErrorClient(e);
        console.log('setting error: ', error.message);
      });
  }, []);
  
  if (app) {
   
  return (
    <SessionProvider session={pageProps.session}>
    <CacheProvider value={emotionCache}>
      <Head>
        <title>
          {app.appName}
        </title>
        <meta
          name="viewport"
          content="initial-scale=1, width=device-width"
        />
        <meta name="twitter:card" content="summary" key="twcard" />
          <meta property="og:url" content={router.asPath} key="ogurl" />
          <meta
            property="og:image"
            content={app.appImage}
            key="ogimage"
          />
          <meta
            property="og:site_name"
            content={app.appName}
            key="ogsitename"
          />
          <meta property="og:title" content="NFT Photo Contest" key="ogtitle" />
          <meta
            property="og:description"
            content={
              app.description
            }
            key="ogdesc"
          />
      </Head>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <AuthConsumer>
              {
                (auth) => auth.isLoading
                  ? <Fragment />
                  : getLayout(<Component {...pageProps} />)
              }
            </AuthConsumer>
          </AuthProvider>
        </ThemeProvider>
      </LocalizationProvider>
    </CacheProvider>
    </SessionProvider>
  );
            }
};

const getApp = async () => {
  const appObject = (await axios.post('/api/app/info', { }));
  return appObject.data.app;
}

export default App;
