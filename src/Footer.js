import React from 'react';

import { Typography } from '@mui/material';


const Footer = () => {
    return(
        <div style={{position: 'fixed', width: '100%', height: '200px', top: (window.innerWidth > 400 ? '95%' : '90%'), backgroundColor: '#9f1161'}}>
            <Typography align='center' variant='body2' style={{paddingTop: '10px', paddingLeft: (window.innerWidth > 400 ? '0px' : '10px'), width: (window.innerWidth > 400 ? '100%' : '95%'), fontWeight: 'bold', color: 'white'}}>
                The contents on this site are for informational purposes only and does not constitute financial, investment, or tax advice.
            </Typography>
        </div>
    )
}

export default Footer;
