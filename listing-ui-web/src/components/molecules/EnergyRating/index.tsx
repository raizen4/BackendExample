import React from 'react';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert';
import { useFormikContext } from 'formik';

import InputText from 'shared/components/molecules/InputText';
import { CreateListing } from '../../organisms/CreateListingForm/types';
import { IEnergyRatingProps } from './types';

const useStyles = makeStyles((theme: Theme) => ({
  ratingLabel: {
    textTransform: 'uppercase',
    fontWeight: theme.typography.fontWeightBold
  },
  warningMessagePadding: {
    paddingTop: theme.spacing(5)
  },
  container: {
    padding: '30px'
  }
}));

function EnergyRating({ reportType }: IEnergyRatingProps) {
  const classes = useStyles({});
  const { values } = useFormikContext<CreateListing>();

  if (reportType !== 'epc' && reportType !== 'homeReport') {
    return null;
  }

  const report = values.propertyDetails[reportType];

  if (!report) {
    return null;
  }

  const showWarning =
    report.eer.current > report.eer.potential ||
    report.eir.current > report.eir.potential;

  return (
    <Grid
      container
      spacing={3}
      className={classes.container}
      data-testid="energy-ratings"
    >
      <Grid item sm={12} md={6} lg={4}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" className={classes.ratingLabel}>
              Energy efficiency rating
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputText
              fullWidth
              type="number"
              name={`propertyDetails.${reportType}.eer.current`}
              label="Current"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputText
              fullWidth
              type="number"
              name={`propertyDetails.${reportType}.eer.potential`}
              label="Potential"
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid item sm={12} md={6} lg={4}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" className={classes.ratingLabel}>
              Environmental impact rating
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputText
              fullWidth
              type="number"
              name={`propertyDetails.${reportType}.eir.current`}
              label="Current"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputText
              fullWidth
              type="number"
              name={`propertyDetails.${reportType}.eir.potential`}
              label="Potential"
            />
          </Grid>
        </Grid>
      </Grid>
      <Grid className={classes.warningMessagePadding} item xs={12}>
        {showWarning && (
          <Alert severity="warning">
            Current rating should not be greater than potential rating
          </Alert>
        )}
      </Grid>
    </Grid>
  );
}

export default EnergyRating;
