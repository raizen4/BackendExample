import { useFormikContext } from 'formik';
import React, { FC, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import { Grid, Theme } from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import InputText from 'shared/components/molecules/InputText';
import { GetExternalImageUrl } from '../../../../services/AssetService';
import metropixStore from '../../../../context/metropixStore';
import { CreateListing } from '../../../organisms/CreateListingForm/types';

const fieldName = 'listingDetails.floorPlan.code';
const [useMetropixStore] = metropixStore;

const useStyles = makeStyles((theme: Theme) => ({
  applyButton: {
    minWidth: 0,
    padding: theme.spacing(2, 0)
  }
}));

const MetropixCodeInput: FC = () => {
  const classes = useStyles();
  const { getFieldMeta, setFieldTouched, validateField } = useFormikContext<
    CreateListing
  >();
  const meta = getFieldMeta<string>(fieldName);
  const {
    imageUrl,
    imageLoaded,
    setImageLoaded,
    setImageUrl,
    imageFailed
  } = useMetropixStore();

  useEffect(() => {
    validateField(fieldName);
  }, [imageFailed, validateField]);

  const updateMetropixUrl = (): void => {
    const url = GetExternalImageUrl('metropix', meta.value);
    setImageUrl(url);
  };

  const handleButtonClick = (): void => {
    updateMetropixUrl();
    setFieldTouched(fieldName, true);
    setImageLoaded(false);
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={8}>
        <InputText
          name={fieldName}
          label="Metropix Floorplan Code"
          placeholder="e.g. 123456"
          variant="outlined"
          inputProps={{
            maxLength: 6
          }}
          validate={() => {
            if (imageFailed) {
              return 'Failed to load floor plan';
            }
            return undefined;
          }}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={12} md={4}>
        <Button
          className={classes.applyButton}
          onClick={handleButtonClick}
          disabled={Boolean(imageUrl) && !imageLoaded}
          variant="contained"
          color="primary"
          disableElevation
          fullWidth
        >
          Apply Code
        </Button>
      </Grid>
    </Grid>
  );
};
export default MetropixCodeInput;
