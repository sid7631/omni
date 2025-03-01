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
import DialogUpload from './DialogUpload';

const bank_route = '/finance/bankaccounts/details'

export default function BankAccountCard(props) {
  const navigate = useNavigate();
  const theme = useTheme();

  return (
    <Card sx={{ minWidth: 220, position: 'relative' }}>
      <CardContent>
        <Box sx={{ position: 'absolute', right: theme.spacing(2), top: theme.spacing(2) }}>
          <Avatar variant='square' alt="Remy Sharp" src={require(`../assets/logos/${props.bank}.png`)} />
        </Box>
        <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
          {props.title}
        </Typography>
        <Typography variant="h7" component="div">
          {props.bank}
        </Typography>

        <Typography variant="body2">
          {props.account}
          <br />
        </Typography>
        <Typography variant="body2" color="text.secondary">
          &#8377; {props.amount}
        </Typography>
      </CardContent>
      <CardActions>
        <Button size="small" onClick={() => {
          navigate(`${bank_route}:${props.account}`);
        }}>Details</Button>
        <DialogUpload bank={props.bank} account={props.account} />
      </CardActions>
    </Card>
  );
}

