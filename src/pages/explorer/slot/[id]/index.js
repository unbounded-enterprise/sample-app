import { useEffect, useState} from 'react';
import NextLink from 'next/link';
import {useRouter} from 'next/router';
import { Box, Breadcrumbs, Button, Typography, Grid, Link, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { BasicSearchbar } from 'src/components/basic-searchbar';
import { NewLayout } from 'src/components/new-layout';
import { CollectionCard } from 'src/components/explorer/CollectionCard';
import axios from 'axios';
import React from 'react';

const slotButtonStyle = { color: 'blue', border: '1px solid blue', fontSize: '1vw' };
const emptyNode = <></>;
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

  const handleSearch = e =>{
    setSearch(e.target.value);
  }

  const handleSelect = e =>{
    setSort(e.target.value);
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
          console.log('setting error: ', e.message);
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
          console.log('setting error: ', e.message);
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
          console.log('setting error: ', e.message);
        });
    }
  }, [sort]);

  useEffect(() => {
    getApp()
      .then((app) => {
        setApp(app);
      })
      .catch((e) => {
        console.log('setting error: ', e.message);
      });
  }, []);

  if (!(app && chosenSlot && collections)) return emptyNode;

  const sharedSx = { font: 'nunito', lineHeight: '40px', fontSize: { xs: '12px', sm: '12px', md: '14px', lg: '16px', xl: '18px' } };
  const sharedSxBold = { fontWeight: 'bold', font: 'nunito', lineHeight: '40px', fontSize: { xs: '12px', sm: '12px', md: '14px', lg: '16px', xl: '18px' } };

  return (
    <Box sx={{ backgroundColor: 'none', py: 5 }}>
      <Box sx={{
        width: '95%',
        alignSelf: 'stretch',
        marginLeft: "auto",
        marginRight: "auto",
        py: 1,
        px: 5,
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
              <BasicSearchbar onChange={handleSearch} sx={{ left:0, width:"80%", p: 1}}/>
              <FormControl sx={{width:"20%", right:0, p:1}}>
                <InputLabel id="demo-simple-select-label">
                  Sort
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  label="Sort"
                  onChange={handleSelect}
                >
                  <MenuItem value={"maximum"}>Maximum: High to Low</MenuItem>
                  <MenuItem value={"maximumReverse"}>Maximum: Low to High</MenuItem>
                  <MenuItem value={"minted"}>Minted: High to Low</MenuItem>
                  <MenuItem value={"mintedReverse"}>Minted: Low to High</MenuItem>
                  <MenuItem value={"newest"}>Newest</MenuItem>
                  <MenuItem value={"oldest"}>Oldest</MenuItem>
                  <MenuItem value={"aToZ"}>Alphabetical</MenuItem>
                  <MenuItem value={"zToA"}>Reverse Alphabetical</MenuItem>
                </Select>
              </FormControl>
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
  <NewLayout>
    { page }
  </NewLayout>
);

const getApp = async () => {
  const appObject = (await axios.post('/api/app/info', { }));
  return appObject.data.app;
}

const getSlot = async (slotId) => { // just used for testing
  const slotsObject = (await axios.post('/api/slot/info', { slotId: slotId }));
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