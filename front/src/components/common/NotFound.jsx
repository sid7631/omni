import { Box } from '@mui/material';
import React from 'react';
import { Link } from 'react-router-dom'; // Assuming you're using React Router for routing
// import './NotFoundPage.css'; // Importing CSS file for additional styles

const NotFound = () => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" height="calc(100vh - 128px)">
    	<div class="fof">
        		<h1>Error 404</h1>
    	</div>
</Box>
  );
};

export default NotFound;
