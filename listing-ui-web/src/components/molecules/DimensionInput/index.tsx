import React, { FC } from 'react';

import InputText from 'shared/components/molecules/InputText';
import { Units } from '../../organisms/CreateListingForm/types';
import { IDimensionInputProps } from './types';
import { Grid, InputAdornment } from '@material-ui/core';
import makeStyles from '@material-ui/styles/makeStyles';
import { Theme } from '@material-ui/core/styles';

const useStyles = makeStyles((theme: Theme) => ({
  flexGrid: {
    display: 'flex'
  }
}));

const DimensionInput: FC<IDimensionInputProps> = ({
  direction,
  name,
  unit
}) => {
  const { flexGrid } = useStyles({});
  const mainUnit = unit === Units.IMPERIAL ? 'ft' : 'm';
  const subUnit = unit === Units.IMPERIAL ? 'in' : 'cm';
  return (
    <Grid container spacing={2}>
      <Grid item xs={6} className={flexGrid}>
        <InputText
          name={`${name}.${direction}.main`}
          label={`${direction}-${mainUnit}`}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">{mainUnit}</InputAdornment>
            )
          }}
          data-testid="width-main"
        />
      </Grid>
      <Grid item xs={6} className={flexGrid}>
        <InputText
          name={`${name}.${direction}.sub`}
          label={`${direction}-${subUnit}`}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">{subUnit}</InputAdornment>
            )
          }}
          data-testid="width-sub"
        />
      </Grid>
    </Grid>
  );
};

export default DimensionInput;
