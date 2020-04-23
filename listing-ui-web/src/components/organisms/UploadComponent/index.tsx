import React, { useState, useEffect, FC } from 'react';
import { FileWithPath } from 'react-dropzone';
import { useFormikContext, getIn } from 'formik';

import GridList from '@material-ui/core/GridList';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { Theme, fade } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import { grey } from '@material-ui/core/colors';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import { getFirstFiveAssetsToUpload } from './helpers';
import Thumb from '../../molecules/Thumb';
import CustomDropzone from '../../molecules/CustomDropzone';
import CurrentAsset from '../../molecules/CurrentAsset';
import {
  PostAssets,
  RemoveImageFromListing,
  FilterAssets
} from '../../../services/AssetService';

import { CreateListing, ListingAsset } from '../CreateListingForm/types';
import { IAsset } from '../../../types/Asset';
import { IUploadComponentProps } from './types';

const white = grey[50];
const useStyles = makeStyles((theme: Theme) => ({
  mainImageStyleOuter: {
    display: 'inline-flex',
    borderRadius: 2,
    width: '70%',
    height: '30vh',
    alignItems: 'center',
    justifyContent: 'center'
  },

  containerStyle: {
    display: 'flex',
    flexDirection: 'row'
  },

  gridImageStyle: {
    display: 'flex',
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: '100%'
  },

  root: {
    marginTop: '1%',
    display: 'flex',
    flexWrap: 'wrap',
    overflow: 'hidden'
  },

  gridList: {
    minHeight: 200,
    maxHeight: 300,
    overflowY: 'auto'
  },

  icon: {
    color: `${fade(white, 0.54)}`
  },

  buttonClass: {
    backgroundColor: `${fade(white, 0)}`,
    border: '2px solid #dadada',
    outline: 'none',
    borderRadius: '7px',
    borderColor: '#9ecaed',
    marginLeft: '15px',
    marginRight: '15px'
  }
}));

function UploadComponent({
  isImageUpload,
  multipleFiles,
  name,
  fileTypes,
  fieldName,
  showPreview
}: IUploadComponentProps) {
  const classes = useStyles({});
  const [showUploadedImagesError, setShowUploadedAssetError] = useState<
    boolean
  >(false);
  const { values, setFieldValue } = useFormikContext<CreateListing>();
  const assetData = getIn(values, fieldName) as IAsset[] & ListingAsset[];
  const [groupImages, setGroupImages] = useState<string[]>([]);
  const [currentAssetIndex, setCurrentAssetIndex] = useState<number | null>(
    assetData && assetData.length > 0 ? 0 : null
  );

  useEffect(() => {
    const abortController = new AbortController();

    const saveFile = async () => {
      const assets = getFirstFiveAssetsToUpload(assetData);

      if (assets.length === 0) {
        return;
      }

      const res = await PostAssets(
        assets,
        abortController,
        isImageUpload ? values.listingUri : null
      );

      const errors = res.filter(assetUploaded => assetUploaded?.error);
      errors.length > 0 && setShowUploadedAssetError(true);

      const dataToFilter = multipleFiles ? assetData : res;
      const filteredAssets = FilterAssets(dataToFilter, res);
      setFieldValue(fieldName, filteredAssets);
    };

    saveFile();

    return () => {
      abortController.abort();
    };
  }, [
    assetData,
    fieldName,
    isImageUpload,
    multipleFiles,
    setFieldValue,
    values.listingUri
  ]);

  const toggleFromGroupSelect = (identifier: string) => {
    const found = groupImages.find(imageUri => imageUri === identifier);

    if (found) {
      setGroupImages(groupImages.filter(imageUri => imageUri !== identifier));
    } else {
      setGroupImages([...groupImages, identifier]);
    }
  };

  const deleteImages = async (imagesToDelete: string[]) => {
    let imageData;

    if (isImageUpload) {
      const imagesRemoved = await RemoveImageFromListing(
        imagesToDelete,
        values.listingUri
      );

      imageData = assetData.filter(
        (image: ListingAsset) => !imagesRemoved.includes(image.uri)
      );
    } else {
      imageData = assetData.filter(
        (image: ListingAsset) => !imagesToDelete.includes(image.uri)
      );
    }

    setFieldValue(fieldName, imageData);
  };

  function onDrop(acceptedFiles: FileWithPath[]): void {
    const images = acceptedFiles
      .map((file): ListingAsset | null => {
        const imageId = file.name + file.size;

        const alreadyExists =
          assetData &&
          assetData.find((asset: ListingAsset) => asset.id === imageId);

        if (alreadyExists) {
          return null;
        } else {
          return {
            uri: '',
            id: imageId,
            isPrimary: false,
            caption: '',
            preview: URL.createObjectURL(file),
            name: file.name,
            fileSize: file.size,
            fileType: file.type,
            isUploading: true,
            isUploaded: false,
            file: file,
            error: false
          };
        }
      })
      .filter(Boolean);

    setFieldValue(fieldName, [...assetData, ...images]);
    setCurrentAssetIndex(0);
  }

  return (
    <Grid item xs={12}>
      <Grid container className={classes.containerStyle} spacing={2}>
        <Dialog
          open={showUploadedImagesError}
          onClose={() => setShowUploadedAssetError(false)}
          aria-labelledby="Error"
          aria-describedby={`Some ${name} could not be uploaded. Please try again!`}
        >
          <DialogTitle id="alert-dialog-title">Error</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Some {name} could not be uploaded. Please try again!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => setShowUploadedAssetError(false)}
              color="primary"
            >
              OK
            </Button>
          </DialogActions>
        </Dialog>
        <Grid item xs={12} md={6}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <CustomDropzone
                handleOnDrop={onDrop}
                multipleFiles={multipleFiles}
                name={name}
                fileTypes={fileTypes}
              />
            </Grid>
            <Grid item xs={12}>
              {assetData && assetData.length > 0 && (
                <GridList
                  spacing={10}
                  cols={3}
                  cellHeight={120}
                  className={classes.gridList}
                >
                  {assetData.map(
                    (asset: IAsset & ListingAsset, index: number) => {
                      const isSelected = index === currentAssetIndex;
                      const groupSelected = groupImages.includes(asset.uri);

                      return (
                        <Thumb
                          i={index}
                          cols={1}
                          key={index}
                          onCurrentAssetClick={() => {
                            setCurrentAssetIndex(index);
                          }}
                          handleToggleFromGroupSelect={() => {
                            toggleFromGroupSelect(asset.uri);
                          }}
                          isSelected={isSelected}
                          isGroupSelected={groupSelected}
                          image={asset}
                        />
                      );
                    }
                  )}
                </GridList>
              )}
            </Grid>
            <Grid item xs={12}>
              {assetData && assetData.length > 0 && (
                <div>
                  <Button className={classes.buttonClass}>Select All</Button>
                  <Button
                    disabled={groupImages.length === 0}
                    className={classes.buttonClass}
                    onClick={() => {
                      deleteImages(groupImages);
                    }}
                  >
                    Delete
                  </Button>
                </div>
              )}
            </Grid>
          </Grid>
        </Grid>
        {showPreview && (
          <CurrentAsset
            currentSelectedAssetIndex={currentAssetIndex}
            isImageUpload={isImageUpload}
            fieldName={fieldName}
          />
        )}
      </Grid>
    </Grid>
  );
}

const WrappedUploadComponent: FC<IUploadComponentProps> = (
  props: IUploadComponentProps
) => {
  const { values } = useFormikContext<CreateListing>();
  const assetData = getIn(values, props.fieldName) as IAsset[] & ListingAsset[];

  if (!assetData) {
    return null;
  }

  return <UploadComponent {...props} />;
};

export default WrappedUploadComponent;
