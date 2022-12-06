import { Bar } from 'react-chartjs-2';
import { Box, Button, Card, CardContent, CardHeader, Divider, useTheme, Container, Typography, Grid } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import NextLink from 'next/link';

export const HomeHandcash = (props) => {
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
          variant="h2"
          sx={{ py: 4 }}
        >
          First Connect to HandCash
        </Typography>
        <Typography
          align="center"
          color="textSecondary"
          variant="subtitle1"
          sx={{ pt: 3, pb: 4 }}
        >
          This first thing you want to do is connect to your app to handcash wallet.
        </Typography>
        <NextLink
                href="/dogs"
                passHref
              >
                <Button
                color="primary"
                variant="contained"
            >
                Connect to HandCash
            </Button>
        </NextLink>
      </Container>
    </Box>
  );
};
