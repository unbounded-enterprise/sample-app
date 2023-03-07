import dynamic from 'next/dynamic'
import { useEffect, useState, useRef, useCallback } from 'react';
import NextLink from 'next/link';
import { Box, Button, Container, Stack, Typography, Grid, Card } from '@mui/material';
import { MainLayout } from '../../components/main-layout';
import axios from 'axios';
import React from 'react';
import { set } from 'nprogress';

const DisplayNFTWithNoSSR = dynamic(
  () => import('../../components/DisplayNFT'),
  { ssr: false }
)

const getApp = async()=>{
    const appObject = (await axios.post('/api/app/info', { }));
    return appObject.data.app;
}

const getSlots = async ()=>{
    const slotsObject = (await axios.post('/api/app/slots', { idOnly: false }));
    
    return slotsObject.data.app.slots;
}

const getSlot = async (slotId)=>{ // just used for testing
  const slotsObject = (await axios.post('/api/slot/info', { slotId: slotId}));
  const collectionsObject = (await axios.post('/api/collection/info', { collectionIds: slotsObject.data.slot.collections}));
}

const getCollections = async(slotId)=>{
    if(slotId){
        const collectionsObject = (await axios.post('/api/slot/collections', { slotId: slotId, idOnly: false, includeDeactivated: false }));
        return collectionsObject.data.slot.collections;
    }
}

const getExpressions = async(slotId)=>{
    if(slotId){
        const expressionsObject = (await axios.post('/api/expression/slot', { slotId: slotId}));
        const expressionsReturn = [];
        expressionsObject.data.expressions.forEach(element => {
            expressionsReturn.push(element.expressionName);
        });
        return expressionsReturn;
    }
}

const getNFTs = async(collectionId, from, to)=>{
    if(collectionId){
        const nftsObject = (await axios.post('/api/collection/nfts', { collectionId: collectionId, idOnly: false, from:from, to:to}));
        return nftsObject.data.collection.nfts;
    }
}

const SlotDisplay = ({ slot, setChosenSlot })=>{
    return (
        <Grid
            item
            lg={2}
            sm={4}
            xs={12}
            onClick={()=>{setChosenSlot(slot.slotId)}}
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
                <Typography variant="h5" sx={{fontSize: slot.slotName.length > 18?'10px':{ xs: '12px', sm: '12px', md: '10px', lg: '12px', xl: '14px'}}}>
                  {slot.slotName}
                </Typography>
            </Card>
        </Grid>
)
}

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

const NftDisplay = ({ nft, setChosenNFT, currentExpression }) => {
  return (
    <Grid
    item
    key={nft.nftId}
    xl={3}
    lg={4}
    sm={6}
    xs={12}
    onClick={()=>{
      setChosenNFT(nft);
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
        </Typography>
          <DisplayNFTWithNoSSR 
            assetlayerNFT={nft}
            expression={currentExpression}
            //defaultAnimation={'durodog_idle_1'} // this would need to be abstracted. maybe look for idle or just go alphabetical?
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

const NftDetailDisplay = ({nft, setCurrentExpression, currentExpression}) => {
    var slotButtonStyle = { color: 'white', border: '1px solid white', fontSize: '4vw'};
    var propertyString = "No Properties Set";
    if(nft.properties){
        propertyString = JSON.stringify(nft.properties);
    }
    var expressionNames = [];
    if(nft.expressionValues){
        nft.expressionValues.forEach(element => {
            expressionNames.push(element.expression.expressionName);
        });
    }
    return (
        <Grid
        item
        key={nft.nftId}
        xs={12}
        onClick={()=>{
          //setChosenNFT(nft);
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
            Serial Number = {nft.serial}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            NFT ID = {nft.nftId}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            Location = {nft.location}
          </Typography>
          <Typography
            color="textSecondary"
            variant="body2"
          >
            NFT Properties = {propertyString}
          </Typography>
              <DisplayNFTWithNoSSR 
                assetlayerNFT={nft}
                expression={currentExpression}
                //defaultAnimation={'durodog_idle_1'} // this would need to be abstracted. maybe look for idle or just go alphabetical?
                // defaultAnimation={defaultAnimation}
                showAnimations={false}
                // animationAlign={isMobileDevice?'top':'right'}
                nftSizePercentage={65}
                // onLoaded={onLoaded}
            />
        </Card>
        {expressionNames.map((name) => (
          <React.Fragment key={name}>
            <Button sx={slotButtonStyle} onClick={()=>{
                setCurrentExpression(name);
            }
            }>{name}</Button>          
          </React.Fragment>
             ))}
    </Grid>
      )
  }

const ExplorerPage = ()=>{
  const [app, setApp] = useState(null);
  const [slots, setSlots] = useState([]);
  const [collections, setCollections] =  useState(null);
  const [expressions, setExpressions] = useState(null);
  const [nfts, setNFTs] = useState(null);
  const [chosenCollection, setChosenCollection]  =  useState(null);
  const [chosenSlot, setChosenSlot] = useState(null);
  const [currentExpression, setCurrentExpression] = useState("Menu View");
  const [chosenNFT, setChosenNFT] = useState(null);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(20);

  const slotButtonStyle = { color: 'white', border: '1px solid white', fontSize: '4vw'};

  useEffect(()=>{
    getSlots().then((slots)=>{
        setSlots(slots)})
        .catch(e=>{console.log('setting error: ', e.message)});
  }, []);

  useEffect(()=>{
    getApp().then((app)=>{
        setApp(app)})
        .catch(e=>{console.log('setting error: ', e.message)});
  }, []);

  useEffect(()=>{
    if(chosenSlot){
        getCollections(chosenSlot).then((collections)=>{
            setCollections(collections)})
            .catch(e=>{console.log('setting error: ', e.message)});
        getExpressions(chosenSlot).then((expressions)=>{
            setExpressions(expressions)})
            .catch(e=>{console.log('setting error: ', e.message)});
      }
    else{
        //setCollections(null);
        //setNFTs(null);
    }
    }, [chosenSlot]);

  useEffect(()=>{
    if(chosenCollection){
        getNFTs(chosenCollection, from, to).then((nfts)=>{
            setNFTs(nfts)})
            .catch(e=>{console.log('setting error: ', e.message)});
        }
    else{
        //setCollections(null);
    }
  }, [chosenCollection, to]);

  useEffect(()=>{
    if(chosenNFT){
        console.log(chosenNFT);
    }
    else{
    }
  }, [chosenNFT]);
  
    
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
        {app ? <>
        <Typography variant="h2">
          {app.appName}
        </Typography></>
        : <></>
        }  
         {chosenSlot ? 
         <>
          <Button sx={slotButtonStyle} onClick={()=>{
            if(chosenNFT){
                setChosenNFT(null);
            } else if(nfts){
                setNFTs(null);
                setChosenCollection(null);
            } else if(collections){
                setCollections(null);
                setChosenSlot(null);
            }}}>Back</Button>
         </>
         :
        <>
            {slots.length >0 && slots.map((slot) => (
          <React.Fragment key={slot.slotId}>
            <SlotDisplay slot={slot} setChosenSlot={setChosenSlot} />
          </React.Fragment>
             ))}
        </>}
        <Grid
        container
        spacing={3}
        sx={{ p: 3 }}
      >
       
        {collections && !chosenCollection && collections.map((collection) => (
          <React.Fragment key={collection.collectionId}>
            <CollectionDisplay collection={collection} setChosenCollection={setChosenCollection} />
          </React.Fragment>
        ))}

        {nfts && !chosenNFT && nfts.map((nft) => (
          <React.Fragment key={nft.nftId}>
            <NftDisplay nft={nft} setChosenNFT={setChosenNFT} currentExpression={"Menu View"} />
          </React.Fragment>
        ))}

        {nfts && !chosenNFT ?
        <>
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
          </>
          : <></>}
         
        {chosenNFT ?
        <>
            <NftDetailDisplay nft={chosenNFT} setCurrentExpression={setCurrentExpression} currentExpression={currentExpression} />
        </>
        :
        <></>
        }
        </Grid>
        </Box>
  </Box>
        </>
  )
}

ExplorerPage.getLayout = (page) => (
    <MainLayout>
      {page}
    </MainLayout>
  );

export default ExplorerPage;