import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Box } from '@mui/material';

export const Logo = styled((props) => {

  return (
    <Box
      sx={{
        pt: 4,
        pb: 2
      }}
      {...props}
    >    
      <img src={'/static/assetlayer_logo.png'} style={{ height: 100 }} alt='NFTsample.app' />
    </Box>
  );
})``;

Logo.defaultProps = {
  variant: 'primary'
};

Logo.propTypes = {
  variant: PropTypes.oneOf(['light', 'primary'])
};
