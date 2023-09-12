import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { Footer } from './footer';
import { MainNavbar } from './main-navbar';
import { useEffect, useState } from "react";
import { useAssetLayer } from "src/contexts/assetlayer-context.js";

const MainLayoutRoot = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    height: '100%',
    paddingTop: 64
}));

const MainLayoutRootUnityOn = styled('div')(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    height: '100%',
    paddingTop: 0
}));

export const MainLayout = (props) => {
    const { loggedIn, handleUserLogin, unityOn, assetlayerClient } = useAssetLayer();
    const [unityTrue, setUnityTrue] = useState(false);
    const { children } = props;
    
    useEffect(() => {
        console.log("unityOn: ", unityOn)
        if (unityOn){
            setUnityTrue(true);
        } else {
            setUnityTrue(false);
        }
    
      }, [unityOn]);

    if(!unityTrue){
        return (
            <MainLayoutRoot>
                <MainNavbar />
                { children }
                <Footer />
            </MainLayoutRoot>
        );
    } else{
        return (
            <MainLayoutRootUnityOn>
                { children }
            </MainLayoutRootUnityOn>
        );
    }
};

MainLayout.propTypes = {
    children: PropTypes.node
};