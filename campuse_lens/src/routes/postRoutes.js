import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  dislikePost,
  getTopPosts,
} from '../controllers/postController.js';
import authenticate from '../middlewares/authenticate.js';
import upload from '../config/cloudinary.js';

const router = express.Router();

// Public routes — /top must be before /:id to avoid route shadowing
router.get('/', getAllPosts);
router.get('/top', getTopPosts);
router.get('/:id', getPostById);

// Protected routes
router.post('/', authenticate, upload.single('image'), createPost);
router.patch('/:id', authenticate, updatePost);
router.delete('/:id', authenticate, deletePost);
router.post('/:id/like', authenticate, likePost);
router.post('/:id/dislike', authenticate, dislikePost);

export default router;
