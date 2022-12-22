import { Bar } from 'react-chartjs-2';
import { Box, Link, useTheme, Container, Typography, Grid } from '@mui/material';
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
          Learn how to build & deploy your own bitcoin NFT app or game in less than an hour. Imagine that - woot!
        </Typography>
        <Typography
          align="center"
          color="textSecondary"
          variant="subtitle1"
          sx={{ pt: 3 }}
        >
          This sample app is a Next-based React client that demonstrates how one might create a game or other application on the Asset Layer platform.  The code provided in this free app is very similar to that used for Duro Dogs.  The code for this app is completely open-source - so have fun creating!  Just thank us after you receive your unicorn status.
        </Typography>
        <NextLink
              href="https://github.com/unbounded-enterprise/sample-app"
              passHref
            >
              <Link underline="none">
                <Box align="center" sx={{ borderRadius: 1, py: '0.5em', px: '0.5em', '&:hover': { backgroundColor: 'rgba(155,155,155,0.1)' } }}>
                <img style={{width:'50%'}} src='/static/github.png' alt='' />
                </Box>
              </Link>
            </NextLink>
      </Container>

    </Box>
  );
};
