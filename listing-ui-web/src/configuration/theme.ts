import { createMuiTheme } from '@material-ui/core/styles';
import red from '@material-ui/core/colors/red';

const serifFont = {
  fontFamily: 'Source Serif Pro'
};

// Material Theme
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#000'
    },
    error: {
      main: red.A400
    },
    background: {
      default: '#fff'
    }
  },
  typography: {
    h1: serifFont,
    h2: serifFont,
    h3: serifFont,
    h4: serifFont,
    h5: serifFont,
    h6: serifFont,
    button: {
      textTransform: 'none'
    }
  },
  overrides: {}
});

if (theme.overrides) {
  theme.overrides.MuiButton = {
    containedPrimary: {
      paddingLeft: theme.spacing(4),
      paddingRight: theme.spacing(4),
      minWidth: 200
    }
  };
}

export default theme;
