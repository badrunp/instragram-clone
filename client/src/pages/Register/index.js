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
} from "@material-ui/core";
import React, { useState, useContext } from "react";
import PersonIcon from "@material-ui/icons/Person";
import { Redirect, useHistory } from "react-router-dom";
import { UserContext } from "../../config/routes";

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
}));

function Register() {
  const styles = useStyles();
  const history = useHistory();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { state, dispatch } = useContext(UserContext);

  const [error, setError] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSubmitRegister = (e) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      fetch("/register", {
        method: "post",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setLoading(false);
            setError(data.error);
          } else {
            setLoading(false);
            history.push("/login", { loginSuccess: true });
          }
        });
    }, 2000);
  };

  if (state) {
    return <Redirect to="/" />;
  }

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
                  variant="h2"
                  style={{
                    fontFamily: "'Grand Hotel', cursive",
                    textAlign: "center",
                  }}
                >
                  Register
                </Typography>
                {error.name ? (
                  <TextField
                    error
                    helperText={error.name}
                    id="standard-helperText"
                    label="Username"
                    type="text"
                    fullWidth
                    color="secondary"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                ) : (
                  <TextField
                    id="standard-helperText"
                    label="Username"
                    type="text"
                    fullWidth
                    color="secondary"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                )}

                {error.email ? (
                  <TextField
                    error
                    helperText={error.email}
                    label="Email"
                    type="text"
                    fullWidth
                    color="secondary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={{ marginTop: "10px" }}
                  />
                ) : (
                  <TextField
                    label="Email"
                    type="text"
                    fullWidth
                    style={{ marginTop: "20px" }}
                    color="secondary"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                )}

                {error.password ? (
                  <TextField
                    error
                    style={{ marginTop: "10px" }}
                    helperText={error.password}
                    id="standard-password-input"
                    label="Password"
                    type="password"
                    fullWidth
                    autoComplete="current-password"
                    color="secondary"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                ) : (
                  <TextField
                    id="standard-password-input"
                    label="Password"
                    type="password"
                    fullWidth
                    autoComplete="current-password"
                    color="secondary"
                    style={{ marginTop: "20px" }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                )}

                <div className={styles.wrapper}>
                  <Button
                    variant="contained"
                    color="secondary"
                    disabled={loading}
                    onClick={handleSubmitRegister}
                    startIcon={<PersonIcon />}
                  >
                    Register
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

export default Register;
