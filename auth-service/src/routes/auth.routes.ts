import express from 'express';
import { login, logout, register, verify, verifyEmail } from '../controller/auth.controllers.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router()
router.post('/login', login);;
router.post('/register', register);
router.get('/verify-email/:token', verifyEmail);
router.get('/logout', authMiddleware, logout)
router.get('/verify', authMiddleware, verify);

export default router;