import { Box, Card, Typography } from '@mui/material';
import "@fontsource/chango";

export const CoinCard = ({ price, quantity, onClick }) => {
  return (
    <Card onClick={onClick}
      sx={{
        border: '3px solid black',
        backgroundColor: 'white',
        borderRadius: '15px',
        textAlign: 'center',
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'rgba(0, 0, 0, 0.05)',
          boxShadow: '0px 3px 5px 2px rgba(0, 0, 0, .3)'
        }
      }}
    >
      {/* Image */}
      <Box>
        <img src="/static/coinImage.png" alt="Coin Image" style={{ width: '70%'}} />
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
        {parseInt(quantity).toLocaleString()} Coins
      </Box>

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
        ${price}
      </Typography>
    </Card>
  );
}
