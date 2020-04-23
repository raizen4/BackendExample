import React, { FC, ChangeEvent } from 'react';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import MenuItem from '@material-ui/core/MenuItem';
import Alert from '@material-ui/lab/Alert';
import { useFormikContext } from 'formik';

import InputText from 'shared/components/molecules/InputText';
import { CreateListing } from '../../organisms/CreateListingForm/types';
import { PriceQualifiers } from '../../../data/PriceQualifiers';
import TextField from '@material-ui/core/TextField';

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    textTransform: 'uppercase'
  },

  warningMessagePadding: {
    paddingTop: theme.spacing(5)
  }
}));

const PricingInfo: FC = () => {
  const classes = useStyles({});
  const { values, setFieldValue } = useFormikContext<CreateListing>();

  const showMarketPriceWarning =
    values.listingDetails.marketPrice < values.propertyDetails.minPrice ||
    values.listingDetails.marketPrice > values.propertyDetails.maxPrice;

  const handlePriceQualifierChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFieldValue('listingDetails.priceQualifier', e.target.value);
  };

  return (
    <Card>
      <CardHeader title="Pricing" className={classes.title} />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <InputText
              label="Min Price"
              name="propertyDetails.minPrice"
              placeholder="£ Min"
              InputLabelProps={{
                shrink: true
              }}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <InputText
              label="Max Price"
              name="propertyDetails.maxPrice"
              placeholder="£ Max"
              InputLabelProps={{
                shrink: true
              }}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <InputText
              label="Market Price"
              placeholder="£"
              name="listingDetails.marketPrice"
              InputLabelProps={{
                shrink: true
              }}
              variant="outlined"
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <TextField
              id="price-qualifier"
              label="Price Qualifier"
              aria-label="price-qualifier"
              value={
                values.listingDetails.priceQualifier
                  ? values.listingDetails.priceQualifier
                  : ''
              }
              onChange={handlePriceQualifierChange}
              variant="outlined"
              select
              fullWidth
            >
              <MenuItem value="">None</MenuItem>
              {PriceQualifiers.map(qualifier => {
                const key = Object.keys(qualifier)[0];
                return (
                  <MenuItem key={key} value={key}>
                    {qualifier[key]}
                  </MenuItem>
                );
              })}
            </TextField>
          </Grid>
          <Grid className={classes.warningMessagePadding} item xs={12}>
            {showMarketPriceWarning && (
              <Alert severity="warning">
                The market price you have entered does not fall within the
                minumum and maximum price
              </Alert>
            )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

export default PricingInfo;
