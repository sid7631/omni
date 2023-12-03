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
// import DialogUpload from '../DialogUpload';


export default function RecommendationsCard(props) {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Card sx={{ minWidth: 260, position: 'relative' }}>
      <CardContent sx={{ pb: theme.spacing(1) }}>
        

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>

            <Chip variant='outlined' color="info" size="small" sx={{ fontSize: 10, }} label={props.duration} />
            <Chip variant="outlined" color="info" size="small" sx={{ fontSize: 12, ml: theme.spacing(1) }} label={moment(props.recommendation_date).fromNow()} />
          </Box>

          <Typography variant="body2" sx={{ fontSize: 12, display: 'flex', flexDirection: 'column', ml: theme.spacing(1) }}>
            SO FAR
            {plMarker(formatAmount((props.ltp - props.buy_price) / props.buy_price * 100), true,)}
          </Typography>
          {/* <Typography>
            {formatAmount(props.profit_loss_pct)}
          </Typography> */}
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: theme.spacing(1) }}>
          <Box >
            <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center', }}>

              <Typography variant="button" sx={{ fontSize: 14 }} >
                {props.symbol}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Typography variant="body2" sx={{ fontSize: 12 }} component="div">
                &#8377;{formatAmount(props.ltp)}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: 12, display: 'flex', ml: theme.spacing(1) }} component="div">
                {plMarker(formatAmount(props.ltp - props.previous_close))}
              </Typography>
              <Typography variant="body2" sx={{ fontSize: 12, display: 'flex' }} component="div">
                ( {plMarker(formatAmount((props.ltp - props.previous_close) / props.previous_close * 100), true)})
              </Typography>
            </Box>
          </Box>

        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: theme.spacing(1) }}>
          <Typography variant="body2" sx={{ fontSize: 14 }}>
            Entry at
            <Typography variant='body2' sx={{ fontSize: 12 }}>
              &#8377;{formatAmount(props.buy_price)}
            </Typography>
          </Typography>
          <Typography variant="body2" sx={{ fontSize: 14 }}>
            Target
            <Typography sx={{ fontSize: 12 }}>
              &#8377;{formatAmount(props.target_price)}
            </Typography>
          </Typography>
        </Box>
      </CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', px: theme.spacing(2), backgroundColor: '#c3e5fe80' }}>
        <Typography variant="button" sx={{ display: 'flex', fontSize: 12 }}>
          Potential left: {plMarker(formatAmount((props.target_price - props.ltp) / props.ltp * 100), true)}
        </Typography>
      </Box>
      <CardActions>
        <Button size="small" onClick={() => {
          console.log('props')
        }}>Details</Button>
        {/* <DialogUpload bank={props.bank} account={props.account} /> */}
        {/* <Button size="small" onClick={() => {
          console.log('props')
        }}>ADD</Button> */}
        <RecommendationsAddTrades {...props} />

      </CardActions>
    </Card>
  );
}

