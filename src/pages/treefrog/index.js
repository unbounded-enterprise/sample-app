import dynamic from 'next/dynamic'
import { useEffect, useState, useRef } from 'react';
import { Button, Box, Stack, Typography } from '@mui/material';
import { MainLayout } from '../../components/main-layout';
import axios from 'axios';
import { treefrogs } from '../../__mocks__/treefrogs';
// import { BlenderAnimation } from '../../components/blender';

const collectionId = process.env.COLLECTION_ID;  //collectionId for duro dogs
const token = process.env.TOKEN;

const BlenderAnimation = dynamic(
  () => import('../../components/blender'),
  { ssr: false }
)

// const animationFile = treefrogs

const BlenderPage = ()=>{

    // const [dogs, setDogs] = useState(null);
    // const [expression, setExpression] = useState('Front View')
    // const [defaultAnimation, setDefaultAnimation] = useState('durodog_idle_1');
    // const [currentDog, setCurrentDog] = useState(null);
    // const [currentDogIndex, setCurrentDogIndex] = useState(0);
    
    // async function fetchDogs() {
    //     const dogRes = await axios.post('/api/getDogs', { from: 0, to: 50 });
    //     setDogs(dogRes.data);
    // }
    
    // useEffect(()=>{
    //     try {
    //         fetchDogs();
    //     } catch(e) {
    //         console.log(e.message);
    //     }
    // }, [])

    // useEffect(()=>{
    //     if (dogs && dogs.length > 0) {
    //         setCurrentDog(dogs[currentDogIndex]);
    //     }
        
    // }, [dogs, currentDogIndex])

    // function onLoaded(spine) {
    //     console.log('loaded spine: ', spine);
    // }

    return (
        <>  
            <Box sx={{backgroundColor: 'white', padding: 1, pt:15}}>
                {/* <Typography sx={{color: 'black'}}> }</Typography> */}
                {/* <Button variant='outlined' sx={buttonStyle} onClick={()=>{setCurrentDogIndex(currentDogIndex+1)}}>Increase Dog Number</Button> */}


                <Stack sx={{}} alignItems='center'>
                    <Box sx={{position: 'relative', height: '70vh', width: 'calc(100vw - 400px)'}}>
                        <BlenderAnimation
                            animationFile='treefrog'
                        />
                    </Box>
                </Stack>   
            </Box> 
        </>
      )
}

BlenderPage.getLayout = (page) => (
    <MainLayout>
      {page}
    </MainLayout>
  );

export default BlenderPage;