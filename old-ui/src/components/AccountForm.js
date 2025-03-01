// src/components/AccountForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { API_URLS } from '../../../config/config';  // Adjust the path as necessary

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
        <form onSubmit={handleSubmit}>
            <div>
                <label>
                    Account Name:
                    <input
                        type="text"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        required
                    />
                </label>
            </div>
            <div>
                <label>
                    Account Type:
                    <select
                        value={accountType}
                        onChange={(e) => setAccountType(e.target.value)}
                        required
                    >
                        <option value="">Select Account Type</option>
                        <option value="Savings">Savings</option>
                        <option value="Checking">Checking</option>
                        <option value="Investment">Investment</option>
                        <option value="Retirement">Retirement</option>
                    </select>
                </label>
            </div>
            <div>
                <button type="submit">Create Account</button>
            </div>
        </form>
    );
}

export default AccountForm;
