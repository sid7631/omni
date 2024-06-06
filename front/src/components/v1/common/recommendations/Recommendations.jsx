import React, { useEffect, useState } from 'react'
import { Box, Grid, Typography } from '@mui/material'

import BankAccountCard from '../BankAccountCard'
import BankAccountAdd from '../BankAccountAdd'
import RecommendationsCard from './RecommendationsCard'
import RecommendationsAdd from './RecommendationsAdd'
import { getRecommendations } from '../api'
import { useUser } from '../UserContext'
import { useLoading } from '../loading/Loading'

const recommendations = [{
    buy_price: 160,
    isin :'',
    recommendation_date: '2023-11-28',
    target : 175,
    sector :'',
    symbol: 'WELSPUNIND',
    duration : 'short',
    potential_pl: 10.9,
    ltp:157.55,
    ltp_change:-3.35,
    ltp_change_prct:-2.08,
    is_active: true,
},
{
    buy_price: 6332.95,
    isin :'',
    recommendation_date: '2023-11-06',
    target :6800,
    sector :'',
    symbol: 'GILLETTE',
    duration : 'short',
    potential_pl: 7.04,
    ltp:6350.75,
    ltp_change:-12.6,
    ltp_change_prct:-0.20,
    is_active: true,
},]

const Recommendations = () => {

    const [recommendations, setRecommendations] = useState([])
    const [key, setKey] = useState(0)

    const {  setLoading } = useLoading();

    useEffect(() => {
      const fetchData = async () => {
        setLoading(true)
        // first
        try {
            const response = await getRecommendations()
            if (response.status === 200) {
                setRecommendations(response.data)
                setLoading(false)
            }
        } catch (error) {
          console.error(error);
          setLoading(false)
        }
      }

      fetchData()
    
      return () => {
        // setRecommendations([])
      }
    }, [key])


    const updateKey = () => {
        setKey(key + 1)
    }
    

    return (
        <Box>
            {/* <Box>

                <Typography variant='h6' gutterBottom>
                    Recommendations
                </Typography>
            </Box> */}
           


            <Grid 
                
                container
                spacing={{ xs: 2, sm: 2, md: 2, lg: 3 }}
                columns={{ xs: 4, sm: 8, md: 8, lg: 8 }}
            >
                {recommendations.map((item, index) => (
                    <Grid item xs={4} sm={4} md={2} lg={2} key={index}>
                        <RecommendationsCard {...item} />
                    </Grid>
                ))}
                {/* <br />
                {recommendations.map((item, index) => (
                    <Grid item xs={4} sm={4} md={2} lg={2} key={index}>
                        <RecommendationsCard {...item} />
                    </Grid>
                ))} */}
                <Grid item xs={4} sm={4} md={2} lg={2} key={key}>
                    <RecommendationsAdd  updateKey={updateKey} />
                </Grid>
            </Grid>

        </Box>
    )
}

export default Recommendations