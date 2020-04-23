import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import AddIcon from '@material-ui/icons/Add';

import PropertyCard from '../../molecules/PropertyCard';
import { IPropertyCardListView } from '../../../types/PropertyCard';
import SaveForm from '../../atoms/SaveForm';

const useStyles = makeStyles((theme: Theme) => ({
  containerStyle: {
    marginTop: theme.spacing(3),
    justifyContent: 'space-between',
    display: 'flex',
    flexDirection: 'row'
  },
  saveForm: {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(2)
  }
}));

const PropertyCardList: FC<{
  propertyData: IPropertyCardListView[];
}> = props => {
  const classes = useStyles({});
  const history = useHistory();

  const actions = [
    {
      icon: <AddIcon />,
      name: 'New Property',
      enabled: true,
      onClick: () => {
        history.push('/listing/property-card/new');
      }
    }
  ];

  return (
    <Grid item xs={12}>
      <Grid container className={classes.containerStyle} spacing={2}>
        <Grid item xs={12}>
          {props.propertyData.map(
            (card: IPropertyCardListView, index: number) => {
              return (
                <PropertyCard
                  property={card}
                  key={`property-card-${index}`}
                  data-testid={`property-card-${index}`}
                />
              );
            }
          )}
        </Grid>
      </Grid>
      <SaveForm className={classes.saveForm} actions={actions} addIcon={true} />
    </Grid>
  );
};

export default PropertyCardList;
