const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');    

const  User = require('../models/user');

exports.createUser = (req, res, next) => {
    console.log('req', req.body);
    bcrypt.hash(req.body.password, 10 )
    .then( hash => {
        const user  = new User( {
            name: req.body.name,
            email: req.body.email,
            password: hash
        })
        user.save()
        .then( result => {
            res.status(201).json({ message: 'User created Sucessfully', result: result });
        })
        .catch((err) => {
            console.log('err', err);
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
        console.log('fetchedUser', fetchedUser);
        return bcrypt.compare(req.body.password, user.password)
    }).then(result => {
        if(!result) {
            return res.status(401).json({ message: 'Incorrect Password!'})
        }
        const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id, name: fetchedUser.name },
            process.env.JWT_KEY,
            { expiresIn: '100h'});
        
        res.status(200).json({ message: 'Login Success', token: token, expiresIn: 36000000, userId: fetchedUser._id });
        
    })
    .catch(error => {
        return res.status(401).json({ message: 'Invalid authentication credentials!'});
    })
}