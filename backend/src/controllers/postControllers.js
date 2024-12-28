const Post = require('../model/post');



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
  
// src/controllers/postController.js
const getPosts = async (req, res) => {
  try {
    // Get pagination parameters from query string
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const sortBy = req.query.sortBy || 'createdAt';
    const order = req.query.order === 'asc' ? 1 : -1;

    // Calculate skip value
    const skip = (page - 1) * limit;

    // Get total count for pagination info
    const totalPosts = await Post.countDocuments();

    // Get paginated posts
    const posts = await Post.find()
      .populate('user', 'username')
      .populate('comments.user', 'username')
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit);

    // Calculate pagination info
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
  
  const deletePost = async (req, res) => {
    try {
      const post = await Post.findOneAndDelete({ _id: req.params.id, user: req.user.userId });
      if (!post) throw new Error('Post not found');
      res.json({ message: 'Post deleted successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };
  
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
  