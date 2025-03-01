import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useNavigate } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
// import hdfc_icon from '../assets/logos/hdfc.png'
import { Box } from '@mui/system';
import { formatAmount, plMarker } from '../utils';
import { Chip } from '@mui/material';
import moment from 'moment';
import { RecommendationsAddTrades } from './RecommendationsAdd';
import StockChart from '../charts/StockChart';
// import DialogUpload from '../DialogUpload';


export default function RecommendationsCard(props) {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Card sx={{ minWidth: 220,position: 'relative' }}>
        <Box sx={{ height: '200px'}}>
          <StockChart stockData={props.chart} title={props.symbol} ltp={props.ltp} previous_close={props.previous_close} buy_price={props.buy_price} target_price={props.target_price} />
        </Box>
      <CardContent sx={{ pb: theme.spacing(1) }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="subtitle1" sx={{ display: 'flex', flexDirection: 'column', color:'#ACC57F !important' }}>
            {plMarker(formatAmount((props.ltp - props.buy_price) / props.buy_price * 100), true,)}
            <Typography sx={{fontSize: 12, color:'#7f7f7f'}}>
              SO FAR
            </Typography>
          </Typography>
            <Typography variant='subtitle1' sx={{ display: 'flex', flexDirection: 'column', color:'#ACC57F !important' }}>
              {formatAmount(props.buy_price)}
              <Typography component='span' sx={{fontSize: 12, color:'#7f7f7f'}}>
              ENTRY: 
              </Typography>
            </Typography>
           
          <Typography variant='subtitle1' sx={{ display: 'flex', flexDirection: 'column', color:'#ACC57F !important' }}>
              {formatAmount(props.target_price)}
              <Typography component='span' sx={{fontSize: 12, color:'#7f7f7f'}}>
              TARGET: 

              </Typography>
            </Typography>
          <Box>
            <Typography sx={{fontSize: 12, color:'#7f7f7f'}}>
              {moment(props.recommendation_date).fromNow()}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

