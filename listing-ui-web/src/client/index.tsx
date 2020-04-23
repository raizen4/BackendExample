import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/styles';
import theme from '../configuration/theme';
import CssBaseline from '@material-ui/core/CssBaseline';
import Routes from '../routes';
import AuthenticateUser from 'shared/utils/authenticateUser';
import { authProvider } from '../utils/auth/authProvider';

function AppEntry() {
  useEffect(() => {
    const jssStyles = document.querySelector('#jss-server-side');
    if (jssStyles) {
      jssStyles.parentNode.removeChild(jssStyles);
    }
  }, []);

  return (
    <BrowserRouter basename="/">
      <AuthenticateUser authProvider={authProvider} forceLogin>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Switch>
            {Routes.map(route => (
              <Route key={route.path} {...route} />
            ))}
          </Switch>
        </ThemeProvider>
      </AuthenticateUser>
    </BrowserRouter>
  );
}

const renderMethod = module.hot ? ReactDOM.render : ReactDOM.hydrate;

renderMethod(<AppEntry />, document.querySelector('#app'));
