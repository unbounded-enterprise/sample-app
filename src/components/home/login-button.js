import React from 'react';
import { Button, Box } from '@mui/material'; // Import Box for additional styling
import { useAssetLayer } from 'src/contexts/assetlayer-context.js'; // Import the hook

const LoginButton = () => {
  const { assetlayerClient, loggedIn, setLoggedIn } = useAssetLayer(); // Use the hook to get the client

  const handleLogin = async () => {
    await assetlayerClient.loginUser({ onSuccess: async () => setLoggedIn(true) });
  };

  return (
    <Box 
      sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '20vh', // 100% of the viewport height
        padding: '2rem' // Add more space around the button
      }}
    >
      <Button 
        variant="contained" 
        onClick={handleLogin}
        sx={{ 
          backgroundColor: '#045CD2', // Set the background color
          '&:hover': {
            backgroundColor: '#045CD2', // Set hover color
          },
          color: 'white',
          fontSize: '1.5rem', // Make the text larger
          padding: '1rem 2rem' // Add more padding to make the button larger
        }}
      >
        Login
      </Button>
    </Box>
  );
};

export default LoginButton;
