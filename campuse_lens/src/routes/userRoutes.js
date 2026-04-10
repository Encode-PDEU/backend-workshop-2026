import express from 'express';
import { getUserProfile, promoteToAdmin } from '../controllers/userController.js';
import authenticate from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';

const router = express.Router();

router.get('/profile/:username', getUserProfile);
router.patch('/promote/:username', authenticate, authorize(['admin']), promoteToAdmin);

export default router;