import { Box, Card, Grid, Link, Typography } from '@mui/material';
import NextLink from 'next/link';

var slotImage;

export const SlotCard = ({ search, slot, numCollections }) => {
  const searchTrue = slot.slotName.toLowerCase().includes(search.toLowerCase());
  slotImage = '/static/collectionImage.png';

  if (slot.slotImage) {
    slotImage = slot.slotImage;
  }

  const fontSize = (slot.slotName.length > 18) ? '10px' : { xs: '12px', sm: '12px', md: '14px', lg: '14px', xl: '14px' };
 
  if(searchTrue){
    return (
      <Grid item xs={12} md={6} lg={4} xl={3} onClick={() => {  }}>
        <NextLink href={`/inventory/slot/${slot.slotId}`} passHref legacyBehavior>
          <Link component="a" color="textPrimary" underline="none" sx={{ alignItems: 'center', display: 'flex' }}>
            <Card variant="outlined" sx={{
              alignItems: 'flex-start',
              display: 'flex',
              flexDirection: 'column',
              p: "16px",
              maxWidth: "372px",
              maxHeight: "454px",
              minWidth: "320px",
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25), 0px 1px 1px rgba(100, 116, 139, 0.06), 0px 1px 2px rgba(100, 116, 139, 0.1)",
              borderRadius: "8px"
            }}>
              <img src={slotImage} alt='collectionimage' style={{ width: '100%', maxWidth: "340px", maxHeight: "340px", alignContent: "center" }} />
              <Typography variant="p2" sx={{ gap: "8px", font: 'nunito', fontWeight: "bold", lineHeight: "40px", fontSize: fontSize }}>
                { slot.slotName }
                <br></br>
              </Typography>
              <Box>
                <Typography variant="p2" sx={{ font: 'nunito', fontWeight: "bold", fontSize: fontSize }}>
                  My Collections:&nbsp;
                </Typography>
                <Typography variant="p2" sx={{ font: 'nunito', fontSize: fontSize }}>
                  { numCollections }
                </Typography>
              </Box>
            </Card>
          </Link>
        </NextLink>
      </Grid>
    )
  }
}