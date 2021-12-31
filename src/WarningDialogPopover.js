import React from 'react';

import { DialogActions, DialogContent, DialogContentText, Dialog, Button } from '@mui/material';

const WarningDialogPopover = (props) => {
    const { onClose, open, warning } = props;

    const handleOk = () => {
        onClose();
    }

    return (
        <div>
        <Dialog open={open} onClose={onClose} aria-labelledby="form-dialog-title">
            <div>
                <DialogContent>
                    <DialogContentText align='center'>
                        {warning}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleOk} color="primary">
                        Okay
                    </Button>
                </DialogActions>
            </div>
        </Dialog>
        </div>
    );
}

export default WarningDialogPopover;