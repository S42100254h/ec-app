import React, { useCallback, useState } from "react";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/styles";
import IconButton from "@material-ui/core/IconButton";
import SearchIcon from "@material-ui/icons/Search";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import HistoryIcon from "@material-ui/icons/History";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import { TextInput } from "../UIkit/index";

const useStyles = makeStyles((theme) => ({
  drawer: {
    [theme.breakpoints.up("sm")]: {
      flexShrink: 0,
      width: 256
    }
  },
  toolbar: theme.mixins.toolbar,
  drawerPaper: {
    width: 256
  },
  searchField: {
    alignItems: "center",
    display: "flex",
    marginLeft: 32
  }
}));

const ClosableDrawer = (props) => {
  const classes = useStyles();
  const { container } = props;

  const [keyword, setKeyword] = useState("");

  const inputKeyword = useCallback((event) => {
    setKeyword(event.target.value)
  }, [setKeyword]);

  return (
    <nav className={classes.drawer}>
      <Drawer
        container={container}
        variant="temporary"
        anchor="right"
        open={props.open}
        onClose={(event) => props.onClose(event)}
        classes= {{paper: classes.drawerPaper}}
        ModalProps={{ keepMounted: true }}
      >
        <div>
          <div className={classes.searchField}>
            <TextInput
              fullWidth={false} label={"キーワードを入力"} multiline={false}
              onChange={inputKeyword} required={false} rows={1} value={keyword} type={"text"}
            />
            <IconButton>
              <SearchIcon />
            </IconButton>
          </div>
          <Divider />
          <List>
            <ListItem button key="logout">
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary={"logout"} />
            </ListItem>
          </List>
        </div>
      </Drawer>
    </nav>
  );
};

export default ClosableDrawer;
