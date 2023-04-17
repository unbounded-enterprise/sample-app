import { useEffect, useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { MainLayout } from '../../components/main-layout';
import axios from 'axios';
import React from 'react';
import { SlotCard } from 'src/components/inventory/SlotCard';
import { HomeHandcash } from 'src/components/home/home-handcash';
import { useAuth } from 'src/hooks/use-auth';
import { parseBasicErrorClient } from 'src/_api_/auth-api';
import { styled } from '@mui/system';


const CenteredImage = styled('img')({display: 'block', marginLeft: 'auto',marginRight: 'auto', width: '50%'});

const loading = <> <CenteredImage src="/static/loader.gif" alt="placeholder" /> </>;

const InventoryPage = () => {
  const [app, setApp] = useState(null);
  const [slots, setSlots] = useState([]);
  const [totalCollections, setTotalCollections] = useState(0);
  const [slotCounts, setSlotCounts] = useState({});
  const { user } = useAuth();

  useEffect(() => {
    getSlots()
      .then((slots) => {
        setSlots(slots);
      })
      .catch((e) => { 
        const error = parseBasicErrorClient(e);
        console.log('setting error: ', error.message);
      });
  }, []);


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

  if (!user) return <HomeHandcash />;
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
        px: 5,
        backgroundColor: 'none'
      }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            { app && slots && slotCounts && <>
              <Typography variant="h2" sx={{ marginBottom: '5px' }}>
                My NFTs
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
          <Grid item xs={12}>
            <Grid container spacing={2}>
              { slots && slots.map((slot) => (
                <React.Fragment key={slot.slotId}>
                  <SlotCard slot={slot} numCollections={slotCounts[slot.slotId]} />
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

const getApp = async () => {
  const appObject = (await axios.post('/api/app/info', {}));
  return appObject.data.app;
}

const getSlots = async () => {
  const slotsObject = (await axios.post('/api/app/slots', { idOnly: false }));

  return slotsObject.data.app.slots;
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
    let slotCount = await axios.post('/api/nft/slots', { slotIds: [element.slotId], countsOnly: true });
    slotCounts[element.slotId] = Object.keys(slotCount.data.nfts).length;
  }
  return slotCounts;
}

