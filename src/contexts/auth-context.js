import { useRouter } from 'next/router';
import { createContext, useContext, useEffect, useReducer, useRef } from 'react';
import PropTypes from 'prop-types';
import { authApi } from '../_api_/auth-api';
import { auth, ENABLE_AUTH } from '../lib/auth';

const HANDLERS = {
  INITIALIZE: 'INITIALIZE',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT'
};

const initialState = {
  isAuthenticated: false,
  isLoading: true,
  user: null
};

const handlers = {
  [HANDLERS.INITIALIZE]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      ...(
        // if payload (user) is provided, then is authenticated
        user
          ? ({
            isAuthenticated: true,
            isLoading: false,
            user
          })
          : ({
            isLoading: false
          })
      )
    };
  },
  [HANDLERS.SIGN_IN]: (state, action) => {
    const user = action.payload;

    return {
      ...state,
      isAuthenticated: true,
      user
    };
  },
  [HANDLERS.SIGN_OUT]: (state) => {
    return {
      ...state,
      isAuthenticated: false,
      user: null
    };
  }
};

const reducer = (state, action) => (
  handlers[action.type] ? handlers[action.type](state, action) : state
);

async function checkForHandcashToken(router) {
  const { search } = window.location;
  const { pathname, query } = router;
  const params = new URLSearchParams(search);
  const authToken = params.get('authToken') 
    || window.localStorage.getItem('authToken') 
    || null;

  if (authToken) router.replace({ pathname, query }, undefined, { shallow: true });

  return authToken;
}

async function getAccessToken(handcashToken) {
  const accessToken = (handcashToken) ?
    await authApi.getToken(handcashToken)
    : localStorage.getItem('accessToken')
    || null;

  return accessToken;
}

async function setLocalStorage({ authToken, accessToken }) {
  // handcash / payment token isn't cached by default
  // localStorage.setItem('authToken', authToken);

  // limited profile information is included by default
  localStorage.setItem('accessToken', accessToken);
}

// The role of this context is to propagate authentication state through the App tree.

export const AuthContext = createContext({ undefined });

export const AuthProvider = (props) => {
  const { children } = props;
  const [state, dispatch] = useReducer(reducer, initialState);
  const initialized = useRef(false);
  const router = useRouter();

  const initialize = async () => {
    // Prevent from calling twice in development mode with React.StrictMode enabled
    if (initialized.current) {
      return;
    }

    initialized.current = true;

    try {
      // Check URL & LS for auth token
      const authToken = await checkForHandcashToken(router);
      // Wrap handcash user in token
      const accessToken = (authToken) ? await getAccessToken(authToken) : null;
      // Get user from Handcash JWT token
      const user = (accessToken) ? await authApi.me(accessToken) : null;

      console.log('user', user);
      setLocalStorage({ authToken, accessToken });
        
      dispatch({
        type: HANDLERS.INITIALIZE,
        payload: user
      });
    } catch (err) {
      console.error(err);
      dispatch({
        type: HANDLERS.INITIALIZE
      });
    }
  };

  useEffect(() => {
    initialize().catch(console.error);
  }, []);

  const signIn = (user) => {
    dispatch({
      type: HANDLERS.SIGN_IN,
      payload: user
    });
  };

  const signOut = () => {
    localStorage.removeItem('accessToken');

    dispatch({
      type: HANDLERS.SIGN_OUT
    });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        signIn,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node
};

export const AuthConsumer = AuthContext.Consumer;

export const useAuthContext = () => useContext(AuthContext);
