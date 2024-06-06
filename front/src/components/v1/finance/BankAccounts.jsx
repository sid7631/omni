import React, { useEffect, useState } from 'react';
import { Button, TextField } from '@mui/material';
import axios from 'axios';
import BankAccountCard from '../common/BankAccountCard';
import { Box } from '@mui/system';
import Grid from '@mui/material/Grid';
import CardDashboard from '../common/CardDashboard';
import { Outlet } from 'react-router-dom';
import BankAccountAdd from '../common/BankAccountAdd';
import { getBankAccounts } from '../common/api';

const bank_accounts = [
    {
        title: 'Bank',
        bank: 'HDFC',
        account: '50100288017671',
        ifsc: 'HDFC000000',
        amount: 57330,
    },
    {
        title: 'Bank',
        bank: 'HDFC',
        account: '50100302570290',
        ifsc: 'HDFC000000',
        amount: 141000,
    },
]



const BankAccounts = () => {
  const [bankaccounts, setbankaccounts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getBankAccounts()
        if(response.status === 200){
            setbankaccounts(response.data['bank_accounts']);
        } else {
            console.log(response.data);
        }

      } catch (error) {
        console.error(error);
      }
    };

    fetchData();

    return () => {
      // Clean up code here
    };
  }, []);

  return (
    <>
      <Grid
        container
        spacing={{ xs: 2, sm: 2, md: 2, lg: 3 }}
        columns={{ xs: 4, sm: 8, md: 12, lg: 12 }}
      >
        {bankaccounts.map((item, index) => (
          <Grid item xs={4} sm={4} md={2} lg={2} key={index}>
            <BankAccountCard {...item} />
          </Grid>
        ))}
        <Grid item xs={4} sm={4} md={2} lg={2} key={999}>
          <BankAccountAdd />
        </Grid>
      </Grid>

      <Outlet />
    </>
  );
};

export default BankAccounts;
