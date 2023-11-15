import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import AppBar from '@mui/material/AppBar';
import CssBaseline from '@mui/material/CssBaseline';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { IconButton, Menu, MenuItem } from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Header = () => {


    const [anchorEl, setAnchorEl] = useState(null);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = (params) => {
        setAnchorEl(null);
        window.location.href = params
    };

    return (
        <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
            <Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="h6" noWrap component="div" sx={{ fontFamily: 'Arial', fontWeight: 'bold', fontSize: '1.2rem', cursor: 'pointer' }} onClick={() => window.location.href = '/'}>
                    OMNI - 
                    <Typography component="span" variant="h6" sx={{ fontStyle: 'italic' }}>

                    Your financial assistant
                    </Typography>
                </Typography>
                <IconButton
                    size="small"
                    edge="end"
                    color="inherit"
                    aria-label="user menu"
                    aria-controls="user-menu"
                    aria-haspopup="true"
                    onClick={handleMenuClick}
                >
                    <AccountCircleIcon />
                </IconButton>
                <Menu
                    id="user-menu"
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                >
                    <MenuItem onClick={() => handleMenuClose('/profile')}>Profile</MenuItem>
                    <MenuItem onClick={() => handleMenuClose('/settings')}>Settings</MenuItem>
                    <MenuItem onClick={() => handleMenuClose('/logout')}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
