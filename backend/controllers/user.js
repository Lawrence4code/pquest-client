const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

// sign up logic
exports.createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hash
    });
    user
      .save()
      .then(result => {
        res
          .status(201)
          .json({ message: "User created Sucessfully", result: result });
      })
      .catch(err => {
        res.status(500).json({
          message: "Invalid authentication creditials!"
        });
      });
  });
};

// login logic
exports.userLogin = (req, res, next) => {
  console.log('userLogin ttt')
  let fetchedUser;
  console.log(req.body);
  User.findOne({ email: req.body.email })
    .then(user => {
      if (!user) {
        return res.status(401).json({ message: "User does not exist!" });
      }
      fetchedUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {
      if (!result) {
        return res.status(401).json({ message: "Incorrect Password!" });
      }
      const token = jwt.sign(
        {
          email: fetchedUser.email,
          userId: fetchedUser._id,
          name: fetchedUser.name
        },
        "secret",
        { expiresIn: "100h" }
      );

      res
        .status(200)
        .json({
          message: "Login Success",
          token: token,
          expiresIn: 36000000,
          userId: fetchedUser._id
        });
    })
    .catch(error => {
      console.log('error', error)
      return res
        .status(401)
        .json({ message: "Invalid authentication credentials!" });
    });
};
