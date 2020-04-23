import React, { FC } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { IRemoveConfirmationDialog } from './IRemoveConfirmationDialog';

const RemoveConfirmationDialog: FC<IRemoveConfirmationDialog> = ({
  onClose,
  isOpen,
  removeRoom,
  roomTitle,
  roomId
}) => {
  const handleRemoveRoom = (id: string) => {
    removeRoom(id);
    onClose();
  };

  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">'WARNING'</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Are you sure you want to delete{' '}
          <i>
            <b>{roomTitle}</b>
          </i>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => handleRemoveRoom(roomId)} color="primary">
          Yes
        </Button>
        <Button onClick={onClose} color="primary">
          No
        </Button>
      </DialogActions>
    </Dialog>
  );
};
export default RemoveConfirmationDialog;
