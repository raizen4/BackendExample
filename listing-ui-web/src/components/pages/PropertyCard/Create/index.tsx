import React from 'react';
import makeStyles from '@material-ui/styles/makeStyles';
import { Theme } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import Nav from '../../../organisms/Nav';
import Header from '../../../organisms/Header';
import CreatePropertyCardForm from '../../../organisms/CreatePropertyCardForm';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => ({
  parentContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%'
  },

  gridContainerStyle: {
    marginTop: '2rem',
    marginBottom: '2rem'
  },

  mainContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: `${drawerWidth}px`,
    flex: '0 0 100%',
    maxWidth: `calc(100% - ${drawerWidth}px)`
  }
}));

function Home() {
  const classes = useStyles({});
  return (
    <>
      <Fade in={true}>
        <div className={classes.parentContainer}>
          <div className={classes.mainContentContainer}>
            <Header />
            <Container className={classes.gridContainerStyle} fixed>
              <Grid container spacing={4}>
                <Grid item xs={12}>
                  <CreatePropertyCardForm />
                </Grid>
              </Grid>
            </Container>
          </div>
          <Nav />
        </div>
      </Fade>
    </>
  );
}

export default Home;
