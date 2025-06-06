const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

// Ensure JWT_SECRET is set
if (!JWT_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET is not defined in environment variables');
    process.exit(1);
}

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
        return res.status(401).json({ 
            success: false,
            message: 'Access token required' 
        });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            if (err.name === 'TokenExpiredError') {
                return res.status(401).json({ 
                    success: false,
                    message: 'Token expired' 
                });
            }
            if (err.name === 'JsonWebTokenError') {
                return res.status(403).json({ 
                    success: false,
                    message: 'Invalid token' 
                });
            }
            return res.status(403).json({ 
                success: false,
                message: 'Token verification failed' 
            });
        }
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;