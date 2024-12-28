const express=require('express')

const router = express.Router();

const health = async (req, res) => {
    try {
    
      res.status(200).json({ message:"Server is healthy"});
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  router.get('/', health);

module.exports = router;