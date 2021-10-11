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

const UsersFollowers = () => {
  const styles = useStyles();
  const [users, setUsers] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const { userid } = useParams();
  const [loadingFollow, setLoadingFollow] = useState({
    loading: false,
    userId: null,
  });

  useEffect(() => {
    fetch("/getfollowers/" + userid, {
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

  const handleFollowUser = (userid) => {
    setLoadingFollow({ loading: true, userId: userid });
    setTimeout(() => {
      setLoadingFollow({ loading: false, userId: null });
      const newUsers = users.map((item) => {
        if (item._id === userid) {
          return {
            ...item,
            followers: [...item.followers, state._id],
          };
        } else {
          return item;
        }
      });
      setUsers(newUsers);
      // setUsers((prevState) => {
      //   return {
      //     ...prevState,
      //     followers: [...prevState.followers, state._id],
      //   };
      // });

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

  const handleUnFollowUser = (userid) => {
    setLoadingFollow({ loading: true, userId: userid });
    setTimeout(() => {
      setLoadingFollow({ loading: false, userId: null });
      const newUsers = users.map((item) => {
        if (item._id === userid) {
          return {
            ...item,
            followers: item.followers.filter((i) => i !== state._id),
          };
        } else {
          return item;
        }
      });
      setUsers(newUsers);
      // setUsers((prevState) => {
      //   const newUser = prevState.followers.filter((i) => i !== state._id);
      //   return {
      //     ...prevState,
      //     followers: newUser,
      //   };
      // });

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
                          {item._id !== state._id ? (
                            item.followers.some((i) => i === state._id) ? (
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
                            ) : (
                              <Button
                                variant="contained"
                                size="small"
                                color="secondary"
                                style={{ boxShadow: "none" }}
                                onClick={() => handleFollowUser(item._id)}
                              >
                                {loadingFollow.loading &&
                                item._id === loadingFollow.userId ? (
                                  <CircularProgress
                                    size={25}
                                    style={{ color: "white" }}
                                  />
                                ) : (
                                  "Unfollow"
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
                <Typography>No Followers!</Typography>
              </Paper>
            </Grid>
          </Grid>
        )}
      </Container>
    </>
  );
};

export default UsersFollowers;
