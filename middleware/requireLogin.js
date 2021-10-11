const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = mongoose.model("User");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).json({
      error: "Harus berisi token!",
    });
  }

  const token = authorization.replace("Bearer ", "");
  jwt.verify(token, process.env.JWT_SECRET, (error, payload) => {
    if (error) {
      return res.status(401).json({
        error: "Token tidak sesuai",
      });
    }
    const { _id } = payload;
    User.findOne({ _id: _id }).then((userData) => {
      req.user = userData;
      next();
    });
  });
};

