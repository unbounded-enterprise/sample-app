import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { Divider, Grid } from '@mui/material';
import { useAuthContext } from '../contexts/auth-context';
import { NewLayout } from '../components/new-layout';
import { HomeHero } from '../components/home/home-hero';
import { HomeHandcash } from '../components/home/home-handcash';
import { HomeDurodogs } from '../components/home/home-durodogs';


const Page = () => {

  return (
    <>
      <Head>
        <title>
          NFT Sample App | Asset Layer
        </title>
      </Head>
      <main>
          <HomeHero />
          <Divider />
          <HomeHandcash />
          <Divider />
          <HomeDurodogs />
          <Divider />
      </main>
    </>
  );
};

Page.getLayout = (page) => (
  <NewLayout>
    {page}
  </NewLayout>
);

export default Page;
