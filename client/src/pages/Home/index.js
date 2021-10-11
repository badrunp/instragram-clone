import React, { useState, useEffect, useContext } from "react";
import {
  Card,
  Container,
  Grid,
  CardHeader,
  Avatar,
  IconButton,
  CardContent,
  Typography,
  CardActions,
  CardMedia,
  TextField,
  Menu,
  ListItemIcon,
  MenuItem,
  Button,
  Paper,
  GridList,
  GridListTile,
  CircularProgress,
} from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { Favorite } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";
import FavoriteBorderOutlinedIcon from "@material-ui/icons/FavoriteBorderOutlined";
import { UserContext } from "../../config/routes";
import ModeCommentOutlinedIcon from "@material-ui/icons/ModeCommentOutlined";
import { Link } from "react-router-dom";
import SendOutlinedIcon from "@material-ui/icons/SendOutlined";
import Fade from "@material-ui/core/Fade";
import DeleteIcon from "@material-ui/icons/Delete";
import VisibilityOffIcon from "@material-ui/icons/VisibilityOff";
import Dialog from "@material-ui/core/Dialog";

const useStyles = makeStyles((theme) => ({
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  boxInformation: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "column",
    marginRight: "10px",
  },
  iconAbsolute: {
    position: "absolute",
    top: "50%",
    right: "0",
    cursor: "pointer",
  },
  gridList: {
    flexWrap: "nowrap",
    // Promote the list into his own layer on Chrome. This cost memory but helps keeping high FPS.
    transform: "translateZ(0)",
  },
  rootGrid: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper,
  },
  gridListTile: {
    padding: "15px",
  },
  large: {
    width: theme.spacing(8),
    height: theme.spacing(8),
  },
  dialogImage: {
    width: "400px",
    maxWidth: "100%",
  },
}));

let interval;
function Home() {
  const styles = useStyles();
  const [dataPost, setDataPost] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dataId, setdataId] = useState("");
  const [postIdd, setPostIdd] = useState("");
  const [users, setUsers] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [imageDialog, setImageDialog] = useState("");
  const [loadingFollow, setLoadingFollow] = useState({
    loading: false,
    userId: null,
  });

  useEffect(() => {
    fetch("/getsubpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDataPost(data.posts);
      })
      .catch((error) => console.log(error));
  }, []);

  const handleClick = (event, userId, postId) => {
    setPostIdd(postId);
    setdataId(userId);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    fetch("/users", {
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

  const [postArray, setPostArray] = useState([]);
  const likePost = (id) => {
    setPostArray([...postArray, id]);

    const n = dataPost.map((item) => {
      if (item._id === id) {
        return { ...item, likes: [...item.likes, state._id] };
      } else {
        return item;
      }
    });
    // console.log({ id: postArray[postArray.length - 1] }, { id });
    setDataPost(n);
    if (postArray[postArray.length - 1] === id) {
      clearTimeout(interval);
    }
    huhi(id);
  };

  const huhi = (id) => {
    interval = setTimeout(() => {
      fetch("/user/like", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ postId: id }),
      })
        .then((res) => res.json())
        .then((data) => {});
    }, 3000);
  };

  const unLike = (id) => {
    setPostArray([...postArray, id]);
    const n = dataPost.map((item) => {
      if (item._id === id) {
        return { ...item, likes: item.likes.filter((i) => i !== state._id) };
      } else {
        return item;
      }
    });
    setDataPost(n);

    // console.log({ id: postArray[postArray.length - 1] }, { id });
    if (postArray[postArray.length - 1] === id) {
      clearTimeout(interval);
    }
    interval = setTimeout(() => {
      fetch("/user/unlike", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ postId: id }),
      })
        .then((res) => res.json())
        .then((data) => {});
    }, 3000);
  };

  const handleComment = (text, postId) => {
    fetch("/user/comment", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        text,
        postId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const newData = dataPost.map((item) => {
          if (item._id === data.result._id) {
            return data.result;
          } else {
            return item;
          }
        });
        setDataPost(newData);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeletePost = (id) => {
    const newData = dataPost.filter((item) => {
      return item._id !== id;
    });

    setDataPost(newData);
    fetch(`/deletepost/${id}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        // console.log(data);
        // const newData = dataPost.filter((item) => {
        //   return item._id !== data.result._id;
        // });
        // setDataPost(newData);
      });

    setAnchorEl(null);
  };

  const handleFollowUser = (userid) => {
    setLoadingFollow({ loading: true, userId: userid });
    setTimeout(() => {
      setLoadingFollow({ loading: false, userId: null });
      const newUsers = users.filter((i) => i._id !== userid);

      setUsers(newUsers);

      fetch("/follow", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ followId: userid }),
      })
        .then((res) => res.json())
        .then((data) => {
          dispatch({
            type: "UPDATE",
            payload: {
              followers: data.result.followers,
              following: data.result.following,
            },
          });
          localStorage.setItem("user", JSON.stringify(data.result));
        });
    }, 1500);
  };

  const handleOpenDialog = (image) => {
    setImageDialog(image);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  return (
    <>
      <Container fixed>
        {users.length > 1 ? (
          <Grid container style={{ marginTop: "80px" }} justify="center">
            <Grid item xs={12} container justify="center">
              <Card style={{ width: "max-content" }}>
                <CardContent>
                  <Grid
                    container
                    style={{ padding: "5px 5px 15px 5px" }}
                    justify="space-between"
                    alignItems="center"
                  >
                    <Grid item>
                      <Typography variant="h6">New User</Typography>
                    </Grid>
                    <Grid item>
                      <Link to="/users" style={{ textDecoration: "none" }}>
                        <Button variant="outlined" size="small">
                          View All
                        </Button>
                      </Link>
                    </Grid>
                  </Grid>
                  <div className={styles.rootGrid}>
                    <GridList className={styles.gridList} cols={2.5}>
                      {users.length > 0
                        ? users.map((item) => {
                            if (
                              !state.following.includes(item._id) &&
                              state._id !== item._id
                            ) {
                              return (
                                <GridListTile
                                  // className={styles.gridListTile}
                                  style={{
                                    width: "200px",
                                    height: "100%",
                                    margin: "0 10px",
                                  }}
                                  key={item._id}
                                >
                                  <Paper
                                    variant="outlined"
                                    className={styles.gridListTile}
                                  >
                                    <Grid
                                      container
                                      direction="column"
                                      wrap="nowrap"
                                    >
                                      <Grid
                                        item
                                        style={{ margin: "7px auto 15px" }}
                                      >
                                        <Link to={`/profil/${item._id}`}>
                                          <Avatar
                                            className={styles.large}
                                            src={item.photo}
                                          />
                                        </Link>
                                      </Grid>
                                      <Grid
                                        item
                                        style={{ textAlign: "center" }}
                                      >
                                        <Typography
                                          variant="body1"
                                          style={{
                                            fontWeight: "600",
                                            textDecoration: "none",
                                            color: "#3f51b5",
                                          }}
                                          zerominwidth="true"
                                          noWrap
                                          component={Link}
                                          to={
                                            state._id === item._id
                                              ? "/profil"
                                              : `/profil/${item._id}`
                                          }
                                        >
                                          {item.name}
                                        </Typography>
                                      </Grid>
                                      <Grid item style={{ margin: "15px 0" }}>
                                        <Button
                                          variant="contained"
                                          color="secondary"
                                          fullWidth
                                          onClick={() =>
                                            handleFollowUser(item._id)
                                          }
                                        >
                                          {loadingFollow.loading &&
                                          item._id === loadingFollow.userId ? (
                                            <CircularProgress
                                              size={25}
                                              style={{ color: "white" }}
                                            />
                                          ) : (
                                            "Follow"
                                          )}
                                        </Button>
                                      </Grid>
                                    </Grid>
                                  </Paper>
                                </GridListTile>
                              );
                            }
                          })
                        : null}
                    </GridList>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        ) : null}

        {/* <Button
          ref={anchorRef}
          aria-controls={open ? "menu-list-grow" : undefined}
          aria-haspopup="true"
          onClick={handleToggle}
          variant="contained"
          color="secondary"
        >
          Select Post
        </Button> */}
        <Grid container justify="center" spacing={3}>
          {true
            ? dataPost.map((item, i) => (
                <Grid
                  item
                  xs={12}
                  md={6}
                  lg={4}
                  style={{ marginTop: "20px" }}
                  key={item._id}
                >
                  <Card>
                    <CardHeader
                      avatar={
                        <Link
                          to={`/profil${
                            item.postedBy._id !== state._id
                              ? "/" + item.postedBy._id
                              : ""
                          }`}
                          style={{ textDecoration: "none", color: "#3f51b5" }}
                        >
                          <Avatar
                            aria-label="recipe"
                            src={item.postedBy.photo}
                          />
                        </Link>
                      }
                      action={
                        <IconButton
                          aria-label="settings"
                          onClick={(e) =>
                            handleClick(e, item.postedBy._id, item._id)
                          }
                        >
                          <MoreVertIcon />
                        </IconButton>
                      }
                      title={
                        <Link
                          to={`/profil${
                            item.postedBy._id !== state._id
                              ? "/" + item.postedBy._id
                              : ""
                          }`}
                          style={{
                            textDecoration: "none",
                            color: "#3f51b5",
                            fontSize: "16px",
                            fontWeight: "bold",
                          }}
                        >
                          {item.postedBy.name}
                        </Link>
                      }
                      subheader="2 jam yang lalu"
                    />

                    {item.photo && item.photo !== "no photo" ? (
                      <CardMedia
                        className={styles.media}
                        image={item.photo}
                        title={item.name}
                        onClick={() => handleOpenDialog(item.photo)}
                        style={{ cursor: "pointer" }}
                      />
                    ) : null}

                    <CardActions disableSpacing>
                      <div className={styles.boxInformation}>
                        <IconButton
                          aria-label="add to favorites"
                          onClick={() => {
                            if (
                              state &&
                              item.likes.some((like) => like === state._id)
                            ) {
                              unLike(item._id);
                            } else {
                              likePost(item._id);
                            }
                          }}
                        >
                          {/* <Favorite
                            color={
                              state &&
                              item.likes.some((like) => like === state._id)
                                ? "secondary"
                                : "inherit"
                            }
                          /> */}
                          {state &&
                          item.likes.some((like) => like === state._id) ? (
                            <Favorite color="secondary" fontSize="large" />
                          ) : (
                            <FavoriteBorderOutlinedIcon fontSize="large" />
                          )}
                        </IconButton>
                      </div>
                      <div className={styles.boxInformation}>
                        <Link to={`/comment/${item._id}`}>
                          <IconButton aria-label="comments">
                            <ModeCommentOutlinedIcon fontSize="large" />
                          </IconButton>
                        </Link>
                      </div>
                    </CardActions>
                    <Typography
                      variant="body1"
                      style={{ margin: "-10px 0 0 15px", fontWeight: "600" }}
                    >
                      Like {item.likes.length}
                    </Typography>

                    <CardContent>
                      <Typography
                        variant="body1"
                        style={{ marginBottom: "5px" }}
                      >
                        {item.title}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        style={{ marginTop: "-5px" }}
                      >
                        {item.body}
                      </Typography>

                      {item.comments.length > 2 ? (
                        <Typography
                          variant="subtitle1"
                          style={{ marginTop: "5px" }}
                        >
                          <Link
                            to={`/comment/${item._id}`}
                            style={{
                              textDecoration: "none",
                              color: "dodgerblue",
                            }}
                          >
                            Lihat semua {item.comments.length} komentar
                          </Link>
                        </Typography>
                      ) : (
                        <div style={{ marginTop: "5px" }}></div>
                      )}

                      <div>
                        {item.comments.map((comment, i) => {
                          if (i > item.comments.length - 3) {
                            return (
                              <Grid container key={comment._id} wrap="nowrap">
                                <Typography
                                  style={{ marginRight: "8px" }}
                                  variant="body2"
                                >
                                  {comment.postedBy.name}
                                </Typography>
                                <Grid item xs zeroMinWidth>
                                  <Typography
                                    variant="body2"
                                    noWrap
                                    color="textSecondary"
                                  >
                                    {comment.text}
                                  </Typography>
                                </Grid>
                              </Grid>
                            );
                          }
                        })}
                      </div>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (e.target[0].value !== "") {
                            handleComment(e.target[0].value, item._id);
                            e.target[0].value = "";
                            e.target[0].focus();
                          }
                        }}
                      >
                        <div style={{ position: "relative" }}>
                          <TextField
                            label="Berikan Komentar...."
                            style={{
                              marginTop: "10px",
                              width: "calc(100% - 35px)",
                            }}
                            color="secondary"
                          />
                          <button
                            className={styles.iconAbsolute}
                            style={{
                              border: "none",
                              background: "white",
                              outline: "none",
                            }}
                          >
                            <SendOutlinedIcon />
                          </button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            : null}
        </Grid>

        <Menu
          id="simple-menu"
          anchorEl={anchorEl}
          keepMounted
          open={Boolean(anchorEl)}
          onClose={handleClose}
          TransitionComponent={Fade}
        >
          {dataId && dataId == state._id ? (
            <MenuItem onClick={() => handleDeletePost(postIdd)}>
              <ListItemIcon>
                <DeleteIcon />
              </ListItemIcon>
              Hapus postingan saya
            </MenuItem>
          ) : (
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <VisibilityOffIcon />
              </ListItemIcon>
              Jangan tampilkan postingan ini
            </MenuItem>
          )}
        </Menu>
      </Container>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <img src={imageDialog} className={styles.dialogImage} />
      </Dialog>
    </>
  );
}

export default Home;
