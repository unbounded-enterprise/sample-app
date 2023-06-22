import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { Box, Breadcrumbs, Button, Typography, Grid, Link } from '@mui/material';
import { MainLayout } from 'src/components/main-layout';
import axios from 'axios';
import React from 'react';
import { NftDetailDisplay } from 'src/components/DisplayNFT/NftDetailDisplay';
import CollectionDetailsInfos from 'src/components/DisplayNFT/CollectionDetailsInfos';
import { parseBasicErrorClient } from 'src/_api_/auth-api';
import { styled } from '@mui/system';
import { useAuth } from 'src/hooks/use-auth';
import { HomeHandcash } from 'src/components/home/home-handcash';


const CenteredImage = styled('img')({display: 'block', marginLeft: 'auto', maxWidth: '200px', marginRight: 'auto', width: '50%'});
const slotButtonStyle = { color: 'blue', border: '1px solid blue', fontSize: '1vw' };

const loading = <> <CenteredImage src="/static/loader.gif" alt="placeholder" /> </>;

const ExploreNftDetailPage = () => {
  const router = useRouter();
  const [app, setApp] = useState(null);
  const [sort, setSort] = useState("maximum");
  //const [nftSort, setNftSort] = useState("ascending");
  const [chosenCollection, setChosenCollection] = useState(null);
  const [chosenSlot, setChosenSlot] = useState(null);
  const [chosenNft, setChosenNft] = useState(null);

  const [slotId, setSlotId] = useState(null);
  const [collectionId, setCollectionId] = useState(null);
  const [nftId, setNftId] = useState(null);
  const { user } = useAuth();


  
  useEffect(() => {
    if(router.isReady){
      setSlotId(router.asPath.split("/")[3]);
      setCollectionId(router.asPath.split("/")[5]);
      setNftId(router.asPath.split("/")[7]);
    }
  }, [router.isReady]);

  useEffect(() => {
    if (slotId) {
      getSlot(slotId)
        .then((slot) => {
          setChosenSlot(slot);
        })
        .catch((e) => {
          const error = parseBasicErrorClient(e);
          console.log('setting error: ', error.message);
        });
    }
  }, [slotId]);

  useEffect(() => {
    if (collectionId) {
      getCollection(collectionId, sort)
        .then((collection) => {
          setChosenCollection(collection);
        })
        .catch((e) => {
          const error = parseBasicErrorClient(e);
          console.log('setting error: ', error.message)
        });
    }
  }, [collectionId]);

  useEffect(() => {
    if (nftId) {
      getNft(nftId)
        .then((nft) => {
          setChosenNft(nft);
        })
        .catch((e) => {
          const error = parseBasicErrorClient(e);
          console.log('setting error: ', error.message);
        });
    }
  }, [nftId]);

  useEffect(( )=> {
    getApp()
      .then((app) => {
        setApp(app);
      })
      .catch((e) => {
        const error = parseBasicErrorClient(e);
        console.log('setting error: ', error.message);
      });
  }, []);

  //if (!user) return <HomeHandcash />;
  if (!(chosenCollection && chosenSlot && chosenNft && app)) return loading;
  
  return (
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
        <Grid container spacing={2} minWidth="320px">
          <Grid item xs={12}>
            <Breadcrumbs aria-label="breadcrumb">
              <NextLink underline="hover" color="inherit" href="/explorer">
                App
              </NextLink>
              <NextLink underline="hover" color="inherit" href={`/explorer/slot/${slotId}`}>
                Slot
              </NextLink>
              <NextLink underline="hover" color="inherit" href={`/explorer/slot/${slotId}/collection/${collectionId}`}>
                Collection
              </NextLink>
              <Typography color="text.primary">
                NFT
              </Typography>
            </Breadcrumbs>
          </Grid>
          <Grid item xs={12} sx={{ backgroundColor: "none" }}>
            <Typography variant="h3" sx={{ lineHeight: '40px' }}>
              {chosenCollection.collectionName} #{chosenNft.serial}
            </Typography>
            <CollectionDetailsInfos
              creator={chosenCollection.handle}
              appName={app.appName}
              slotName={chosenSlot.slotName}
              totalSupply={chosenCollection.maximum}
              collectionName={chosenCollection.collectionName}
              type={chosenCollection.type}
              nftLocation={chosenNft.location}
            />
        <NftDetailDisplay nft={chosenNft} />
      </Grid>
        </Grid>
      </Box>
    </Box> 
  )
}

ExploreNftDetailPage.getLayout = (page) => (
  <MainLayout>
    { page }
  </MainLayout>
);

export default ExploreNftDetailPage;

const getApp = async() => {
  const appObject = (await axios.post('/api/app/info', { }));
  return appObject.data.app;
}

const getSlot = async (slotId) => { // just used for testing
  if (slotId.length > 10) {
    const slotsObject = (await axios.post('/api/slot/info', { slotId }));
    return slotsObject.data.slot;
  }
}


const getCollection = async (collection, sortFunction) => {
  if (collection.length > 10) {
    const collectionsObject = (await axios.post('/api/collection/info', { collectionId: collection, idOnly: false, includeDeactivated: false }));
    return collectionsObject.data.collections[0];
  }
}

const getNft = async (nftId) => {
  let nftObject;  
  if (nftId) {
    nftObject = (await axios.post('/api/nft/info', { nftId }));
  } 
  return nftObject.data.nfts[0];
}