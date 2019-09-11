const jwt = require('jsonwebtoken');


module.exports = (req, res, next) => {

    try {
      const token = req.headers.authorization.split(' ')[1];
      const decodedToken = jwt.verify(token, process.env.JWT_KEY );
      console.log('decodedToken', decodedToken)
      req.userData = { email :  decodedToken.email, userId: decodedToken.userId, userName: decodedToken.name }
      next();
    } catch(error) {
        res.status(401).json({ message: 'You are not authenticated! '});
    }
}