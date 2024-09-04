const express = require('express');
const mongoose = require('mongoose');
const cors = require("cors");
const projectRoutes = require('../routes/projectRoutes');

const app = express();

app.use(cors());
app.use(express.json()); 

mongoose.connect('mongodb+srv://nguyentrung2292003:GYCKF3LGpSWUfabU@databases.l0xs9.mongodb.net/Final-project', {
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

app.use('/api/projects', projectRoutes);
