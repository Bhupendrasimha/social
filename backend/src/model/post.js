/**
 * Post Model
 * 
 * Defines the schema and model for posts in the social media application.
 * Posts can be created by users, liked by other users, and commented on.
 */

const mongoose = require('mongoose');

/**
 * Post Schema
 * 
 * @property {ObjectId} user - Reference to the user who created the post
 * @property {String} content - The text content of the post
 * @property {ObjectId[]} likes - Array of user IDs who have liked the post
 * @property {Object[]} comments - Array of comment objects on the post
 * @property {Date} createdAt - Timestamp of when the post was created
 */
const postSchema = new mongoose.Schema({
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: {
      type: String,
      required: [true, 'Post content is required'],
      trim: true,
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    comments: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
      },
      content: {
        type: String,
        required: true
      },
      createdAt: {
        type: Date,
        default: Date.now
      }
    }],
    createdAt: {
      type: Date,
      default: Date.now
    }
  });
  
  const Post = mongoose.model('Post', postSchema);
  module.exports = Post;
