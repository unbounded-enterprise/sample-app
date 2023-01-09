import dynamic from 'next/dynamic'
import { useEffect, useState, useRef } from 'react';
import { Avatar, Box, Container, Typography, Grid, Card } from '@mui/material';
import { MainLayout } from '../../components/main-layout';
import axios from 'axios';
import React from 'react';

import { Users as UsersIcon } from '../../icons/users';

const items = [
    {
      subtitle: 'Active Apps',
      value: '8'
    },
    {
      subtitle: 'Digital Assets Created',
      value: '1,000,000+'
    },
    {
      subtitle: 'Transactions',
      value: '5,000,000+'
    }
  ];

const buttonStyle = {border: '1px solid black', color: 'black'};

const ImagePage = (props)=>{

    
    return (
        <>  
            <Box
    sx={{
      backgroundColor: 'primary.main',
      py: 15
    }}
    {...props}
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
          py: 5
        }}
      >
        <Grid
        container
        spacing={3}
        sx={{ p: 3 }}
      >
        {items.map((item) => (
        <Grid
            item
            key={item.value}
            md={4}
            xs={12}
      >
            <Card
              sx={{
                alignItems: 'center',
                display: 'flex',
                flexDirection: 'column',
                p: 2,
                m: 4,
              }}
              variant="outlined"
            >
              <Typography variant="h5">
                {item.value}
              </Typography>
              <Typography
                color="textSecondary"
                variant="h6"
              >
                {item.subtitle}
              </Typography>
            </Card>
          </Grid>
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