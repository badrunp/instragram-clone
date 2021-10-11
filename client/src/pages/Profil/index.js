import {
  Avatar,
  Container,
  Grid,
  makeStyles,
  IconButton,
  Typography,
  CircularProgress,
} from "@material-ui/core";
import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../config/routes";
import { green } from "@material-ui/core/colors";
import AddAPhotoIcon from "@material-ui/icons/AddAPhoto";
import { Link } from "react-router-dom";

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
  },
  textCenter: {
    justifyContent: "center",
    [theme.breakpoints.up("sm")]: {
      justifyContent: "flex-start",
    },
  },
  boxAvatarProfil: {
    position: "relative",
    marginTop: "10px",
  },
  inputFilesContainer: {
    position: "absolute",
    right: "0",
    bottom: "0",
  },
  buttonProgress: {
    color: green[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -22,
    marginLeft: -22,
  },
  boxLoadingProgress: {
    position: "relative",
  },
}));

function Profil() {
  const styles = useStyles();
  const { state, dispatch } = useContext(UserContext);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/getmypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPosts(data.posts);
      });
  }, [state]);

  const handleChangeImage = (e) => {
    // setTestPhoto(URL.createObjectURL(e.target.files[0]));
    // dispatch({
    //   type: "UPDATEPHOTO",
    //   payload: URL.createObjectURL(e.target.files[0]),
    // });
    const data = new FormData();
    data.append("file", e.target.files[0]);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "dha5gfvpi");
    if (e.target.files[0]) {
      setLoading(true);
      fetch("https://api.cloudinary.com/v1_1/dha5gfvpi/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          localStorage.setItem(
            "user",
            JSON.stringify({ ...state, photo: data.url })
          );
          dispatch({
            type: "UPDATEPHOTO",
            payload: data.url,
          });
          setLoading(false);
          fetch("/updatephotoprofi", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
            body: JSON.stringify({ photo: data.url }),
          })
            .then((res) => res.json())
            .then((resData) => {});
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  return (
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
          <div className={styles.boxAvatarProfil}>
            <Avatar
              className={styles.large}
              src={state && state.photo ? state.photo : null}
            />

            <div className={styles.inputFilesContainer}>
              <input
                id="icon-button-file"
                type="file"
                style={{ display: "none" }}
                onChange={handleChangeImage}
              />
              <label htmlFor="icon-button-file">
                <div className={styles.boxLoadingProgress}>
                  <IconButton
                    color="secondary"
                    aria-label="upload picture"
                    component="span"
                    style={{ background: "white" }}
                  >
                    <AddAPhotoIcon />
                  </IconButton>
                  {loading && (
                    <CircularProgress
                      size={44}
                      className={styles.buttonProgress}
                    />
                  )}
                </div>
              </label>
            </div>
          </div>
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
            <Grid item xs={12}>
              <Typography
                variant="h4"
                style={{ marginBottom: "10px" }}
                className={styles.name}
              >
                {state ? state.name : "Loading..."}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Typography
                variant="h4"
                style={{ marginBottom: "15px" }}
                className={styles.name}
              >
                {state ? state.email : "Loading..."}
              </Typography>
            </Grid>
            <Grid container spacing={2} className={styles.textCenter}>
              <Grid item>
                <Typography variant="h6" className={styles.subInfo}>
                  {posts.length} Post
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  variant="h6"
                  className={styles.subInfo}
                  component={Link}
                  to={`/profil/followers/${
                    state && state._id ? state._id : ""
                  }`}
                  style={{ textDecoration: "none", color: "#3f51b5" }}
                >
                  {state && state.followers && state.followers.length} Pollowers
                </Typography>
              </Grid>
              <Grid item>
                <Typography
                  variant="h6"
                  className={styles.subInfo}
                  component={Link}
                  to={`/profil/following/${
                    state && state._id ? state._id : ""
                  }`}
                  style={{ textDecoration: "none", color: "#3f51b5" }}
                >
                  {state && state.following && state.following.length} Pollowing
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
  );
}

export default Profil;
