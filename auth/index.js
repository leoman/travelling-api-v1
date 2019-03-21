import jwt from 'jsonwebtoken';
import config from '../config/config.json';

export const authenticateToken = (req, res, next) => {
    const token = req.headers['x-access-token'];

    if (!token) return res.status(403).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, config.auth.secret, function(err, decoded) {
        if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      
        req.userId = decoded.id;
        next();
    });
};

export default authenticateToken;
