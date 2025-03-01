import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import { Bars } from 'react-loader-spinner';
import { useLoading } from './loading/Loading';

const LoadingIndicator = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
      <Bars
        height="80"
        width="80"
        radius="9"
        color='green'
        ariaLabel='three-dots-loading'
      />
      {/* <Typography variant="h6" style={{ color: '#4CAF50' }}>
        Loading...
      </Typography> */}
    </div>
  );
};

export default LoadingIndicator;


export const LoadingIndicatorGlobal = () => {
  const { loading } = useLoading();
  return (
    loading &&
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 9999, backgroundColor: 'rgba(0, 0, 0, 0.25)' }}>

      <div style={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <Bars
          height="80"
          width="80"
          radius="9"
          color='green'
          ariaLabel='three-dots-loading'
        />
        {/* <Typography variant="h6" style={{ color: '#4CAF50' }}>
        Loading...
      </Typography> */}
      </div>
    </div>
  );
}