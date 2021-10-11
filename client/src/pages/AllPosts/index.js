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
}));

let interval;
function AllPosts() {
  const styles = useStyles();
  const [dataPost, setDataPost] = useState([]);
  const { state } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dataId, setdataId] = useState("");
  const [postIdd, setPostIdd] = useState("");

  useEffect(() => {
    fetch("/getallpost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDataPost(data.posts);
      });
  }, [setDataPost]);

  const handleClick = (event, userId, postId) => {
    setPostIdd(postId);
    setdataId(userId);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

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
    }, 5000);
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
    }, 5000);
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

  return (
    <>
      <Container fixed>
        <Grid container justify="center" spacing={3}>
          {true
            ? dataPost.map((item, i) => (
                <Grid
                  item
                  xs={12}
                  lg={4}
                  style={{ marginTop: "20px" }}
                  key={item._id}
                >
                  <Card>
                    <CardHeader
                      avatar={<Avatar aria-label="recipe" src={item.photo} />}
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
                          style={{ textDecoration: "none", color: "#333" }}
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
                        title="Paella dish"
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
                          } else {
                            return null;
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
          {dataId && dataId === state._id ? (
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
    </>
  );
}

export default AllPosts;
