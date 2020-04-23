import React, { useState, useEffect } from 'react';

import { Theme } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Fade from '@material-ui/core/Fade';

import makeStyles from '@material-ui/styles/makeStyles';
import Container from '@material-ui/core/Container';

import Nav from '../../organisms/Nav';
import Header from '../../organisms/Header';
import Breadcrumbs from '../../molecules/Breadcrumbs';
import PropertyCardList from '../../organisms/PropertyCardList';

import { IPropertyCardListView } from '../../../types/PropertyCard';
import { GetPropertyCardsByCompany } from '../../../services/PropertyCardService';

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

function PropertyCards() {
  const classes = useStyles({});
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [propertyCards, setPropertyCards] = useState<
    IPropertyCardListView[] | null
  >(null);

  useEffect(() => {
    async function getPropertyCardData() {
      try {
        setLoading(true);
        const res = await GetPropertyCardsByCompany('TEST-COMPANY-ID');

        if (res) {
          setPropertyCards(res.propertyCards);
        } else {
          console.log(`Could not load Property Cards for company`);
        }
        setLoading(false);
        setLoaded(true);
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    }
    getPropertyCardData();
  }, []);

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
              <Container className={classes.containerStyle} fixed>
                <Grid container spacing={4}>
                  <Grid item xs={12}>
                    {propertyCards && (
                      <Breadcrumbs
                        route={{
                          label: 'Properties',
                          path: '/properties'
                        }}
                        pageLabel={'Sales'}
                      />
                    )}
                  </Grid>
                </Grid>
                {propertyCards && (
                  <PropertyCardList propertyData={propertyCards} />
                )}
              </Container>
            </div>
            <Nav />
          </div>
        </Fade>
      )}
    </>
  );
}

export default PropertyCards;
