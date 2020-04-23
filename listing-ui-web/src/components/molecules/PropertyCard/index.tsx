import React, { FC } from 'react';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import Grid from '@material-ui/core/Grid';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import Chip from '@material-ui/core/Chip';

import placeholderImage from '../../../images/image_placeholder.png';
import { IPropertyCardListView } from '../../../types/PropertyCard';
import { GetFormattedAddress } from '../../../services/PropertyCardService';
import { Typography } from '@material-ui/core';
import { FILE_DOMAIN_URL } from '../../../configuration/domains';

const useStyles = makeStyles((theme: Theme) => ({
  propertyCard: {
    width: '100%',
    marginBottom: theme.spacing(3),
    border: 'solid 1px transparent',
    '&:hover': {
      border: `solid 1px ${theme.palette.grey[200]}`,
      cursor: 'pointer'
    }
  },
  imageContainer: {
    overflow: 'hidden',
    position: 'relative',
    height: '100px'
  },
  imageStyle: {
    maxWidth: '100%',
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)'
  },
  propertyDetails: {
    paddingLeft: theme.spacing(2)
  },
  updatedLabel: {
    textAlign: 'right'
  },
  features: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5)
    }
  }
}));

const PropertyCard: FC<{
  property: IPropertyCardListView;
}> = props => {
  const classes = useStyles({});

  const GetLastUpdated = (): string => {
    if (!props.property.updatedDateTime) {
      return 'N/A';
    } else {
      const updatedDate = Date.parse(props.property.updatedDateTime);
      if (updatedDate > Date.now() - 1000 * 60 * 60 * 24) {
        return new Date(updatedDate).toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit'
        });
      } else {
        return new Date(updatedDate).toLocaleDateString();
      }
    }
  };

  const OpenPropertyCard = () => {
    console.log(`open property - ${props.property.uri}`);
  };

  const ImageSrc = (): string => {
    if (props.property.imageUri) {
      return `${FILE_DOMAIN_URL}/${props.property.imageUri}`;
    } else {
      return placeholderImage;
    }
  };

  return (
    <div onClick={OpenPropertyCard}>
      <Card className={classes.propertyCard}>
        <CardContent>
          <Grid container spacing={2}>
            <Grid item xs={4} md={2} className={classes.imageContainer}>
              <img
                src={ImageSrc()}
                alt={`image for ${props.property.address.postalCode}`}
                className={classes.imageStyle}
              />
            </Grid>
            <Grid item xs={8} md={10}>
              <Grid container>
                <Grid item xs={12} md={9} className={classes.propertyDetails}>
                  <Grid container>
                    <Grid item xs={12}>
                      <Typography>
                        {GetFormattedAddress(props.property.address)}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} className={classes.features}>
                      {props.property.propertyType && (
                        <Chip label={props.property.propertyType} />
                      )}
                      {props.property.propertyStyle && (
                        <Chip label={props.property.propertyStyle} />
                      )}
                      {props.property.bedroomTotal && (
                        <Chip
                          label={`${props.property.bedroomTotal} bedrooms`}
                        />
                      )}
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={3} className={classes.updatedLabel}>
                  <Typography variant="subtitle2">
                    Last updated {GetLastUpdated()}
                  </Typography>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </div>
  );
};

export default PropertyCard;
