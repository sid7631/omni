import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { Bars } from 'react-loader-spinner';

const LoadingIndicator = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Bars
      height = "80"
      width = "80"
      radius = "9"
      color = 'green'
      ariaLabel = 'three-dots-loading'     
      wrapperStyle
      wrapperClass
    />
      {/* <Typography variant="h6" style={{ color: '#4CAF50' }}>
        Loading...
      </Typography> */}
    </div>
  );
};

export default LoadingIndicator;
