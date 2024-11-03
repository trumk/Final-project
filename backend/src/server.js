const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const cors = require("cors");
const cookieParser = require('cookie-parser');
const projectRoutes = require('../routes/projectRoutes');
const authRoutes = require('../routes/authRoutes')
const userRoutes = require('../routes/userRoutes')
const aiRoutes = require('../routes/aiRoutes');

const app = express();

app.use(cors({
  origin: "http://localhost:3000", 
  credentials: true, 
}));

app.use(express.json()); 
app.use(cookieParser());
dotenv.config();

mongoose.connect(process.env.MONGO_URL)
.then(() => {
  console.log('Connected to mongodb!');
  app.listen(5000, () => {
    console.log('Server is running on port 5000');
  });
})
.catch((error) => {
  console.error('Connection failed!', error.message);
});

app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/ai', aiRoutes);