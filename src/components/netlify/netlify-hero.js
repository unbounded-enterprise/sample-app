import { Box, Button, Card, CardContent, CardHeader, Divider, useTheme, Container, Typography, Grid } from '@mui/material';

export const NetlifyHero = (props) => {
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
          sx={{ py: 4, mt:5 }}
        >
          Deploy This App to Netlify
        </Typography>
        <Typography
          align="center"
          variant="h3"
          sx={{ py: 4 }}
        >
          Here's how...

          Be sure to show how to set the environment variables in netlify.  You need to add your APP_SECRET to the file.
        </Typography>
      </Container>

    </Box>
  );
};
