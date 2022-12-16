import Head from 'next/head';
import { MainLayout } from '../components/main-layout';
import { HomeHero } from '../components/home/home-hero';
import { HomeDurodogs } from '../components/home/home-durodogs';
import { Divider } from '@mui/material';
const { HomeHandcash } = require('../pages/api/auth/handcash/home-handcash');

const Page = () => (
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

Page.getLayout = (page) => (
  <MainLayout>
    {page}
  </MainLayout>
);

export default Page;
