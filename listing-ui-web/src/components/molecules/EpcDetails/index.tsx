import React, { FC } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import Radio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import { useFormikContext } from 'formik';

import Checkbox from 'shared/components/molecules/Checkbox';
import { RadioGroup } from 'shared/components/molecules/RadioGroup';
import { CreateListing } from '../../organisms/CreateListingForm/types';
import EnergyRating from '../EnergyRating';
import UploadComponent from '../../organisms/UploadComponent';

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    textTransform: 'uppercase'
  },
  viewingOption: {
    textTransform: 'capitalize'
  },
  radioGroupRoot: {
    flexDirection: 'row'
  },
  radioGroupTypographyStyle: {
    padding: theme.spacing(1)
  }
}));

const EpcDetails: FC = () => {
  const classes = useStyles({});
  const { values } = useFormikContext<CreateListing>();

  return (
    <Card>
      <CardHeader title="EPC" className={classes.title} />
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography className={classes.radioGroupTypographyStyle}>
                  Please choose one of the options below
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <FormControl component="fieldset">
                  <RadioGroup
                    aria-label="EPC status selector"
                    name="propertyDetails.epc.status"
                    row
                  >
                    <FormControlLabel
                      value="Received"
                      control={<Radio color="primary" />}
                      label="EPC received"
                      labelPlacement="start"
                    />
                    <FormControlLabel
                      value="Applied"
                      control={<Radio color="primary" />}
                      label="EPC applied for"
                      labelPlacement="start"
                    />
                    <FormControlLabel
                      value="None"
                      control={<Radio color="primary" />}
                      label="EPC not yet applied for"
                      labelPlacement="start"
                    />
                  </RadioGroup>
                </FormControl>
              </Grid>
            </Grid>
            {values.propertyDetails.epc.status === 'Received' && (
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <FormControlLabel
                    label="The EPC is in date and valid"
                    control={<Checkbox name="propertyDetails.epc.isValid" />}
                  />
                </Grid>
                <EnergyRating reportType="epc" />
                <Grid item xs={12}>
                  <UploadComponent
                    isImageUpload={false}
                    name="EPC REPORT"
                    multipleFiles={false}
                    fileTypes={['application/pdf']}
                    fieldName="propertyDetails.epc.files"
                    showPreview={false}
                  />
                </Grid>
              </Grid>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default EpcDetails;
