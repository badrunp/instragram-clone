import React, { useEffect, useState, useContext } from "react";
import {
  Container,
  Grid,
  Card,
  CardContent,
  Avatar,
  Typography,
  TextField,
} from "@material-ui/core";
import { useParams } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import SendOutlinedIcon from "@material-ui/icons/SendOutlined";
import { UserContext } from "../../config/routes";
import { Link } from "react-router-dom";

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

function Comment() {
  const styles = useStyles();
  const { state, dispatch } = useContext(UserContext);

  const { postid } = useParams();
  const [post, setPost] = useState([]);

  useEffect(() => {
    fetch("/getpostbyid/" + postid, {
      headers: {
        Authorization: localStorage.getItem("token"),
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPost(data.post);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleComment = (text, postId) => {
    setPost((prevState) => {
      return {
        ...prevState,
        comments: [
          ...prevState.comments,
          {
            text: text,
            postedBy: state,
          },
        ],
      };
    });

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
      .then((data) => {})
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      <Container fixed>
        <Grid container justify="center">
          <Grid item xs={12}>
            <Card style={{ marginTop: "20px", marginBottom: "20px" }}>
              <CardContent>
                <Grid
                  container
                  style={{
                    borderBottom: "1px solid rgba(0,0,0,.2)",
                    paddingBottom: "20px",
                  }}
                  spacing={2}
                >
                  <Grid item xs={2} sm={1} container justify="center">
                    <Link
                      to={`/profil`}
                      style={{ textDecoration: "none", color: "#3f51b5" }}
                    >
                      <Avatar
                        src={post && post.postedBy && post.postedBy.photo}
                      />
                    </Link>
                  </Grid>
                  <Grid item xs>
                    <Grid container>
                      <Grid item xs={12}>
                        <Typography
                          variant="body1"
                          style={{
                            fontWeight: "600",
                            textDecoration: "none",
                            color: "#3f51b5",
                          }}
                          component={Link}
                          to={`/profil`}
                        >
                          {post && post.postedBy && post.postedBy.name}
                        </Typography>
                      </Grid>
                      <Grid item xs={12}>
                        <Typography variant="body1">
                          {post && post.title && post.title}
                        </Typography>
                        <Typography variant="body2">
                          {post && post.body && post.body}
                        </Typography>
                      </Grid>
                      <Grid item style={{ marginTop: "20px" }}>
                        <Typography variant="body2">12 jam</Typography>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                {post &&
                  post.comments &&
                  post.comments.map((item, i) => (
                    <Grid
                      container
                      style={{ marginTop: "20px" }}
                      key={i}
                      spacing={2}
                    >
                      <Grid item xs={2} sm={1} container justify="center">
                        <Link
                          to={`/profil/${item.postedBy._id}`}
                          style={{ color: "#3f51b5", textDecoration: "none" }}
                        >
                          <Avatar src={item.postedBy.photo} />
                        </Link>
                      </Grid>
                      <Grid item xs>
                        <Grid container>
                          <Grid item xs={12}>
                            <Typography
                              variant="body1"
                              component={Link}
                              to={`/profil/${item.postedBy._id}`}
                              style={{
                                fontWeight: "600",
                                textDecoration: "none",
                                color: "#3f51b5",
                              }}
                            >
                              {item.postedBy.name}
                            </Typography>
                          </Grid>
                          <Grid item xs={12}>
                            <Typography variant="body2">{item.text}</Typography>
                          </Grid>
                          <Grid item style={{ marginTop: "10px" }}>
                            <Typography variant="body2">12 jam</Typography>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  ))}

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (e.target[0].value !== "") {
                      handleComment(e.target[0].value, post._id);
                      e.target[0].value = "";
                      e.target[0].focus();
                    }
                  }}
                  style={{ marginTop: "10px" }}
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
      </Container>
    </>
  );
}

export default Comment;
