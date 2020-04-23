import React, { FC, useEffect } from 'react';
import { useFormikContext } from 'formik';
import { makeStyles } from '@material-ui/core/styles';
import { CreateListing } from '../../../organisms/CreateListingForm/types';
import { GetExternalImageUrl } from '../../../../services/AssetService';
import metropixStore from '../../../../context/metropixStore';

const fieldName = 'listingDetails.floorPlan.code';

const useStyles = makeStyles(() => ({
  previewImage: {
    maxWidth: '100%'
  }
}));

const [useMetropixStore] = metropixStore;

const MetropixPreview: FC = () => {
  const classes = useStyles();
  const { getFieldMeta } = useFormikContext<CreateListing>();
  const {
    setImageLoaded,
    setImageUrl,
    imageUrl,
    setImageFailed
  } = useMetropixStore();
  const codeMeta = getFieldMeta<string>(fieldName);

  useEffect(() => {
    if (codeMeta.initialValue) {
      const url = GetExternalImageUrl('metropix', codeMeta.initialValue);
      setImageUrl(url);
    }
  }, [codeMeta.initialValue, setImageUrl]);

  const handleImgLoad = (): void => {
    setImageLoaded(true);
    setImageFailed(false);
  };

  const handleImgError = (): void => {
    setImageLoaded(true);
    setImageUrl('');
    setImageFailed(true);
  };

  if (!imageUrl) {
    return null;
  }

  return (
    <img
      className={classes.previewImage}
      data-testid="metropix-image"
      alt="Metropix Preview"
      src={imageUrl}
      onLoad={handleImgLoad}
      onError={handleImgError}
    />
  );
};

export default MetropixPreview;
