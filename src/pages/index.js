import Head from 'next/head';
import { MainLayout } from '../components/main-layout';
import { HomeHero } from '../components/home/home-hero';
import { HomeNetlify } from '../components/home/home-netlify';
import { HomeHandcash } from '../components/home/home-handcash';
import { HomeProxy } from '../components/home/home-proxy';
import { HomeDurodogs } from '../components/home/home-durodogs';
import { HomeCollection } from '../components/home/home-collection';
import { Divider } from '@mui/material';

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
        <HomeNetlify />
        <Divider />
        <HomeProxy />
        <Divider />
        <HomeHandcash />
        <Divider />
        <HomeDurodogs />
        <Divider />
        <HomeCollection />
    </main>
  </>
);

Page.getLayout = (page) => (
  <MainLayout>
    {page}
  </MainLayout>
);

export default Page;
