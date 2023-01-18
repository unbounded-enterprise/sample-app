import { Bar } from 'react-chartjs-2';
import { Box, Button, Card, CardContent, CardHeader, Divider, useTheme, Container, Typography, Grid } from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import NextLink from 'next/link';

export const TutorialNetlify = (props) => {
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
          Deploy This App on Netlify
        </Typography>
        <Typography
          align="center"
          color="textSecondary"
          variant="subtitle1"
          sx={{ pt: 3, pb:5 }}
        >
          It&apos;s super easy.
        </Typography>
        <NextLink
                href="/tutorial/netlify"
                passHref
              >
                <Button
                color="primary"
                variant="contained"
            >
                Learn How
            </Button>
        </NextLink>
      </Container>
    </Box>
  );
};
