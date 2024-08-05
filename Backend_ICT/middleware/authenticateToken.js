const jwt = require('jsonwebtoken');
const JWT_SECRET = 'your_jwt_secret_key';

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send({ message: 'Access Denied' });

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) return res.status(403).send({ message: 'Invalid Token' });
        req.user = decoded;
        next();
    });
};

module.exports = authenticateToken;
