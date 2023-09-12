import { Box, Card, Grid, Typography } from '@mui/material';

var menuViewExpressionValue;

export const AssetCard = ({ search, collection, asset, onCardClick }) => {
    const searchTrue = includeSerial(search, asset);

  asset.expressionValues.forEach((element) => {
    if (element.expression.expressionName === "Menu View") {
      menuViewExpressionValue = element.value;
    }
  });
    
  if (searchTrue){
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
                        <img src={menuViewExpressionValue} alt="Asset Image" style={{ width: '100%', display: 'block', marginBottom: '0' }} />
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
                        #{asset.serial}
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

const includeSerial = (search, asset)=>{
    let searchArray = [];
    let finalArray = [];
    let isTrue = true;
  
    if (search) {
      isTrue = false;
      searchArray = search.split(",");
      if (searchArray.length > 0) {
        searchArray.forEach((element) => {
          if (element.includes("-")) {
            element = element.split("-");
            finalArray.push(element);
          } else {
            element = parseInt(element);
            finalArray.push(element);
          }
        });
      }
    }
  
    finalArray.forEach((element) => {
      if (Number.isInteger(element)) {
        if (asset.serial === element) {
          isTrue = true;
        } 
      } else {
        if (Array.isArray(element)) {
          if (asset.serial >= parseInt(element[0]) && asset.serial <= parseInt(element[1])) {
            isTrue = true;
          }
        }
      }
    })
  
    return isTrue;
  }