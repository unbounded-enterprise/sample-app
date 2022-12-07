import { Bar } from 'react-chartjs-2';
import { Box, Button, Card, CardContent, CardHeader, Divider, useTheme, Container, Typography, Grid } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import NextLink from 'next/link';

export const HomeDurodogs = (props) => {
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
          Access Your Duro Dogs, Then Expand
        </Typography>
        <Typography
          align="center"
          color="textSecondary"
          variant="subtitle1"
          sx={{ pt: 3 }}
        >
          Connect to the Asset Layer API to view your dogs.  Use this code to create an entirely new game using Duro Dogs.
        </Typography>
        <Typography
          align="center"
          color="textSecondary"
          variant="subtitle1"
          sx={{ pt: 3 }}
        >
          <NextLink
                href="/dog"
                passHref
              >
                <Button
                color="primary"
                variant="contained"
            >
                View Duro Dogs
            </Button>
        </NextLink>
        </Typography>
      </Container>
    </Box>
  );
};
