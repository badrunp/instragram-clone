import React, { useState, useEffect, useContext, useRef } from "react";
import {
  Toolbar,
  AppBar,
  Typography,
  makeStyles,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  ListItemIcon,
  Paper,
  Container,
  TextField,
  Grid,
} from "@material-ui/core";
import { Link, useHistory } from "react-router-dom";
import InstagramIcon from "@material-ui/icons/Instagram";
import { UserContext } from "../../config/routes";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import Fade from "@material-ui/core/Fade";
import PersonIcon from "@material-ui/icons/Person";
import PostAddIcon from "@material-ui/icons/PostAdd";
import HomeOutlinedIcon from "@material-ui/icons/HomeOutlined";
import Popper from "@material-ui/core/Popper";
import Grow from "@material-ui/core/Grow";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import MenuList from "@material-ui/core/MenuList";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
  tabContent: {
    minHeight: "63px",
    minWidth: "100px",
    position: "relative",
  },
  small: {
    width: theme.spacing(4),
    height: theme.spacing(4),
  },
  boxAvatar: {
    position: "relative",
    lineHeight: "1.75",
    padding: "6px 12px",
    display: "flex",
    alignItems: "center",
    cursor: "pointer",
    verticalAlign: "middle",
    marginLeft: "5px",
  },
  linkMenu: {
    "& > * + *": {
      marginLeft: theme.spacing(2),
    },
  },
  navLink: {
    textDecoration: "none",
    color: "#333",
  },
  navLinkMenu: {
    textDecoration: "none",
    color: "#333",
    marginLeft: "10px",
    color: "grey",
  },
  navbarTitle: {
    display: "none",
    [theme.breakpoints.up("md")]: {
      display: "block",
    },
  },
  boxSearch: {
    position: "relative",
  },
  boxDataSearch: {
    position: "absolute",
    left: "50%",
    marginTop: "10px",
    transform: "translate(-50%, 0)",
    height: "max-content",
    maxHeight: "250px",
    background: "white",
    width: "100%",
    minWidth: "300px",
    overflowY: "scroll",
    border: ".5px solid rgba(0,0,0,.2)",
    [theme.breakpoints.down("md")]: {
      left: "70%",
    },
  },
  boxBlank: {
    position: "fixed",
    width: "100%",
    height: "100vh",
    background: "transparent",
    zIndex: "10",
  },
}));
const Navbar = () => {
  const styles = useStyles();

  const { state, dispatch } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const history = useHistory();
  const [open, setOpen] = React.useState(false);
  const anchorRef = React.useRef(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [dataSearch, setDataSearch] = useState([]);
  const inputRef = useRef();

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    inputRef.current.focus();
  };

  useEffect(() => {
    fetch("/getallusers", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data.users);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleCloses = (event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target)) {
      return;
    }

    setOpen(false);
  };

  function handleListKeyDown(event) {
    if (event.key === "Tab") {
      event.preventDefault();
      setOpen(false);
    }
  }
  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const logout = () => {
    localStorage.clear();
    dispatch({ type: "LOGOUT" });
    history.push("/login");
    setAnchorEl(null);
    setDataSearch([]);
  };

  const handleSearching = (e) => {
    if (e.target.value.length !== 0) {
      setSearchOpen(true);
      let myData = [];
      users.map((data) => {
        let n = data.name.indexOf(e.target.value);
        if (n !== -1) {
          myData.push(data);
        } else {
          return null;
        }
      });
      if (myData.length === 0) {
        setDataSearch([]);
        setSearchOpen(false);
      } else {
        setDataSearch(myData);
      }
    } else {
      setDataSearch([]);
      setSearchOpen(false);
    }
  };

  const handleCloseMenuSearch = () => {
    setDataSearch([]);
    setSearchOpen(false);
  };

  const handleShowDataSearch = () => {
    if (searchOpen) {
      return (
        <>
          <Paper style={{ padding: "10px" }} className={styles.boxDataSearch}>
            {dataSearch &&
              dataSearch.map((item) => (
                <Grid
                  container
                  key={item._id}
                  style={{
                    padding: "10px 0",
                    borderBottom: "1px solid rgba(0,0,0,.2)",
                  }}
                  alignItems="center"
                  justify="flex-start"
                >
                  <Grid item style={{ marginRight: "10px" }}>
                    <a
                      href={`/profil/${item._id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <Avatar src={item.photo} />
                    </a>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant="body2"
                      component="a"
                      href={`/profil/${item._id}`}
                      style={{
                        textDecoration: "none",
                        color: "#3f51b5",
                        fontSize: "18px",
                      }}
                    >
                      {item.name}
                    </Typography>
                  </Grid>
                </Grid>
              ))}
          </Paper>
        </>
      );
    }
  };

  const renderList = () => {
    if (state) {
      return [
        // <Link to="/allposts" key={4} className={styles.navLinkMenu}>
        //   All posts
        // </Link>,
        // <Link to="/" key={3} className={styles.navLinkMenu}>
        //   <SendOutlinedIcon style={{ fontSize: "25px" }} />
        // </Link>,

        <div className={styles.boxSearch} key={3}>
          <TextField
            label="Search..."
            size="small"
            variant="outlined"
            color="secondary"
            onKeyUp={handleSearching}
            ref={inputRef}
          />

          {handleShowDataSearch()}
        </div>,

        <div className={styles.grow} key={4} />,
        <IconButton
          key={1}
          ref={anchorRef}
          aria-controls={open ? "menu-list-grow" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          style={{ marginRight: "-10px" }}
        >
          {" "}
          <HomeOutlinedIcon style={{ fontSize: "30px" }} />
        </IconButton>,
        <div className={styles.boxAvatar} onClick={handleClick} key={2}>
          <Avatar
            className={styles.small}
            src={state.photo ? state.photo : null}
          />
        </div>,
      ];
    } else {
      return [
        <Typography className={styles.linkMenu} key={1}>
          <Link to="/login" className={styles.navLink}>
            Login
          </Link>
          <Link to="/register" className={styles.navLink}>
            Register
          </Link>
        </Typography>,
      ];
    }
  };

  return (
    <>
      <AppBar
        color="inherit"
        style={{
          boxShadow: "none",
          borderBottom: "1px solid rgba(0,0,0,.2)",
          // zIndex: "9999",
        }}
      >
        <Container fixed>
          {/* {dataSearch &&
            dataSearch.map((item) => <p key={item._id}>{item.name}</p>)} */}
          <Toolbar>
            <Link
              to={state ? "/" : "/login"}
              style={{
                display: "flex",
                alignItems: "center",
                textDecoration: "none",
                color: "#333",
              }}
            >
              <IconButton>
                <InstagramIcon color="secondary" />
              </IconButton>

              <Typography
                variant="h5"
                style={{ fontFamily: "'Grand Hotel', cursive" }}
                className={styles.navbarTitle}
              >
                Instagram clone
              </Typography>
            </Link>
            <div className={styles.grow} />
            {renderList()}
          </Toolbar>
        </Container>
      </AppBar>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
        TransitionComponent={Fade}
      >
        <Link className={styles.navLink} to="/profil">
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            Profile
          </MenuItem>
        </Link>
        <Link className={styles.navLink} to="/post/create">
          <MenuItem onClick={handleClose}>
            <ListItemIcon>
              <PostAddIcon />
            </ListItemIcon>
            Create post
          </MenuItem>
        </Link>
        <MenuItem onClick={logout}>
          <ListItemIcon style={{ witdh: "20px" }}>
            <ExitToAppIcon />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>

      <Popper
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        style={{ zIndex: "999", marginTop: "7px" }}
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === "bottom" ? "center top" : "center bottom",
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleCloses}>
                <MenuList
                  autoFocusItem={open}
                  id="menu-list-grow"
                  onKeyDown={handleListKeyDown}
                >
                  <MenuItem
                    onClick={handleCloses}
                    component={Link}
                    to="/allposts"
                  >
                    All Posts
                  </MenuItem>
                  <MenuItem onClick={handleCloses} component={Link} to="/">
                    My Followers Posts
                  </MenuItem>
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>

      {searchOpen ? (
        <div className={styles.boxBlank} onClick={handleCloseMenuSearch}></div>
      ) : null}
    </>
  );
};

export default Navbar;
