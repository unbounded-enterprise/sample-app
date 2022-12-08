import { Box, Button, Card, CardContent, CardHeader, Divider, useTheme, Container, Typography, Grid } from '@mui/material';
import NextLink from 'next/link';

export const TutorialHero = (props) => {
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
          NFT Sample App Tutorial
        </Typography>
        <Typography
          align="center"
          variant="h3"
          sx={{ py: 4 }}
        >
          Learn how to build & deploy your own bitcoin NFT app or game in less than an hour. Imagine that - woot!
        </Typography>
      </Container>

    </Box>
  );
};
