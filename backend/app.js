const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts.js");
const userRoutes = require("./routes/user.js");

// instance of express
const app = express();

// connection to DB
mongoose
  .connect(
    `mongodb+srv://lawrence:UF6mc1seQupQloUC@cluster0-qn38b.mongodb.net/test?retryWrites=true&w=majority`,
    { useUnifiedTopology: true, useNewUrlParser: true }
  )
  .then(() => {
    console.log("Connect to remote db successfully");
  })
  .catch(err => {
    console.log("Connection to db failed!", err);
  });

// mongoose depcreation warning, remove in prod verison

//TODO:
mongoose.set('useCreateIndex', true);

mongoose.set('useFindAndModify', false);
// middleware to allow cors
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, OPTIONS"
  );
  next();
});

// middleware to make request readble
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use("/images", express.static(path.join("images")));

app.use("/api/posts", postsRoutes);
app.use("/api/user", userRoutes);

module.exports = app;
