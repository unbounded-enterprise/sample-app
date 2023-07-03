import React, { useEffect, useState } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { BasicSearchbar } from 'src/components/widgets/basic/basic-searchbar';
import { MainLayout } from '../../components/main-layout';
import axios from 'axios';
import { SlotCard } from 'src/components/explorer/SlotCard';
import { HomeHandcash } from 'src/components/home/home-handcash';
import { useAuth } from 'src/hooks/use-auth';
import { parseBasicErrorClient } from 'src/_api_/auth-api';
import { styled } from '@mui/system';

const CenteredImage = styled('img')({display: 'block', marginLeft: 'auto', maxWidth: '200px', marginRight: 'auto', width: '50%'});
const loading = <> <CenteredImage src="/static/loader.gif" alt="placeholder" /> </>;

const ExplorerPage = () => {
  const [app, setApp] = useState(null);
  const [slots, setSlots] = useState([]);
  const [totalCollections, setTotalCollections] = useState(0);
  const [search, setSearch] = useState("");
  const [chosenSlot, setChosenSlot] = useState(null);

  const { user } = useAuth();

  const handleSearch = e =>{
    setSearch(e.target.value);
  }

  useEffect(() => {
    getSlots()
      .then((slots) => { 
        setSlots(slots);
      })
      .catch(e => { 
        const error = parseBasicErrorClient(e);
        console.log('setting error: ', error.message);
      });
  }, []);


  useEffect(() => {
    sumCollections(slots)
      .then((count) => {
        setTotalCollections(count);
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

  //if (!user) return <HomeHandcash/>;
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
            { app && <>
              <Typography variant="h2" sx={{ marginBottom: '5px' }}>
                NFT Explorer
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
                  <SlotCard search={search} slot={slot} setChosenSlot={setChosenSlot} />
                </React.Fragment>
              )) }
            </Grid>
          </Grid>
        </Grid>
      </Box>
    </Box>
  )
}

ExplorerPage.getLayout = (page) => (
  <MainLayout>
    { page }
  </MainLayout>
);

export default ExplorerPage;

const getApp = async () => {
  const appObject = (await axios.post('/api/app/info', {}));
  return appObject.data.app;
}

const getSlots = async () => {
  const slotsObject = (await axios.post('/api/app/slots', { idOnly: false }));

  return slotsObject.data.app.slots;
}

const sumCollections = async (slots) => {
  let collections = 0;
  slots.forEach((element) => {
    collections = collections + element.collections.length
  });
  return collections;
}