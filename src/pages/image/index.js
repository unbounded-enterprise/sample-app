import dynamic from 'next/dynamic'
import { useEffect, useState, useRef, useCallback } from 'react';
import NextLink from 'next/link';
import { Box, Container, Typography, Grid, Card } from '@mui/material';
import { MainLayout } from '../../components/main-layout';
import axios from 'axios';
import React from 'react';

const DisplayNFTWithNoSSR = dynamic(
  () => import('../../components/DisplayNFT'),
  { ssr: false }
)

const ImagePage = ()=>{

  const [images, setImages] = useState(null);

  const fetchImages = async () => {
    try {
        const imagesRes = await axios.post('/api/getImages', { from: 0, to: 10 });
        setImages(imagesRes.data);
        console.log(imagesRes.data);
    } catch(e) {
        console.log(e.response?.data?.error || 'unknown error');
    }
  }

  useEffect(()=>{
    fetchImages();
  }, [])
  
    
  return (
    <>  
      <Box
        sx={{
          backgroundColor: 'primary.main',
          py: 15
        }}
      >

      <Typography
        align="center"
        color="primary.contrastText"
        variant="h2"
      >
        A collection of images
      </Typography>

      <Box
        sx={{
          py: 5,
          alignItems: 'center'
        }}
      >
        <Grid
        container
        spacing={3}
        sx={{ p: 3 }}
      >
        {images && images.map((image) => (
          <NextLink key={image.nftId} href={`/image/${image.nftId}`}>
            <Grid
                item
                key={image.nftId}
                md={4}
                xs={12}
            >
                <Card
                  sx={{
                    alignItems: 'center',
                    display: 'flex',
                    flexDirection: 'column',
                    p: 14,
                    m: 4,
                  }}
                  variant="outlined"
                >
                    <Typography variant="h5">
                      {image.serial}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="h6"
                    >
                      {image.nftId}
                    </Typography>
                    <Typography
                      color="textSecondary"
                      variant="h6"
                    >
                      <DisplayNFTWithNoSSR 
                        assetlayerNFT={image}
                        expression='Menu View'
                        // defaultAnimation={defaultAnimation}
                        showAnimations={false}
                        // animationAlign={isMobileDevice?'top':'right'}
                        nftSizePercentage={65}
                        // onLoaded={onLoaded}
                    />
                    </Typography>
                </Card>
            </Grid>
          </NextLink>
        ))}
        </Grid>
        </Box>
  </Box>
        </>
  )
}

ImagePage.getLayout = (page) => (
    <MainLayout>
      {page}
    </MainLayout>
  );

export default ImagePage;