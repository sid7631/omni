import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useAlert } from './AlertContext';

const GlobalAlert = () => {
  const { alertState, hideAlert } = useAlert();

  return (
    <Snackbar
      open={alertState.open}
      autoHideDuration={6000}
      onClose={hideAlert}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
    >
      <Alert onClose={hideAlert} severity={alertState.severity}>
        {alertState.message}
      </Alert>
    </Snackbar>
  );
};

export default GlobalAlert;
