import { MsalAuthProvider, LoginType } from 'react-aad-msal';
import 'regenerator-runtime';
import { Configuration, Logger, LogLevel } from 'msal';
import hasWindow from 'shared/utils/hasWindow';
import { b2c } from '../../configuration/b2c';

// Msal Configurations
export const config: Configuration = {
  auth: {
    validateAuthority: false,
    authority: b2c.AUTH_URL,
    clientId: b2c.CLIENT_ID ?? '',
    redirectUri: hasWindow() ? `${window.location.origin}/listing` : '',
    postLogoutRedirectUri: hasWindow()
      ? `${window.location.origin}/listing`
      : ''
  },
  system: {
    logger: new Logger(
      (logLevel, message, containsPii) => {
        console.log('[MSAL]', message);
      },
      {
        level: LogLevel.Verbose,
        piiLoggingEnabled: false
      }
    )
  },
  cache: {
    cacheLocation: 'localStorage',
    storeAuthStateInCookie: true
  }
};
//https://launchbagentb2cstaging.onmicrosoft.com/someapi/demo.read
// Authentication Parameters
export const authenticationParameters = {
  state: '',
  scopes: [
    `https://launchbagentb2cstaging.onmicrosoft.com/create-advert/user_impersonation`
  ]
};

interface WindowAsAny extends Window {
  [index: string]: {} | unknown;
}

// Options
export const options = {
  loginType:
    hasWindow() && ((window as unknown) as WindowAsAny)['Cypress']
      ? LoginType.Popup
      : LoginType.Redirect,
  tokenRefreshUri: hasWindow()
    ? `${window.location.origin}/listing-ui-web/static/auth.html`
    : ''
};

export const authProvider = hasWindow()
  ? new MsalAuthProvider(config, authenticationParameters, options)
  : null;
