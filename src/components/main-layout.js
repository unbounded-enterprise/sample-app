import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Footer } from './footer';
import { MainNavbar } from './main-navbar';
import { useAssetLayer } from "src/contexts/assetlayer-context.js";

const MainLayoutRoot = styled('div')(({ theme, unity }) => ({
    backgroundColor: theme.palette.background.default,
    height: '100%',
    paddingTop: unity ? 0 : 64 
}));

export const MainLayout = (props) => {
    const { loggedIn, handleUserLogin, unityOn, assetlayerClient } = useAssetLayer();
    const { children } = props;

    return (
        <MainLayoutRoot unity={unityOn}>
            { !unityOn && <MainNavbar /> }
            { children }
            { !unityOn && <Footer /> }
        </MainLayoutRoot>
    );
};

MainLayout.propTypes = {
    children: PropTypes.node
};