import React from 'react';
import Loadable from 'react-loadable';
import Loader from '../components/atoms/Loader';
import Home from '../components/pages/Home';

const listingLoader = Loadable({
  loader: () => import('../components/pages/Listing/Create'),
  loading: () => <Loader />
});
const propertyCardLoader = Loadable({
  loader: () => import('../components/pages/PropertyCard/Create'),
  loading: () => <Loader />
});

const propertiesLoader = Loadable({
  loader: () => import('../components/pages/PropertyCards'),
  loading: () => <Loader />
});

const routes = [
  {
    path: '/listing',
    exact: true,
    component: Home
  },
  {
    path: '/listing/create/:id',
    exact: true,
    component: listingLoader
  },
  {
    path: '/properties',
    exact: true,
    component: propertiesLoader
  },
  {
    path: '/listing/property-card/new',
    exact: true,
    component: propertyCardLoader
  }
];

export default routes;
