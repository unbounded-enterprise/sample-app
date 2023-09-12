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
  const [user, setUser] = useState(null);

  const getIsLoggedIn = async () => {
    return assetlayerClient.initialize();
  }

  const getUser = async () => {
    const { result: user } = await assetlayerClient.users.safe.getUser();
    return user;
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

  useEffect(() => {
    if(loggedIn){
      getUser()
      .then((newUser) => {
        setUser(newUser);
      })
      .catch((e) => { 
        const error = parseBasicErrorClient(e);
        console.log('setting error: ', error.message);
      });
    }
  }, [loggedIn]);

  const value = {
    assetlayerClient,
    loggedIn,
    setLoggedIn,
    unityOn,
    setUnityOn,
    gameEnded,
    setGameEnded,
    user,
    setUser
  };

  return (
    <AssetLayerContext.Provider value={value}>
      {children}
    </AssetLayerContext.Provider>
  );
};
