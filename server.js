const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
dotenv.config();
const port = process.env.PORT || 5000;
const url_db = process.env.URL_DB;

// app.use(cors());

mongoose.connect(url_db, {
  useFindAndModify: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useNewUrlParser: true,
});

mongoose.connection.on("connected", () => {
  console.log("Database connected");
});

mongoose.connection.on("error", (err) => {
  console.log("Database error" + err);
});

require("./models/user");
require("./models/post");

app.use(express.json());

app.use(require("./routes/auth"));
app.use(require("./routes/post"));
app.use(require("./routes/user"));

if (process.env.NODE_ENV == "production") {
  app.use(express.static("client/build"));
  const path = require("path");
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
