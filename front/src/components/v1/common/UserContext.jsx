// UserContext.js
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import LoadingIndicator from './LoadingIndicator';

const UserContext = createContext();

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: true,
};

const userReducer = (state, action) => {
  switch (action.type) {
    case 'LOGIN':
      return {
        ...state,
        user: action.payload.user,
        isAuthenticated: true,
        loading: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
      };
    case 'LOADING':
      return {
        ...state,
        loading: action.payload,
      }
    default:
      return state;
  }
};

const UserProvider = ({ children }) => {
  const [state, dispatch] = useReducer(userReducer, initialState);

  useEffect(() => {

    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token) {
      dispatch({ type: 'LOGIN', payload: { user: JSON.parse(storedUser) } });
    } else {
      dispatch({ type: 'LOADING' });
    }
  }, []);

  const login = (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    dispatch({ type: 'LOGIN', payload: { user } });
  }

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT', payload: false });
  }

  const loading = (payload) => {
    dispatch({ type: 'LOADING', payload: payload });
  }

  return <UserContext.Provider value={{ ...state, login, logout, loading }}>
    {state.loading ? 
    <LoadingIndicator/>
  : children}
  </UserContext.Provider>;
};

const useUser = () => useContext(UserContext);

export { UserProvider, useUser };
