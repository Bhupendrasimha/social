/**
 * Post Controller
 * 
 * This module provides controller functions for handling post-related operations
 * including creating, reading, updating, deleting posts as well as liking and
 * commenting functionality.
 */

const Post = require('../model/post');

/**
 * Create a new post
 * 
 * @param {Object} req - Express request object containing post content and authenticated user
 * @param {Object} res - Express response object
 * @returns {Object} Created post object
 * @throws {400} If post creation fails
 */
const createPost = async (req, res) => {
    try {
      const post = new Post({
        content: req.body.content,
        user: req.user.userId
      });
      await post.save();
      res.status(201).json(post);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
/**
 * Get paginated posts with optional sorting
 * 
 * @param {Object} req - Express request object containing query parameters
 * @param {Object} res - Express response object
 * @returns {Object} Posts array and pagination metadata
 * @throws {500} If posts retrieval fails
 */
const getPosts = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;

    const skip = (page - 1) * limit;

   
    const totalPosts = await Post.countDocuments();

   
    const posts = await Post.find()
      .populate('user', 'username')
      .populate('comments.user', 'username')
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit);


    const totalPages = Math.ceil(totalPosts / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      posts,
      pagination: {
        currentPage: page,
        totalPages,
        totalPosts,
        limit,
        hasNextPage,
        hasPrevPage,
        nextPage: hasNextPage ? page + 1 : null,
        prevPage: hasPrevPage ? page - 1 : null
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * Update an existing post
 * 
 * @param {Object} req - Express request object containing post ID and new content
 * @param {Object} res - Express response object
 * @returns {Object} Updated post object
 * @throws {400} If post not found or update fails
 */
const updatePost = async (req, res) => {
    try {
      const post = await Post.findOne({ _id: req.params.id, user: req.user.userId });
      if (!post) throw new Error('Post not found');
      
      post.content = req.body.content;
      await post.save();
      res.json(post);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
/**
 * Delete a post
 * 
 * @param {Object} req - Express request object containing post ID
 * @param {Object} res - Express response object
 * @returns {Object} Success message
 * @throws {400} If post not found or deletion fails
 */
const deletePost = async (req, res) => {
    try {
      const post = await Post.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
      if (!post) throw new Error('Post not found');
      res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
/**
 * Toggle like status on a post
 * 
 * @param {Object} req - Express request object containing post ID
 * @param {Object} res - Express response object
 * @returns {Object} Updated post object
 * @throws {400} If post not found or like operation fails
 */
const likePost = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) throw new Error('Post not found');
      
      const liked = post.likes.includes(req.user.userId);
      if (liked) {
        post.likes = post.likes.filter(id => id.toString() !== req.user.userId);
      } else {
        post.likes.push(req.user.userId);
      }
      
      await post.save();
      res.json(post);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
/**
 * Add a comment to a post
 * 
 * @param {Object} req - Express request object containing post ID and comment content
 * @param {Object} res - Express response object
 * @returns {Object} Updated post object with new comment
 * @throws {400} If post not found or comment addition fails
 */
const commentOnPost = async (req, res) => {
    try {
      const post = await Post.findById(req.params.id);
      if (!post) throw new Error('Post not found');
      
      post.comments.push({
        user: req.user.userId,
        content: req.body.content
      });
      
      await post.save();
      res.json(post);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
  module.exports = {
    createPost,
    getPosts,
    updatePost,
    deletePost,
    likePost,
    commentOnPost
  };