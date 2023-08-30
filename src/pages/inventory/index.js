import { useEffect, useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { BasicSearchbar } from 'src/components/widgets/basic/basic-searchbar';
import { MainLayout } from '../../components/main-layout';
import axios from 'axios';
import React from 'react';
import { SlotCard } from 'src/components/inventory/SlotCard';
import LoginButton from 'src/components/home/login-button';
import { useAuth } from 'src/hooks/use-auth';
import { parseBasicErrorClient } from 'src/_api_/auth-api';
import { styled } from '@mui/system';
//import { AssetLayer } from '@assetlayer/sdk-client';
import { useAssetLayer } from 'src/contexts/assetlayer-context.js'; // Import the hook


//const assetlayerClient = new AssetLayer({baseUrl: "/api"})

const CenteredImage = styled('img')({display: 'block', marginLeft: 'auto', maxWidth: '200px', marginRight: 'auto', width: '50%'});

const loading = <> <CenteredImage src="/static/loader.gif" alt="placeholder" /> </>;

const InventoryPage = () => {
  const [app, setApp] = useState(null);
  const [slots, setSlots] = useState([]);
  const [totalCollections, setTotalCollections] = useState(0);
  const [slotCounts, setSlotCounts] = useState({});
  const [search, setSearch] = useState("");
  const { assetlayerClient, loggedIn, setLoggedIn } = useAssetLayer(); // Use the hook to get the client and loggedIn state
  const [user, setUser] = useState(null);

  const handleSearch = e =>{
    setSearch(e.target.value);
  }

  const getApp = async () => {
    const appObject = (await axios.post('/api/app/info', {}));
    return appObject.data.body.app;
  }
  
  const getSlots = async () => {
    const {result: slotsObject} = await assetlayerClient.apps.safe.getAppSlots();
  
    return slotsObject;
  }
  
  const countCollections = async (slotCounts) => {
    let collectionCount = 0;
    for (const key in slotCounts) {
      if (slotCounts.hasOwnProperty(key)) {
        collectionCount += slotCounts[key];
      }
    }
    return collectionCount;
  }
  
  const getSlotCounts = async (slots) => {
    let slotCounts = {};
    for (const element of slots) {
      const {result: slotCount} = await assetlayerClient.assets.safe.getUserSlotsAssets({slotIds: [element.slotId], countsOnly: true });
      //let slotCount = await axios.post('/api/nft/slots', { slotIds: [element.slotId], countsOnly: true });
      slotCounts[element.slotId] = Object.keys(slotCount).length;
    }
    return slotCounts;
  }
  
  const getUser = async () => {
    const {result: user} = await assetlayerClient.users.safe.getUser();
    return user;
  }
  
  const getIsLoggedIn = async () => {
    const loggedIn = await assetlayerClient.initialize();
    return loggedIn;
  
  }

  /*useEffect(() => {
    getIsLoggedIn()
      .then((isLoggedIn) => {
        setLoggedIn(isLoggedIn)
      })
      .catch(e => { 
        const error = parseBasicErrorClient(e);
        console.log('setting error: ', error.message);
      });
  }, []);*/

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
    if(loggedIn){
    getSlots()
      .then((slots) => {
        setSlots(slots);
      })
      .catch((e) => { 
        const error = parseBasicErrorClient(e);
        console.log('setting error: ', error.message);
      });}
  }, [loggedIn]);


  useEffect(() => {
    countCollections(slotCounts)
      .then((count) => {
        setTotalCollections(count);
      })
      .catch((e) => { 
        const error = parseBasicErrorClient(e);
        console.log('setting error: ', error.message);
      });
  }, [slotCounts]);

  useEffect(() => {
    getSlotCounts(slots)
      .then((counts) => {
        setSlotCounts(counts);
      })
      .catch((e) => { 
        const error = parseBasicErrorClient(e);
        console.log('setting error: ', error.message);
      });
  }, [slots]);


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

  if (!loggedIn) return <LoginButton />;
  if (!app) return loading;

  const fontSize = { xs: '12px', sm: '14px', md: '16px', lg: '16px', xl: '18px' };
  const sharedSx = { font: 'nunito', lineHeight: '40px', fontSize };
  const sharedSxBold = { fontWeight: 'bold', font: 'nunito', lineHeight: '40px', fontSize };

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
            { app && slots && slotCounts && <>
              <Typography variant="h2" sx={{ marginBottom: '5px' }}>
                My Assets
              </Typography>
              <Typography variant="p2" sx={{ fontWeight: 'bold', lineHeight: '40px', fontSize }}>
                App:&nbsp;
              </Typography>
              <Typography variant="p2" sx={sharedSx}>
                { app.appName }
                <br></br>
              </Typography>
              <Typography variant="p2" sx={sharedSxBold}>
                Total Slots:&nbsp;
              </Typography>
              <Typography variant="p2" sx={sharedSx}>
                {slots.length} &emsp;
              </Typography>
              <Typography variant="p2" sx={sharedSxBold}>
                Total Collections:&nbsp;
              </Typography>
              <Typography variant="p2" sx={sharedSx}>
                { totalCollections }
                <br></br>
              </Typography>
              <Typography variant="h4" sx={{ font: 'nunito', lineHeight: '50px' }}>
                Select Slot:
              </Typography>
            </> }
          </Grid>
          <Grid item xs={12} sx={{backgroundColor: "none"}}>
            <Box sx={{left:0, width:"100%"}}>
              <BasicSearchbar onChange={handleSearch} sx={{ left: 0, width: "90%", p: 1 }}/>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              { slots && slots.map((slot) => (
                <React.Fragment key={slot.slotId}>
                  <SlotCard search={search} slot={slot} numCollections={slotCounts[slot.slotId]} />
                </React.Fragment>
              )) }
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

InventoryPage.getLayout = (page) => (
  <MainLayout>
    { page }
  </MainLayout>
);

export default InventoryPage;