import NextLink from 'next/link';
import { Card, Grid, Typography } from '@mui/material';

var menuViewExpressionValue;

export const NftCard = ({ collection, nft, slot }) => {
  nft.expressionValues.forEach((element) => {
    if (element.expression.expressionName === "Menu View") {
      menuViewExpressionValue = element.value;
    }
  });
    
  return (
    <Grid item key={nft.nftId} xs={12} md={6} lg={4} xl={3} onClick={()=>{}}>
      <NextLink href={`/explorer/slot/${slot.slotId}/collection/${collection.collectionId}/nft/${nft.nftId}`} passHref legacyBehavior>
        <Card variant="outlined" sx={{
          display: 'flex',
          flexDirection: 'column',
          p: 1,
          m: 1,
          minWidth: "300px"
        }}>
          <img src={menuViewExpressionValue} alt='Collection Image' style={{ maxHeight: '300px', maxWidth: '300px', placeSelf: 'center' }} />
          <Typography variant="p2" sx={{ padding: 1, fontWeight: "bold" }}>
            {collection.collectionName} #{nft.serial}
          </Typography>
        </Card>
      </NextLink>
    </Grid>
  )
}