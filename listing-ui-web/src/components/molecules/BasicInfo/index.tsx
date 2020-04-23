import React, { FC, ChangeEvent } from 'react';
import { useFormikContext } from 'formik';
import Card from '@material-ui/core/Card';

import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import MenuItem from '@material-ui/core/MenuItem';
import TextField from '@material-ui/core/TextField';

import InputText from 'shared/components/molecules/InputText';

import { PropertyStyles } from '../../../data/PropertyStyles';
import { PropertyTypes } from '../../../data/PropertyTypes';
import { CreateListing } from '../../organisms/CreateListingForm/types';

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    textTransform: 'uppercase'
  }
}));

const Bedrooms = [0, 1, 2, 3, 4];

const BasicInfo: FC = () => {
  const { title } = useStyles();
  const { values, setFieldValue } = useFormikContext<CreateListing>();

  const handleNewBuildChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldValue('propertyDetails.newBuild', e.target.value === 'Yes');
  };

  return (
    <Card>
      <CardHeader title="Basic Property Info" className={title} />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <InputText
              label="Type"
              name="propertyDetails.propertyType"
              fullWidth
              select
              variant="outlined"
            >
              {PropertyTypes.map(type => {
                const key = Object.keys(type)[0];
                return (
                  <MenuItem key={key} value={key}>
                    {type[key]}
                  </MenuItem>
                );
              })}
            </InputText>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <InputText
              label="Style"
              name="propertyDetails.propertyStyle"
              fullWidth
              select
              variant="outlined"
            >
              {PropertyStyles.map(style => {
                const key = Object.keys(style)[0];
                return (
                  <MenuItem key={key} value={key}>
                    {style[key]}
                  </MenuItem>
                );
              })}
            </InputText>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <InputText
              label="Bedrooms"
              name="propertyDetails.bedroomTotal"
              fullWidth
              select
              variant="outlined"
            >
              {Bedrooms.map(room => (
                <MenuItem key={room} value={room}>
                  {room}
                </MenuItem>
              ))}
            </InputText>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              id="new-build-field"
              label="New build?"
              value={values.propertyDetails.newBuild ? 'Yes' : 'No'}
              onChange={handleNewBuildChange}
              variant="outlined"
              fullWidth
              select
            >
              <MenuItem value="No">No</MenuItem>
              <MenuItem value="Yes">Yes</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default BasicInfo;
