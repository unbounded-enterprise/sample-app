import { useRouter } from 'next/router';
import { useSession, signIn as authSignIn, signOut as authSignOut } from "next-auth/react"
import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import { authApi } from '../_api_/auth-api';
import { auth, ENABLE_AUTH } from '../lib/auth';
import { Unity, useUnityContext } from "react-unity-webgl";

export const UnityContext = createContext({ undefined });

export const UnityProvider = (props) => {
  const { children } = props;
  const {
    unityProvider,
    loadingProgression,
    isLoaded,
    unload,
    sendMessage,
  } = useUnityContext({
    loaderUrl: "unity/Build/WebGL.loader.js",
    dataUrl: "unity/Build/WebGL.data",
    frameworkUrl: "unity/Build/WebGL.framework.js",
    codeUrl: "unity/Build/WebGL.wasm",
  });

  async function handleUnload() {
    console.log('handling unload')
    if (!isLoaded) return;

    await unload();
    console.log('unloaded?')
  }

  useEffect(() => {
    return () => console.log('unity provider unmounted')
  }, []);

  return (
    <UnityContext.Provider
      value={{
        unityProvider,
        loadingProgression,
        isLoaded,
        unload,
        handleUnload,
        sendMessage,
      }}
    >
      {children}
    </UnityContext.Provider>
  );
};

export const UnityComponent = ({ user, didToken }) => {
  const {
    unityProvider,
    loadingProgression,
    isLoaded,
    unload,
    sendMessage,
  } = useUnity({
    loaderUrl: "unity/Build/WebGL.loader.js",
    dataUrl: "unity/Build/WebGL.data",
    frameworkUrl: "unity/Build/WebGL.framework.js",
    codeUrl: "unity/Build/WebGL.wasm",
  });

  useEffect(() => {
    if (!user || !isLoaded || !didToken) return;
    
    sendMessage(
      "LoginReceiver",
      "SetDIDToken",
      didToken
    );
  }, [isLoaded, user]);

  return (
    <UnityProvider>
      <Unity
        unityProvider={unityProvider}
        style={{
          position: "relative", // or 'absolute'
          top: 0,
          left: 0,
          zIndex: 1000, // any value higher than the z-index of your navbar
          visibility: isLoaded ? "visible" : "hidden",
          width: "100%",
          height: "96.5vh",
        }}
      />
    </UnityProvider>
  )
}

UnityProvider.propTypes = {
  children: PropTypes.node
};

export const UnityConsumer = UnityContext.Consumer;

export const useUnity = () => useContext(UnityContext);
