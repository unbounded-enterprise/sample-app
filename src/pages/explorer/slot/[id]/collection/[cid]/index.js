import { useEffect, useState } from 'react';
import NextLink from 'next/link';
import {useRouter} from 'next/router';
import { Box, Button, Typography, Grid } from '@mui/material';
import { BasicSearchbar } from 'src/components/basic-searchbar';
import { NewLayout } from 'src/components/new-layout';
import { NftCard } from 'src/components/NftCard';
import axios from 'axios';
import React from 'react';

const ExploreCollectionPage = ()=>{
  const router = useRouter();
  const [app, setApp] = useState(null);
  const [sort, setSort] = useState("maximum");
  const [nfts, setNFTs] = useState(null);
  const [chosenCollection, setChosenCollection]  =  useState(null);
  const [chosenSlot, setChosenSlot] = useState(null);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(20);
  const [nftSearch, setNftSearch] = useState(null);

  const [slotId, setSlotId] = useState(null)
  const [collectionId, setCollectionId] = useState(null)

  const slotButtonStyle = { color: 'blue', border: '1px solid blue', fontSize: '1vw'};

  const handleNftSearch = e =>{
    
    if(e.key==="Enter"){
      setNftSearch(e.target.value);
    }
  }

  useEffect(()=>{
    if(router.isReady){
        setSlotId(router.asPath.split("/")[3]);
        setCollectionId(router.asPath.split("/")[5]);
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
    if(chosenCollection){
      getNFTs({collectionId:chosenCollection.collectionId, to:to, from:from}).then((nfts)=>{
        setNFTs(nfts)})
        .catch(e=>{console.log('setting error: ', e.message)});
      }
  }, [chosenCollection]);

  useEffect(()=>{
    getApp().then((app)=>{
        setApp(app)})
        .catch(e=>{console.log('setting error: ', e.message)});
  }, []);
    
  return (
    <> 
      {chosenCollection && chosenSlot && nfts ? <>
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
      <Grid item xs={12} sx={{backgroundColor: "none"}}>
        <NextLink href={`/explorer/slot/${slotId}`} passHref><Button sx={slotButtonStyle}>Back</Button></NextLink> </Grid>
        </Grid>
        
        <Grid item>
          <Typography variant="h3" sx={{font:'nunito', fontWeight:'bold', lineHeight:'40px'}}>
        {chosenCollection.collectionName}
      </Typography> 
      <Typography variant="p2" sx={{font:'nunito', fontWeight:'bold', lineHeight:'50px'}}>
       Creator: {chosenCollection.creator} &emsp; App: {app.appName} &emsp; Slot: {chosenSlot.slotName} &emsp; Max Supply: {chosenCollection.maximum} &emsp; Type: {chosenCollection.type}
      </Typography></Grid>
        
         
        
         

        
         <Grid item xs={12} sx={{backgroundColor: "none"}}><Box sx={{left:0, width:"100%"}}>
          <BasicSearchbar onKeyPress={handleNftSearch} sx={{ left:0, width:"80%", p: 1}}/>
          </Box></Grid>
        <Grid item>
        <Box sx={{}}><Typography variant="h3">
          Select NFT to View Details
        </Typography> </Box></Grid>
        <Grid item xs={12}>
          <Grid
        container
        spacing={1}
        sx={{ p: 1 }}
      >

        {nfts && nfts.map((nft) => (
          <React.Fragment key={nft.nftId}>
            <NftCard search={nftSearch} collection={chosenCollection} nft={nft} slot={chosenSlot} />
          </React.Fragment>
        ))}</Grid>
        <Grid item xs={12}>
        <Button sx={slotButtonStyle} onClick={()=>{
            if(from>0){
                setFrom(from-20);
                setTo(to-20);
            }
          }}>Previous 20</Button>
        <Button sx={slotButtonStyle} onClick={()=>{
            setFrom(from+20);
            setTo(to+20);
          }}>Next 20</Button>
         </Grid>
         
        </Grid>
        </Box>
  </Box> </>: <></>}
        </>
  )
}

ExploreCollectionPage.getLayout = (page) => (
    <NewLayout>
      {page}
    </NewLayout>
  );

export default ExploreCollectionPage;

const getApp = async()=>{
  const appObject = (await axios.post('/api/app/info', { }));
  return appObject.data.app;
}

const getSlot = async (slotId)=>{ 
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

const getNFTs = async({collectionId, serials, from, to})=>{
var nftsObject;  
if(collectionId){
      if(serials){
        nftsObject = (await axios.post('/api/collection/nfts', { collectionId: collectionId, idOnly: false, serials: serials}));
        } else{  
          nftsObject = (await axios.post('/api/collection/nfts', { collectionId: collectionId, idOnly: false, from:from, to:to}));
        }
      return nftsObject.data.collection.nfts;
  }
}