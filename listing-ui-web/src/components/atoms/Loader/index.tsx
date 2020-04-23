import React, { FC } from 'react';
import { makeStyles, Theme, Fade, CircularProgress } from '@material-ui/core';
import { IProps } from './types';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: 'white',
    zIndex: theme.zIndex.modal
  }
}));

const Loader: FC<IProps> = ({ show }) => {
  const { root } = useStyles({});
  return (
    <Fade in={show}>
      <div className={root}>
        <CircularProgress />
      </div>
    </Fade>
  );
};

export default Loader;
