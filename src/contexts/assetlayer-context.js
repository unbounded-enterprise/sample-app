import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
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
  const [balance, setBalance] = useState(null);
  const runOnceRef = useRef(false);

  async function getIsLoggedIn() {
    return assetlayerClient.initialize();
  }

  async function loadUser() {
    const { result: user, error } = 
      await assetlayerClient.users.safe.getUser();
    if (user) setUser(user);
    return user;
  };

  async function loadCurrencyBalance() {
    const { result: balance, error } =
      await assetlayerClient.currencies.safe.getCurrencyBalance();
    if (balance) setBalance(balance);
    return balance;
  }

  async function handleUserLogin(loggedIn) {
    if (loggedIn) {
      if (!user) await loadUser();
      if (!balance) await loadCurrencyBalance();
    }
    else {
      if (user) setUser(null);
      if (balance) setBalance(null);
    }

    setLoggedIn(loggedIn);
  }

  useEffect(() => {
    if (runOnceRef.current) return;

    getIsLoggedIn()
      .then((isLoggedIn) => {
        handleUserLogin(isLoggedIn);
      })
      .catch((e) => { 
        const error = parseBasicErrorClient(e);
        console.log('setting error: ', error.message);
      });

    return () => {
      runOnceRef.current = true;
    }
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
    handleUserLogin,
    unityOn,
    setUnityOn,
    gameEnded,
    setGameEnded,
    user,
    balance,
  };

  return (
    <AssetLayerContext.Provider value={value}>
      {children}
    </AssetLayerContext.Provider>
  );
};
