// src/components/AccountForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { API_URLS } from '../../config/config';  // Adjust the path as necessary
import { Box, Button, FormControl, InputLabel, MenuItem, OutlinedInput, Select, TextField } from '@mui/material';

const accountTypes = [
    'Savings',
    'Checking',
    'Investment',
    'Retirement'
];


function AccountForm() {
    const [accountName, setAccountName] = useState('');
    const [accountType, setAccountType] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(API_URLS.createAccount, {
                account_name: accountName,
                account_type: accountType
            }, {
                headers: { 'Content-Type': 'application/json' }
            });
            alert('Account created successfully!');
            console.log(response.data);
        } catch (error) {
            console.error('There was an error creating the account:', error);
            alert('Error creating account.');
        }
    };

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: 'calc(100vh - 320px)' }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', width: 300, alignItems: 'center', justifyContent: 'center' }}>
                <FormControl sx={{ m: 1, width: 300 }}>
                    <TextField
                        id="account-name"
                        label="Account Name"
                        value={accountName}
                        onChange={(event) => {
                            setAccountName(event.target.value);
                        }}
                        size='small'
                    />
                </FormControl>
                <FormControl sx={{ m: 1, width: 300 }}>
                    <InputLabel id="account-type-label" size='small'>Account Type</InputLabel>
                    <Select
                        labelId="account-type-label"
                        id="account-type"
                        value={accountType}
                        onChange={(event) => {
                            setAccountType(event.target.value);
                        }}
                        input={<OutlinedInput label="Account Type" size='small' />}
                        size='small'
                    >
                        {accountTypes.map((accountType) => (
                            <MenuItem
                                key={accountType}
                                value={accountType}
                            // style={getStyles(name, personName, theme)}
                            >
                                {accountType}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                <Button variant="contained" fullWidth onClick={handleSubmit}>Submit</Button>
            </Box>
        </Box>
    );
}

export default AccountForm;
