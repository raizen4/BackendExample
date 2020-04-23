import React, { FC, useState } from 'react';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import AddIcon from '@material-ui/icons/Add';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import CloseIcon from '@material-ui/icons/Close';

import { ISaveFormProps } from './types';

const SaveForm: FC<ISaveFormProps> = ({ className, actions, addIcon }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={className}>
      <SpeedDial
        data-testid="speed-dial"
        ariaLabel="SpeedDial tooltip example"
        icon={
          <SpeedDialIcon
            icon={addIcon ? <AddIcon /> : <MoreVertIcon />}
            openIcon={<CloseIcon />}
          />
        }
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map(({ enabled = true, ...action }) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={action.onClick}
          />
        ))}
      </SpeedDial>
    </div>
  );
};

export default SaveForm;
