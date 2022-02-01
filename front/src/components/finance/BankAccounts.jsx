import React, { useEffect, useState } from 'react';
import { Button, TextField } from '@mui/material';
import axios from 'axios';
import BankAccountCard from '../common/BankAccountCard';
import { Box } from '@mui/system';
import Grid from '@mui/material/Grid';
import CardDashboard from '../common/CardDashboard';
import { Outlet } from 'react-router-dom';
import BankAccountAdd from '../common/BankAccountAdd';

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

    useEffect(async () => {
      const response = await axios.get('http://localhost:8000/bank_accounts')
      if(response.status === 200){
          console.log(response)
          setbankaccounts(response.data)
      }
    
      return () => {
        // second;
      };
    }, []);
    



    return (
        <>
            <Grid container spacing={{ xs: 2, sm: 2, md: 2, lg: 3 }} columns={{ xs: 4, sm: 8, md: 12, lg: 12 }}>

                {bankaccounts.map((item, index) => (
                    <Grid item xs={4} sm={4} md={2} lg={2} key={index}>
                        <BankAccountCard {...item} />
                    </Grid>
                ))}
                <Grid item xs={4} sm={4} md={2} lg={2} key={999}>

                    <BankAccountAdd />
                </Grid>
                {/* <Grid item xs={4} sm={4} md={2} lg={2} key={999}>
                    <BankAccountCard {...item} />
                </Grid> */}
            </Grid>

            <Outlet />
            {/* <BankAccountCard /> */}
            {/* <TextField id="account" label="Bank Account" variant="outlined" value={account} onChange={(event)=> setaccount(event.target.value)} />
            <TextField id="ifsc" label="IFSC Code" variant="outlined" value={ifsc} onChange={(event) => setifsc(event.target.value)} />
            <Button variant="contained" onClick={onSubmit}>Submit</Button> */}
        </>
    );
};

export default BankAccounts;
