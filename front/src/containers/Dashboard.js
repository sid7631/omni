// src/containers/Dashboard.js
import React from 'react';
import Button from '../components/common/Button';

const Dashboard = () => (
  <div>
    <h1>Dashboard</h1>
    <Button onClick={() => console.log('Clicked!')}>Click Me</Button>
  </div>
);

export default Dashboard;
