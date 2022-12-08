import Head from 'next/head';
import { MainLayout } from '../../components/main-layout';
import { TutorialHero } from '../../components/tutorial/tutorial-hero';
import { TutorialNetlify } from '../../components/tutorial/tutorial-netlify';
import { HomeHandcash } from '../../components/home/home-handcash';
import { TutorialProxy } from '../../components/tutorial/tutorial-proxy';
import { HomeDurodogs } from '../../components/home/home-durodogs';
import { HomeCollection } from '../../components/home/home-collection';
import { Divider } from '@mui/material';

const Page = () => (
  <>
    <Head>
      <title>
        Tutorial | Asset Layer
      </title>
    </Head>
    <main>
        <TutorialHero />
        <Divider />
        <TutorialNetlify />
        <Divider />
        <TutorialProxy />
        <Divider />
        <HomeHandcash />
    </main>
  </>
);

Page.getLayout = (page) => (
  <MainLayout>
    {page}
  </MainLayout>
);

export default Page;
