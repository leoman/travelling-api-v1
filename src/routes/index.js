import express from 'express';
import APIRoutes from './api';
let router = express.Router();

router.use('/api', APIRoutes);

export default router;