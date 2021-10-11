import React, { useState, useEffect, useContext } from "react";
import {
  Container,
  Grid,
  Paper,
  Avatar,
  Typography,
  Button,
  CircularProgress,
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { UserContext } from "../../config/routes";
import { Link, useParams } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
}));

const UsersFollowing = () => {
  const styles = useStyles();
  const [users, setUsers] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [loadingFollow, setLoadingFollow] = useState({
    loading: false,
    userId: null,
  });

  const { userid } = useParams();

  useEffect(() => {
    fetch("/getfollowing/" + userid, {
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

  const handleUnFollowUser = (followid) => {
    setLoadingFollow({ loading: true, userId: followid });
    setTimeout(() => {
      setLoadingFollow({ loading: false, userId: null });
      if (userid === state._id) {
        const newUsers = users.filter((i) => i._id !== followid);
        setUsers(newUsers);
      } else {
        const newUsers = users.map((item) => {
          if (item._id === followid) {
            return {
              ...item,
              followers: item.followers.filter((i) => i !== state._id),
            };
          } else {
            return item;
          }
        });

        setUsers(newUsers);
      }

      fetch("/unfollow", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ unfollowId: followid }),
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

  const handleFollowUser = (followid) => {
    setLoadingFollow({ loading: true, userId: followid });
    setTimeout(() => {
      setLoadingFollow({ loading: false, userId: null });
      const newUser = users.map((item) => {
        if (item._id === followid) {
          return {
            ...item,
            followers: [...item.followers, state._id],
          };
        } else {
          return item;
        }
      });
      setUsers(newUser);

      fetch("/follow", {
        method: "put",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ followId: followid }),
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
      <Container fixed>
        {users.length > 0 ? (
          <Grid container justify="center" style={{ marginTop: "80px" }}>
            <Grid item xs={12} md={8}>
              <Paper style={{ padding: "20px" }}>
                {users.length > 0
                  ? users.map((item) => (
                      <Grid
                        container
                        key={item._id}
                        alignItems="center"
                        spacing={1}
                        style={{
                          borderBottom: "1px solid rgba(0,0,0,.2)",
                          padding: "5px 0",
                        }}
                      >
                        <Grid item>
                          <Link
                            to={`/profil${
                              item._id !== state._id ? "/" + item._id : ""
                            }`}
                          >
                            <Avatar src={item.photo} />
                          </Link>
                        </Grid>
                        <Grid item>
                          <Typography
                            variant="body2"
                            component={Link}
                            to={`/profil${
                              item._id !== state._id ? "/" + item._id : ""
                            }`}
                            style={{ color: "#3f51b5", textDecoration: "none" }}
                          >
                            {item.name}
                          </Typography>
                        </Grid>
                        <div className={styles.grow} />
                        <Grid item>
                          {state._id !== item._id ? (
                            item.followers.some((i) => i === state._id) ? (
                              item._id !== state._id ? (
                                <Button
                                  variant="outlined"
                                  size="small"
                                  color="secondary"
                                  style={{ boxShadow: "none" }}
                                  onClick={() => handleUnFollowUser(item._id)}
                                >
                                  {loadingFollow.loading &&
                                  item._id === loadingFollow.userId ? (
                                    <CircularProgress
                                      size={25}
                                      style={{ color: "black" }}
                                    />
                                  ) : (
                                    "Unfollow"
                                  )}
                                </Button>
                              ) : null
                            ) : (
                              <Button
                                size="small"
                                variant="contained"
                                color="secondary"
                                style={{
                                  boxShadow: "none",
                                  marginLeft: "10px",
                                }}
                                onClick={() => handleFollowUser(item._id)}
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
                            )
                          ) : null}
                        </Grid>
                      </Grid>
                    ))
                  : null}
              </Paper>
            </Grid>
          </Grid>
        ) : (
          <Grid container justify="center" style={{ marginTop: "80px" }}>
            <Grid item>
              <Paper style={{ padding: "10px" }}>
                <Typography>No Following!</Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
    </>
  );
};

export default UsersFollowing;
