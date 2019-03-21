import express from 'express';
import AuthController from '../../controllers/AuthController';

let router = express.Router();

router.post('/login', AuthController.login);

router.get('/logout', AuthController.logout);

export default router;