import express from 'express';
import { createComment, getCommentsByPost } from '../controllers/commentController.js';
import authenticate from '../middlewares/authenticate.js';

const router = express.Router();

router.post('/', authenticate, createComment);
router.get('/post/:postId', getCommentsByPost);

export default router;
