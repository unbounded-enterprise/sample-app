import NextLink from 'next/link';
import { Box, Card, Grid, Link, Typography } from '@mui/material';

export const SlotCard = ({ slot, setChosenSlot }) => {
  return (
    <Grid
      item
      xs={12}
      sm={4}
      lg={3}
      onClick={() => { setChosenSlot(slot) }}
    >
      <NextLink href={`/explorer/slot/${slot.slotId}`} passHref legacyBehavior>
        <Link
          color="textPrimary"
          component="a"
          underline="none"
          sx={{
            alignItems: 'center',
            display: 'flex'
          }}
        >
          <Card
            variant="outlined"
            sx={{
              alignItems: 'flex-start',
              display: 'flex',
              flexDirection: 'column',
              p: "16px",
              maxWidth: "372px",
              maxHeight: "454px",
              boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25), 0px 1px 1px rgba(100, 116, 139, 0.06), 0px 1px 2px rgba(100, 116, 139, 0.1)",
              borderRadius: "8px"
            }}
          >
            <img src={'/static/collectionImage.png'} alt='collectionimage' style={{ width: '100%', maxWidth: "340px", maxHeight: "340px", alignContent: "center" }} />
            <Typography variant="p2" sx={{ gap: "8px", font: 'nunito', fontWeight: "bold", lineHeight: "40px", fontSize: slot.slotName.length > 18 ? '10px' : { xs: '12px', sm: '12px', md: '14px', lg: '14px', xl: '14px' } }}>
              { slot.slotName }
              <br></br>
            </Typography>
            <Box>
              <Typography variant="p2" sx={{ font: 'nunito', fontWeight: "bold", fontSize: slot.slotName.length > 18 ? '10px' : { xs: '12px', sm: '12px', md: '14px', lg: '14px', xl: '14px' } }}>
                Total Collections:&nbsp;
              </Typography>
              <Typography variant="p2" sx={{ font: 'nunito', fontSize: slot.slotName.length > 18 ? '10px' : { xs: '12px', sm: '12px', md: '14px', lg: '14px', xl: '14px' } }}>
                { slot.collections.length }
              </Typography>
            </Box>
          </Card>
        </Link>
      </NextLink>
    </Grid>
  )
}