import mongoose from 'mongoose';

const postSchema = new mongoose.Schema(
  {
    author: {
      type: String,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
      maxlength: [1000, 'Content cannot exceed 1000 characters'],
    },
    image: {
      type: String,
      default: null,
    },
    isAnonymous: {
      type: Boolean,
      default: false,
    },
    likes: {
      type: [String], // Array of usernames
      default: [],
    },
    dislikes: {
      type: [String], // Array of usernames
      default: [],
    },
    hasWonReward: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual field for score calculation
postSchema.virtual('score').get(function () {
  return this.likes.length - this.dislikes.length;
});

// Indexes for performance
postSchema.index({ createdAt: -1 });
postSchema.index({ author: 1 });

const Post = mongoose.model('Post', postSchema);

export default Post;
