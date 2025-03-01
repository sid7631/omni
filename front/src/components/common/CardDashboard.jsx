import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import { useNavigate } from "react-router-dom";

const CardDashboard = (props) => {
    let navigate = useNavigate();

    return (
        <Card sx={{ minWidth: 220 }}>
            <CardContent>
                <Typography sx={{ fontSize: 14 }} color="text.secondary" gutterBottom>
                    {props.meta}
                </Typography>
                <Typography variant="h5" component="div">
                    {props.title}
                </Typography>
                <Typography variant="body2">
                    {props.description}
                    <br />
                </Typography>
            </CardContent>
            <CardActions>
                <Button size="small" onClick={() => {
                    navigate(props.route);
                }}>Learn More</Button>
            </CardActions>
        </Card>
    );
};

export default CardDashboard;
