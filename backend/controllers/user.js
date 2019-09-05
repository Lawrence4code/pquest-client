const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');    

const  User = require('../models/user');

exports.createUser = (req, res, next) => {
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
            res.status(500).json({
                message: 'Invalid authentication creditials!'
            })
        })
    });
}

exports.userLogin =  (req, res, next) => {
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
            process.env.JWT_KEY,
            { expiresIn: '100h'});
        
        res.status(200).json({ message: 'Login Success', token: token, expiresIn: 36000000, userId: fetchedUser._id });
        
    })
    .catch(error => {
        return res.status(401).json({ message: 'Invalid authentication credentials!'});
    })
}