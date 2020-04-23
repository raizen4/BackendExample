import React, { FC, useEffect, useRef } from 'react';
import { useFormikContext, getIn } from 'formik';

import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Grid from '@material-ui/core/Grid';
import { Theme, fade } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import grey from '@material-ui/core/colors/grey';
import StarBorderTwoToneIcon from '@material-ui/icons/StarBorderTwoTone';
import StarRateTwoToneIcon from '@material-ui/icons/StarRateTwoTone';

import InputText from 'shared/components/molecules/InputText';

import placeholderImage from '../../../images/image_placeholder.png';
import {
  CreateListing,
  ListingAsset
} from '../../organisms/CreateListingForm/types';

import { ICurrentAssetProps } from './types';
import { FILE_DOMAIN_URL } from '../../../configuration/domains';

const white = grey[50];
const black = grey[900];

const useStyles = makeStyles((theme: Theme) => ({
  titleBar: {
    backgroundColor: black,
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    color: white,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  previewImageContainer: {
    position: 'relative',
    width: '100%',
    paddingTop: '56.25%' /* 16:9 Aspect Ratio */,
    height: 0,
    overflow: 'hidden'
  },
  previewFileContainer: {
    position: 'relative',
    width: '100%',
    paddingTop: '100%',
    height: 0,
    overflow: 'hidden'
  },
  previewImageStyle: {
    position: 'absolute',
    top: '50%',
    left: 0,
    width: '100%',
    transform: 'translateY(-50%)'
  },

  primaryIcon: {
    outlineColor: `${fade(white, 1)}`,
    color: `${fade(white, 1)}`
  }
}));

function GetImageUrl(currentImage: ListingAsset): string {
  const imgPreview = currentImage.preview
    ? currentImage.preview
    : `${FILE_DOMAIN_URL}/${currentImage.uri}`;

  return currentImage.fileType && !currentImage.fileType.includes('image')
    ? placeholderImage
    : imgPreview;
}

function GetPrimaryAsset(assetData: ListingAsset[], index: number | null) {
  return assetData.map((file, i) => {
    file.isPrimary = i === index ? !file.isPrimary : false;
    return file;
  });
}

const CurrentAsset: FC<ICurrentAssetProps> = ({
  isImageUpload,
  currentSelectedAssetIndex,
  fieldName
}) => {
  const classes = useStyles();
  const inputRef = useRef<HTMLInputElement>(null);
  const { values, setFieldValue } = useFormikContext<CreateListing>();
  const assetData = getIn(values, fieldName);

  const currentImage =
    currentSelectedAssetIndex !== null &&
    assetData &&
    assetData[currentSelectedAssetIndex];

  useEffect(() => {
    inputRef.current && inputRef.current.focus();
  }, [currentImage]);

  const handleMakePrimary = () => {
    const newValues = GetPrimaryAsset(assetData, currentSelectedAssetIndex);
    setFieldValue(fieldName, newValues);
  };

  if (currentImage) {
    const imageSrc = GetImageUrl(currentImage);

    if (isImageUpload) {
      return (
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <div className={classes.previewImageContainer}>
                <img
                  src={imageSrc}
                  alt={currentImage.name}
                  className={classes.previewImageStyle}
                />
                <div className={classes.titleBar}>
                  <span>Make this image primary</span>
                  <IconButton
                    onClick={() => handleMakePrimary()}
                    data-testid="primary-button"
                  >
                    {currentImage.isPrimary ? (
                      <StarRateTwoToneIcon
                        className={classes.primaryIcon}
                        data-testid="isprimary-icon"
                      />
                    ) : (
                      <StarBorderTwoToneIcon
                        className={classes.primaryIcon}
                        data-testid="isnotprimary-icon"
                      />
                    )}
                  </IconButton>
                </div>
              </div>
            </Grid>
            <Grid item xs={12}>
              <Grid container spacing={2}>
                <Grid item xs={8}>
                  <Typography variant="h5">Caption this photograph</Typography>
                  <InputText
                    inputRef={inputRef}
                    name={`listingDetails.images[${currentSelectedAssetIndex}].caption`}
                    label="new name goes here"
                    variant="outlined"
                    fullWidth
                  />{' '}
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="h5">Pos.</Typography>
                  <Typography variant="h6">
                    {currentSelectedAssetIndex
                      ? assetData.indexOf(assetData[currentSelectedAssetIndex])
                      : 0}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      );
    } else {
      return (
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <div className={classes.previewFileContainer}>
                <img
                  src={imageSrc}
                  alt={currentImage.name}
                  className={classes.previewImageStyle}
                />
              </div>
            </Grid>
          </Grid>
        </Grid>
      );
    }
  } else {
    return (
      <Grid item xs={12} md={6}>
        <div className={classes.previewImageContainer}>
          <img
            src={placeholderImage}
            className={classes.previewImageStyle}
            alt="Placeholder"
          />
        </div>
      </Grid>
    );
  }
};

export default CurrentAsset;
