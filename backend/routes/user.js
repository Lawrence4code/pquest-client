const express = require('express');

const UserController = require('../controllers/user');

// router instance
const expressRouter = express.Router();
 
// sign up route
expressRouter.post('/signup', UserController.createUser);

// user login route
expressRouter.post('/login', UserController.userLogin);

module.exports = expressRouter;