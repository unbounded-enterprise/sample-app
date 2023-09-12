import { Box, Card, Grid, Typography } from '@mui/material';

var collectionImage;

export const CollectionCard = ({ search, collection, assetCount, onCardClick }) => {
    collectionImage = "/static/collectionImage.png";

    if (collection.collectionImage) {
        if (collection.collectionImage.includes("http")) {
            collectionImage = collection.collectionImage;
        }  
    }

    if(collection.collectionName.toLowerCase().includes(search.toLowerCase())) {
        return (
            <div onClick={onCardClick}>
                <Card 
                    sx={{
                        border: '3px solid black',
                        backgroundColor: 'white',
                        borderRadius: '15px',
                        textAlign: 'center',
                        position: 'relative' // Add this line
                    }}
                >
                    {/* Image */}
                    <Box mb={0}>
                        <img src={collectionImage} alt="Coin Image" style={{ width: '100%', display: 'block', marginBottom: '0' }} />
                    </Box>

                    {/* Asset Count Box */}
                    <Box 
                        sx={{
                            position: 'absolute', // Absolute positioning
                            bottom: 50, // Padding from the bottom
                            right: 8, // Padding from the right
                            backgroundColor: '#1E3465',
                            color: 'white',
                            fontFamily: 'Chango',
                            padding: '0.2rem 0.5rem', // Some padding for the box
                            borderRadius: '5px' // Slight rounded corners
                        }}
                    >
                        {assetCount}
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
                </Card>
            </div>
        );
    }
}
