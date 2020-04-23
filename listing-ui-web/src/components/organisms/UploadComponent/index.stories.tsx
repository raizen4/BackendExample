import React from 'react';
import base from 'paths.macro';
import { Grid } from '@material-ui/core';
import { getStoryTitle } from 'shared/utils/getStoryTitle';
import UploadComponent from './index';
import { Formik } from 'formik';
import { ListingAsset } from '../CreateListingForm/types';

const title = getStoryTitle(base, 'Listing UI');

const initValues = {
  listingDetails: {
    images: [] as ListingAsset[]
  }
};

const Decorator = storyFn => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={12}>
        <Formik initialValues={initValues} onSubmit={() => {}}>
          {storyFn()}
        </Formik>
      </Grid>
    </Grid>
  );
};

export default { title, decorators: [Decorator] };

export const standard = () => (
  <UploadComponent
    isImageUpload={false}
    name="IMAGES"
    multipleFiles
    fileTypes={['image/jpeg', 'image/jpg', 'image/png']}
    fieldName="listingDetails.images"
    showPreview
  />
);
