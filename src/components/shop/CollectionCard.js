import { Box, Card, Grid, Typography } from '@mui/material';

var collectionImage;

export const CollectionCard = ({ collection }) => {
    collectionImage = "/static/collectionImage.png";

  if (collection.collectionImage) {
    if (collection.collectionImage.includes("http")) {
      collectionImage = collection.collectionImage;
    }  
  }
  return (
    <Card 
      sx={{
        border: '3px solid black',
        backgroundColor: 'white',
        borderRadius: '15px',
        textAlign: 'center'
      }}
    >
      {/* Image */}
      <Box mb={0}>
        <img src={collectionImage} alt="Coin Image" style={{ width: '100%', display: 'block', marginBottom: '0' }} />
      </Box>

      {/* Quantity */}
      <Box 
        py={1} 
        sx={{
          width: '100%', // Make the box full width
          backgroundColor: 'black',
          fontFamily: 'chango',
          fontSize: '1rem',
          color: 'white'
        }}
      >
       {collection.collectionName}
      </Box>

      {/* Minted and Maximum */}
      <Typography 
        variant="h6" 
        py={1} 
        sx={{
          color: '#1E3465',
          fontFamily: 'chango',
          fontSize: '1.2rem'
        }}
      >
        {collection.minted} <img src="/static/mintedIcon.png" alt="minted-icon" style={{ height: '1.2rem', verticalAlign: 'middle' }} />&nbsp;&nbsp;&nbsp;&nbsp;
        {collection.maximum} <img src="/static/maximumIcon.png" alt="maximum-icon" style={{ height: '1.2rem', verticalAlign: 'middle' }} />
      </Typography>

      {/* Price */}
      <Typography 
        variant="h6" 
        py={1} 
        sx={{
          color: '#FF4D0D',
          fontFamily: 'chango',
          fontSize: '1.2rem'
        }}
      >
        50 <img src="/static/coinImage.png" alt="price-icon" style={{ height: '1.2rem', verticalAlign: 'middle' }} />
      </Typography>
    </Card>
  );
}
