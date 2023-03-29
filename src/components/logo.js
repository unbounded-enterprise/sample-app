import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Box, Container } from '@mui/material';

const LogoStyle = styled('div')(() => ({
  height: '10',
  paddingTop: 2
}));

export const Logo = styled((props) => {
  const { variant, ...other } = props;

  const color = variant === 'light' ? '#C1C4D6' : '#5048E5';

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
