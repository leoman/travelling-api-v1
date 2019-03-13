const router = require('express').Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../config/config.json');

const authenticateUserCredentials = (username, password) => {

    const { user } = config.auth;
    let passwordIsValid = false;

    try {
        passwordIsValid = bcrypt.compareSync(password, user.password);
    } catch (error) {
        return { error };
    }

    if (username !== user.username || !passwordIsValid) {
        return { error: 'User credentials were incorrect' };
    }

    return { user }
}

class AuthController {

    login(req, res) {
        const result = authenticateUserCredentials(req.body.username, req.body.password, res);
    
        if(result.error) {
            return res.status(401).send({ auth: false, token: null, error: result.error });
        }
    
        const token = jwt.sign({ username: result.user.username }, config.auth.secret, {
            expiresIn: 86400
        });
        res.status(200).send({ auth: true, token: token });
    };

    logout(req, res) {
        res.status(200).send({ auth: false, token: null });
    };
}

module.exports = new AuthController;