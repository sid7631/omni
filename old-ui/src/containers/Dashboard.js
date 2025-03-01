// src/containers/Dashboard.js
import React from 'react';
import Button from '../components/common/Button';
import AccountForm from '../components/AccountForm';

const Dashboard = () => (
  <div>
    <h1>Dashboard</h1>
    <AccountForm></AccountForm>
    <Button onClick={() => console.log('Clicked!')}>Click Me</Button>
  </div>
);

export default Dashboard;
