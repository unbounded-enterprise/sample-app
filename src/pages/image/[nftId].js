import { useCallback, useEffect, useState } from 'react';
import NextLink from 'next/link';
import Head from 'next/head';
import { Box, Button, Container, Grid, Link, Typography } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { MainLayout } from '../../components/main-layout';
import { useRouter } from 'next/router'

const ImageDetails = () => {

  const router = useRouter()
  const { nftId } = router.query

  return (
    <>
      <Head>
        <title>
          Image Details | Sample App
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 20
        }}
      >
        <Container maxWidth="md">
        <NextLink
            href="/image"
            passHref
          >
            <Button
              component="a"
              startIcon={<ArrowBackIcon fontSize="small" />}
            >
              Images
            </Button>
          </NextLink>
          <Box sx={{ mb: 4, alignItems: 'center' }}>
                <Typography variant="subtitle2" sx={{ alignItems: 'center' }}>
                    nftId: {nftId}
                </Typography>
          </Box>
        </Container>
      </Box>
    </>
  );
};

ImageDetails.getLayout = (page) => (
  <MainLayout>
      {page}
  </MainLayout>
);

export default ImageDetails;

