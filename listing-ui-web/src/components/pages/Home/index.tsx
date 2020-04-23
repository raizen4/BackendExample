import React from 'react';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import makeStyles from '@material-ui/styles/makeStyles';
import { Theme } from '@material-ui/core/styles';
import Fade from '@material-ui/core/Fade';

import Container from '@material-ui/core/Container';
import Nav from '../../organisms/Nav';
import Header from '../../organisms/Header';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => ({
  parentContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%'
  },

  mainContentContainer: {
    display: 'flex',
    flexDirection: 'column',
    transform: `translateX(${drawerWidth}px)`,
    flex: '0 0 100%',
    maxWidth: `calc(100% - ${drawerWidth}px)`
  }
}));

function Home() {
  const classes = useStyles({});

  return (
    <Fade in={true}>
      <div className={classes.parentContainer}>
        <div className={classes.mainContentContainer}>
          <Header />
          <Container
            fixed
            style={{
              marginLeft: '1rem',
              marginTop: '2rem',
              marginBottom: '2rem'
            }}
          >
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  href="/listing/create"
                >
                  Create Listing
                </Button>
              </Grid>
            </Grid>
          </Container>
        </div>
        <Nav />
      </div>
    </Fade>
  );
}

export default Home;
