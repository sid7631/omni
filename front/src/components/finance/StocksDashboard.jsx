import React from 'react'
import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import SidebarStocks from '../common/sidebars/SidebarStocks'

const StocksDashboard = () => {

  return (
    <>
    {/* <SidebarStocks /> */}
    <Box sx={{ backgroundColor: '#f6f7f9'}}>

    <Box>
        Stocks

    </Box>

    <Outlet />
    </Box>
    </>
  )
}

export default StocksDashboard