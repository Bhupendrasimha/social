const express = require('express');
 const {register,login,getCurrentUser} =require( '../controllers/authControllers');
const auth = require('../middleware/auth');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me',auth,getCurrentUser)

module.exports = router;