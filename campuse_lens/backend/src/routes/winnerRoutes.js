import express from 'express';
import { getWinners } from '../controllers/winnerController.js';

const router = express.Router();

// Public route — no auth required
router.get('/', getWinners);

export default router;
