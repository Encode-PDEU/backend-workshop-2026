import express from 'express';
import { distributeReward } from '../controllers/rewardController.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

router.post('/distribute/:postId', authenticate, distributeReward);

export default router;
