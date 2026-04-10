import express from 'express';
import { distributeReward } from '../controllers/rewardController.js';
import authenticate from '../middlewares/authenticate.js';
import authorize from '../middlewares/authorize.js';

const router = express.Router();

router.post('/distribute/:postId', authenticate, authorize(['admin']), distributeReward);

export default router;
