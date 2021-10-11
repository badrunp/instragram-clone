const express = require("express");
const mongoose = require("mongoose");
const User = mongoose.model("User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const requireLogin = require("../middleware/requireLogin");

const routes = express.Router();

routes.post("/register", (req, res) => {
  const { name, email, password } = req.body;
  const errorArray = {};

  if (!name) {
    errorArray.name = "Nama harus diisi!";
  }

  if (
    !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    )
  ) {
    errorArray.email = "Email tidak valid!";
  }

  if (!password) {
    errorArray.password = "Password harus diisi!";
  }

  if (!name || !password || errorArray.email) {
    return res.status(422).json({
      error: errorArray,
    });
  }

  User.findOne({ email: email })
    .then((result) => {
      if (result) {
        res.status(422).json({
          error: { email: "Email sudah terdaftar" },
        });
      }


      bcrypt.hash(password, 12).then((hash_password) => {
        const newUser = new User({
          name,
          email,
          password: hash_password,
        });

        newUser
          .save()
          .then((user) => {
            res.status(200).json({
              message: "Daftar berhasil",
            });
          })
          .catch((error) => {
            res.status(422).json({
              error,
            });
          });
      });
    })
    .catch((error) => {
      res.status(422).json({ error });
    });
});

routes.post("/login", (req, res) => {
  const { email, password } = req.body;
  const errorArray = {};

  if (!email) {
    errorArray.email = "Email harus diisi!";
  } else if (
    !/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    )
  ) {
    errorArray.email = "Email tidak valid!";
  }

  if (!password) {
    errorArray.password = "Password harus diisi!";
  }

  if (!password || errorArray.email) {
    return res.status(422).json({
      error: errorArray,
    });
  }

  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(422).json({
          error: { email: "Email tidak terdaftar!" },
        });
      }

      bcrypt
        .compare(password, user.password)
        .then((match) => {
          if (match) {
            const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
            const { _id, name, email, followers, following, photo } = user;
            return res.status(200).json({
              message: "Login berhasil",
              token,
              user: { _id, name, email, followers, following, photo },
            });
          } else {
            return res.status(422).json({
              error: { password: "Password Salah" },
            });
          }
        })
        .catch((error) => {
          res.status(422).json({
            error,
          });
        });
    })
    .catch((error) => {
      res.status(422).json({
        error,
      });
    });
});

routes.put("/updatephotoprofi", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.user._id },
    { $set: { photo: req.body.photo } },
    (error, result) => {
      if (error) {
        return res.status(422).json({ error });
      }

      res.status(200).json(result);
    }
  );
});

module.exports = routes;
