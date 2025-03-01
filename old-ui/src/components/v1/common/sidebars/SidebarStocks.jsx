import * as React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import { formatAmount } from '../utils';
import DataThresholdingIcon from '@mui/icons-material/DataThresholding';
import DataThresholdingTwoToneIcon from '@mui/icons-material/DataThresholdingTwoTone';
import DataThresholdingRoundedIcon from '@mui/icons-material/DataThresholdingRounded';
import DataThresholdingOutlinedIcon from '@mui/icons-material/DataThresholdingOutlined';


const drawerWidth = 280;

const sidebarMenuItems = [
  {
    name: 'Holdings',
    path: '/finance/holdings',
    icon: <DataThresholdingOutlinedIcon />
  },
  {
    name: 'Stocks',
    path: '/finance/stocks',
    icon: <DataThresholdingTwoToneIcon />
  },
  {
    name: 'Bank Accounts',
    path: '/finance/bankaccounts',
    icon: <DataThresholdingRoundedIcon />
  },
  {
    name: 'Settings',
    path: '/settings',
    icon: <DataThresholdingOutlinedIcon />
  },
  {
    name: 'Univest',
    path: '/finance/univest',
    icon: <MailIcon />
  }
]
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `0px`,
  [theme.breakpoints.up('sm')]: {
    width: `0px`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: theme.spacing(0, 1, 0, 2),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);



const SidebarStocks = ({ open, handleDrawerClose }) => {

  const theme = useTheme();

  return (
    <Drawer variant="permanent" open={open}>
      <DrawerHeader>
        <Typography variant="h6" noWrap component="div">
          OMNI
        </Typography>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      {/* <Divider /> */}
      <Box sx={{ px: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#d4fd58', p: 2, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
          <Typography variant='subtitle2'>
            Portfolio
          </Typography>
          <Typography variant='subtitle2' sx={{ color: '#394122' }}>
            December 21, 2023
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1c1b1b', height: 80, color: 'white', p: 2, borderBottomLeftRadius: 20, borderBottomRightRadius: 20 }}>
          <Box>
            <Typography variant='subtitle2' sx={{ color: '#ababab' }}>
              Total Invest
            </Typography>
            <Typography variant='subtitle1'>
              &#8377; {formatAmount(187885)}
            </Typography>
          </Box>
          <Box>
            <Typography variant='h6'>
              30%
            </Typography>
          </Box>

        </Box>
      </Box>

      <Box sx={{ px: 2.5, mt: 4 }}>

        <List>
          {sidebarMenuItems.map((item, index) => (
            <ListItem key={item.name} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  // px: 2.5,
                }}
                onClick={() => {
                  window.location.href = item.path
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText primary={item.name} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
}



export default SidebarStocks