import React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import CardDashboard from '../common/CardDashboard';
import { makeStyles } from '@mui/styles';

// import financeImage from '../assets/finance.png'

const useStyles = makeStyles(theme => ({
  finance: {
    // backgroundColor: 'red',
    // color: (props) => props.color,
    background: '#4e54c8',
    background: 'linear-gradient(to left, #8f94fb, #4e54c8)',
    width: '100%',
    // height: '600px',
    padding: theme.spacing(2),
    position: 'relative'

  },
}));

const dashboard_cards = [
  {
    title: 'Finance',
    description: 'Track your investment ',
    meta: 'Track Your Finance',
    route: '/finance'
  },
  {
    title: 'Personal',
    description: 'Track your Personal items',
    meta: 'Track Your Finance',
    route: '/finance/dashboard'
  },
  {
    title: 'Others',
    description: 'Track your Others items',
    meta: 'Track Your Finance',
    route: '/finance/dashboard'
  }
]

const Home = () => {
  const classes = useStyles();

  return (
    <>
      <Grid container spacing={{ xs: 2, sm: 2, md: 2, lg: 3 }} columns={{ xs: 4, sm: 8, md: 12, lg: 12 }}>
        {dashboard_cards.map((item, index) => (
          <Grid item xs={4} sm={4} md={2} lg={2} key={index}>
            <CardDashboard {...item} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default Home;
