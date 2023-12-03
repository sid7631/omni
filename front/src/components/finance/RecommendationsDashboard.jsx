import React from 'react'
import { Box, Typography } from '@mui/material'
import Recommendations from '../common/recommendations/Recommendations'

const RecommendationsDashboard = () => {
  return (
    <Box>
      <Box>
        <Typography variant='h5' gutterBottom>
          Recommendations
        </Typography>
      </Box>
      <Box>
        <Recommendations />
      </Box>
    </Box>
  )
}

export default RecommendationsDashboard