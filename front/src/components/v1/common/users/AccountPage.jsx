import React, { useState } from 'react';
import { Button, TextField, Container, Typography, Snackbar } from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import axios from 'axios';
import { addBroker } from '../api';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function AccountPage() {
  const [formData, setFormData] = useState({
    client_id: '',
    broker_id: '',
  });

  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // You should replace 'your-api-endpoint' with the actual endpoint for inserting data.
      const response = await addBroker(formData);

      if (response.status === 200) {
        setSnackbarSeverity('success');
        setSnackbarMessage('Data inserted successfully');
      } else {
        setSnackbarSeverity('error');
        setSnackbarMessage('Error inserting data');
      }
    } catch (error) {
      setSnackbarSeverity('error');
      setSnackbarMessage('Error inserting data');
    }

    setOpenSnackbar(true);
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpenSnackbar(false);
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '50px' }}>
      <Typography variant="h4" gutterBottom>
        Trading Account Form
      </Typography>
      <form onSubmit={handleSubmit}>
        {/* <TextField
          fullWidth
          label="User ID"
          name="user_id"
          value={formData.user_id}
          onChange={handleInputChange}
          margin="normal"
          required
        /> */}
        <TextField
          fullWidth
          label="Client ID"
          name="client_id"
          value={formData.client_id}
          onChange={handleInputChange}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Broker ID"
          name="broker_id"
          value={formData.broker_id}
          onChange={handleInputChange}
          margin="normal"
          required
        />
        <Button type="submit" variant="contained" color="primary" style={{ marginTop: '20px' }}>
          Submit
        </Button>
      </form>
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default AccountPage;
