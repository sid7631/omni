import React, { useState } from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useNavigate } from "react-router-dom";
import Avatar from '@mui/material/Avatar';
import { Box } from '@mui/system';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import axios from 'axios';
import { saveRecommendations, saveRecommendationsTrades } from '../api';
import { FormControl, FormControlLabel, FormLabel, Radio, RadioGroup } from '@mui/material';
import { useLoading } from '../loading/Loading';
// import { saveBankAccount } from './api';


export default function RecommendationsAdd(props) {

    const navigate = useNavigate();
    const {  setLoading } = useLoading();

    const [open, setOpen] = useState(false);
    const [symbol, setsymbol] = useState('');
    const [buyprice, setbuyprice] = useState('');
    const [targetprice, settargetprice] = useState('');
    const [recommendationdate, setrecommendationdate] = useState('');
    const [duration, setduration] = useState('');


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);

    };

    const onSubmit = async () => {
        try {
            setLoading(true)
            const params = {
                symbol: symbol,
                buyprice: buyprice,
                targetprice: targetprice,
                recommendationdate: recommendationdate,
                duration: duration
            }
            const response = await saveRecommendations(params)
            console.log(response);
            // TODO: Handle successful response for status code 200
            if(response.status === 200) {
                handleClose();
                // navigate(0)
                setLoading(false)
                props.updateKey()
            }

        } catch (error) {
            setLoading(false)
            console.error(error);
        }
    };

    return (
        <div>
            {/* <Button variant="outlined" onClick={handleClickOpen}>
                Open form dialog
            </Button> */}
            <RecommendationsAddCard onClickEvent={handleClickOpen} />
            <Dialog open={open} onClose={handleClose}>
                <DialogTitle>Recommendation Details</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Enter Details To Stock Recommendation
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="symbol"
                        label="Symbol Name"
                        type="text"
                        fullWidth
                        variant="standard"
                        value={symbol} 
                        onChange={(event) => setsymbol(event.target.value)} 

                        sx={{mb:2}}
                    />
                    <TextField 
                        id="buyprice" 
                        label="Buy Price" 
                        variant="standard" 
                        fullWidth
                        type='number'
                        value={buyprice} 
                        onChange={(event) => setbuyprice(event.target.value)} 
                        sx={{mb:2}}
                    />
                    <TextField 
                        id="targetprice" 
                        label="Target Price" 
                        variant="standard" 
                        fullWidth
                        type='number'
                        value={targetprice} 
                        onChange={(event) => settargetprice(event.target.value)} 
                        sx={{mb:2}}
                    />
                    <TextField 
                        id="recommendationdate" 
                        label="Recommendation Date" 
                        variant="standard" 
                        fullWidth
                        type='date'
                        value={recommendationdate} 
                        onChange={(event) => setrecommendationdate(event.target.value)} 
                        sx={{mb:2}}
                    />
                    <FormControl>
                        <FormLabel id='demo-controlled-radio-buttons-group-label'>Duration</FormLabel>
                     <RadioGroup
                     row
                        aria-labelledby="demo-controlled-radio-buttons-group"
                        name="controlled-radio-buttons-group"
                        value={duration}
                        onChange={(event) => setduration(event.target.value)}
                    >
                        <FormControlLabel value="short" control={<Radio />} label="Short" />
                        <FormControlLabel value="medium" control={<Radio />} label="Medium" />
                        <FormControlLabel value="long" control={<Radio />} label="Long" />
                    </RadioGroup>
                    </FormControl>
                     {/* <TextField 
                        id="duration" 
                        label="Duration" 
                        variant="standard" 
                        fullWidth
                        type='text'
                        value={duration} 
                        onChange={(event) => setduration(event.target.value)} 
                        sx={{mb:2}}
                    /> */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Cancel</Button>
                    <Button onClick={onSubmit}>Add New</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

const RecommendationsAddCard = (props) => {
    const theme = useTheme();
    return (
        <Box component={Paper} sx={{ p: 2, cursor: 'pointer' }}>

            <Button size="small" onClick={props.onClickEvent}>Add New Recommendation</Button>
        </Box>
        // <Card sx={{ minWidth: 220, minHeight: 147, position: 'relative' }}>
        //     <CardContent sx={{ minHeight: 100 }}>
        //         <Box sx={{ position: 'absolute', right: theme.spacing(2), top: theme.spacing(2) }}>
        //             {/* <Avatar variant='square' alt="Remy Sharp"  >
        //                 <AccountBalanceIcon />
        //             </Avatar> */}
        //             <AccountBalanceIcon fontSize='large' sx={{ width: 40, height: 40 }} />
        //         </Box>
        //         <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
        //             New Recommendation
        //         </Typography>
        //     </CardContent>
        //     <CardActions>
        //         <Button size="small" onClick={props.onClickEvent}>Add New Recommendation</Button>
        //     </CardActions>
        // </Card>
    )
}


export const RecommendationsAddTrades = (props) => {


    const [open, setOpen] = useState(false);
    // const [symbol, setsymbol] = useState('');
    const [buyprice, setbuyprice] = useState(props.buy_price);
    const [quantity, setquantity] = useState('');
    const [trade_date, settrade_date] = useState('');
    const [client_id, setclient_id] = useState('');

    const {  setLoading } = useLoading();


    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);

    };

    const onSubmit = async () => {
       try {
        setLoading(true)
        const params = {
            symbol: props.symbol,
            buy_price: buyprice,
            recommendation_id: props.id,
            sell_price: 0,
            trade_date: trade_date,
            client_id: client_id,
            quantity: quantity,
            trade_type: 'buy'
        }
        const response = await saveRecommendationsTrades(params)
        console.log(response);

        // TODO: Handle successful response for status code 200

        if(response.status === 200) {
            handleClose();
            // navigate(0)
            setLoading(false)
            props.updateKey()
        }

         } catch (error) {
            setLoading(false)
            console.error(error);
        }
    };

    return (
        <Box>
        <Box>
            <Button size="small" onClick={() => {
                handleClickOpen()
            }}>ADD</Button>
        </Box>
        <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Recommendation Details</DialogTitle>
        <DialogContent>
            <DialogContentText>
                Enter Details To Stock Recommendation
            </DialogContentText>
            <TextField
                autoFocus
                margin="dense"
                id="symbol"
                label="Symbol Name"
                type="text"
                fullWidth
                variant="standard"
                value={props.symbol} 
                // onChange={(event) => setsymbol(event.target.value)} 

                sx={{mb:2}}
            />
                <TextField 
                    id="quantity" 
                    label="Quantity" 
                    variant="standard" 
                    fullWidth
                    type='number'
                    value={quantity} 
                    onChange={(event) => setquantity(event.target.value)} 
                    sx={{mb:2}}
                />
            <TextField 
                id="buyprice" 
                label="Buy Price" 
                variant="standard" 
                fullWidth
                type='number'
                value={buyprice} 
                onChange={(event) => setbuyprice(event.target.value)} 
                sx={{mb:2}}
            />
            <TextField 
                id="trade_date" 
                label="Recommendation Date" 
                variant="standard" 
                fullWidth
                type='date'
                value={trade_date} 
                onChange={(event) => settrade_date(event.target.value)} 
                sx={{mb:2}}
            />
             {/* <TextField 
                id="duration" 
                label="Duration" 
                variant="standard" 
                fullWidth
                type='text'
                value={duration} 
                onChange={(event) => setduration(event.target.value)} 
                sx={{mb:2}}
            /> */}
            <TextField
                autoFocus
                margin="dense"
                id="client_id"
                label="Client Id"
                type="text"
                fullWidth
                variant="standard"
                value={client_id} 
                onChange={(event) => setclient_id(event.target.value)} 

                sx={{mb:2}}
            />
            
        </DialogContent>
        <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button onClick={onSubmit}>Add New</Button>
        </DialogActions>
    </Dialog>
    </Box>
    )
}

// export const RecommendationsAddTradesCard = () => {
//     return (
//         <Button size="small" onClick={() => {
//             console.log('props')
//           }}>ADD</Button>
//     )
// }