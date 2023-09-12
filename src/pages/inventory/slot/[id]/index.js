import { useEffect, useState} from 'react';
import NextLink from 'next/link';
import {useRouter} from 'next/router';
import { Box, Breadcrumbs, Typography, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { BasicSearchbar } from 'src/components/widgets/basic/basic-searchbar';
import { MainLayout } from 'src/components/main-layout';
import { CollectionCard } from 'src/components/inventory/CollectionCard';
import axios from 'axios';
import React from 'react';
import { sortCollections, collectionSortMethods } from 'src/pages/explorer/slot/[id]/index';
import DropdownMenu from '../../../../components/widgets/DropdownMenu';
import { parseBasicErrorClient } from 'src/_api_/auth-api';
import { styled } from '@mui/system';
import { useAuth } from 'src/hooks/use-auth';
import LoginButton from 'src/components/home/login-button';
import { useAssetLayer } from 'src/contexts/assetlayer-context.js'; // Import the hook




const CenteredImage = styled('img')({display: 'block', marginLeft: 'auto', maxWidth: '200px', marginRight: 'auto', width: '50%'});
const slotButtonStyle = { color: 'blue', border: '1px solid blue', fontSize: '1vw' };

const loading = <> <CenteredImage src="/static/loader.gif" alt="placeholder" /> </>;

const InventorySlotPage = ()=>{
  const router = useRouter();
  const [thisLink, setThisLink] = useState("");
  const [app, setApp] = useState(null);
  const [collections, setCollections] = useState(null);
  const [chosenSlot, setChosenSlot] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("maximum");
  const [totalNfts, setTotalNfts] = useState(0);
  const [collectionCounts, setCollectionCounts] = useState({});
  const [activeCollections, setActiveCollections] = useState(null);
  const { assetlayerClient, loggedIn, handleUserLogin } = useAssetLayer(); // Use the hook to get the client and loggedIn state
  const [user, setUser] = useState(null);
  
  const handleSearch = (e) => {
    setSearch(e.target.value);
  }

  const handleSelect = (value) => {
    setSort(value);
  }

  
const countNfts = async (collectionCounts) => {
  let nftCount = 0;
  for (const key in collectionCounts) {
    if (collectionCounts.hasOwnProperty(key)) {
      nftCount += collectionCounts[key];
    }
  }
  return nftCount;
}
  
/*const getNftCounts = async (collections) => {
  var nftCounts = {};
  if (collections){
    for (const element of collections) {
      var nftCount = await axios.post('/api/nft/collections', { collectionIds:[element.collectionId], countsOnly: true });
      if(nftCount){
        nftCounts[element.collectionId] = nftCount.data.collections[element.collectionId];
      }
    }
    console.log(nftCounts);
    return nftCounts;
  }
}*/
  
const getApp = async () => {
  const appObject = (await axios.post('/api/app/info', { }));
  return appObject.data.body.app;
}

const getSlot = async (slotId)=>{ // just used for testing
  const slotsObject = (await axios.post('/api/slot/info', { slotId }));
  return slotsObject.data.body.slot;
}
  
const getCollections = async (activeCollections) => {
  if (activeCollections) {
    const collections = Object.keys(activeCollections);
    if (!(collections.length > 0)) return [];
    const collectionsObject = await assetlayerClient.collections.safe.getCollections({collectionIds: collections, idOnly: false });
    //(await axios.post('/api/collection/info', { collectionIds: collections, idOnly: false, includeDeactivated: false }));
    return collectionsObject.result.sort(collectionSortMethods.maximum);
  }
}

const getActiveCollections = async (slot) => {
  if (slot) {
    const {result: activeCollectionsObject} = await assetlayerClient.assets.safe.getUserSlotsAssets({slotIds: [slot], countsOnly: true });

    //const activeCollectionsObject = await axios.post('/api/nft/slots', { slotIds: [slot], countsOnly: true });
    //console.log(Object.keys(activeCollectionsObject.data.nfts));
    console.log(activeCollectionsObject);
    return activeCollectionsObject;
  }
}

const getUser = async () => {
  const {result: user} = await assetlayerClient.users.safe.getUser();
  return user;
}

const getIsLoggedIn = async () => {
  const loggedIn = await assetlayerClient.initialize();
  return loggedIn;
}

  useEffect(() => {
    getIsLoggedIn()
      .then((isLoggedIn) => {
        handleUserLogin(isLoggedIn)
      })
      .catch(e => { 
        const error = parseBasicErrorClient(e);
        console.log('setting error: ', error.message);
      });
  }, []);

  useEffect(() => {
    if(loggedIn){
      getUser()
      .then((user) => {
        setUser(user)
      })
      .catch(e => { 
        const error = parseBasicErrorClient(e);
        console.log('setting error: ', error.message);
      });
    }
  }, [loggedIn]);

  
  useEffect(() => {
    if (router.isReady) {
      setThisLink(router.query.id.replace("/explorer/slot/",""));
    }
  }, [router.isReady]);

  useEffect(() => {
    if (thisLink) {
      getSlot(thisLink)
        .then((slot) => {
          console.log("chosen slot", slot);
          setChosenSlot(slot);
        })
        .catch((e) => {
          const error = parseBasicErrorClient(e);
          console.log('setting error: ', error.message);
        });
    }
  }, [thisLink]);

  useEffect(() => {
    if (chosenSlot && loggedIn) {
      console.log("here");
      getActiveCollections(thisLink)
        .then((collections) => {
          setActiveCollections(collections);
        })
        .catch((e) => {
          const error = parseBasicErrorClient(e);
          console.log('setting error: ', error.message);
        });
    }
  }, [chosenSlot, loggedIn])

  useEffect(() => {
    if (activeCollections) {
      getCollections(activeCollections)
        .then((collections) => {
          setCollections(collections);
        })
        .catch((e) => {
          const error = parseBasicErrorClient(e);
          console.log('setting error: ', error.message);
        });
    }
  }, [activeCollections]);

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

  useEffect(() => {
    countNfts(activeCollections)
      .then((count) => {
        setTotalNfts(count);
      })
      .catch(e => { 
        const error = parseBasicErrorClient(e);
        console.log('setting error: ', error.message);
      });
  }, [activeCollections]);

  /*useEffect(() => {
    getNftCounts(collections)
      .then((counts) => {
        setCollectionCounts(counts)
      })
      .catch(e => { 
        const error = parseBasicErrorClient(e);
        console.log('setting error: ', error.message);
      });
  }, [collections]);*/

  if (!loggedIn) return <LoginButton />;
  if (!(app && chosenSlot && collections && collectionCounts)) return loading;

  const sharedSx = { font: 'nunito', lineHeight: '40px', fontSize: { xs: '12px', sm: '12px', md: '14px', lg: '16px', xl: '18px' }};
  const sharedSxBold = { fontWeight: 'bold', font: 'nunito', lineHeight: '40px', fontSize: { xs: '12px', sm: '12px', md: '14px', lg: '16px', xl: '18px' }};

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
        <Grid container spacing={2}>
          <Grid item>
            <Breadcrumbs aria-label="breadcrumb">
              <NextLink underline="hover" color="inherit" href="/inventory">
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
              Total NFTs Owned:&nbsp;
            </Typography>
            <Typography variant="p2" sx={sharedSx}>
              { totalNfts }
              <br></br>
            </Typography>
          </Grid>
          <Grid item xs={12} sx={{ backgroundColor: "none" }}>        
            <Box sx={{ left: 0, width: "100%" }}>
              <BasicSearchbar onChange={handleSearch} sx={{ left: 0, width: "80%", p: 1 }}/>
              <DropdownMenu sx={{ width: '20%', p: 1, right: 0 }} optionsArray={sortOptions} onChange={handleSelect} label='Sort' defaultValue={'maximum'} />
            </Box>        
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={1} sx={{ p: 1 }}>
              { collections.map((collection) => (
                <React.Fragment key={collection.collectionId}>
                  <CollectionCard search={search} collection={collection} slot={chosenSlot} collectionCount={activeCollections[collection.collectionId]}/>
                </React.Fragment>
              ))}
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

InventorySlotPage.getLayout = (page) => (
  <MainLayout>
    { page }
  </MainLayout>
);


export default InventorySlotPage;