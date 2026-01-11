import express from 'express';
import { deleteImg, getProfile, uploadAvatar } from '../controller/user.controllers.js';

const router = express.Router()
router.get('/',getProfile);;
router.get("/avatar/upload-signature", uploadAvatar)
router.delete('/image', deleteImg)

export default router;