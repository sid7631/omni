import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Avatar } from '@mui/material';
import { useUser } from '../UserContext';

const AccountPage = () => {

    const { user } = useUser();

    console.log(user)
    
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h6">Account</Typography>

      <Box sx={{ mt: 3 }}>
        <List>
          <ListItem>
            <Avatar alt="Mats Karlsson" src="https://cdn.dribbble.com/users/10589568/avatars/original/660a613c33599e0c6a592d7b58e617f5.png?1398224630" />
            <ListItemText primary="Mats Karlsson" secondary="Roof Technologies" />
          </ListItem>
        </List>
      </Box>

      <Box sx={{ mt: 3 }}>
        <List>
          <ListItem>
            <ListItemText primary="Edit Profile" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Settings" />
          </ListItem>
          <ListItem>
            <ListItemText primary="General" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Account" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Name" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Security and Access" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Email" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Notifications" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Subscriptions" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Phone" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Accessibility" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Monetization" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Appearance" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Fox" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Change your password" />
          </ListItem>
          <ListItem>
            <ListItemText primary="Deactivate Account" />
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default AccountPage;
