const express = require("express");
const mongoose = require("mongoose");
const requireLogin = require("../middleware/requireLogin");
const Post = mongoose.model("Post");

const routes = express.Router();

routes.get("/getallpost", requireLogin, (req, res) => {
  Post.find({})
    .populate({ path: "postedBy", select: "_id name photo" })
    .populate("comments.postedBy", "_id name")
    .then((posts) => {
      res.status(200).json({
        posts,
      });
    })
    .catch((error) => {
      console.log(error);
    });
});
routes.get("/getsubpost", requireLogin, (req, res) => {
  Post.find({ postedBy: { $in: [...req.user.following, req.user._id] } })
    .populate({ path: "postedBy", select: "_id name photo" })
    .populate("comments.postedBy", "_id name")
    .then((posts) => {
      res.status(200).json({
        posts,
      });
    })
    .catch((error) => {
      console.log(error);
    });
});

routes.post("/createpost", requireLogin, (req, res) => {
  const { title, body, photo } = req.body;

  if (!title | !body) {
    return res.status(401).json({
      error: "Tidak boleh kosong!",
    });
  }

  const postObj = {
    title,
    body,
    photo,
    postedBy: req.user,
  };

  req.user.password = undefined;

  const newPost = new Post(postObj);

  newPost
    .save()
    .then((result) => {
      res.status(200).json({
        post: result,
      });
    })
    .catch((error) => {
      res.status(401).json({
        error,
      });
    });
});

routes.get("/getmypost", requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate("postedBy", "_id name")
    .then((posts) => {
      res.status(200).json({
        posts,
      });
    })
    .catch((error) => {
      res.status({ error });
    });
});

routes.put("/user/like", requireLogin, (req, res) => {
  Post.findOne({ _id: req.body.postId })
    .populate("postedBy")
    .populate("comments.postedBy", "_id name")
    .then((post) => {
      const likes = post.likes.includes(req.user._id);
      if (likes) {
        return res.status(200).json({
          result: post,
        });
      } else {
        Post.findByIdAndUpdate(
          req.body.postId,
          {
            $push: {
              likes: req.user._id,
            },
          },
          { new: true }
        )
          .populate("postedBy")
          .exec((error, result) => {
            if (error) {
              return res.status(422).json({ error });
            } else {
              return res.status(200).json({ result });
            }
          });
      }
    })
    .catch((error) => {
      res.status(422).json({ error });
    });
});
routes.put("/user/unlike", requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: {
        likes: req.user._id,
      },
    },
    { new: true }
  )
    .populate("postedBy")
    .populate("comments.postedBy", "_id name")
    .exec((error, result) => {
      if (error) {
        return res.status(422).json({ error });
      } else {
        return res.status(200).json({ result });
      }
    });
});

routes.put("/user/comment", requireLogin, (req, res) => {
  const comment = {
    text: req.body.text,
    postedBy: req.user._id,
  };
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: {
        comments: comment,
      },
    },
    { new: true }
  )
    .populate("postedBy")
    .populate("comments.postedBy", "_id name photo")
    .exec((error, result) => {
      if (error) {
        return res.status(422).json({ error });
      } else {
        return res.status(200).json({ result });
      }
    });
});

routes.delete("/deletepost/:postId", requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy", "_id")
    .exec((error, post) => {
      if (error || !post) {
        return res.status(422).json({ error });
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.status(200).json({
              message: "Berhasil dihapus",
              result,
            });
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });
});

routes.get("/getpostbyid/:postId", requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate("postedBy")
    .populate("comments.postedBy", "_id name photo")
    .then((post) => {
      if (post) {
        res.status(200).json({
          post,
        });
      }
    })
    .catch((error) => {
      res.status(422).json({
        error,
      });
    });
});

module.exports = routes;
