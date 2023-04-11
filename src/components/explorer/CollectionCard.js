import NextLink from 'next/link';
import { Box, Card, Grid, Typography } from '@mui/material';

var collectionImage;
var returnValue;

export const CollectionCard = ({ search, collection, slot }) =>{
  const searchTrue = collection.collectionName.toLowerCase().includes(search.toLowerCase());
  collectionImage = "/static/collectionImage.png";
  returnValue = <></>;

  if (collection.collectionImage) {
    if (collection.collectionImage.includes("http")) {
      collectionImage = collection.collectionImage;
    }  
  }

  if (searchTrue) {
    const fontSizeH4 = (collection.collectionName.length > 50) ? '10px' : { xs: '12px', sm: '14px', md: '14px', lg: '16px', xl: '14px' };
    const fontSizeP2 = (collection.collectionName.length > 50) ? '10px' : { xs: '10px', sm: '10px', md: '12px', lg: '12px', xl: '14px' };

    returnValue = (
      <Grid item xs={12} md={6} lg={4} xl={3} onClick={()=>{}}>
        <NextLink href={`/explorer/slot/${slot.slotId}/collection/${collection.collectionId}`} passHref legacyBehavior>
          <Card variant="outlined" sx={{
            display: 'flex',
            flexDirection: 'column',
            p: 1,
            m: 1,
            minWidth: "320px"
          }}>
            <img src={collectionImage} alt='Collection Image' style={{ maxHeight: '300px', maxWidth: '300px', placeSelf: 'center' }} />
            <Typography variant="h4" sx={{ lineHeight:"25px", fontSize: fontSizeH4 }}>
              { collection.collectionName }
            </Typography>
            <Box>
              <Typography variant="p2" sx={{ fontWeight: "bold", lineHeight:"25px", fontSize: fontSizeP2 }}>
                Type:&nbsp;
              </Typography>
              <Typography variant="p2" sx={{ lineHeight:"25px", fontSize: fontSizeP2 }}>
                { collection.type }
              </Typography>
            </Box>
            <Box>
              <Typography variant="p2" sx={{ fontWeight: "bold", lineHeight:"25px", fontSize: fontSizeP2 }}>
                Created by:&nbsp;
              </Typography>
              <Typography variant="p2" sx={{ lineHeight:"25px", fontSize: fontSizeP2 }}>
                { collection.handle }
              </Typography>
            </Box>
            <Box>
              <Typography variant="p2" sx={{ fontWeight:"bold", lineHeight:"25px", fontSize: fontSizeP2 }}>
                Total Minted:&nbsp;
              </Typography>
              <Typography variant="p2" sx={{ lineHeight:"25px", fontSize: fontSizeP2 }}>
                { collection.mintedAmt }
              </Typography>
            </Box>
            <Box>
              <Typography variant="p2" sx={{ fontWeight:"bold", lineHeight:"25px", fontSize: fontSizeP2 }}>
                Max Supply:&nbsp;
              </Typography>
              <Typography variant="p2" sx={{ lineHeight:"25px", fontSize: fontSizeP2 }}>
                { (collection.maximum >= 900000000) ? '\u221e': collection.maximum }
              </Typography>
            </Box>
          </Card>
        </NextLink>
      </Grid>
    );
  }

  return returnValue;
}