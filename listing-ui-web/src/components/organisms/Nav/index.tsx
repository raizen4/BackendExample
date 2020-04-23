import React from 'react';
import {
  makeStyles,
  Theme,
  Divider,
  ListItem,
  List,
  ListItemText,
  ListItemIcon,
  Drawer,
  Hidden,
  useTheme
} from '@material-ui/core';
import MailIcon from '@material-ui/icons/Mail';
import InboxIcon from '@material-ui/icons/Inbox';

const drawerWidth = 240;
const useStyles = makeStyles((theme: Theme) => ({
  navContainer: {
    position: 'fixed',
    height: '100vh',
    width: drawerWidth
  },

  drawer: {
    [theme.breakpoints.up('sm')]: {
      width: drawerWidth,
      flexShrink: 0
    }
  },
  drawerPaper: {
    width: drawerWidth
  },

  toolbar: theme.mixins.toolbar
}));

const DrawerItems = () => {
  const classes = useStyles({});

  return (
    <div>
      <div className={classes.toolbar} />
      <Divider />
      {DrawerItemsList(['Inbox', 'Starred', 'Send email', 'Drafts'])}
      <Divider />
      {DrawerItemsList(['All mail', 'Trash', 'Spam'])}
    </div>
  );
};

const DrawerItemsList = (items: string[]) => {
  return (
    <List>
      {items.map((text, index) => (
        <ListItem button key={text}>
          <ListItemIcon>
            {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
          </ListItemIcon>
          <ListItemText primary={text} />
        </ListItem>
      ))}
    </List>
  );
};

const Nav = () => {
  const classes = useStyles({});
  const theme = useTheme();
  return (
    <div className={classes.navContainer}>
      <nav className={classes.drawer} aria-label="mailbox folders">
        <Hidden implementation="css">
          <Drawer
            variant="permanent"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open
            classes={{
              paper: classes.drawerPaper
            }}
            ModalProps={{
              keepMounted: true // Better open performance on mobile and tablets.
            }}
          >
            <DrawerItems />
          </Drawer>
        </Hidden>
      </nav>
    </div>
  );
};

export default Nav;
