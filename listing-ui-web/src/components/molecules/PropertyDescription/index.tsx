import React, { FC, useState } from 'react';
import { useFormikContext } from 'formik';

import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import CardContent from '@material-ui/core/CardContent';
import { Theme } from '@material-ui/core/styles';
import makeStyles from '@material-ui/styles/makeStyles';
import FormControl from '@material-ui/core/FormControl';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Grid from '@material-ui/core/Grid';

import InputText from 'shared/components/molecules/InputText';
import { RadioGroup } from 'shared/components/molecules/RadioGroup';
import { Units, CreateListing } from '../../organisms/CreateListingForm/types';
import TabPanels from './TabPanels';
import Tabs from './Tabs';

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
    'flex-direction': 'row-reverse',
    '&> *:first-child': {
      marginBottom: '0!important'
    }
  },
  RadioGroupRoot: {
    margin: theme.spacing(4, 0, 3),
    flexDirection: 'row'
  }
}));

const PropertyDescription: FC = () => {
  const { title, expand, expandOpen, RadioGroupRoot } = useStyles({});
  const formData = useFormikContext<CreateListing>();

  const [expanded, setExpanded] = useState(true);
  const [tabValue, setTabValue] = useState(
    () =>
      [...formData.values.listingDetails.descriptions.rooms].sort(
        (a, b) => a.displayOrder - b.displayOrder
      )[0]?.id || 'add'
  );
  return (
    <Card>
      <CardHeader
        title="Description"
        className={title}
        action={
          <IconButton
            className={expanded ? `${expand} ${expandOpen}` : expand}
            aria-expanded={expanded}
            aria-label={expanded ? 'show less' : 'show more'}
            onClick={() => {
              setExpanded(!expanded);
            }}
          >
            <ExpandMoreIcon />
          </IconButton>
        }
      />
      <CardContent>
        <Collapse in={expanded}>
          <Grid container>
            <Grid item xs={12}>
              <InputText
                label="General Summary"
                multiline
                rows={10}
                disabled={formData.isSubmitting}
                fullWidth
                spellCheck="true"
                aria-label="property summary"
                name="listingDetails.descriptions.summary"
                placeholder="Add general details about the property..."
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset">
                <RadioGroup
                  aria-label="units"
                  name="listingDetails.descriptions.measurementUnit"
                  classes={{
                    root: RadioGroupRoot
                  }}
                >
                  <FormControlLabel
                    value={Units.METRIC}
                    control={<Radio />}
                    label="Metric measurements"
                    labelPlacement="start"
                  />
                  <FormControlLabel
                    value={Units.IMPERIAL}
                    control={<Radio />}
                    label="Imperial measurements"
                    labelPlacement="start"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
          <Tabs tabValue={tabValue} setTabValue={setTabValue} />
          <TabPanels tabValue={tabValue} />
        </Collapse>
      </CardContent>
    </Card>
  );
};

export default PropertyDescription;
