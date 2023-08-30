import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { Box, Button, Breadcrumbs, IconButton, Typography, Grid, LinearProgress, TextField } from '@mui/material';
import { BasicSearchbar } from 'src/components/widgets/basic/basic-searchbar';
import { MainLayout } from 'src/components/main-layout';
import { AssetCard } from 'src/components/explorer/AssetCard';
import axios from 'axios';
import React from 'react';
import { parseBasicErrorClient } from 'src/_api_/auth-api';
import { styled } from '@mui/system';
import { useAuth } from 'src/hooks/use-auth';
import { HomeHandcash } from 'src/components/home/home-handcash';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


const CenteredImage = styled('img')({display: 'block', marginLeft: 'auto', maxWidth: '200px', marginRight: 'auto', width: '50%'});
const slotButtonStyle = { color: 'blue', border: '1px solid blue'};
const textStyle = { font: 'nunito', lineHeight: '50px' };
const boldTextStyle = { font: 'nunito', fontWeight: 'bold', lineHeight: '50px' };

const loading = <> <CenteredImage src="/static/loader.gif" alt="placeholder" /> </>;

const ExploreCollectionPage = () => {
  const router = useRouter();
  const [app, setApp] = useState(null);
  const [sort, setSort] = useState("maximum");
  const [assets, setAssets] = useState(null);
  const [chosenCollection, setChosenCollection] = useState(null);
  const [chosenSlot, setChosenSlot] = useState(null);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(19);
  const [assetSearch, setAssetSearch] = useState(null);
  const [slotId, setSlotId] = useState(null);
  const [collectionId, setCollectionId] = useState(null);
  const [page, setPage] = useState(1);
  const { user } = useAuth();


  function nextPage() {
    setFrom(from+20); 
    setTo(to+20);
    setAssets(null);
    setPage(page+1);
    //scroll(0,0)
  }

  function lastPage() {
    if (from > 0) { 
      setFrom(from-20); 
      setTo(to-20);
      setAssets(null);
      setPage(page-1);
      //scroll(0,0)
    }
  }

  const handlePageChange = (event) => {
    setPage(event.target.value);
    const newValue = parseInt(event.target.value);
    if (!isNaN(newValue)) {
      setFrom((newValue-1)*20);
      setTo((newValue-1)*20+19);
    }
  };

  const handleAssetSearch = (e) => {
    if (e.key === "Enter") {
      setAssetSearch(e.target.value);
    }
  }

  useEffect(() => {
    if (router.isReady) {
      setSlotId(router.asPath.split("/")[3]);
      setCollectionId(router.asPath.split("/")[5]);
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
          console.log('setting error: ', error.message);
        });
    }
  }, [collectionId]);

  useEffect(() => {
    if (chosenCollection) {
      getAssets({ collectionId: chosenCollection.collectionId, to, from })
        .then((assets) => {
          setAssets(assets);
        })
        .catch((e) => {
          const error = parseBasicErrorClient(e);
          console.log('setting error: ', error.message);
        });
    }
  }, [chosenCollection, from, to]);

  useEffect(() => {
    if (collectionId) {
      getAssets({ collectionId: chosenCollection.collectionId, serials:assetSearch })
        .then((assets) => {
          setAssets(assets);
        })
        .catch((e) => {
          const error = parseBasicErrorClient(e);
          console.log('setting error: ', error.message);
        });
    }
  }, [assetSearch]);

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

  //if (!user) return <HomeHandcash />;
  if (!(chosenCollection && chosenSlot && app)) return loading;

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
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Breadcrumbs aria-label="breadcrumb">
              <NextLink underline="hover" color="inherit" href="/explorer">
                App
              </NextLink>
              <NextLink underline="hover" color="inherit" href={`/explorer/slot/${slotId}`}>
                Slot
              </NextLink>
              <Typography color="text.primary">
                Collection
              </Typography>
            </Breadcrumbs>
          </Grid>
          <Grid item>
            <Typography variant="h3" sx={{ font: 'nunito', fontWeight: 'bold', lineHeight: '40px' }}>
              { chosenCollection.collectionName }
            </Typography> 
            <Typography variant="p2" sx={textStyle}>
              Creator:&nbsp;
            </Typography>
            <Typography variant="p2" sx={boldTextStyle}>
              {chosenCollection.creator.handle} &emsp;
            </Typography>
            <Typography variant="p2" sx={textStyle}>
              App:&nbsp;
            </Typography>
            <Typography variant="p2" sx={boldTextStyle}>
              {app.appName} &emsp;
            </Typography>
            <Typography variant="p2" sx={textStyle}>
              Slot:&nbsp;
            </Typography>
            <Typography variant="p2" sx={boldTextStyle}>
              {chosenSlot.slotName} &emsp;
            </Typography>
            <Typography variant="p2" sx={textStyle}>
              Minted:&nbsp;
            </Typography>
            <Typography variant="p2" sx={boldTextStyle}>
              {chosenCollection.minted} &emsp;
            </Typography>
            <Typography variant="p2" sx={textStyle}>
              Max Supply:&nbsp;
            </Typography>
            <Typography variant="p2" sx={boldTextStyle}>
              { (chosenCollection.maximum > 900000000) ? '\u221e' : chosenCollection.maximum } &emsp;
            </Typography>
            <Typography variant="p2" sx={textStyle}>
              Type:&nbsp;
            </Typography>
            <Typography variant="p2" sx={boldTextStyle}>
              {chosenCollection.type} &emsp;
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ backgroundColor: "none" }}>
            <Box sx={{ left: 0, width: "100%" }}>
              <BasicSearchbar onKeyPress={handleAssetSearch} sx={{ left: 0, width: "80%", p: 1 }}/>
            </Box>
          </Grid>
          <Grid item>
            <Box sx={{}}>
              <Typography variant="h3">
                Select Asset to View Details
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1} sx={{ p: 1 }}>
              { (!!assets) ? assets.map((asset) => (
                <React.Fragment key={asset.assetId}>
                  <AssetCard collection={chosenCollection} asset={asset} slot={chosenSlot} />
                </React.Fragment>
              )) : <LinearProgress sx={{ width: '100%', mb: '1rem' }}/> }
            </Grid>
            <Grid item xs={12}>
              <Box display="flex" justifyContent="center">
                <Typography variant="p2" alignSelf="center">
                  {from}-{to} of {chosenCollection.minted} &emsp;
                </Typography>
                <IconButton onClick={lastPage}>
                  <ArrowBackIosIcon/>
                </IconButton>
                <TextField
                  type="number"
                  label="Page"
                  value={page}
                  onChange={handlePageChange}
                />
                <IconButton onClick={nextPage}>
                  <ArrowForwardIosIcon/>
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

ExploreCollectionPage.getLayout = (page) => (
    <MainLayout>
      { page }
    </MainLayout>
  );

export default ExploreCollectionPage;

const getApp = async () => {
  const appObject = (await axios.post('/api/app/info', { }));
  return appObject.data.body.app;
}

const getSlot = async (slotId)=>{ 
  if (slotId.length > 10) {
    const slotsObject = (await axios.post('/api/slot/info', { slotId }));
    return slotsObject.data.body.slot;
  }
}


const getCollection = async (collection, sortFunction) => {
  if (collection.length > 10) {
    const collectionsObject = (await axios.post('/api/collection/info', { collectionId: collection, idOnly: false, includeDeactivated: false }));
    console.log(collectionsObject);
    return collectionsObject.data.body.collections[0];
  }
}

const getAssets = async ({ collectionId, serials, from, to }) => {
  let assetsObject;
  if (collectionId) {
    if (serials) {
      assetsObject = (await axios.post('/api/collection/assets', { collectionId, idOnly: false, serials }));
    } else {  
      assetsObject = (await axios.post('/api/collection/assets', { collectionId, idOnly: false, from, to }));
    }
    return assetsObject.data.body.collection.assets;
  }
}