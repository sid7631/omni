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


const theme = createTheme();

function App() {
  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Header />
        {/* <Sidebar /> */}
        <Box component="main" sx={{ flexGrow: 1, p: 4 }}>
          <Toolbar />
          <Router>
            <Routes>
              <Route exact path="/" element={<Home />} />
              <Route exact path="/finance/holdings" element={<Holdings />} />
              <Route exact path="/finance" element={<FinanceDashboard />} />
              <Route exact path="/finance/bankaccounts" element={<BankAccounts />} >
                <Route
                  path="/finance/bankaccounts/details:account"
                  element={<BankAccountDetails />}
                />
              </Route>
            </Routes>
          </Router>
        </Box>

      </Box>
    </ThemeProvider>
  );
}

export default App;
