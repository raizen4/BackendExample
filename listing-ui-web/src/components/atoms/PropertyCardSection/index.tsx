import React, { FC } from 'react';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';
import { ISectionProps } from './types';

const section: FC<ISectionProps> = ({
  title,
  descriptionTitle,
  descriptionBody,
  children
}) => {
  return (
    <Grid container spacing={4}>
      <Grid item xs={3}>
        <Typography variant="h6">{descriptionTitle}</Typography>
        <Typography>{descriptionBody}</Typography>
      </Grid>
      <Grid item xs={6}>
        <Card>
          <CardHeader title={title}></CardHeader>
          <CardContent>{children}</CardContent>
        </Card>
      </Grid>
      <Grid item xs={3}></Grid>
    </Grid>
  );
};

export default section;
