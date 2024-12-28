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

router.post('/', auth, createPost);
router.get('/', auth,getPosts);
router.put('/:id', auth, updatePost);
router.delete('/:id', auth, deletePost);
router.post('/:id/like', auth, likePost);
router.post('/:id/comment', auth, commentOnPost);

module.exports=router