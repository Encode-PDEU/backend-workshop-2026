import Post from '../models/Post.js';

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
export const createPost = async (req, res, next) => {
  try {
    const { content, isAnonymous } = req.body;
    const image = req.file ? req.file.path : null;

    const post = await Post.create({
      author: req.user.username,
      content,
      image,
      isAnonymous: isAnonymous === 'true' || isAnonymous === true,
    });

    res.status(201).json({
      success: true,
      message: 'Post created successfully',
      data: { post },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all posts with pagination
// @route   GET /api/posts?page=1&limit=10
// @access  Public
export const getAllPosts = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Post.countDocuments();

    // Apply privacy masking for anonymous posts
    const maskedPosts = posts.map(post => {
      const postObj = post.toObject();
      if (postObj.isAnonymous) {
        postObj.author = 'anonymous';
      }
      return postObj;
    });

    res.status(200).json({
      success: true,
      data: {
        posts: maskedPosts,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single post by ID
// @route   GET /api/posts/:id
// @access  Public
export const getPostById = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const postObj = post.toObject();

    // Apply privacy masking
    if (postObj.isAnonymous) {
      postObj.author = 'anonymous';
    }

    res.status(200).json({
      success: true,
      data: { post: postObj },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update own post
// @route   PATCH /api/posts/:id
// @access  Private
export const updatePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check ownership
    if (post.author !== req.user.username) {
      return res.status(403).json({
        success: false,
        message: 'You can only edit your own posts',
      });
    }

    const { content } = req.body;
    if (content) post.content = content;

    await post.save();

    res.status(200).json({
      success: true,
      message: 'Post updated successfully',
      data: { post },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete own post
// @route   DELETE /api/posts/:id
// @access  Private
export const deletePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check ownership
    if (post.author !== req.user.username) {
      return res.status(403).json({
        success: false,
        message: 'You can only delete your own posts',
      });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Like a post
// @route   POST /api/posts/:id/like
// @access  Private
export const likePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const username = req.user.username;

    // Remove from dislikes if exists, add to likes (atomic, mutually exclusive)
    const update = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { dislikes: username },
        $addToSet: { likes: username },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Post liked',
      data: { post: update },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Dislike a post
// @route   POST /api/posts/:id/dislike
// @access  Private
export const dislikePost = async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const username = req.user.username;

    // Remove from likes if exists, add to dislikes (atomic, mutually exclusive)
    const update = await Post.findByIdAndUpdate(
      req.params.id,
      {
        $pull: { likes: username },
        $addToSet: { dislikes: username },
      },
      { new: true }
    );

    res.status(200).json({
      success: true,
      message: 'Post disliked',
      data: { post: update },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get top 3 posts by score
// @route   GET /api/posts/top
// @access  Public
export const getTopPosts = async (req, res, next) => {
  try {
    const posts = await Post.find({ hasWonReward: false }).sort({ createdAt: -1 });

    // Calculate scores and sort in memory
    const postsWithScores = posts.map(post => ({
      ...post.toObject(),
      score: post.likes.length - post.dislikes.length,
    }));

    postsWithScores.sort((a, b) => b.score - a.score);

    const topPosts = postsWithScores.slice(0, 3);

    res.status(200).json({
      success: true,
      data: { posts: topPosts },
    });
  } catch (error) {
    next(error);
  }
};
