// SettingsPage.js
import React, { useState } from 'react';
import { Container, Paper, TextField, Button, Typography, Avatar, Stack } from '@mui/material';
import { styled } from '@mui/system';
import { motion } from 'framer-motion';
import { useUser } from '../UserContext';

const StyledContainer = styled(Container)({
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

const StyledPaper = styled(Paper)({
  padding: 32,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  maxWidth: 600,
  margin: 'auto',
  boxShadow: '0px 0px 10px 0px rgba(0,0,0,0.2)',
});

const StyledAvatar = styled(Avatar)({
  width: 120,
  height: 120,
  marginBottom: 16,
});

const StyledButton = styled(Button)({
  marginTop: 16,
});

const SettingsPage = () => {

  const { user } = useUser();

  console.log(user)

  const [userData, setUserData] = useState({
    profileImage: 'https://placekitten.com/120/120', // Replace with the user's profile image URL
    fullName: 'John Doe',
    username: 'john.doe',
    email: 'john.doe@example.com',
    bio: 'Software Engineer',
  });

  const handleInputChange = (fieldName) => (e) => {
    setUserData({
      ...userData,
      [fieldName]: e.target.value,
    });
  };

  const handleSave = () => {
    // Add logic to save updated settings (e.g., make an API call)
    console.log('Settings saved:', userData);
  };

  return (
    <StyledContainer>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <StyledPaper elevation={3}>
          <StyledAvatar src={userData.profileImage} alt="Profile" />
          <Typography variant="h4" gutterBottom>
            Account Settings
          </Typography>
          <TextField
            label="Full Name"
            fullWidth
            value={userData.fullName}
            onChange={handleInputChange('fullName')}
            margin="normal"
          />
          <TextField
            label="Username"
            fullWidth
            value={userData.username}
            onChange={handleInputChange('username')}
            margin="normal"
          />
          <TextField
            label="Email"
            fullWidth
            type="email"
            value={userData.email}
            onChange={handleInputChange('email')}
            margin="normal"
          />
          <TextField
            label="Bio"
            fullWidth
            multiline
            rows={3}
            value={userData.bio}
            onChange={handleInputChange('bio')}
            margin="normal"
          />
          <Stack spacing={2} direction="row">
            <StyledButton variant="contained" color="primary" onClick={handleSave}>
              Save
            </StyledButton>
          </Stack>
        </StyledPaper>
      </motion.div>
    </StyledContainer>
  );
};

export default SettingsPage;
