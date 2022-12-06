import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Footer } from './footer';
import { MainNavbar } from './main-navbar';
const MainLayoutRoot = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    height: '100%',
    paddingTop: 64
}));

export const MainLayout = (props) => {
    const { children } = props;

    return (
        <MainLayoutRoot>
            <MainNavbar />
                {children}
            <Footer />
        </MainLayoutRoot>
      );

};

MainLayout.propTypes = {
    children: PropTypes.node
};