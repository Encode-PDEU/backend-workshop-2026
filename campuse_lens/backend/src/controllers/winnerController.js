import Post from '../models/Post.js';

// @desc    Get top 3 posts by score (likes - dislikes)
// @route   GET /api/winners
// @access  Public
export const getWinners = async (req, res, next) => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });

    // Calculate score in memory (likes - dislikes) and sort descending
    const postsWithScores = posts.map(post => ({
      ...post.toObject(),
      score: post.likes.length - post.dislikes.length,
    }));

    postsWithScores.sort((a, b) => b.score - a.score);

    const winners = postsWithScores.slice(0, 3);

    res.status(200).json({
      success: true,
      message: 'Top 3 winning posts',
      data: { winners },
    });
  } catch (error) {
    next(error);
  }
};
