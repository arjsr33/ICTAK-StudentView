const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key';

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (token == null) return res.sendStatus(401); // if there isn't any token

    jwt.verify(token, JWT_SECRET, (err, user) => {
        console.log(err);
        if (err) return res.sendStatus(403);
        req.user = user;
        next(); // pass the execution off to whatever request the client intended
    });
}

module.exports = authenticateToken;
