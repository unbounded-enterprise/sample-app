import { Bar } from 'react-chartjs-2';
import { Box, Button, Card, CardContent, CardHeader, Divider, useTheme, Container, Typography, Grid } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import NextLink from 'next/link';

export const HomeHero = (props) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: 'background.paper',
        pt: 6,
        pb: '8em'
      }}
      {...props}
    >    
      <Container
        maxWidth="md"
        sx={{
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Typography
          align="center"
          variant="h1"
          sx={{ py: 4, mt:5 }}
        >
          Welcome to NFT Sample App
        </Typography>
        <Typography
          align="center"
          variant="h3"
          sx={{ py: 4 }}
        >
          Learn how to build & deploy your bitcoin NFT app or game in less than an hour. Imagine that - woot!
        </Typography>
        <Typography
          align="center"
          color="textSecondary"
          variant="subtitle1"
          sx={{ pt: 3 }}
        >
          This sample app is a Next-based React client that demonstrates how one might create a game or other application on the Asset Layer platform.  Sure React might slow down your game, but we love it and it's great for a demo.  Duro Dogs runs on React and works great.  The code for this app is completely open-source and free to use.  Just thank us after you receive your unicorn status.
        </Typography>
      </Container>

    </Box>
  );
};
