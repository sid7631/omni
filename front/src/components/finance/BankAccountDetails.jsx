import React from 'react';
import { useParams } from 'react-router-dom';

const BankAccountDetails = () => {
    let { account } = useParams();

    return (
        <div>
            Bank Account Detials
        </div>
    );
};

export default BankAccountDetails;
