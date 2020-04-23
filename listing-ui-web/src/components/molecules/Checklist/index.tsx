import React, { FC } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import { Theme } from '@material-ui/core';
import makeStyles from '@material-ui/styles/makeStyles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from 'shared/components/molecules/Checkbox';
import InputText from 'shared/components/molecules/InputText';
import { useFormikContext } from 'formik';
import { CreateListing } from '../../organisms/CreateListingForm/types';

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    textTransform: 'uppercase'
  }
}));

const Checklist: FC = () => {
  const { title } = useStyles({});
  const { values } = useFormikContext<CreateListing>();
  return (
    <Card>
      <CardHeader title="Checklist" className={title} />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <FormControlLabel
              label="I confirm I have seen photo ID and a current utility bill for the customer"
              control={
                <Checkbox
                  required
                  name="listingDetails.compliance.confirmedId"
                />
              }
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              label="Advanced marketing pack sent to customer"
              control={
                <Checkbox
                  required
                  name="listingDetails.sentAdvancedMarketingPack"
                />
              }
            />
          </Grid>
          <Grid item xs={12}>
            <FormControlLabel
              label="Agent has keys for property"
              control={
                <Checkbox required name="listingDetails.agencyHasKeys" />
              }
            />
          </Grid>
          {values.listingDetails.agencyHasKeys && (
            <Grid item xs={4} sm={6} md={6}>
              <InputText
                fullWidth
                label="Reference number for keys (if any)"
                name="listingDetails.agencyKeysRef"
                placeholder="12345456"
                InputLabelProps={{
                  shrink: true
                }}
              />
            </Grid>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

export default Checklist;
