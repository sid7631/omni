import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { API_URLS } from '../../config/config';
import { useLoading } from '../common/loading/Loading';

const ViewAccount = () => {

  const {  setLoading } = useLoading();

  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    const fetchAccounts = async () => {
      setLoading(true)
      try {
        const response = await axios.get(API_URLS.viewAccount);
        setAccounts(response.data);
      } catch (error) {
        console.error('Error fetching accounts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  return (
    <div>
      <h2>All Accounts</h2>

        <table border="1">
          <thead>
            <tr>
              <th>Account ID</th>
              <th>Account Name</th>
              <th>Account Type</th>
            </tr>
          </thead>
          <tbody>
            {accounts.map((account) => (
              <tr key={account.account_id}>
                <td>{account.account_id}</td>
                <td>{account.account_name}</td>
                <td>{account.account_type}</td>
              </tr>
            ))}
          </tbody>
        </table>

    </div>
  );
};

export default ViewAccount;
