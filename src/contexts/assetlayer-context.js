import React, { createContext, useContext, useState, useEffect } from 'react';
import { AssetLayer } from '@assetlayer/sdk-client';
import { get } from 'http';

export const AssetLayerContext = createContext();

export const useAssetLayer = () => {
  return useContext(AssetLayerContext);
};

export const AssetLayerProvider = ({ children }) => {
  const [assetlayerClient, setAssetLayerClient] = useState(new AssetLayer({baseUrl: "/api"}));
  const [loggedIn, setLoggedIn] = useState(false);
  const [unityOn, setUnityOn] = useState(false);
  const [gameEnded, setGameEnded] = useState(false);

  const getIsLoggedIn = async () => {
    return assetlayerClient.initialize();
  }

  useEffect(() => {
    getIsLoggedIn()
      .then((isLoggedIn) => {
        setLoggedIn(isLoggedIn);
      })
      .catch((e) => { 
        const error = parseBasicErrorClient(e);
        console.log('setting error: ', error.message);
      });
  }, []);

  const value = {
    assetlayerClient,
    loggedIn,
    setLoggedIn,
    unityOn,
    setUnityOn,
    gameEnded,
    setGameEnded
  };

  return (
    <AssetLayerContext.Provider value={value}>
      {children}
    </AssetLayerContext.Provider>
  );
};
