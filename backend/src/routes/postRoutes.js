/**
 * Post Routes
 * 
 * This module defines the routes for post-related operations including creating,
 * reading, updating and deleting posts, as well as liking and commenting on posts.
 * All routes require authentication via the auth middleware.
 */

const express = require('express');
const auth = require('../middleware/auth');
const {
  createPost,
  getPosts, 
  updatePost,
  deletePost,
  likePost,
  commentOnPost
} = require('../controllers/postControllers');
const router = express.Router();

/**
 * POST /api/posts
 * Creates a new post. Requires authentication.
 */
router.post('/', auth, createPost);

/**
 * GET /api/posts ?page=1&limit=10
 * Retrieves all posts. Requires authentication.
 */
router.get('/', auth, getPosts);

/**
 * PUT /api/posts/:id
 * Updates an existing post by ID. Requires authentication.
 */
router.put('/:id', auth, updatePost);

/**
 * DELETE /api/posts/:id
 * Deletes a post by ID. Requires authentication.
 */
router.delete('/:id', auth, deletePost);

/**
 * POST /api/posts/:id/like
 * Likes/unlikes a post by ID. Requires authentication.
 */
router.post('/:id/like', auth, likePost);

/**
 * POST /api/posts/:id/comment
 * Adds a comment to a post by ID. Requires authentication.
 */
router.post('/:id/comment', auth, commentOnPost);

module.exports = router;