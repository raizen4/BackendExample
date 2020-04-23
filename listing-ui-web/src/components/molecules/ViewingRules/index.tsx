import React, { FC, ChangeEvent } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import MenuItem from '@material-ui/core/MenuItem';
import RadioGroup from '@material-ui/core/RadioGroup';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import { useFormikContext } from 'formik';

import InputText from 'shared/components/molecules/InputText';
import { CreateListing } from '../../organisms/CreateListingForm/types';

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    textTransform: 'uppercase'
  },
  viewingOption: {
    textTransform: 'capitalize'
  },
  radioGroupRoot: {
    'flex-direction': 'row'
  },
  radioGroupTypograpghyStyle: {
    padding: theme.spacing(1)
  }
}));

const viewingOptions = ['accompanied', 'combined', 'unaccompanied'];

const ViewingOptions: FC = () => {
  const classes = useStyles({});
  const { values, setFieldValue } = useFormikContext<CreateListing>();

  function handleViewingTypeChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.value === 'unaccompanied') {
      setFieldValue('listingDetails.viewingRules.autoConfirm', false);
    }
    setFieldValue('listingDetails.viewingRules.type', e.target.value);
  }

  const handleAutoConfirmChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldValue(
      'listingDetails.viewingRules.autoConfirm',
      e.target.value === 'Yes'
    );
  };

  return (
    <Card>
      <CardHeader title="Viewing Rules" className={classes.title} />
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={4}>
                <Typography className={classes.radioGroupTypograpghyStyle}>
                  Same day viewing appointments allowed
                </Typography>
              </Grid>

              <Grid item xs={12} md={2}>
                <RadioGroup
                  aria-label="same-day-confirmation-radio-group"
                  value={
                    values.listingDetails.viewingRules.sameDay === true
                      ? 'Yes'
                      : 'No'
                  }
                  row
                  onChange={(ev, value) => {
                    setFieldValue(
                      'listingDetails.viewingRules.sameDay',
                      value === 'Yes'
                    );
                  }}
                >
                  <FormControlLabel
                    value="Yes"
                    control={<Radio color="primary" />}
                    label="Yes"
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    value="No"
                    control={<Radio color="primary" />}
                    label="No"
                    labelPlacement="start"
                  />
                </RadioGroup>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} md={6}>
            <InputText
              className={classes.viewingOption}
              label="Type of viewing appointments"
              name="listingDetails.viewingRules.type"
              fullWidth
              select
              variant="outlined"
              onChange={handleViewingTypeChange}
            >
              {viewingOptions.map(opt => {
                return (
                  <MenuItem
                    className={classes.viewingOption}
                    key={opt}
                    value={opt}
                  >
                    {opt}
                  </MenuItem>
                );
              })}
            </InputText>
          </Grid>
          <Grid item xs={12}>
            <Grid container alignItems="center">
              <Grid item>Auto-confirm viewing appointments?</Grid>
              <Grid item>
                <RadioGroup
                  aria-label="Auto confirm viewing appointments"
                  name="listingDetails.viewingRules.autoConfirm"
                  classes={{
                    root: classes.radioGroupRoot
                  }}
                  value={
                    values.listingDetails.viewingRules.autoConfirm
                      ? 'Yes'
                      : 'No'
                  }
                  onChange={handleAutoConfirmChange}
                >
                  <FormControlLabel
                    value="Yes"
                    control={<Radio />}
                    label="Yes"
                    labelPlacement="start"
                    disabled={
                      values.listingDetails.viewingRules.type ===
                      'unaccompanied'
                    }
                  />
                  <FormControlLabel
                    value="No"
                    control={<Radio />}
                    label="No"
                    labelPlacement="start"
                    disabled={
                      values.listingDetails.viewingRules.type ===
                      'unaccompanied'
                    }
                  />
                </RadioGroup>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default ViewingOptions;
