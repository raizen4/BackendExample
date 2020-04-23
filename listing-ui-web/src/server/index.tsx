import compression from 'compression';
import express from 'express';
import fs from 'fs';
import path from 'path';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Loadable from 'react-loadable';
import { getBundles } from 'react-loadable/webpack';
import { StaticRouter, Route, Switch } from 'react-router-dom';
import minifyCssString from 'minify-css-string';
import Routes from '../routes';
import { ServerStyleSheets, ThemeProvider } from '@material-ui/styles';
import theme from '../configuration/theme';
import CssBaseline from '@material-ui/core/CssBaseline';
import { IRouteContext } from '../../../../../../Shared/MicroFrontEnds/typings/routing/types';
import {
  dedupeArray,
  getAppFileAndMainVendorFileNames,
  getBundleNames,
  getSharedAndVendorBundles,
  sortScripts
} from './helpers';
import AuthenticateUser from 'shared/utils/authenticateUser';
import { authProvider } from '../utils/auth/authProvider';

const stats = require('../../dist/react-loadable.json');

const port = process.env.NODE_PORT || 3000;

function AppEntry() {
  const app = express();

  const filesFromClientDist = fs.readdirSync(
    path.resolve(__dirname, '..', 'client')
  );

  app.use(compression({ level: -1 }));
  app.use('/listing-ui-web/static/', express.static('./dist/client'));

  app.get('*', (req, res) => {
    let scriptsForClient: string[] = getAppFileAndMainVendorFileNames(
      filesFromClientDist
    );

    const sheets = new ServerStyleSheets();

    const modules = ['app'];

    const context: IRouteContext = {};

    const App = ReactDOMServer.renderToString(
      <Loadable.Capture report={moduleName => modules.push(moduleName)}>
        <StaticRouter location={req.url} context={context} basename="/">
          <AuthenticateUser authProvider={authProvider} forceLogin>
            {sheets.collect(
              <ThemeProvider theme={theme}>
                <CssBaseline />
                <Switch>
                  <Switch>
                    {Routes.map(route => (
                      <Route key={route.path} {...route} />
                    ))}
                  </Switch>
                </Switch>
              </ThemeProvider>
            )}
          </AuthenticateUser>
        </StaticRouter>
      </Loadable.Capture>
    );

    const css = sheets.toString();
    const bundleObjects = getBundles(stats, modules);
    const bundles = getBundleNames(bundleObjects);

    scriptsForClient = sortScripts(
      dedupeArray([
        ...scriptsForClient,
        ...getSharedAndVendorBundles(filesFromClientDist, [...bundles, 'app'])
      ])
    );

    const canonicalUrl = `https://LaunchB.azurewebsites.net/some/app`;
    const metaTitle = `Welcome | LaunchB`;
    const metaDesc = `Registration`;
    const headerScripts = scriptsForClient
      .map(
        file => `<script src="/listing-ui-web/static/${file}" defer></script>`
      )
      .join('\n');
    const response = `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="utf-8">
                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                <meta name="viewport" content="width=device-width, initial-scale=1">
                <meta name="author" content="LaunchB">
                <meta name='description' content="${metaDesc}" />
                <link rel="canonical" href="${canonicalUrl}" />
                <title>${metaTitle}</title>
                <style id="jss-server-side">${minifyCssString(css)}</style>
                ${headerScripts}
            </head>
            <body>
                <div class='app' id='app'>${App}</div>
                <script src="https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js"></script>
                <script>
                  WebFont.load({
                    google: {
                      families: ['Source+Serif+Pro:400,700']
                    }
                  });
                </script>
            </body>
        </html>
    `;

    if (context.url) {
      return res.redirect(301, context.url);
    }

    if (context.status === 404) {
      return res.status(404).send(response);
    }

    return res.status(200).send(response);
  });

  Loadable.preloadAll().then(() => {
    app.listen(port, () => {
      console.log(`listing-ui-web app is running on http://localhost:${port}`);
    });
  });
}

AppEntry();
