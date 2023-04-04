import { Box, Card, Grid, Typography} from '@mui/material';
import NextLink from 'next/link';

export const CollectionCard = ({search, collection, slot}) =>{
  console.log(collection);
    const searchTrue = collection.collectionName.toLowerCase().includes(search.toLowerCase());
    var collectionImage = "/static/collectionImage.png";
    if(collection.collectionImage){
      if(collection.collectionImage.includes("http")){
        collectionImage = collection.collectionImage
    }  }
    var returnValue = <></>;
    if(searchTrue){
      returnValue = (<Grid
      item
      lg={3}
      sm={4}
      xs={12}
      onClick={()=>{}}
      >
          <NextLink href={`/explorer/slot/${slot.slotId}/collection/${collection.collectionId}`} passHref legacyBehavior><Card
            sx={{
              display: 'flex',
              flexDirection: 'column',
              p: 1,
              m: 1,
            }}
            variant="outlined"
          >
              <img src={collectionImage} alt={'Collection Image'} style={{maxHeight: '300px', maxWidth: '300px', placeSelf: 'center'}} />
              <Typography variant="h4" sx={{lineHeight:"25px", fontSize: collection.collectionName.length > 50?'10px':{ xs: '12px', sm: '14px', md: '14px', lg: '16px', xl: '14px'}}}>
                {collection.collectionName}
              </Typography>
              <Box>
              <Typography
                variant="p2" sx={{fontWeight: "bold",lineHeight:"25px", fontSize: collection.collectionName.length > 50?'10px':{ xs: '10px', sm: '10px', md: '12px', lg: '12px', xl: '14px'}}}
              >
                Type:&nbsp;
              </Typography><Typography
                variant="p2" sx={{lineHeight:"25px", fontSize: collection.collectionName.length > 50?'10px':{ xs: '10px', sm: '10px', md: '12px', lg: '12px', xl: '14px'}}}
              >
                {collection.type}
              </Typography></Box>
              <Box><Typography
                variant="p2" sx={{fontWeight: "bold", lineHeight:"25px", fontSize: collection.collectionName.length > 50?'10px':{ xs: '10px', sm: '10px', md: '12px', lg: '12px', xl: '14px'}}}
              >
                Created by:&nbsp;
              </Typography>
              <Typography
                variant="p2" sx={{lineHeight:"25px", fontSize: collection.collectionName.length > 50?'10px':{ xs: '10px', sm: '10px', md: '12px', lg: '12px', xl: '14px'}}}
              >
                {collection.handle}
              </Typography></Box>
              <Box><Typography
                variant="p2" sx={{fontWeight:"bold",lineHeight:"25px", fontSize: collection.collectionName.length > 50?'10px':{ xs: '10px', sm: '10px', md: '12px', lg: '12px', xl: '14px'}}}
              >
                Total Minted:&nbsp;
              </Typography>
              <Typography
                variant="p2" sx={{lineHeight:"25px", fontSize: collection.collectionName.length > 50?'10px':{ xs: '10px', sm: '10px', md: '12px', lg: '12px', xl: '14px'}}}
              >
                {collection.mintedAmt}
              </Typography></Box>
              <Box><Typography
                variant="p2" sx={{fontWeight:"bold",lineHeight:"25px", fontSize: collection.collectionName.length > 50?'10px':{ xs: '10px', sm: '10px', md: '12px', lg: '12px', xl: '14px'}}}
              >
                Max Supply:&nbsp;
              </Typography>
              <Typography
                variant="p2" sx={{lineHeight:"25px", fontSize: collection.collectionName.length > 50?'10px':{ xs: '10px', sm: '10px', md: '12px', lg: '12px', xl: '14px'}}}
              >
                {collection.maximum>=900000000 ? '\u221e': collection.maximum}
              </Typography></Box>
          </Card></NextLink>
      </Grid>
  );
}
return returnValue;
}