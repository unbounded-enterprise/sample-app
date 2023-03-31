import NextLink from 'next/link';
import { Box, Card, Grid, Typography } from '@mui/material';

const defaultCollectionImage = "/static/collectionImage.png";
const emptyNode = <></>;
var collectionImage = defaultCollectionImage;
var returnValue = emptyNode;

export const CollectionCard = ({ search, collection, slot }) =>{
  const searchTrue = collection.collectionName.toLowerCase().includes(search.toLowerCase());

  if (collection.collectionImage) {
    if (collection.collectionImage.includes("http")) {
      collectionImage = collection.collectionImage
    }  
  }

  if (searchTrue) {
    returnValue = (
      <Grid
        item
        xs={12}
        sm={4}
        lg={3}
        onClick={()=>{}}
      >
        <NextLink href={`/explorer/slot/${slot.slotId}/collection/${collection.collectionId}`} passHref legacyBehavior>
          <Card
            variant="outlined"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              p: 1,
              m: 1,
            }}
          >
            <img src={collectionImage} alt={'Collection Image'} style={{maxHeight: '300px', maxWidth: '300px', placeSelf: 'center'}} />
            <Typography variant="h4" sx={{lineHeight:"25px", fontSize: collection.collectionName.length > 50?'10px':{ xs: '12px', sm: '14px', md: '14px', lg: '16px', xl: '14px'}}}>
              { collection.collectionName }
            </Typography>
            <Box>
              <Typography variant="p2" sx={{fontWeight: "bold",lineHeight:"25px", fontSize: collection.collectionName.length > 50?'10px':{ xs: '10px', sm: '10px', md: '12px', lg: '12px', xl: '14px'}}}>
                Type:&nbsp;
              </Typography>
              <Typography variant="p2" sx={{lineHeight:"25px", fontSize: collection.collectionName.length > 50?'10px':{ xs: '10px', sm: '10px', md: '12px', lg: '12px', xl: '14px'}}}>
                { collection.type }
              </Typography>
            </Box>
            <Box>
              <Typography variant="p2" sx={{fontWeight: "bold", lineHeight:"25px", fontSize: collection.collectionName.length > 50?'10px':{ xs: '10px', sm: '10px', md: '12px', lg: '12px', xl: '14px'}}}>
                Created by:&nbsp;
              </Typography>
              <Typography variant="p2" sx={{lineHeight:"25px", fontSize: collection.collectionName.length > 50?'10px':{ xs: '10px', sm: '10px', md: '12px', lg: '12px', xl: '14px'}}}>
                { collection.creator }
              </Typography>
            </Box>
            <Box>
              <Typography variant="p2" sx={{fontWeight:"bold",lineHeight:"25px", fontSize: collection.collectionName.length > 50?'10px':{ xs: '10px', sm: '10px', md: '12px', lg: '12px', xl: '14px'}}}>
                Max Supply:&nbsp;
              </Typography>
              <Typography variant="p2" sx={{lineHeight:"25px", fontSize: collection.collectionName.length > 50?'10px':{ xs: '10px', sm: '10px', md: '12px', lg: '12px', xl: '14px'}}}>
                { (collection.maximum >= 999999999) ? '\u221e': collection.maximum }
              </Typography>
            </Box>
          </Card>
        </NextLink>
      </Grid>
    );
  }

  return returnValue;
}