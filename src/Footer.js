import React from 'react';

import { Typography } from '@mui/material';


const Footer = () => {
    return(
        <div style={{position: 'fixed', width: '100%', height: '200px', top: '95%', backgroundColor: '#9f1161'}}>
            <Typography align='center' variant='body2' style={{paddingTop: '10px', fontWeight: 'bold', color: 'white'}}>
                The contents on this site are for informational purposes only and does not constitute financial, investment, or tax advice.
            </Typography>
        </div>
    )
}

export default Footer;
