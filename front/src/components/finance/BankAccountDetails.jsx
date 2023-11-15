import { Box } from '@mui/material';
import React from 'react';
import { useParams } from 'react-router-dom';

const BankAccountDetails = () => {
    let { account } = useParams();

    return (
        <Box>
            {/* Bank account details UI */}
            {/* Format the UI using mui5 */}
            {/* Populate the UI with the bank account details */}
            {account} Bank Account Details
        </Box>
    );
};

export default BankAccountDetails;
