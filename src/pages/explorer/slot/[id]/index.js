import { useEffect, useState} from 'react';
import NextLink from 'next/link';
import {useRouter} from 'next/router';
import { Box, Breadcrumbs, Button, Typography, Grid, Link, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { BasicSearchbar } from 'src/components/widgets/basic/basic-searchbar';
import { MainLayout } from 'src/components/main-layout';
import { CollectionCard } from 'src/components/explorer/CollectionCard';
import DropdownMenu from '../../../../components/widgets/DropdownMenu';
import axios from 'axios';
import React from 'react';
import { parseBasicErrorClient } from 'src/_api_/auth-api';
import { styled } from '@mui/system';
import { useAuth } from 'src/hooks/use-auth';
import { HomeHandcash } from 'src/components/home/home-handcash';


const CenteredImage = styled('img')({display: 'block', marginLeft: 'auto', maxWidth: '200px', marginRight: 'auto', width: '50%'});
const slotButtonStyle = { color: 'blue', border: '1px solid blue', fontSize: '1vw' };

const loading = <> <CenteredImage src="/static/loader.gif" alt="placeholder" /> </>;

export const collectionSortMethods = {
  maximum: maximumSort,
  maximumReverse: maximumSortReverse,
  minted: mintedSort,
  mintedReverse: mintedSortReverse,
  newest: newestSort,
  oldest: oldestSort,
  aToZ,
  zToA,
};

function maximumSort(a, b) {
  if (a && b) {
    return b.maximum - a.maximum;
  }
  return 0;
}
  
function maximumSortReverse(a, b) {
  if (a && b) {
    return a.maximum - b.maximum;
  }
  return 0;
}
  
function mintedSort(a, b) {
  if (a && b) {
    return b.mintedAmt - a.mintedAmt;
  }
  return 0;
}
  
function mintedSortReverse(a, b) {
  if (a && b) {
    return a.mintedAmt - b.mintedAmt;
  }
  return 0;
}
  
function newestSort(a, b) {
  if (a && b) {
    return a.createdAt - b.createdAt;
  } 
  return 0;
}
  
function oldestSort(a, b) {
  if (a && b) {
    return b.createdAt - a.createdAt;
  } 
  return 0;
}

function aToZ(a, b) {
  if (a && b) {
    if (a.collectionName > b.collectionName) {
      return 1;
    } else if (b.collectionName > a.collectionName) {
      return -1;
    }
  } 
  return 0;
}

function zToA(a, b) {
  if (a && b) {
    if (a.collectionName > b.collectionName) {
      return -1;
    } else if (b.collectionName > a.collectionName) {
      return 1;
    }
  } 
  return 0;
}

const ExploreSlotPage = () => {
  const router = useRouter();
  const [thisLink, setThisLink] = useState("");
  const [app, setApp] = useState(null);
  const [collections, setCollections] = useState(null);
  const [chosenSlot, setChosenSlot] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("maximum");
  const { user } = useAuth();


  const handleSearch = e =>{
    setSearch(e.target.value);
  }

  const handleSelect = (value) => {
    setSort(value);
  }

  useEffect(()=>{
    if (router.isReady) {
      setThisLink(router.query.id.replace("/explorer/slot/",""));
    }
  }, [router.isReady]);

  useEffect(() => {
    if (thisLink) {
      getSlot(thisLink)
        .then((slot) => {
          setChosenSlot(slot);
        })
        .catch((e) => {
          const error = parseBasicErrorClient(e);
          console.log('setting error: ', error.message);
        });
    }
  }, [thisLink]);

  useEffect(() => {
    if (thisLink) {
      getCollections(thisLink)
        .then((collections) => {
          setCollections(collections);
        })
        .catch((e) => {
          const error = parseBasicErrorClient(e);
          console.log('setting error: ', error.message);
        });
    }
  }, [thisLink]);

  useEffect(() => {
    if (collections) {
      sortCollections(collections, sort)
        .then((newCollections) => {
          setCollections(newCollections);
        })
        .catch((e) => {
          const error = parseBasicErrorClient(e);
          console.log('setting error: ', error.message);
        });
    }
  }, [sort]);

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
  if (!(app && chosenSlot && collections)) return loading;

  const sharedSx = { font: 'nunito', lineHeight: '40px', fontSize: { xs: '12px', sm: '12px', md: '14px', lg: '16px', xl: '18px' } };
  const sharedSxBold = { fontWeight: 'bold', font: 'nunito', lineHeight: '40px', fontSize: { xs: '12px', sm: '12px', md: '14px', lg: '16px', xl: '18px' } };

  
  const sortOptions = [
    { value: 'maximum', display: 'Maximum: High to Low' },
    { value: 'maximumReverse', display: 'Maximum: Low to High' },
    { value: 'minted', display: 'Minted: High to Low' },
    { value: 'mintedReverse', display: 'Minted: Low to High' },
    { value: 'newest', display: 'Newest' },
    { value: 'oldest', display: 'Oldest' },
    { value: 'aToZ', display: 'Alphabetical' },
    { value: 'zToA', display: 'Reverse Alphabetical' },
  ];
  

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
        <Grid container spacing={1}>
          <Grid item>
            <Breadcrumbs aria-label="breadcrumb">
              <NextLink underline="hover" color="inherit" href="/explorer">
                App
              </NextLink>
              <Typography color="text.primary">
                Slot
              </Typography>
            </Breadcrumbs>
          </Grid>
          <Grid item xs={12} sx={{ backgroundColor: "none" }}>
            <Typography variant="p2" sx={sharedSxBold}>
              App:&nbsp;
            </Typography>
            <Typography variant="p2" sx={sharedSx}>
              {app.appName} &emsp;
            </Typography>
            <Typography variant="p2" sx={sharedSxBold}>
              Slot:&nbsp;
            </Typography>
            <Typography variant="p2" sx={sharedSx}>
              { chosenSlot.slotName } 
            </Typography> 
          </Grid>
          <Grid item xs={12} sx={{ backgroundColor: "none" }}>
            <Typography variant="p2" sx={sharedSxBold}>
              Total Collections:&nbsp;
            </Typography>
            <Typography variant="p2" sx={sharedSx}>
              {chosenSlot.collections.length} &emsp;
            </Typography>
            <Typography variant="p2" sx={sharedSxBold}>
              Total NFTs:&nbsp;
            </Typography>
            <Typography variant="p2" sx={sharedSx}>
              TBD
              <br></br>
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{backgroundColor: "none"}}>
            <Box sx={{left:0, width:"100%"}}>
              <BasicSearchbar onChange={handleSearch} sx={{ left: 0, width: "80%", p: 1 }}/>
              <DropdownMenu sx={{ width: '20%', p: 1, right: 0 }} optionsArray={sortOptions} onChange={handleSelect} label='Sort' defaultValue={'maximum'} />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Grid container>
              { collections.map((collection) => (
                <React.Fragment key={collection.collectionId}>
                  <CollectionCard search={search} collection={collection} slot={chosenSlot} />
                </React.Fragment>
              )) }
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

ExploreSlotPage.getLayout = (page) => (
  <MainLayout>
    { page }
  </MainLayout>
);

const getApp = async () => {
  const appObject = (await axios.post('/api/app/info', { }));
  return appObject.data.app;
}

const getSlot = async (slotId) => { // just used for testing
  const slotsObject = (await axios.post('/api/slot/info', { slotId }));
  return slotsObject.data.slot;
}
  
const getCollections = async (slot, sortFunction) => {
  if (slot) {
    const collectionsObject = (await axios.post('/api/slot/collections', { slotId: slot, idOnly: false, includeDeactivated: false }));
    return collectionsObject.data.slot.collections.sort(maximumSort);
  }
}
  
export const sortCollections = async (collections, sortFunction) => {
  const sortMethod = collectionSortMethods[sortFunction];
  
  return (!!sortMethod) ? [...collections.sort(sortMethod)] : collections;
}

export default ExploreSlotPage;