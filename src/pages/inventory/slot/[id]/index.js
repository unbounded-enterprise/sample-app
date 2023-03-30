import { useEffect, useState} from 'react';
import NextLink from 'next/link';
import {useRouter} from 'next/router';
import { Box, Button, Typography, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { BasicSearchbar } from 'src/components/basic-searchbar';
import { NewLayout } from 'src/components/new-layout';
import { CollectionCard } from 'src/components/inventory/CollectionCard';
import axios from 'axios';
import React from 'react';

const InventorySlotPage = ()=>{
  const router = useRouter();
  const [thisLink, setThisLink] = useState("");
  const [app, setApp] = useState(null);
  const [collections, setCollections] =  useState(null);
  const [chosenSlot, setChosenSlot] = useState(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("maximum");
  const [totalNfts, setTotalNfts] = useState(0);
  const [collectionCounts, setCollectionCounts] = useState({});
  const [activeCollections, setActiveCollections] = useState(null);
  

  const slotButtonStyle = { color: 'blue', border: '1px solid blue', fontSize: '1vw'};

  const handleSearch = e =>{
    setSearch(e.target.value);
  }

  const handleSelect = e =>{
    setSort(e.target.value);
  }

  useEffect(()=>{
    if(router.isReady){
        setThisLink(router.query.id.replace("/explorer/slot/",""))
    }
  }, [router.isReady]);

  useEffect(()=>{
    if(thisLink){
    getSlot(thisLink).then((slot)=>{
        setChosenSlot(slot)})
        .catch(e=>{console.log('setting error: ', e.message)});}
  }, [thisLink]);

  useEffect(()=>{
    if(chosenSlot){
      getActiveCollections(thisLink).then((collections)=>{
          setActiveCollections(collections)})
          .catch(e=>{console.log('setting error: ', e.message)});}
  }, [chosenSlot])

  useEffect(()=>{
    if(activeCollections){
    getCollections(activeCollections).then((collections)=>{
        setCollections(collections)})
        .catch(e=>{console.log('setting error: ', e.message)});}
  }, [activeCollections]);

  useEffect(()=>{
    if(collections){
      sortCollections(collections, sort).then((newCollections)=>{
        setCollections(newCollections)})
        .catch(e=>{console.log('setting error: ', e.message)});
    }
  }, [sort]);

  useEffect(()=>{
    getApp().then((app)=>{
        setApp(app)})
        .catch(e=>{console.log('setting error: ', e.message)});
  }, []);

  useEffect(() => {
    countNfts(activeCollections).then((count) => {
      setTotalNfts(count)
    })
      .catch(e => { console.log('setting error: ', e.message) });
  }, [activeCollections]);

  /*useEffect(() => {
    getNftCounts(collections).then((counts) => {
      setCollectionCounts(counts)
    })
      .catch(e => { console.log('setting error: ', e.message) });
  }, [collections]);*/

  return (
    <> {app && chosenSlot && collections && collectionCounts ? <>
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
        <NextLink href="/inventory" passHref><Button sx={slotButtonStyle}>Back</Button></NextLink> </Grid>
        </Grid>
        <Grid item xs={12} sx={{backgroundColor: "none"}}>
    <Typography variant="p2" sx={{font:'nunito', fontWeight:'bold', lineHeight:'40px', fontSize:{ xs: '12px', sm: '12px', md: '14px', lg: '16px', xl: '18px'}}}>
        App:&nbsp;
      </Typography>
      
      <Typography variant="p2" sx={{font:'nunito', lineHeight:'40px', fontSize:{ xs: '12px', sm: '12px', md: '14px', lg: '16px', xl: '18px'}}}>
       {app.appName} &emsp;
      </Typography>
      <Typography variant="p2" sx={{font:'nunito', fontWeight:'bold', lineHeight:'40px', fontSize:{ xs: '12px', sm: '12px', md: '14px', lg: '16px', xl: '18px'}}}>
        Slot:&nbsp;
      </Typography>
      <Typography variant="p2" sx={{font:'nunito', lineHeight:'40px', fontSize:{ xs: '12px', sm: '12px', md: '14px', lg: '16px', xl: '18px'}}}>
       {chosenSlot.slotName}
      </Typography> </Grid>
      <Grid item xs={12} sx={{backgroundColor: "none"}}>
      <Typography variant="p2" sx={{font:'nunito', fontWeight:'bold', lineHeight:'40px', fontSize:{ xs: '12px', sm: '12px', md: '14px', lg: '16px', xl: '18px'}}}>
        Total Collections:&nbsp;
      </Typography>
      <Typography variant="p2" sx={{font:'nunito', lineHeight:'40px', fontSize:{ xs: '12px', sm: '12px', md: '14px', lg: '16px', xl: '18px'}}}>
       {chosenSlot.collections.length} &emsp;
      </Typography>
      <Typography variant="p2" sx={{font:'nunito', fontWeight:'bold', lineHeight:'40px', fontSize:{ xs: '12px', sm: '12px', md: '14px', lg: '16px', xl: '18px'}}}>
        Total NFTs Owned:&nbsp;
      </Typography>
      <Typography variant="p2" sx={{font:'nunito', lineHeight:'40px', fontSize:{ xs: '12px', sm: '12px', md: '14px', lg: '16px', xl: '18px'}}}>
       {totalNfts} <br></br>
      </Typography></Grid>
         <Grid item xs={12} sx={{backgroundColor: "none"}}><Box sx={{left:0, width:"100%"}}>
          <BasicSearchbar onChange={handleSearch} sx={{ left:0, width:"80%", p: 1}}/>
          <FormControl sx={{width:"20%", right:0, p:1}}>
            <InputLabel id="demo-simple-select-label">Sort</InputLabel>
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
        </FormControl></Box></Grid>
        <Grid item>
            <Grid container>
        {collections.map((collection) => (
          <React.Fragment key={collection.collectionId}>
            <CollectionCard search={search} collection={collection} slot={chosenSlot} collectionCount={activeCollections[collection.collectionId]}/>
          </React.Fragment>
        ))}</Grid>
        </Grid>
                </Box>
  </Box> </>: <></>} 
        </>
  )
}

InventorySlotPage.getLayout = (page) => (
    <NewLayout>
      {page}
    </NewLayout>
  );

  const countNfts = async (collectionCounts) => {
    var nftCount = 0;
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

  const maximumSort = (a,b)=>{
    if(a && b){
      return b.maximum - a.maximum;
    }
    return 0;
  }
  
  const maximumSortReverse = (a,b)=>{
    if(a && b){
      return a.maximum - b.maximum;
    }
    return 0;
  }
  
  const  mintedSort = (a,b)=>{
    if(a && b){
      return b.mintedAmt - a.mintedAmt;
    }
    return 0;
  }
  
  const  mintedSortReverse = (a,b)=>{
    if(a && b){
      return a.mintedAmt - b.mintedAmt;
    }
    return 0;
  }
  
  const newestSort = (a,b)=>{
    if(a && b){
    return a.createdAt - b.createdAt;
    } 
    return 0;
  }
  
  const oldestSort = (a,b)=>{
    if(a && b){
    return b.createdAt - a.createdAt;
    } 
    return 0;
  }
  
  const aToZ = (a,b)=>{
    if(a && b){
      if(a.collectionName > b.collectionName){
        return 1;
      } else if(b.collectionName > a.collectionName){
        return -1;
      }
    } 
    return 0;
  }
  
  const zToA = (a,b)=>{
    if(a && b){
      if(a.collectionName > b.collectionName){
        return -1;
      } else if(b.collectionName > a.collectionName){
        return 1;
      }
    } 
    return 0;
  }
  
  const getApp = async()=>{
      const appObject = (await axios.post('/api/app/info', { }));
      return appObject.data.app;
  }

const getSlot = async (slotId)=>{ // just used for testing
    const slotsObject = (await axios.post('/api/slot/info', { slotId: slotId}));
    return slotsObject.data.slot;
}
  
  const getCollections = async(activeCollections)=>{
      if(activeCollections){
        const collections = Object.keys(activeCollections);
          const collectionsObject = (await axios.post('/api/collection/info', { collectionIds:collections, idOnly: false, includeDeactivated: false }));
          return collectionsObject.data.collections.sort(maximumSort);
      }
  }

  const getActiveCollections = async(slot)=>{
    if(slot){
      const activeCollectionsObject = await axios.post('/api/nft/slots', { slotIds:[slot], countsOnly: true });
      //console.log(Object.keys(activeCollectionsObject.data.nfts));
      return activeCollectionsObject.data.nfts;
  }
  }
  
  const sortCollections = async(collections, sortFunction)=>{
    var newCollections = [];
    if(sortFunction==="maximum"){
      newCollections = [...collections.sort(maximumSort)];
    }
    if(sortFunction==="maximumReverse"){
      newCollections = [...collections.sort(maximumSortReverse)];
    }
    if(sortFunction==="minted"){
      newCollections = [...collections.sort(mintedSort)];
    }
    if(sortFunction==="mintedReverse"){
      newCollections = [...collections.sort(mintedSortReverse)];
    }
    if(sortFunction==="newest"){
      newCollections = [...collections.sort(newestSort)];
    }
    if(sortFunction==="oldest"){
      newCollections = [...collections.sort(oldestSort)];
    }
    if(sortFunction==="aToZ"){
      newCollections = [...collections.sort(aToZ)];
    }
    if(sortFunction==="zToA"){
      newCollections = [...collections.sort(zToA)];
    }
    return newCollections;
  }

export default InventorySlotPage;