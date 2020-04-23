import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import { Theme } from '@material-ui/core/styles';
import CircularProgress from '@material-ui/core/CircularProgress';

const useStyles = makeStyles((theme: Theme) => ({
  parentContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    color: 'white',
    backgroundColor: 'grey',
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
    alignItems: 'center',
    top: '0px',
    position: 'sticky',
    zIndex: theme.zIndex.appBar
  },
  element: {
    paddingRight: theme.spacing(1),
    paddingLeft: theme.spacing(1)
  }
}));

const AutoSaveRender = ({ saving, lastSaved }) => {
  const classes = useStyles({});
  const dateOptions = {
    month: 'short',
    year: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  };
  const savedString = new Intl.DateTimeFormat('en-Us', dateOptions).format(
    lastSaved
  );

  return (
    <div className={classes.parentContainer}>
      <div className={classes.element}>Draft Mode</div>
      <div className={classes.element}>
        {saving ? (
          <div style={{ display: 'flex' }}>
            <CircularProgress size={'1rem'} style={{ color: 'white' }} />
          </div>
        ) : (
          `Last saved ${savedString}`
        )}
      </div>
    </div>
  );
};

export default AutoSaveRender;
