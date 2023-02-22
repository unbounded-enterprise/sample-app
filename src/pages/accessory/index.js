import dynamic from 'next/dynamic'
import { useEffect, useState, useRef, useCallback } from 'react';
import NextLink from 'next/link';
import { Box, Button, Container, Stack, Typography, Grid, Card } from '@mui/material';
import { MainLayout } from '../../components/main-layout';
import axios from 'axios';
import React from 'react';

const DisplayNFTWithNoSSR = dynamic(
  () => import('../../components/DisplayNFT'),
  { ssr: false }
)

export function getSlotId(bodyPart) {
  switch (bodyPart) {
    case 'Hat':
      return '633b320009d1acdc4ec50e04';
    case 'Glasses':
      return '633b321809d1ac44c8c50e0c';
    case 'Collar':
      return '633b322e09d1acfdddc50e14';
    default:
      return '';
  }
}

const expressions = ['Menu View', 'Front View Dog Image', 'Three Quarter View Dog Image'];


const CollectionDisplay = ({ collection, setChosenCollection })=>{
  return (
    
          
            <Grid
                item
                lg={2}
                sm={4}
                xs={12}
                onClick={()=>{setChosenCollection(collection.collectionId)}}
            >
                <Card
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 1,
                    m: 1,
                  }}
                  variant="outlined"
                >
                    <Typography variant="h5" sx={{fontSize: collection.collectionName.length > 18?'10px':{ xs: '12px', sm: '12px', md: '10px', lg: '12px', xl: '14px'}}}>
                      {collection.collectionName}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="body2"
                    >
                      Minted: {collection.minted}
                    </Typography>
                    <img src={collection.collectionImage} alt='collectionimage' style={{width: '100%'}} />
                </Card>
            </Grid>
  )
}

const NftDisplay = ({ nft, setCurrentExpression, currentExpression }) => {
  return (
    <Grid
    item
    key={nft.nftId}
    xl={3}
    lg={4}
    sm={6}
    xs={12}
    onClick={()=>{
      if(currentExpression === 2) {
        setCurrentExpression(0);
      } else {
        setCurrentExpression(currentExpression+1);
      }
    }}
>
    <Card
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'column',
        p: 1,
        m: 1,
      }}
      variant="outlined"
    >
        <Typography variant="h5">
          {nft.serial}
        </Typography>
        <Typography
          color="textSecondary"
          variant="body2"
        >
          {nft.nftId}
        </Typography>
        <Typography
          color="textSecondary"
          variant="h6"
        >
          {expressions[currentExpression]}
        </Typography>
          <DisplayNFTWithNoSSR 
            assetlayerNFT={nft}
            expression={expressions[currentExpression]}
            defaultAnimation={'durodog_idle_1'}
            // defaultAnimation={defaultAnimation}
            showAnimations={false}
            // animationAlign={isMobileDevice?'top':'right'}
            nftSizePercentage={65}
            // onLoaded={onLoaded}
        />
    </Card>
</Grid>
  )
}

const AccessoryPage = ()=>{

  const [images, setImages] = useState(null);
  const [collections, setCollections] =  useState(null);
  const [chosenCollection, setChosenCollection]  =  useState(null);
  const [chosenSlot, setChosenSlot] = useState(null);
  const [currentExpression, setCurrentExpression] = useState(0);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(20);
  const [slotCollections, setSlotCollections] = useState({Hat: null, Glasses: null, Collar: null});

  const slotButtonStyle = { color: 'white', border: '1px solid white', fontSize: '4vw'};

  const fetchSlot = async (slotName) => {
    try {
      const collections = (await axios.post('/api/slot/collections', { slotId: getSlotId(slotName), idOnly: true, includeDeactivated: false })).data;
      const nftData = [];
      const collectionInfos = await axios.post('/api/collection/info',  { collectionIds: collections });
      const filteredCollections = collectionInfos.data.filter(col => !col?.collectionName?.includes('Test'))
      slotCollections[slotName] = filteredCollections;
      setSlotCollections({...slotCollections});
      return filteredCollections;

    } catch(e) {
        console.log(e.response?.data?.error || 'unknown error');
    }
  }

  useEffect(()=>{
    fetchSlot('Hat').then((hats)=>{
      fetchSlot('Glasses').then(()=>{
        fetchSlot('Collar')})})
        .catch(e=>{console.log('fetching error: ', e.message)});
  }, [])

  useEffect(()=>{
    if (chosenSlot) {
      setCollections(slotCollections[chosenSlot]);
    } else {
      setCollections(null);
      setChosenCollection(null);
    }
  }, [chosenSlot, slotCollections])


  async function fetchNfts(collectionId) {
    try {
      const nfts = (await axios.post('/api/collection/nfts', { collectionId, idOnly: false, includeDeactivated: false, from, to })).data;
      setImages(nfts);
    } catch(e) {
      console.log('nft fetching error: ', e.message);
    }
  }


  useEffect(()=>{
    if (chosenCollection) {
      fetchNfts(chosenCollection);
    } else {
      setImages(null);
    }
  }, [chosenCollection])
  
    
  return (
    <>  
      <Box
        sx={{
          backgroundColor: 'primary.main',
          py: 15
        }}
      >

      <Box
        sx={{
          py: 5,
        }}
      >
         {chosenSlot ? 
         <>
          <Button sx={slotButtonStyle} onClick={()=>{
            setChosenSlot(null);
          }}>Back</Button>
         </>
         :
        <>
          <Stack justifyContent='center' alignItems='center' sx={{ p: '1rem'}}>
            <Typography variant='h3'>Choose Slot</Typography>
            <Stack direction='row' gap={2} justifyContent='space-evenly' sx={{width: '100%', m: '1rem'}}>
              <Button sx={slotButtonStyle} onClick={()=>{setChosenSlot('Hat')}}>Hats</Button>
              <Button sx={slotButtonStyle} onClick={()=>{setChosenSlot('Glasses')}}>Glasses</Button>
              <Button sx={slotButtonStyle} onClick={()=>{setChosenSlot('Collar')}}>Collars</Button>
            </Stack>
          </Stack>
        </>}
        <Grid
        container
        spacing={3}
        sx={{ p: 3 }}
      >
       
         {!images && collections && collections.map((collection) => (
          <React.Fragment key={collection.collectionId}>
            <CollectionDisplay collection={collection} setChosenCollection={setChosenCollection} />
          </React.Fragment>
        ))}
        {images && images.map((nft) => (
          <React.Fragment key={nft.nftId}>
          
           <NftDisplay nft={nft} setCurrentExpression={setCurrentExpression} currentExpression={currentExpression} />

          </React.Fragment>
        ))}
        </Grid>
        </Box>
  </Box>
        </>
  )
}

AccessoryPage.getLayout = (page) => (
    <MainLayout>
      {page}
    </MainLayout>
  );

export default AccessoryPage;