import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';

import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/styles/makeStyles';
import Container from '@material-ui/core/Container';

import AutoSaveRender from '../../../atoms/AutoSaveRender';
import Nav from '../../../organisms/Nav';
import Header from '../../../organisms/Header';
import Breadcrumbs from '../../../molecules/Breadcrumbs';
import CreateListingForm from '../../../organisms/CreateListingForm';
import { IListing } from '../../../../types/Listing';
import { GetListingById } from '../../../../services/ListingService';
import { GetFormattedAddress } from '../../../../services/PropertyCardService';

const drawerWidth = 240;

const useStyles = makeStyles((theme: Theme) => ({
  parentContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%'
  },

  containerStyle: {
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
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [listing, setListing] = useState<IListing | null>(null);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(new Date());
  const { id } = useParams();
  useEffect(() => {
    async function getListingData() {
      try {
        setLoading(true);
        const res = await GetListingById(id);
        if (res) {
          setListing(res);
        } else {
          console.log(`Could not load Id: ${id}`);
        }
        setLoading(false);
        setLoaded(true);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
    getListingData();
  }, [id]);

  return (
    <>
      {loading && (
        <div>
          <h1>loading</h1>
        </div>
      )}
      {!loading && loaded && (
        <Fade in={true}>
          <div className={classes.parentContainer}>
            <div className={classes.mainContentContainer}>
              <Header />
              <AutoSaveRender saving={saving} lastSaved={lastSaved} />
              <Container className={classes.containerStyle} fixed>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    {listing && (
                      <Breadcrumbs
                        route={{
                          label: 'test name',
                          path: '/listing'
                        }}
                        pageLabel={'Create a draft property listing'}
                      />
                    )}
                  </Grid>
                </Grid>
                <Grid container spacing={4} alignItems="center">
                  <Grid item xs={9}>
                    {listing && (
                      <h2>
                        {GetFormattedAddress(listing.propertyDetails.address)}
                      </h2>
                    )}
                  </Grid>

                  <Grid item xs={3}>
                    <Button href="/listing">Cancel listing</Button>
                  </Grid>
                </Grid>
                <CreateListingForm
                  listing={listing}
                  setSaving={setSaving}
                  setLastSaved={setLastSaved}
                />
              </Container>
            </div>
            <Nav />
          </div>
        </Fade>
      )}
    </>
  );
}

export default Home;
