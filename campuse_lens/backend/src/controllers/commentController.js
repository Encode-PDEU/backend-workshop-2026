import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

// @desc    Create comment on a post (always anonymous)
// @route   POST /api/comments
// @access  Private (login required)
export const createComment = async (req, res, next) => {
  try {
    const { postId, content } = req.body;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Author is never stored — all comments are anonymous
    const comment = await Comment.create({
      post: postId,
      content,
    });

    res.status(201).json({
      success: true,
      message: 'Comment added successfully',
      data: { comment },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get comments for a post
// @route   GET /api/comments/post/:postId
// @access  Public
export const getCommentsByPost = async (req, res, next) => {
  try {
    const { postId } = req.params;

    const comments = await Comment.find({ post: postId }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      data: { comments },
    });
  } catch (error) {
    next(error);
  }
};
