import React from 'react';

import { DialogActions, DialogContent, DialogContentText, Dialog, Button, Typography } from '@mui/material';

const IntroPopover = (props) => {
    const { onClose, open } = props;

    const handleOk = () => {
        onClose();
    }

    return (
        <div>
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
            <div>
                <DialogContent style={{padding: '20px 24px 0px 24px'}}>
                    <DialogContentText align='center'>
                        <Typography>
                            <h1>Welcome to my KTY Reflections app!</h1>
                            <p>The app is meant to give you an idea of your reflections for a particular day. This is done using your public KTY address 
                            and selecting a day from the calendar. The app uses transaction data from BSC Scan to then determine your reflections. 
                            The calculations should be accurate to about a 0.8% deviation. Currently, the dates are based on UTC time.</p>  
                            <p>This is an early version of the app. I have some ideas for cool things to add to it as time allows. If you have any problems 
                            with the app, or have any suggestions for app additions, please feel free to email me at KtyReflectionsApp@gmail.com. Also, 
                            if you want to contribute to the app in anyway, you can fork the project on <a href='https://github.com/ProducePete21/kty_reflections' target='_blank' rel='noreferrer'>GitHub</a>. 
                            </p>
                            <h6 style={{marginTop: '55px', marginBottom: '10px'}}>Disclaimer: By using this app you understand that this is for informational purposes only and does not constitute financial, 
                            investment, or tax advice.</h6>
                        </Typography>
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleOk} color="primary">
                        Get on with it!
                    </Button>
                </DialogActions>
            </div>
        </Dialog>
        </div>
    );
}

export default IntroPopover;