const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv')
const cors = require("cors");
const cookieParser = require('cookie-parser');
const projectRoutes = require('../routes/projectRoutes');
const authRoutes = require('../routes/authRoutes')

const app = express();

app.use(cors());
app.use(express.json()); 
app.use(cookieParser());
dotenv.config();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
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
app.use('/api/projects', projectRoutes);
app.use('/uploads', express.static('uploads'));
