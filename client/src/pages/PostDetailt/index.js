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
import { Link, useHistory, useParams } from "react-router-dom";
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
function PostDetailt() {
  const styles = useStyles();
  const [datapost, setDataPost] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [dataId, setdataId] = useState("");
  const [postIdd, setPostIdd] = useState("");
  const { postid } = useParams();

  const history = useHistory();

  useEffect(() => {
    fetch("/getpostbyid/" + postid, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setDataPost(data.post);
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

    // console.log({ id: postArray[postArray.length - 1] }, { id });
    setDataPost((prevState) => {
      return {
        ...prevState,
        likes: [...prevState.likes, state._id],
      };
    });
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
    setDataPost((prevState) => {
      return {
        ...prevState,
        likes: prevState.likes.filter((i) => i !== state._id),
      };
    });

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
        // console.log(data);
        // const newData = dataPost.map((item) => {
        //   if (item._id === data.result._id) {
        //     return data.result;
        //   } else {
        //     return item;
        //   }
        // });
        setDataPost(data.result);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleDeletePost = (id) => {
    // const newData = dataPost.filter((item) => {
    //   return item._id !== id;
    // });

    // setDataPost(newData);
    fetch(`/deletepost/${id}`, {
      method: "delete",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        history.push("/profil");
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
      {datapost && datapost._id ? (
        <Container fixed>
          <Grid container justify="center" spacing={3}>
            <Grid
              item
              xs={12}
              lg={4}
              style={{ marginTop: "20px" }}
              key={datapost._id}
            >
              <Card>
                <CardHeader
                  avatar={
                    <Avatar aria-label="recipe" src={datapost.postedBy.photo} />
                  }
                  action={
                    <IconButton
                      aria-label="settings"
                      onClick={(e) =>
                        handleClick(e, datapost.postedBy._id, datapost._id)
                      }
                    >
                      <MoreVertIcon />
                    </IconButton>
                  }
                  title={
                    <Link
                      to={`/profil${
                        datapost.postedBy._id !== state._id
                          ? "/" + datapost.postedBy._id
                          : ""
                      }`}
                      style={{ textDecoration: "none", color: "#333" }}
                    >
                      {datapost.postedBy.name}
                    </Link>
                  }
                  subheader="2 jam yang lalu"
                />

                {datapost.photo && datapost.photo !== "no photo" ? (
                  <CardMedia
                    className={styles.media}
                    image={datapost.photo}
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
                          datapost.likes.some((like) => like === state._id)
                        ) {
                          unLike(datapost._id);
                        } else {
                          likePost(datapost._id);
                        }
                      }}
                    >
                      {state &&
                      datapost.likes.some((like) => like === state._id) ? (
                        <Favorite color="secondary" fontSize="large" />
                      ) : (
                        <FavoriteBorderOutlinedIcon fontSize="large" />
                      )}
                    </IconButton>
                  </div>
                  <div className={styles.boxInformation}>
                    <Link to={`/comment/${datapost._id}`}>
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
                  Like {datapost.likes.length}
                </Typography>

                <CardContent>
                  <Typography variant="body1" style={{ marginBottom: "5px" }}>
                    {datapost.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    style={{ marginTop: "-5px" }}
                  >
                    {datapost.body}
                  </Typography>

                  {datapost.comments.length > 2 ? (
                    <Typography
                      variant="subtitle1"
                      style={{ marginTop: "5px" }}
                    >
                      <Link
                        to={`/comment/${datapost._id}`}
                        style={{
                          textDecoration: "none",
                          color: "dodgerblue",
                        }}
                      >
                        Lihat semua {datapost.comments.length} komentar
                      </Link>
                    </Typography>
                  ) : (
                    <div style={{ marginTop: "5px" }}></div>
                  )}

                  <div>
                    {datapost.comments.map((comment, i) => {
                      if (i > datapost.comments.length - 3) {
                        return (
                          <Grid container key={comment._id} wrap="nowrap">
                            <Typography
                              style={{ marginRight: "8px" }}
                              variant="body2"
                            >
                              {comment.postedBy.name}
                            </Typography>
                            <Grid dataPost xs zeroMinWidth>
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
                        handleComment(e.target[0].value, datapost._id);
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
      ) : (
        "Loading..."
      )}
    </>
  );
}

export default PostDetailt;
