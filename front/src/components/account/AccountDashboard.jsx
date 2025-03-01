import { Box, Link, Tab, Tabs } from '@mui/material'
import React from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import PersonAddIcon from '@mui/icons-material/PersonAdd';

function samePageLinkNavigation(event) {
    if (
        event.defaultPrevented ||
        event.button !== 0 || // ignore everything but left-click
        event.metaKey ||
        event.ctrlKey ||
        event.altKey ||
        event.shiftKey
    ) {
        return false;
    }
    return true;
}


const tabMapping = [
    { label: "Accounts Overview", path: "/account" },
    { label: "Create Account", path: "/account/create" },
    { label: "View Account", path: "/account/view"},
]

function LinkTab(props) {
    return (
        <Tab
            component="a"
            onClick={(event) => {
                // Routing libraries handle this, you can remove the onClick handle when using them.
                if (samePageLinkNavigation(event)) {
                    event.preventDefault();
                }
            }}
            aria-current={props.selected && 'page'}
            {...props}
        />
    );
}



const AccountDashboard = () => {

    const location = useLocation();
    const navigate = useNavigate();
  
    // Find index of current route in tabMapping, default to 0 if not found
    const defaultValue = tabMapping.findIndex((tab) => tab.path === location.pathname);
    const [value, setValue] = React.useState(defaultValue !== -1 ? defaultValue : 0);

    React.useEffect(() => {
        const newIndex = tabMapping.findIndex((tab) => tab.path === location.pathname);
        if (newIndex !== -1) setValue(newIndex);
      }, [location.pathname]);

    const handleChange = (event, newValue) => {
        // event.type can be equal to focus with selectionFollowsFocus.
        if (
            event.type !== 'click' ||
            (event.type === 'click' && samePageLinkNavigation(event))
        ) {
            setValue(newValue);
            navigate(tabMapping[newValue].path)
        }
    };

    return (
        <>
            <Box sx={{ width: '100%' }}>
                <Tabs
                    value={value}
                    onChange={handleChange}
                    aria-label="account"
                    role="navigation"
                >
                   {tabMapping.map((tab, index) => (
            <Tab key={index} label={tab.label} />
          ))}
                </Tabs>
            </Box>
            <Outlet />
        </>

    )
}

export default AccountDashboard