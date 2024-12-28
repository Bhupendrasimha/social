require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const health = require('./routes/health')
const app = express();
const connectDB = require('./config/db')
app.use(cors());
app.use(express.json());
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/health',health)

const PORT = process.env.PORT || 5000;
// connectDB()
//   .then(async() => {
//     console.log('Database connected!');
//     app.listen(PORT,async () => {
//       console.log(`Server is running on port: ${PORT} 🚀`);
//     });
//   })
//   .catch((err) => {
//     console.log(err,"ERRORS");
//   });

const MONGODB_URI = process.env.MONGODB_URI 

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('Database connected! 📦');
  app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT} 🚀`);
  });
})
.catch((err) => {
  console.log('MongoDB connection error:', err);
});
