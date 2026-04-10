import Post from '../models/Post.js';
import User from '../models/User.js';

// @desc    Distribute reward to post author
// @route   POST /api/rewards/distribute/:postId
// @access  Admin only
export const distributeReward = async (req, res, next) => {
  try {
    const { postId } = req.params;
    const rewardAmount = 100; // Fixed reward amount

    // Find the post
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Check if post already won reward
    if (post.hasWonReward) {
      return res.status(400).json({
        success: false,
        message: 'This post has already won a reward',
      });
    }

    // Use Promise.all to update user and post simultaneously
    const [updatedUser, updatedPost] = await Promise.all([
      User.findOneAndUpdate(
        { username: post.author },
        { $inc: { rewards: rewardAmount } },
        { new: true }
      ),
      Post.findByIdAndUpdate(postId, { hasWonReward: true }, { new: true }),
    ]);

    res.status(200).json({
      success: true,
      message: `Reward of ${rewardAmount} points distributed successfully`,
      data: {
        post: updatedPost,
        user: updatedUser,
      },
    });
  } catch (error) {
    next(error);
  }
};
