import Comment from '../models/Comment.js';
import Post from '../models/Post.js';

// @desc    Create comment on a post
// @route   POST /api/comments
// @access  Private
export const createComment = async (req, res, next) => {
  try {
    const { postId, content, isAnonymous } = req.body;

    // Check if post exists
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const comment = await Comment.create({
      post: postId,
      author: req.user.username,
      content,
      isAnonymous: isAnonymous === 'true' || isAnonymous === true,
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

    // Apply privacy masking
    const maskedComments = comments.map(comment => {
      const commentObj = comment.toObject();
      if (commentObj.isAnonymous) {
        commentObj.author = 'anonymous';
      }
      return commentObj;
    });

    res.status(200).json({
      success: true,
      data: { comments: maskedComments },
    });
  } catch (error) {
    next(error);
  }
};
