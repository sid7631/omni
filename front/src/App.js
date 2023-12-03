import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Holdings from './components/finance/Holdings';
import Home from './components/home/Home';
import FinanceDashboard from './components/finance/FinanceDashboard';
import Box from '@mui/material/Box';
import { CssBaseline } from '@mui/material';
import Header from './components/common/Header';
import Sidebar from './components/common/Sidebar';
import Toolbar from '@mui/material/Toolbar';
import BankAccounts from './components/finance/BankAccounts';
import BankAccountDetails from './components/finance/BankAccountDetails';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import RegistrationPage from './components/common/RegistrationPage';
import { AlertProvider } from './components/common/AlertContext';
import GlobalAlert from './components/common/GlobalAlert';
import LoginPage from './components/common/LoginPage';
import { UserProvider } from './components/common/UserContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import SettingsPage from './components/common/users/SettingsPage';
import AccountPage from './components/common/users/AccountPage';
import StocksDashboard from './components/finance/StocksDashboard';
import StockDetails from './components/common/stocks/StockDetails';
import { useTheme } from '@emotion/react';
import React from 'react';
import SidebarStocks from './components/common/sidebars/SidebarStocks';
import RecommendationsDashboard from './components/finance/RecommendationsDashboard';
import { LoadingProvider } from './components/common/loading/Loading';
import { LoadingIndicatorGlobal } from './components/common/LoadingIndicator';


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
  
  const [open, setOpen] = React.useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (
    <ThemeProvider theme={theme}>
      <AlertProvider>
        <UserProvider>
        <LoadingProvider>
        <LoadingIndicatorGlobal />
          <Box sx={{ display: 'flex' , backgroundColor: '#f6f7f9', minHeight: '100vh' }}>
            <CssBaseline />
            <Header open={open} handleDrawerOpen={handleDrawerOpen} />
            <GlobalAlert />
            <SidebarStocks open={open} handleDrawerClose={handleDrawerClose} />
            <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
              <Toolbar />
              <Router>
                <Routes>
                  <Route exact path="/" element={<ProtectedRoute element={Home} />} />
                  <Route exact path="/register" element={<RegistrationPage />} />
                  <Route exact path='/login' element={<LoginPage />} />
                  <Route exact path="/finance/holdings" element={< ProtectedRoute element={Holdings} />} />
                  <Route exact path="/finance/univest" element={<ProtectedRoute element={RecommendationsDashboard} />} />
                  <Route exact path="/finance/stocks" element={<ProtectedRoute element={StocksDashboard} />} >
                    <Route
                      path='/finance/stocks/:symbol'
                      element={<ProtectedRoute element={StockDetails} />}
                    />
                  </Route>
                  
                  <Route exact path="/finance" element={<ProtectedRoute element={FinanceDashboard} />} />
                  <Route exact path="/finance/bankaccounts" element={<ProtectedRoute element={BankAccounts} />} >
                    <Route
                      path="/finance/bankaccounts/details:account"
                      element={<ProtectedRoute element={BankAccountDetails} />}
                    />
                  </Route>
                  <Route path='/settings' element={<ProtectedRoute element={AccountPage} />} />
                </Routes>
              </Router>
            </Box>
          </Box>
          </LoadingProvider>
        </UserProvider>
      </AlertProvider>
    </ThemeProvider>
  );
}

export default App;
