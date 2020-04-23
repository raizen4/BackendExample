import React, { FC } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import MenuItem from '@material-ui/core/MenuItem';
import { useFormikContext, getIn } from 'formik';

import { CreateListing } from '../../organisms/CreateListingForm/types';
import { RadioGroup } from 'shared/components/molecules/RadioGroup';
import InputText from 'shared/components/molecules/InputText';
import EnergyRating from '../EnergyRating';
import UploadComponent from '../../organisms/UploadComponent';
import { ExemptionReasons } from '../../../data/ExemptionReasons';
import { IHomeReport } from '../../../types/PropertyCard';

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

const HomeReport: FC = () => {
  const classes = useStyles({});
  const { values } = useFormikContext<CreateListing>();
  return (
    <Card>
      <CardHeader title="Home Report" className={classes.title} />
      <CardContent>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Grid item xs={12}>
              <Typography className={classes.radioGroupTypographyStyle}>
                Please choose one of the options below
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="Home report status selector"
                  name="propertyDetails.homeReport.status"
                  row
                >
                  <FormControlLabel
                    value="None"
                    control={<Radio color="primary" />}
                    label="Home report not received"
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    value="Received"
                    control={<Radio color="primary" />}
                    label="Home report received"
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    value="Exempt"
                    control={<Radio color="primary" />}
                    label="Property exempt from home report"
                    labelPlacement="start"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
            {values.propertyDetails.homeReport.status === 'Exempt' && (
              <Grid item xs={6}>
                <InputText
                  label="Exemption reason"
                  name="propertyDetails.homeReport.exemptionReason"
                  fullWidth
                  select
                  variant="outlined"
                >
                  {ExemptionReasons.map(reason => {
                    const key = Object.keys(reason)[0];
                    return (
                      <MenuItem key={key} value={key}>
                        {reason[key]}
                      </MenuItem>
                    );
                  })}
                </InputText>
              </Grid>
            )}
          </Grid>
          {values.propertyDetails.homeReport.status === 'Received' && (
            <>
              <EnergyRating reportType="homeReport" />
              <Grid item xs={12}>
                <UploadComponent
                  isImageUpload={false}
                  name="HOME REPORT"
                  multipleFiles={false}
                  fileTypes={['application/pdf']}
                  fieldName="propertyDetails.homeReport.files"
                  showPreview={false}
                />
              </Grid>
            </>
          )}
        </Grid>
      </CardContent>
    </Card>
  );
};

const WrappedHomeReport: FC = () => {
  const { values } = useFormikContext<CreateListing>();
  const homeReportData = getIn(
    values,
    'propertyDetails.homeReport'
  ) as IHomeReport;

  if (!homeReportData?.files) {
    //TODO: Display Error?
    return null;
  }

  return <HomeReport />;
};

export default WrappedHomeReport;
