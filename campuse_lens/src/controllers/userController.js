import User from '../models/User.js';

// @desc    Get user profile
// @route   GET /api/users/profile/:username
// @access  Public
export const getUserProfile = async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Promote user to admin
// @route   PATCH /api/users/promote/:username
// @access  Admin only
export const promoteToAdmin = async (req, res, next) => {
  try {
    const { username } = req.params;

    const user = await User.findOne({ username });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (user.role === 'admin') {
      return res.status(400).json({
        success: false,
        message: 'User is already an admin',
      });
    }

    user.role = 'admin';
    await user.save();

    res.status(200).json({
      success: true,
      message: `${username} has been promoted to admin`,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};
