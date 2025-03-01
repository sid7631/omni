import React, { createContext, useCallback, useContext, useState } from 'react';

const AlertContext = createContext();

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }) => {
  const [alertState, setAlertState] = useState({ open: false, message: '', severity: 'success' });

  const showAlert = useCallback((message, severity = 'success') => {
    setAlertState((prevState) => ({ ...prevState, open: true, message, severity }));
  }, []);
  const hideAlert = useCallback(() => {
    setAlertState((prevState) => ({ ...prevState, open: false }));
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, hideAlert, alertState }}>
      {children}
    </AlertContext.Provider>
  );
};
