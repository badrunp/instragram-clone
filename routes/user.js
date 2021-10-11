const express = require("express");
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");
const User = mongoose.model("User");

const routes = express.Router();

routes.get("/user/:id", (req, res) => {
  User.findOne({ _id: req.params.id })
    .select("-password")
    .then((user) => {
      if (user) {
        Post.find({ postedBy: req.params.id })
          .populate("postedBy", "_id name")
          .exec((error, posts) => {
            if (error) {
              return res.status(422).json({ error });
            }

            res.status(200).json({
              user,
              posts,
            });
          });
      } else {
        console.log("tidak ada user denga id " + req.params.id);
      }
    })
    .catch((error) => {
      res.status(404).json({ error });
    });
});

routes.put("/follow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    { new: true },
    (error, result) => {
      if (error) {
        return res.status(422).json({ error });
      }

      User.findByIdAndUpdate(
        req.user._id,
        {
          $push: { following: req.body.followId },
        },
        { new: true }
      )
        .select("-password")
        .then((data) => {
          return res.status(200).json({
            result: data,
            result2: result,
          });
        })
        .catch((error) => {
          console.log(error);
          res.status(422).json({ error });
        });
    }
  );
});

routes.put("/unfollow", requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: { followers: req.user._id },
    },
    { new: true },
    (error, result) => {
      if (error) {
        return res.status(422).json({ error });
      }

      User.findByIdAndUpdate(
        req.user._id,
        {
          $pull: { following: req.body.unfollowId },
        },
        { new: true }
      )
        .select("-password")
        .then((data) => {
          res.status(200).json({
            result: data,
            result2: result,
          });
        })
        .catch((error) => {
          res.status(422).json({ error });
        });
    }
  );
});

routes.get("/users", requireLogin, (req, res) => {
  User.find({})
    .then((users) => {
      if (users) {
        const usersArray = [];
        users.map((item) => {
          if (
            !req.user.following.includes(item._id) &&
            item._id !== req.user._id
          ) {
            usersArray.push(item);
          }
        });
        res.status(200).json({ users: usersArray });
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(422).json({ error });
    });
});

routes.get("/getfollowers/:userid", requireLogin, (req, res) => {
  User.findOne({ _id: req.params.userid })
    .then((user) => {
      User.find({ _id: { $in: user.followers } })
        .then((users) => {
          res.status(200).json({
            users,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      res.status(244).json({
        error,
      });
    });
});

routes.get("/getfollowing/:userid", requireLogin, (req, res) => {
  User.findOne({ _id: req.params.userid })
    .then((user) => {
      User.find({ _id: { $in: user.following } })
        .then((users) => {
          res.status(200).json({
            users,
          });
        })
        .catch((error) => {
          console.log(error);
        });
    })
    .catch((error) => {
      res.status(244).json({
        error,
      });
    });
});

routes.get("/getallusers", requireLogin, (req, res, next) => {
  User.find({})
    .then((users) => {
      res.status(200).json({
        users,
      });
    })
    .catch((error) => {
      res.status(422).json({
        error,
      });
    });
});

module.exports = routes;
