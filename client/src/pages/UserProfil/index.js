import {
  Avatar,
  Container,
  Grid,
  makeStyles,
  Typography,
  Button,
  CircularProgress,
} from "@material-ui/core";
import React, { useEffect, useState, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import { UserContext } from "../../config/routes";

const useStyles = makeStyles((theme) => ({
  large: {
    width: theme.spacing(18),
    height: theme.spacing(18),
    [theme.breakpoints.up("md")]: {
      width: theme.spacing(25),
      height: theme.spacing(25),
    },
  },
  subInfo: {
    fontSize: "12px",
    [theme.breakpoints.up("md")]: {
      fontSize: "16px",
    },
  },
  name: {
    fontSize: "18px",
    textAlign: "center",
    [theme.breakpoints.up("md")]: {
      fontSize: "30px",
      textAlign: "left",
    },
    [theme.breakpoints.up("sm")]: {
      textAlign: "left",
    },
  },
  boxContainer: {
    flexDirection: "column",
    alignItems: "center",
    [theme.breakpoints.up("sm")]: {
      flexDirection: "row",
    },
  },
  boxAvatar: {
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    marginRight: "0",
    [theme.breakpoints.up("sm")]: {
      justifyContent: "flex-end",
      marginTop: "30px",
      marginRight: "20px",
    },
  },
  image: {
    width: "100%",
    height: "300px",
    objectFit: "cover",
    borderRadius: "4px",
  },
  textCenter: {
    justifyContent: "center",
    [theme.breakpoints.up("sm")]: {
      justifyContent: "flex-start",
    },
  },
}));

function UserProfil() {
  const styles = useStyles();
  const { state, dispatch } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState([]);
  const { userid } = useParams();
  const [loadingFollow, setLoadingFollow] = useState({
    loading: false,
    userId: null,
  });

  useEffect(() => {
    fetch("/user/" + userid, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts);
        setUser(data.user);
      });
  }, []);

  const handleFollowUser = () => {
    setLoadingFollow({ loading: true, userId: userid });
    setTimeout(() => {
      setLoadingFollow({ loading: false, userId: null });
      setUser((prevState) => {
        return {
          ...prevState,
          followers: [...prevState.followers, state._id],
        };
      });

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
          // setUser(data.result2);
        });
    }, 1500);
  };

  const handleUnFollowUser = () => {
    setLoadingFollow({ loading: true, userId: userid });
    setTimeout(() => {
      setLoadingFollow({ loading: false, userId: null });
      setUser((prevState) => {
        const newUser = prevState.followers.filter((i) => i !== state._id);
        return {
          ...prevState,
          followers: newUser,
        };
      });

      fetch("/unfollow", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ unfollowId: userid }),
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
          // setUser(data.result2);
        });
    }, 1500);
  };

  return (
    <>
      {user && user.followers && posts ? (
        <>
          <Grid
            container
            justify="center"
            className={styles.boxContainer}
            style={{
              borderBottom: "1px solid rgba(0,0,0,.3)",
              paddingBottom: "20px",
              marginBottom: "30px",
            }}
          >
            <Grid item xs={12} sm={5} container className={styles.boxAvatar}>
              <Avatar
                className={styles.large}
                src={user && user.photo ? user.photo : null}
              />
            </Grid>
            <Grid
              item
              style={{ marginTop: "30px" }}
              xs={12}
              sm={5}
              container
              alignItems="center"
            >
              <Grid container className={styles.textCenter}>
                <Grid item>
                  <Typography
                    variant="h4"
                    style={{ marginBottom: "10px", height: "30.42px" }}
                    className={styles.name}
                  >
                    {user.name}{" "}
                    {user.followers &&
                    user.followers.some((i) => i === state._id) ? (
                      <Button
                        size="small"
                        variant="outlined"
                        color="secondary"
                        style={{ boxShadow: "none", marginLeft: "10px" }}
                        onClick={handleUnFollowUser}
                      >
                        {loadingFollow.loading ? (
                          <CircularProgress
                            size={23}
                            style={{ color: "black" }}
                          />
                        ) : (
                          "Unfollow"
                        )}
                      </Button>
                    ) : (
                      <Button
                        size="small"
                        variant="contained"
                        color="secondary"
                        style={{ boxShadow: "none", marginLeft: "10px" }}
                        onClick={handleFollowUser}
                      >
                        {loadingFollow.loading ? (
                          <CircularProgress
                            size={23}
                            style={{ color: "white" }}
                          />
                        ) : (
                          "follow"
                        )}
                      </Button>
                    )}
                  </Typography>

                  <Typography
                    variant="h4"
                    style={{ marginBottom: "15px" }}
                    className={styles.name}
                  >
                    {user.email}
                  </Typography>
                </Grid>
                <Grid container spacing={2} className={styles.textCenter}>
                  <Grid item>
                    <Typography variant="h6" className={styles.subInfo}>
                      {posts.length} Posting
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant="h6"
                      className={styles.subInfo}
                      component={Link}
                      to={`/profil/followers/${user._id}`}
                      style={{
                        color: "#3f51b5",
                        textDecoration: "none",
                      }}
                    >
                      {user.followers && user.followers.length} Followers
                    </Typography>
                  </Grid>
                  <Grid item>
                    <Typography
                      variant="h6"
                      className={styles.subInfo}
                      component={Link}
                      to={`/profil/following/${user._id}`}
                      style={{ color: "#3f51b5", textDecoration: "none" }}
                    >
                      {user.following && user.following.length} Following
                    </Typography>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Container fixed>
            <Grid container spacing={3}>
              {posts.map((item) => (
                <Grid
                  item
                  xs={12}
                  sm={6}
                  md={4}
                  key={item._id}
                  container
                  justify="center"
                >
                  <Link to={`/profil/post/${item._id}`}>
                    <img src={item.photo} className={styles.image} />
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Container>
        </>
      ) : (
        "Loading..."
      )}
    </>
  );
}

export default UserProfil;
