import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Box } from '@mui/material';

export default function AccountsList(props) {
    return (
        <Box sx={{ width: '100%', maxWidth: 360, maxHeight: 400, overflow: 'auto' }}>
            <List sx={{ bgcolor: 'background.paper' }}>
            <ListItem alignItems="flex-start">
                            {/* <ListItemAvatar>
                                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                            </ListItemAvatar> */}
                            <ListItemText
                                // primary="Brunch this weekend?"
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            Account
                                        </Typography>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            Invested
                                        </Typography>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            Value
                                        </Typography>
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                { props.accounts.map((account) => (
                    <>
                        <ListItem alignItems="flex-start">
                            {/* <ListItemAvatar>
                                <Avatar alt="Remy Sharp" src="/static/images/avatar/1.jpg" />
                            </ListItemAvatar> */}
                            <ListItemText
                                primary="Brunch this weekend?"
                                secondary={
                                    <React.Fragment>
                                        <Typography
                                            sx={{ display: 'inline' }}
                                            component="span"
                                            variant="body2"
                                            color="text.primary"
                                        >
                                            Ali Connors
                                        </Typography>
                                        {" — I'll be in your neighborhood"}
                                    </React.Fragment>
                                }
                            />
                        </ListItem>
                    </>

                ))}
            </List>
        </Box>
    );
}