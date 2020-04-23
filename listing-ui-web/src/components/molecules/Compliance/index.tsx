import React, { FC } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';
import Checkbox from 'shared/components/molecules/Checkbox';
import InputText from 'shared/components/molecules/InputText';
import Typography from '@material-ui/core/Typography';
import { useFormikContext, Field } from 'formik';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import Alert from '@material-ui/lab/Alert';
import InputAdornment from '@material-ui/core/InputAdornment';
import EventIcon from '@material-ui/icons/Event';
import format from 'date-fns/format';
import TextField from '@material-ui/core/TextField';

import { CreateListing } from '../../organisms/CreateListingForm/types';
import InputKeyboardDatePicker from '../../../../../../shared/components/molecules/KeyboardDatePicker/index';

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    textTransform: 'uppercase'
  },
  warningMessagePadding: {
    paddingTop: theme.spacing(5)
  }
}));

const Compliance: FC = () => {
  const classes = useStyles({});
  const { values } = useFormikContext<CreateListing>();

  const showContractWarning = !!values.listingDetails.compliance
    .competitorAgreementExpiry;
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      <Card>
        <CardHeader title="Compliance" className={classes.title} />
        <CardContent>
          <Grid container spacing={5}>
            <Grid item xs={12}>
              <FormControlLabel
                label="I have seen the Land Registry confirmation that confirms this customer is the owner of the property"
                control={
                  <Checkbox
                    required
                    name="listingDetails.compliance.confirmedLandRegistryOwnership"
                  />
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <InputText
                label="Link to Land Registry documents"
                name="listingDetails.compliance.landRegistryDocsUri"
                placeholder="https://landregistry.data.gov.uk/"
                fullWidth
              ></InputText>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={5}>
                <Grid item xs={12} md={4}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography>Agency Agreement Date</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        variant="outlined"
                        fullWidth
                        disabled={true}
                        label="Agreement Date"
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <EventIcon />
                            </InputAdornment>
                          )
                        }}
                        id={'agreement-period'}
                        value={`${format(
                          new Date(
                            values.listingDetails.compliance.agencyAgreementSignedDate
                          ),
                          'dd/MM/yyyy'
                        )}`}
                        placeholder="DD/MM/YYYY"
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography>Agreement Period</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        disabled={true}
                        fullWidth
                        id="Period"
                        label="Period"
                        value={`${values.listingDetails.compliance.agencyAgreementPeriod} Weeks`}
                        variant="outlined"
                      />
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} md={4}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography>Agreement Expiry Date</Typography>
                    </Grid>
                    <Grid item xs={12}>
                      <Field
                        fullWidth
                        label="Agreement Expires on"
                        format="dd/MM/yyyy"
                        id={'competitor-expiry-date'}
                        name="listingDetails.compliance.competitorAgreementExpiry"
                        component={InputKeyboardDatePicker}
                        variant="inline"
                        inputVariant="outlined"
                        placeholder="DD/MM/YYYY"
                        minDate={new Date()}
                        disablePast
                        InputAdornmentProps={{ position: 'start' }}
                      />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid className={classes.warningMessagePadding} item xs={12}>
            {showContractWarning && (
              <Alert severity="warning">
                Placeholder message for agent to warn customer of contract
                breach
              </Alert>
            )}
          </Grid>
        </CardContent>
      </Card>
    </MuiPickersUtilsProvider>
  );
};

export default Compliance;
