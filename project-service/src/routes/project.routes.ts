import express from 'express';
import { create } from '../controller/project.controllers.js';

const router = express.Router()
router.get('/create/:projectLanguage',create);;
export default router;