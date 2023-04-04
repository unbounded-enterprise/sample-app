import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import {useRouter} from 'next/router';
import { Box, Breadcrumbs, Typography, Link, Grid } from '@mui/material';
import { NewLayout } from 'src/components/new-layout';
import axios from 'axios';
import React from 'react';
import { NftDetailDisplay, NftPropertyDisplay } from 'src/components/inventory/NftDetailDisplay';

const InventoryNftDetailPage = ()=>{
  const router = useRouter();
  const [app, setApp] = useState(null);
  const [sort, setSort] = useState("maximum");
  //const [nftSort, setNftSort] = useState("ascending");
  const [chosenCollection, setChosenCollection]  =  useState(null);
  const [chosenSlot, setChosenSlot] = useState(null);
  const [chosenNft, setChosenNft] = useState(null);
 const [properties, setProperties] = useState(null);
  const [currentExpression, setCurrentExpression] = useState("Menu View");


  const [slotId, setSlotId] = useState(null);
  const [collectionId, setCollectionId] = useState(null);
  const [nftId, setNftId] = useState(null);

  const slotButtonStyle = { color: 'blue', border: '1px solid blue', fontSize: '1vw'};
  
  useEffect(()=>{
    if(router.isReady){
        setSlotId(router.asPath.split("/")[3]);
        setCollectionId(router.asPath.split("/")[5]);
        setNftId(router.asPath.split("/")[7]);
    }
  }, [router.isReady]);

  useEffect(()=>{
    if(slotId){
    getSlot(slotId).then((slot)=>{
        setChosenSlot(slot)})
        .catch(e=>{console.log('setting error: ', e.message)});}
  }, [slotId]);

  useEffect(()=>{
    if(collectionId){
        getCollection(collectionId, sort).then((collection)=>{
        setChosenCollection(collection)})
        .catch(e=>{console.log('setting error: ', e.message)});}
  }, [collectionId]);

  useEffect(()=>{
    if(nftId){
        getNft(nftId).then((nft)=>{
        setChosenNft(nft)})
        .catch(e=>{console.log('setting error: ', e.message)});}
  }, [nftId]);

  useEffect(()=>{
    getApp().then((app)=>{
        setApp(app)})
        .catch(e=>{console.log('setting error: ', e.message)});
  }, []);
  
    
  return (
    <> 
      {chosenCollection && chosenSlot && chosenNft ? <>
      <Box
        sx={{
          backgroundColor: 'none',
          py: 5
        }}
      >
      
      <Box
        sx={{
          width: '85%',
          alignSelf: 'stretch',
          marginLeft: "auto",
          marginRight: "auto",
          py: 1,
          px: 5,
          backgroundColor: 'none'
        }}
      >
      <Grid container spacing={2}>
      <Grid item xs={12}>
              <Breadcrumbs aria-label="breadcrumb">
                <NextLink underline="hover" color="inherit" href="/inventory">
                  App
                </NextLink>
                <NextLink underline="hover" color="inherit" href={`/inventory/slot/${slotId}`}>
                  Slot
                </NextLink>
                <NextLink underline="hover" color="inherit" href={`/inventory/slot/${slotId}/collection/${collectionId}`}>
                  Collection
                </NextLink>
                <Typography color="text.primary">NFT</Typography>
              </Breadcrumbs></Grid>
        
      <Grid item xs={12} sx={{backgroundColor: "none"}}>
            <Typography variant="h3" sx={{ lineHeight:'40px'}}>
            {chosenCollection.collectionName} #{chosenNft.serial}
      </Typography>
      <Typography variant="h5" sx={{lineHeight:'80px'}}>
       Creator: {chosenCollection.handle} &emsp; App: {app.appName} &emsp; Slot: {chosenSlot.slotName} &emsp;
      </Typography>
      <Typography variant="p2" sx={{lineHeight:'30px', marginBottom:"40px"}}>
       Total Supply: {chosenCollection.maximum} &emsp; Collection: {chosenCollection.collectionName} &emsp; Type: {chosenCollection.type} &emsp;
      </Typography>
      <Link href={"https://whatsonchain.com/tx/" + chosenNft.location.slice(0,-3)} variant="p2">
  Location
</Link>
            <NftDetailDisplay nft={chosenNft} setCurrentExpression={setCurrentExpression} currentExpression={currentExpression} />
        </Grid>
       <Grid item xs={12} sx={{backgroundColor: "none"}}>
          <NftPropertyDisplay nft={chosenNft} properties={properties} setProperties={setProperties} />
        </Grid></Grid>

        </Box>
  </Box> </>: <></>}
        </>
  )
}

InventoryNftDetailPage.getLayout = (page) => (
    <NewLayout>
      {page}
    </NewLayout>
  );

export default InventoryNftDetailPage;

const getApp = async()=>{
  const appObject = (await axios.post('/api/app/info', { }));
  return appObject.data.app;
}

const getSlot = async (slotId)=>{ // just used for testing
  if(slotId.length>10){
    const slotsObject = (await axios.post('/api/slot/info', { slotId: slotId}));
    return slotsObject.data.slot;
  }
}


const getCollection = async(collection, sortFunction)=>{
  if(collection.length>10){
      const collectionsObject = (await axios.post('/api/collection/info', { collectionId: collection, idOnly: false, includeDeactivated: false }));
      return collectionsObject.data.collections[0];
  }
}

const getNft = async(nftId)=>{
var nftObject;  
if(nftId){
      nftObject = (await axios.post('/api/nft/info', {nftId:nftId}));
        } 
      return nftObject.data.nfts[0];
}