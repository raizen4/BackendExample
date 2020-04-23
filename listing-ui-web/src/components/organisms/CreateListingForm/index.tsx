import React, { FC } from 'react';
import { Formik, Form, FormikProps, FormikHelpers } from 'formik';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import { makeStyles, Theme } from '@material-ui/core/styles';
import SaveIcon from '@material-ui/icons/Save';
import SendIcon from '@material-ui/icons/Send';
import FileIcon from '@material-ui/icons/InsertDriveFileOutlined';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';

import { createListingSchema } from '../../../schemas/CreateListingSchema';
import AutoSave from '../../atoms/AutoSave';
import BasicInfo from '../../molecules/BasicInfo';
import PricingInfo from '../../molecules/PricingInfo';
import UploadComponent from '../UploadComponent';
import PropertyDescription from '../../molecules/PropertyDescription';
import Checklist from '../../molecules/Checklist';
import KeyFeatures from '../../molecules/KeyFeatures';
import Compliance from '../../molecules/Compliance';
import ViewingRules from '../../molecules/ViewingRules';
import Media from '../../molecules/Media';
import EpcDetails from '../../molecules/EpcDetails';
import HomeReport from '../../molecules/HomeReport';
import SaveForm from '../../atoms/SaveForm';
import {
  Units,
  CreateListingRoom
} from '../../organisms/CreateListingForm/types';
import { PutListing } from '../../../services/ListingService';

import { IListing, IRoom } from '../../../types/Listing';
import { IAsset } from '../../../types/Asset';
import { CreateListing, ListingAsset } from './types';
import {
  convertToImperial,
  convertToMetric,
  IDimensionMeasurement
} from '../../../utils/unitConversion';

const useStyles = makeStyles((theme: Theme) => ({
  saveForm: {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(2)
  }
}));

const mapRoomMeasurementToForm = (
  val: number,
  unit: string
): IDimensionMeasurement => {
  const metricMeasurements = {
    main: Math.floor(val),
    sub: Math.floor((val - Math.floor(val)) * 100)
  };
  if (unit === Units.METRIC) {
    return metricMeasurements;
  } else {
    return convertToImperial(metricMeasurements);
  }
};

const mapFormMeasurementToListingRoom = (
  measure: IDimensionMeasurement,
  unit: string
) => {
  const metricMeasurements =
    unit === Units.METRIC ? measure : convertToMetric(measure);
  return metricMeasurements.main + metricMeasurements.sub / 100;
};

const mapRoomToForm = (room: IRoom, unit: string): CreateListingRoom => {
  return {
    id: room.id,
    title: room.title,
    description: room.description,
    displayOrder: room.displayOrder,
    measurements: {
      width: mapRoomMeasurementToForm(room.measurements.width, unit),
      length: mapRoomMeasurementToForm(room.measurements.length, unit)
    }
  };
};

const CreateListingForm: FC<{
  listing: IListing;
  setSaving: (state: boolean) => void;
  setLastSaved: (state: Date) => void;
}> = ({ listing, setSaving, setLastSaved }) => {
  const classes = useStyles();
  const initVals = mapListingToForm(listing);

  function mapAssets(assetData: IAsset[]): IAsset[] & ListingAsset[] {
    return assetData?.map(asset => ({
      ...asset,
      id: asset.name + asset.fileSize,
      isUploading: false,
      isUploaded: true,
      error: false
    }));
  }

  function mapListingToForm(listing: IListing): CreateListing {
    const mappedListing = {
      ...listing,
      listingDetails: {
        ...listing.listingDetails,
        images: mapAssets(listing.listingDetails.images),
        floorPlan: {
          code: listing.listingDetails.floorPlan.code,
          images: mapAssets(listing.listingDetails.floorPlan.images)
        },
        newFeature: '',
        descriptions: {
          ...listing.listingDetails.descriptions,
          rooms: listing.listingDetails.descriptions.rooms.map(room =>
            mapRoomToForm(
              room,
              listing.listingDetails.descriptions.measurementUnit
            )
          )
        }
      }
    };

    if (mappedListing.propertyDetails.isScottishProperty) {
      mappedListing.propertyDetails = {
        ...listing.propertyDetails,
        homeReport: {
          ...listing.propertyDetails.homeReport,
          files: mapAssets(listing.propertyDetails.homeReport?.files)
        }
      };
    }

    return mappedListing;
  }

  const handleSubmit = (
    values: CreateListing,
    { setSubmitting }: FormikHelpers<CreateListing>
  ) => {
    // Save and Reload listing
    const clonedValues = { ...values };

    setSaving(true);
    setSubmitting(false);

    async function saveListing(listing: IListing) {
      await Promise.all([
        PutListing(listing),
        new Promise(resolve => setTimeout(resolve, 1500))
      ]);
      setLastSaved(new Date());
      setSaving(false);
    }

    const valuesToSave: IListing = {
      ...clonedValues,
      listingDetails: {
        ...clonedValues.listingDetails,
        descriptions: {
          ...clonedValues.listingDetails.descriptions,
          rooms: clonedValues.listingDetails.descriptions.rooms.map(room => {
            return {
              ...room,
              measurements: {
                width: mapFormMeasurementToListingRoom(
                  room.measurements.width,
                  clonedValues.listingDetails.descriptions.measurementUnit
                ),
                length: mapFormMeasurementToListingRoom(
                  room.measurements.length,
                  clonedValues.listingDetails.descriptions.measurementUnit
                )
              }
            };
          })
        }
      }
    };
    return saveListing(valuesToSave);
  };

  return (
    <Formik
      initialValues={initVals}
      onSubmit={handleSubmit}
      validationSchema={createListingSchema}
    >
      {(formProps: FormikProps<CreateListing>) => {
        const actions = [
          {
            icon: <SaveIcon />,
            name: 'Save',
            enabled: true,
            onClick: formProps.submitForm
          },
          {
            icon: <FileIcon />,
            name: 'Preview',
            enabled: true,
            onClick: formProps.submitForm
          },
          {
            icon: <SendIcon />,
            name: 'Set live',
            enabled: false,
            onClick: formProps.submitForm
          },
          {
            icon: <FileIcon />,
            name: 'Export to PDF',
            enabled: true,
            onClick: () => {
              console.log('exporting to pdf');
            }
          }
        ];
        return (
          <Form>
            <AutoSave saveDelaySeconds={60} />
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <Card>
                  <CardHeader title="FILES" />
                  <CardContent>
                    <UploadComponent
                      isImageUpload
                      name="IMAGES"
                      multipleFiles
                      fileTypes={['image/jpeg', 'image/jpg', 'image/png']}
                      fieldName="listingDetails.images"
                      showPreview
                    />
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={12}>
                <Media />
              </Grid>
              <Grid item xs={12}>
                <Card>
                  <PricingInfo />
                </Card>
              </Grid>
              <Grid item xs={12}>
                <KeyFeatures />
              </Grid>
              <Grid item xs={12}>
                <BasicInfo />
              </Grid>
              <Grid item xs={12}>
                <PropertyDescription />
              </Grid>
              <Grid item xs={12}>
                {formProps.values.propertyDetails.isScottishProperty ? (
                  <HomeReport />
                ) : (
                  <EpcDetails data-testid="epc-details" />
                )}
              </Grid>
              <Grid item xs={12}>
                <ViewingRules />
              </Grid>
              <Grid item xs={12}>
                {formProps.values.propertyDetails.isScottishProperty ? (
                  <div />
                ) : (
                  <Compliance />
                )}
              </Grid>
              <Grid item xs={12}>
                <Checklist />
              </Grid>
            </Grid>
            <SaveForm className={classes.saveForm} actions={actions} />
          </Form>
        );
      }}
    </Formik>
  );
};

export default CreateListingForm;
