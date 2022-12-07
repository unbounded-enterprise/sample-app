import Head from 'next/head';
import { MainLayout } from '../components/main-layout';
import { HomeHero } from '../components/home/home-hero';
import { HomeHandcash } from '../components/home/home-handcash';
import { HomeProxy } from '../components/home/home-proxy';
import { HomeDurodogs } from '../components/home/home-durodogs';
import { HomeCollection } from '../components/home/home-collection';
import { Divider } from '@mui/material';

const Page = () => (
  <>
    <Head>
      <title>
        Asset Layer | Sample App
      </title>
    </Head>
    <main>
        <HomeHero />
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
