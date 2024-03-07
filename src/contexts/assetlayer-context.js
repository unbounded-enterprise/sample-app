import React, { createContext, useContext, useRef, useState, useEffect } from 'react';
import { AssetLayer } from '@assetlayer/sdk';
import { get } from 'http';

export const AssetLayerContext = createContext();

export const useAssetLayer = () => {
  return useContext(AssetLayerContext);
};

export const AssetLayerProvider = ({ children }) => {
  const [assetlayerClient, setAssetLayerClient] = useState(new AssetLayer({baseUrl: "/api"}));
  const [retrievingSession, setRetrievingSession] = useState(true);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [unityOn, setUnityOn] = useState(false);
  const [balance, setBalance] = useState(null);
  const runOnceRef = useRef(false);

  async function getIsLoggedIn() {
    return assetlayerClient.initialize();
  }
  async function handleUserLogin(loggedIn) {
    if (loggedIn) {
      if (!user) await loadUser();
      // if (!balance) await loadCurrencyBalance(); // requires sdk update before enabling
    }
    else {
      if (user) setUser(null);
      if (balance) setBalance(null);
    }

    setLoggedIn(loggedIn);
    setRetrievingSession(false);
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

  const value = {
    assetlayerClient,
    retrievingSession,
    loggedIn,
    handleUserLogin,
    user,
    balance,
    loadCurrencyBalance,
    unityOn,
    setUnityOn,
  };

  return (
    <AssetLayerContext.Provider value={value}>
      {children}
    </AssetLayerContext.Provider>
  );
};
