import React, { FC } from 'react';
import { useFormikContext } from 'formik';

import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import makeStyles from '@material-ui/styles/makeStyles';
import { Theme } from '@material-ui/core/styles';

import TabPanel from 'shared/components/atoms/TabPanel';
import InputText from 'shared/components/molecules/InputText';

import { IPropertyDescriptionTabPanelProps } from './types';
import { IListing } from '../../../../types/Listing';
import DimensionInput from '../../DimensionInput';
import { Directions } from '../../DimensionInput/types';

const useStyles = makeStyles((theme: Theme) => ({
  title: {
    textTransform: 'uppercase'
  },
  expand: {
    transform: 'rotate(0deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest
    })
  },
  expandOpen: {
    transform: 'rotate(180deg)'
  },
  tabWrapper: {
    flexDirection: 'row-reverse',
    '&> *:first-child': {
      marginBottom: '0!important',
      marginLeft: theme.spacing(1)
    }
  },
  TabPanelRoot: {
    padding: theme.spacing(4, 2)
  },
  RadioGroupRoot: {
    flexDirection: 'row'
  }
}));

const PropertyDescriptionTabPanel: FC<IPropertyDescriptionTabPanelProps> = ({
  tabValue
}) => {
  const { TabPanelRoot } = useStyles({});
  const formData = useFormikContext<IListing>();

  const handleSaveDescription = (name: string): void => {
    //TODO: Add to global notification component
    console.log(`${name} description was saved`);
  };

  return (
    <>
      {formData.values.listingDetails.descriptions.rooms.map(
        function createRoomTabPanel(room, i: number) {
          const roomTitle = room.title !== '' ? room.title : `Room ${i + 1}`;
          return (
            <TabPanel
              className={TabPanelRoot}
              key={room.id}
              name={roomTitle.replace(' ', '-')}
              value={tabValue}
              index={room.id}
            >
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  <InputText
                    fullWidth
                    label="Name of room"
                    name={`listingDetails.descriptions.rooms[${i}].title`}
                    placeholder="Room 1"
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <DimensionInput
                        direction={Directions.WIDTH}
                        name={`listingDetails.descriptions.rooms[${i}].measurements`}
                        unit={
                          formData.values.listingDetails.descriptions
                            .measurementUnit
                        }
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <DimensionInput
                        direction={Directions.LENGTH}
                        name={`listingDetails.descriptions.rooms[${i}].measurements`}
                        unit={
                          formData.values.listingDetails.descriptions
                            .measurementUnit
                        }
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <InputText
                    disabled={formData.isSubmitting}
                    multiline
                    rows={10}
                    fullWidth
                    label={`${roomTitle} description`}
                    spellCheck="true"
                    aria-label={`${roomTitle} description`}
                    name={`listingDetails.descriptions.rooms[${i}].description`}
                    placeholder="Add details about the room..."
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    color="primary"
                    variant="contained"
                    onClick={() => handleSaveDescription(roomTitle)}
                  >
                    Save changes to this description
                  </Button>
                </Grid>
              </Grid>
            </TabPanel>
          );
        }
      )}
    </>
  );
};

export default PropertyDescriptionTabPanel;
