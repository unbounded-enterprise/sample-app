import Head from 'next/head';
import { MainLayout } from '../../components/main-layout';
import { NetlifyHero } from '../../components/netlify/netlify-hero';
import { Divider } from '@mui/material';

const Page = () => (
  <>
    <Head>
      <title>
        Deploy to Netlify | NFT Sample App
      </title>
    </Head>
    <main>
        <NetlifyHero />
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