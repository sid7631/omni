import logo from './logo.svg';
import { createTheme, ThemeProvider } from '@mui/material/styles'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css';
import { LoadingIndicatorGlobal } from './components/common/LoadingIndicator';
import { LoadingProvider } from './components/common/loading/Loading';
import { Box, CssBaseline } from '@mui/material';
import Header from './components/common/Header';
import { useState } from 'react';
import GlobalAlert from './components/common/GlobalAlert';
import { AlertProvider } from './components/common/AlertContext';
import Toolbar from '@mui/material/Toolbar';
import React from 'react';
import SidebarStocks from './components/common/sidebars/SidebarStocks';
import Home from './components/home/Home';
import AccountForm from './components/account/AccountForm';
import AccountDashboard from './components/account/AccountDashboard';
import ViewAccount from './components/account/ViewAccount';

const theme = createTheme({
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      'sans-serif'
    ].join(','),
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        colorPrimary: {
          backgroundColor: "white",
          color: "black",
        }
      }
    }
  }
});

function App() {

  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <AlertProvider>
        <LoadingProvider>
          <LoadingIndicatorGlobal />
          <Box sx={{
            display: 'flex',
            backgroundColor: '#f6f7f9',
            minHeight: '100vh'
          }}>
            <CssBaseline />
            <Header open={open} handleDrawerOpen={handleDrawerOpen} />
            <GlobalAlert />
            <SidebarStocks open={open} handleDrawerClose={handleDrawerClose} />
            <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
              <Toolbar />
              <Router>
                <Routes>
                  <Route exact path='/' element={<Home />} />
                  <Route exact path='/account' element={<AccountDashboard />} >
                    <Route path='/account/create' element={<AccountForm />} />
                    <Route path='/account/view' element={<ViewAccount />} />
                  </Route>
                </Routes>
              </Router>
            </Box>
          </Box>
        </LoadingProvider>
      </AlertProvider>
    </ThemeProvider>
  );
}

export default App;
