const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const  User = require('../models/user');

console.log('User', User);

const expressRouter = express.Router();
 
expressRouter.post('/signup', (req, res, next) => {
    bcrypt.hash(req.body.password, 10 )
    .then( hash => {
        const user  = new User( {
            email: req.body.email,
            password: hash
        })
        user.save()
        .then( result => {
            res.status(201).json({ message: 'User created Sucessfully', result: result });
        })
        .catch((err) => {
            res.status(500).json({ message: err })
        })
    });
});

expressRouter.post('/login', (req, res, next) => {
    let fetchedUser;
    User.findOne({ email: req.body.email }).then(user => {
        if(!user) {
            return res.status(401).json({ message: 'User does not exist!'})
        }
        fetchedUser = user;
        return bcrypt.compare(req.body.password, user.password)
    }).then(result => {
        if(!result) {
            return res.status(401).json({ message: 'Incorrect Password!'})
        }
        const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id },
            { expiresIn: '1h'});
        
        res.status(200).json({ message: 'Login Success', token: token, expiresIn: 3600 });
        
    })
    .catch(error => {
        return res.status(401).json({ message: 'Authentication failed!'});
    })
})

module.exports = expressRouter;