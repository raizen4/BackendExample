import React, { FC, useState } from 'react';
import { FieldArray, FieldArrayRenderProps } from 'formik';
import clsx from 'clsx';
import Grid from '@material-ui/core/Grid';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Collapse from '@material-ui/core/Collapse';
import IconButton from '@material-ui/core/IconButton';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Alert from '@material-ui/lab/Alert';
import FeatureList from './FeatureList';

const useStyles = makeStyles((theme: Theme) => ({
  chip: {
    margin: theme.spacing(0.5)
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
  }
}));

const KeyFeatures: FC = () => {
  const classes = useStyles({});
  const [expanded, setExpanded] = useState(true);

  const toggleExpanded = (): void => {
    setExpanded(!expanded);
  };

  return (
    <Card>
      <CardHeader
        title="Key Features"
        action={
          <IconButton
            className={clsx(classes.expand, expanded && classes.expandOpen)}
            aria-expanded={expanded}
            aria-label={expanded ? 'show less' : 'show more'}
            onClick={toggleExpanded}
          >
            <ExpandMoreIcon />
          </IconButton>
        }
      />
      <CardContent>
        <Collapse in={expanded}>
          <Grid aria-label="Add new feature area" container spacing={4}>
            <Grid item xs={12}>
              <Alert severity="info">
                Only the first 10 features will display in an online advert!
              </Alert>
            </Grid>
            <FieldArray name="listingDetails.keyFeatures">
              {(helpers: FieldArrayRenderProps) => <FeatureList {...helpers} />}
            </FieldArray>
          </Grid>
        </Collapse>
      </CardContent>
    </Card>
  );
};
export default KeyFeatures;
