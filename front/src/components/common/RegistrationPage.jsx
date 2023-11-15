// RegistrationPage.js
import React, { useState } from 'react';
import axios from 'axios';
import {
    Container,
    Typography,
    TextField,
    Button,
    Grid,
    Alert,
} from '@mui/material';
import { useAlert } from './AlertContext';
import { UserRegister } from './api';

const RegistrationPage = () => {

    const { showAlert } = useAlert();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Implement registration logic here
        try {
            const response = await UserRegister(formData);
            console.log('Registration successful:', response.data);
            // Handle successful registration
            // Reset form
            setFormData({
                username: '',
                email: '',
                password: '',
            })
            // Redirect to login page
            window.location.href = '/login';

        } catch (error) {
            // Handle errors
            showAlert('Registration failed. Please try again.', 'error');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Typography variant="h5" align="center" gutterBottom>
                Register
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Username"
                            variant="outlined"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Email"
                            variant="outlined"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            fullWidth
                            label="Password"
                            variant="outlined"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                </Grid>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    size="large"
                    sx={{ mt: 3 }}
                >
                    Register
                </Button>
            </form>
        </Container>
    );
};

export default RegistrationPage;
