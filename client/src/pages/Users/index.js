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
import { Link } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  grow: {
    flexGrow: 1,
  },
}));

const Users = () => {
  const styles = useStyles();
  const [users, setUsers] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [loadingFollow, setLoadingFollow] = useState({
    loading: false,
    userId: null,
  });

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

  return (
    <>
      {users.length > 1 ? (
        <Container fixed>
          <Grid container justify="center" style={{ marginTop: "80px" }}>
            <Grid item xs={12} md={8}>
              <Paper style={{ padding: "20px" }}>
                {users.length > 0
                  ? users.map((item) => {
                      if (
                        !state.following.includes(item._id) &&
                        state._id !== item._id
                      ) {
                        return (
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
                                to={`/profil/${item._id}`}
                                style={{
                                  textDecoration: "none",
                                  color: "#3f51b5",
                                }}
                              >
                                <Avatar src={item.photo} />
                              </Link>
                            </Grid>
                            <Grid item>
                              <Typography
                                variant="body2"
                                component={Link}
                                to={`/profil/${item._id}`}
                                style={{
                                  textDecoration: "none",
                                  color: "#3f51b5",
                                }}
                              >
                                {item.name}
                              </Typography>
                            </Grid>
                            <div className={styles.grow} />
                            <Grid item>
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
                                  "Follow"
                                )}
                              </Button>
                            </Grid>
                          </Grid>
                        );
                      }
                    })
                  : null}
              </Paper>
            </Grid>
          </Grid>
        </Container>
      ) : (
        <Grid container justify="center">
          <Grid item>
            <Paper style={{ padding: "10px", marginTop: "20px" }}>
              <Typography>No users!</Typography>
            </Paper>
          </Grid>
        </Grid>
      )}
    </>
  );
};

export default Users;
