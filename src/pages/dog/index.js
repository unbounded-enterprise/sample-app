import dynamic from 'next/dynamic'
import { useEffect, useState, useRef } from 'react';
import { Button, Box, Stack, Typography, useMediaQuery, useTheme } from '@mui/material';
import { MainLayout } from '../../components/main-layout';
import axios from 'axios';

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

    const theme = useTheme();
    const isMobileDevice = useMediaQuery(theme.breakpoints.down('lg'));
    
    async function fetchDogs() {
        try {
            const dogRes = await axios.post('/api/getDogs', { from: 0, to: 50 });
            
            setDogs(dogRes.data);
        } catch(e) {
            console.log(e.response?.data?.error || 'unknown error');
        }
    }
    
    useEffect(()=>{
        fetchDogs();
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
                    <Box sx={{position: 'relative', height: isMobileDevice?'50vh':'60vh', width: '100vw'}}>{currentDog && 
                    <PixiNFTWithNoSSR 
                        assetlayerNFT={currentDog} 
                        expression={expression} 
                        defaultAnimation={defaultAnimation} 
                        showAnimations={true}
                        animationAlign={isMobileDevice?'top':'right'}
                        nftSizePercentage={65}
                        onLoaded={onLoaded}
                    /> }</Box>
                </Stack>


                <Stack sx={{}}>
                        <Button variant='outlined' sx={buttonStyle} onClick={()=>{setExpression('Front View'); setDefaultAnimation('durodog_idle_1')}}>Front View</Button>
                        <Button variant='outlined' sx={buttonStyle} onClick={()=>{setExpression('Three Quarter View'); setDefaultAnimation('run')}}>Three Quarter View</Button>
                        <Button variant='outlined' sx={buttonStyle} onClick={()=>{setExpression('Menu View'); setDefaultAnimation('run')}}>Menu View</Button>
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