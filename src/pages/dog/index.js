import dynamic from 'next/dynamic'
import { useEffect, useState, useRef } from 'react';
import { Button, Box, Stack, Typography } from '@mui/material';
import { MainLayout } from '../../components/main-layout';
import axios from 'axios';

const collectionId = process.env.COLLECTION_ID;  //collectionId for duro dogs
const token = process.env.TOKEN;

const PixiNFTWithNoSSR = dynamic(
  () => import('../../components/PixiNFT'),
  { ssr: false }
)


const buttonStyle = {border: '1px solid black', color: 'black'};

const PixiPage = ()=>{

    const [dogs, setDogs] = useState(null);
    const [expression, setExpression] = useState('Front View')
    const [defaultAnimation, setDefaultAnimation] = useState('durodog_idle_1');
    const [currentDog, setCurrentDog] = useState(null);
    const [currentDogIndex, setCurrentDogIndex] = useState(0);
    
    async function fetchDogs() {
        const dogRes = await axios.post('/api/getDogs', { from: 0, to: 50 });
        // const dogRes = await axios.post('/api/collection/nfts', { from: 0, to: 50, collectionId, token, handle: 'durodogs' });
        setDogs(dogRes.data);
    }
    
    useEffect(()=>{
        try {
            fetchDogs();
        } catch(e) {
            console.log(e.message);
        }
    }, [])

    useEffect(()=>{
        if (dogs && dogs.length > 0) {
            setCurrentDog(dogs[currentDogIndex]);
        }
        
    }, [dogs, currentDogIndex])

    function onLoaded(spine) {
        console.log('loaded spine: ', spine);
    }
    return (
        <>  
            <Box sx={{backgroundColor: 'white', padding: 1, pt:15}}>
                <Typography sx={{color: 'black'}}>Current Serial: #{currentDog && currentDog.serial }</Typography>
                <Button variant='outlined' sx={buttonStyle} onClick={()=>{setCurrentDogIndex(currentDogIndex+1)}}>Increase Dog Number</Button>


                <Stack sx={{}} alignItems='center'>
                    <Box sx={{position: 'relative', height: '70vh', width: 'calc(100vw - 400px)'}}>{currentDog && 
                    <PixiNFTWithNoSSR 
                        assetlayerNFT={currentDog} 
                        expression={expression} 
                        defaultAnimation={defaultAnimation} 
                        showAnimations={true}
                        animationAlign='right'
                        nftSizePercentage={65}
                        onLoaded={onLoaded}
                    /> }</Box>
                </Stack>


                <Stack sx={{}}>
                        <Button variant='outlined' sx={buttonStyle} onClick={()=>{setExpression('Front View'); setDefaultAnimation('durodog_idle_1')}}>Front View</Button>
                        <Button variant='outlined' sx={buttonStyle} onClick={()=>{setExpression('Three Quarter View'); setDefaultAnimation('run')}}>Three Quarter View</Button>
                </Stack>       
            </Box> 
        </>
      )
}

PixiPage.getLayout = (page) => (
    <MainLayout>
      {page}
    </MainLayout>
  );

export default PixiPage;