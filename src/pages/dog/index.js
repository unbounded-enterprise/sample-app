import dynamic from 'next/dynamic'
import { useEffect, useState, useRef } from 'react';
import { Button, Box, Stack, Typography } from '@mui/material';
import { MainLayout } from '../../components/main-layout';
import { Texture } from 'pixi.js';
import axios from 'axios';
import { getExpressionValue, playAnimation, setNewSlotImage } from '../../components/PixiNFT';

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
    const [spine, setSpine] = useState(null);
    const [hat, setHat] = useState(null);
    const [won, setWon] = useState(0);
    const [rewardArr, setRewardArr] = useState([]);
    
    async function fetchDogs() {
        const dogRes = await axios.post('/api/getDogs', { from: 0, to: 50 });
        // const dogRes = await axios.post('/api/collection/nfts', { from: 0, to: 50, collectionId, token, handle: 'durodogs' });
        setDogs(dogRes.data);
        fetchItems();
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

    useEffect(()=>{
        if (spine && hat) {
            const url = getExpressionValue(hat.expressionValues, 'Front View Dog Image', 'Image');
            Texture.fromURL(url).then((tex)=>{  
                console.log('url: ', url);
                setNewSlotImage(spine, 'hat', tex);
            });
        }
    }, [spine, hat])




    async function fetchItems() {
        const itemRes = await axios.post('/api/collection/nfts', { collectionId: '63586bd17f6f20e4a44e9ee8', idOnly: false,  from: 0, to: 20  });
        console.log('item response', itemRes.data);
        setHat(itemRes.data[0]);

    }

    async function onDigClicked() {
        if (spine) {
            const rdm = Math.random();
            const digAni = rdm < 0.9?'durodog_dig':'durodog_dig_2';
            playAnimation(digAni, spine, false);
            setTimeout(()=>{
                playAnimation(defaultAnimation, spine, true);
             }, 2000);
            if ( Math.random() < 0.1) {
                setTimeout(()=>{
                    setRewardArr(Array(won+1).fill().map((_, i) => i));
                    setWon(won+1);
                   
                }, 2000);
            }
        }
    }

    function onLoaded(spine) {
        console.log('loaded spine: ', spine);
        setSpine(spine);

    }


    return (
        <>  
            <Box sx={{backgroundColor: 'white', padding: 1, pt:15}}>
                <Typography sx={{color: 'black'}}>Current Serial: #{currentDog && currentDog.serial }</Typography>
                <Button variant='outlined' sx={buttonStyle} onClick={()=>{setCurrentDogIndex(currentDogIndex+1)}}>Increase Dog Number</Button>


                <Stack alignItems='center' sx={{backgroundImage: 'url(/static/images/moondig.png)', backgroundRepeat: 'no-repeat', backgroundSize: 'contain', backgroundPosition: 'center'}}>
                    <Box sx={{position: 'relative', height: '70vh', width: '90vw'}}>{currentDog && 
                    <PixiNFTWithNoSSR 
                        assetlayerNFT={currentDog} 
                        expression={expression} 
                        defaultAnimation={defaultAnimation} 
                        showAnimations={false}
                        animationAlign='right'
                        nftSizePercentage={55}
                        onLoaded={onLoaded}
                    /> }</Box>
                    {won && <>
                        { rewardArr.map((val) => <img style={{width: '10%', position: 'absolute', top: '10%', left: 10*val + '%'}} src='/static/images/gem.png' alt='' />)}
                    </>}
                </Stack>   
                <Stack alignItems='center'><Button onClick={onDigClicked} variant='contained' sx={{width: '40%', fontSize: '3rem', margin: '1rem', backgroundcolor: 'green', color: 'white'}}>DIG</Button></Stack>
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