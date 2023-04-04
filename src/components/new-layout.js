import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Footer } from './footer';
import { NewerNavbar } from './newer-navbar';
const NewLayoutRoot = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    height: '100%',
    paddingTop: 64
}));

export const NewLayout = (props) => {
    const { children } = props;

    return (
        <NewLayoutRoot>
            <NewerNavbar />
                {children}
            <Footer />
        </NewLayoutRoot>
      );

};

NewLayout.propTypes = {
    children: PropTypes.node
};