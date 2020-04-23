import React, { FC } from 'react';
import MuiBreadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { IBreadcrumbs } from './types';

const Breadcrumbs: FC<IBreadcrumbs> = ({ route, pageLabel }) => (
  <MuiBreadcrumbs aria-label="breadcrumb">
    <Link href={route.path}>{route.label}</Link>
    <Typography color="textPrimary">{pageLabel}</Typography>
  </MuiBreadcrumbs>
);

export default Breadcrumbs;
