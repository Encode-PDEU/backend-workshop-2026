import express from 'express';
import {
  createPost,
  getAllPosts,
  getPostById,
  getMyPosts,
  updatePost,
  deletePost,
  likePost,
  dislikePost,
} from '../controllers/postController.js';
import authenticate from '../middlewares/authenticate.js';
import upload from '../config/cloudinary.js';

const router = express.Router();

// Public routes — /my-posts must be before /:id to avoid route shadowing
router.get('/', getAllPosts);
router.get('/my-posts', authenticate, getMyPosts);
router.get('/:id', getPostById);

// Protected routes
router.post('/', authenticate, upload.single('image'), createPost);
router.patch('/:id', authenticate, updatePost);
router.delete('/:id', authenticate, deletePost);
router.post('/:id/like', authenticate, likePost);
router.post('/:id/dislike', authenticate, dislikePost);

export default router;
