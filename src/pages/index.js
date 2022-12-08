import Head from 'next/head';
import { MainLayout } from '../components/main-layout';
import { HomeHero } from '../components/home/home-hero';
import { HomeHandcash } from '../components/home/home-handcash';
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
        <HomeHandcash />
        <Divider />
        <HomeDurodogs />
        <Divider />
        {/* <HomeCollection /> */}
    </main>
  </>
);

Page.getLayout = (page) => (
  <MainLayout>
    {page}
  </MainLayout>
);

export default Page;
