import React from 'react';
import { Link } from 'react-router-dom';
import {
  Typography,
  Grid,
  Container,
  makeStyles,
  Theme,
  Fade,
  Button
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) => ({
  wrapper: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    marginTop: '40%'
  }
}));

function Home() {
  const { wrapper } = useStyles({});

  return (
    <Fade in={true}>
      <Container maxWidth="sm">
        <div className={wrapper}>
          <Grid
            container
            justify="center"
            alignItems="center"
            direction="column"
          >
            <Typography align="center" variant="h1">
              Page 2
            </Typography>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <Button size="large" color="primary" variant="contained">
                GO to page 1
              </Button>
            </Link>
          </Grid>
        </div>
      </Container>
    </Fade>
  );
}

export default Home;
