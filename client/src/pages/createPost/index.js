import React, { useState } from "react";
import {
  Card,
  CardContent,
  Container,
  Grid,
  Typography,
  TextField,
  makeStyles,
  Button,
  CircularProgress,
  colors,
  IconButton,
  Paper,
} from "@material-ui/core";
import { useHistory } from "react-router-dom";
import PersonIcon from "@material-ui/icons/Person";
import PhotoCamera from "@material-ui/icons/PhotoCamera";

const useStyles = makeStyles((theme) => ({
  cardMain: {
    width: "100%",
    maxWidth: "420px",
    padding: "20px 0 30px",
  },
  wrapper: {
    margin: theme.spacing(4, 1, 1, 0),
    position: "relative",
    width: "max-content",
  },
  buttonProgress: {
    color: colors[500],
    position: "absolute",
    top: "50%",
    left: "50%",
    marginTop: -12,
    marginLeft: -12,
  },
  boxFile: {
    marginTop: "10px",
    marginLeft: "-10px",
  },
}));

function CreatePost() {
  const styles = useStyles();
  const history = useHistory();

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setImage] = useState("");
  const [showImage, setShowImage] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState([]);

  const handleSubmitCreatePost = () => {
    setLoading(true);
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "insta-clone");
    data.append("cloud_name", "dha5gfvpi");

    const errorArray = {};

    if (!title) {
      errorArray.title = "Tidak boleh kosong!";
    }

    if (!body) {
      errorArray.body = "Tidak boleh kosong!";
    }

    if (!image) {
      errorArray.image = "Pilih gambar terlebih dahulu!";
    }

    if (
      Object.keys(errorArray).length > 0 &&
      errorArray.constructor === Object
    ) {
      return setTimeout(() => {
        setError(errorArray);
        setLoading(false);
      }, 2000);
    }

    if (image) {
      fetch("https://api.cloudinary.com/v1_1/dha5gfvpi/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          if (data) {
            fetch("/createpost", {
              method: "post",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
              },
              body: JSON.stringify({
                title: title,
                body: body,
                photo: data.url,
              }),
            })
              .then((res) => res.json())
              .then((data) => {
                setError([]);
                setLoading(false);
                history.push("/");
              })
              .catch((error) => {
                setLoading(false);
                console.log(error);
              });
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  };

  const handleChangeImage = (e) => {
    setShowImage(URL.createObjectURL(e.target.files[0]));
    setImage(e.target.files[0]);
  };

  //   useEffect(() => {

  //   })

  return (
    <>
      <Container>
        <Grid
          container
          justify="center"
          alignItems="center"
          style={{ height: "89vh" }}
        >
          <Grid item>
            <Card className={styles.cardMain}>
              <CardContent>
                <Typography
                  variant="h4"
                  style={{
                    fontFamily: "'Grand Hotel', cursive",
                    textAlign: "center",
                  }}
                >
                  Create Post
                </Typography>

                {/* {props.location.state && props.location.state.loginSuccess ? (
                  <Alert
                    severity="success"
                    style={{ marginTop: "20px", marginBottom: "10px" }}
                  >
                    Register berhasil silahkan login
                  </Alert>
                ) : null} */}

                {error.title ? (
                  <TextField
                    error
                    helperText={error.title}
                    label="Title"
                    type="text"
                    fullWidth
                    color="secondary"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    style={{ marginTop: "10px" }}
                  />
                ) : (
                  <TextField
                    label="Title"
                    type="text"
                    fullWidth
                    //   style={{ marginTop: "20px" }}
                    color="secondary"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                )}

                {error.body ? (
                  <TextField
                    error
                    style={{ marginTop: "10px" }}
                    helperText={error.body}
                    label="Body"
                    type="text"
                    fullWidth
                    autoComplete="current-password"
                    color="secondary"
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                ) : (
                  <TextField
                    label="Body"
                    type="text"
                    fullWidth
                    color="secondary"
                    style={{ marginTop: "20px" }}
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                  />
                )}

                <div className={styles.boxFile}>
                  <input
                    id="icon-button-file"
                    type="file"
                    style={{ display: "none" }}
                    onChange={handleChangeImage}
                  />
                  <label htmlFor="icon-button-file">
                    <IconButton
                      color="secondary"
                      aria-label="upload picture"
                      component="span"
                    >
                      <PhotoCamera />
                    </IconButton>
                  </label>
                </div>

                {showImage ? (
                  <Paper
                    variant="outlined"
                    style={{ padding: "5px", width: "max-content" }}
                  >
                    <img src={showImage} style={{ width: "80px" }} />
                  </Paper>
                ) : null}

                {error.image ? (
                  <Typography variant="caption" style={{ color: "red" }}>
                    {error.image}
                  </Typography>
                ) : null}

                <div className={styles.wrapper}>
                  <Button
                    variant="contained"
                    color="secondary"
                    disabled={loading}
                    onClick={handleSubmitCreatePost}
                    startIcon={<PersonIcon />}
                  >
                    Add Post
                  </Button>
                  {loading && (
                    <CircularProgress
                      size={24}
                      className={styles.buttonProgress}
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default CreatePost;
