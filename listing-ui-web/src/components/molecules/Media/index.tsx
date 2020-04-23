import { useFormikContext } from 'formik';
import React, { FC } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import makeStyles from '@material-ui/styles/makeStyles';
import { Theme } from '@material-ui/core/styles';
import InputText from 'shared/components/molecules/InputText';
import { CreateListing } from '../../organisms/CreateListingForm/types';
import UploadComponent from '../../organisms/UploadComponent';
import MetropixPreview from './MetropixPreview';
import MetropixCodeInput from './MetropixCodeInput';
import { Typography } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    padding: '2px'
  },
  mediaLabel: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(1)
  },
  mediaField: {
    margin: theme.spacing(3, 0)
  },
  warningMessagePadding: {
    paddingTop: theme.spacing(5)
  }
}));

const Media: FC = () => {
  const classes = useStyles({});
  const { values } = useFormikContext<CreateListing>();
  return (
    <Card>
      <CardHeader title="OTHER MEDIA" />
      <CardContent>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <div className={classes.mediaField}>
              <InputText
                label="Embed a 360° tour"
                name="listingDetails.tour"
                placeholder="e.g. https://my.matterport.com/show/?m=1234567890"
                variant="outlined"
                fullWidth
              />
            </div>
            <div className={classes.mediaField}>
              <InputText
                label="Embed an audio tour"
                name="listingDetails.video"
                placeholder="e.g. https://www.vimeo.com/yourtour-123456"
                variant="outlined"
                fullWidth
              />
            </div>
            <div className={classes.mediaField}>
              <MetropixCodeInput />
            </div>
          </Grid>
          <Grid item xs={12} md={6}>
            <MetropixPreview />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs={12} md={6}>
            <Typography className={classes.mediaLabel}>OR</Typography>
          </Grid>
          <Grid item xs={12}>
            <UploadComponent
              isImageUpload={false}
              name="FLOORPLAN"
              multipleFiles={false}
              fileTypes={['image/jpeg', 'image/jpg', 'image/png']}
              fieldName="listingDetails.floorPlan.images"
              showPreview
            />
          </Grid>
          <Grid className={classes.warningMessagePadding} item xs={12}>
            {values.listingDetails.floorPlan.code &&
              values.listingDetails.floorPlan.images &&
              values.listingDetails.floorPlan.images.length > 0 &&
              values.listingDetails.floorPlan.images[0].uri && (
                <Alert severity="warning">
                  The metropix floorplan will be displayed instead of your image
                  upload
                </Alert>
              )}
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
export default Media;
