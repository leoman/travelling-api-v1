const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/config.json');

router.get('/fake-register', function(req, res) {
    // create a token
    const token = jwt.sign({ id: 1 }, config.secret, {
        expiresIn: 86400 // expires in 24 hours
    });

    res.status(200).send({ auth: true, token: token });
});

router.get('/me', function(req, res) {
    var token = req.headers['x-access-token'];
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' });
    
    jwt.verify(token, config.secret, function(err, decoded) {
      if (err) return res.status(500).send({ auth: false, message: 'Failed to authenticate token.' });
      
      res.status(200).send(decoded);
    });
});

module.exports = router;